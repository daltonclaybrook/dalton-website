package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"time"
)

// main function
func main() {
	lambda.Start(HandleRequest)
}

// HandleRequest from lambda
func HandleRequest(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	response := events.APIGatewayProxyResponse{
		Headers: map[string]string{"Access-Control-Allow-Origin": "*"},
	}

	session, err := session.NewSession()
	if err != nil {
		return response, badAWSSession
	}

	db := dynamodb.New(session)
	accessToken, err := getAccessToken(db)
	if err != nil {
		return response, err
	}

	activites, err := fetchActivities(accessToken)
	if err != nil {
		return response, err
	}

	response.StatusCode = 200
	response.Body = activites
	return response, nil
}

// MARK: - Helpers

func isTokenStillActiveForTime(expirationString string) (bool, error) {
	i, err := strconv.ParseInt(expirationString, 10, 64)
	if err != nil {
		return false, err
	}
	expiration := time.Unix(i, 0)
	current := time.Now()
	return current.Before(expiration), nil
}

func getAccessToken(db *dynamodb.DynamoDB) (string, error) {
	// fetch strava expiration
	expiresAt, err := fetchValueForAttribute(stravaExpiresAtKey, db)
	if err != nil {
		return "", err
	}
	isActive, err := isTokenStillActiveForTime(expiresAt)
	if err != nil {
		return "", err
	}

	// fetch or refresh strava access token
	if isActive {
		// fetch strava access token
		return fetchValueForAttribute(stravaAccessTokenKey, db)
	} else {
		refreshToken, err := fetchValueForAttribute(stravaRefreshTokenKey, db)
		if err != nil {
			return "", err
		}
		return refreshAndSaveNewAccessToken(refreshToken, db)
	}
}

func refreshAndSaveNewAccessToken(refreshToken string, db *dynamodb.DynamoDB) (string, error) {
	payloadMap := map[string]string{
		"client_id":     os.Getenv("STRAVA_CLIENT_ID"),
		"client_secret": os.Getenv("STRAVA_CLIENT_SECRET"),
		"grant_type":    "refresh_token",
		"refresh_token": refreshToken,
	}
	payloadBytes, err := json.Marshal(payloadMap)
	if err != nil {
		return "", err
	}
	res, err := http.Post("https://www.strava.com/oauth/token", "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return "", tokenRefreshFailed
	}

	var response RefreshResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return "", err
	}

	if err := setValueForAttribute(stravaAccessTokenKey, response.AccessToken, db); err != nil {
		return "", err
	}
	if err := setValueForAttribute(stravaRefreshTokenKey, response.RefreshToken, db); err != nil {
		return "", err
	}
	if err := setValueForAttribute(stravaExpiresAtKey, strconv.FormatInt(response.ExpiresAt, 10), db); err != nil {
		return "", err
	}
	return response.AccessToken, nil
}

func fetchActivities(accessToken string) (string, error) {
	url := "https://www.strava.com/api/v3/athlete/activities?per_page=3"
	authHeader := fmt.Sprintf("Bearer %s", accessToken)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", authHeader)

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return "", activitiesRequestFailed
	}

	resBytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}
	return string(resBytes), nil
}

// MARK: - Dynamo DB Helpers

// Fetch a string "Value" for a specified string "Attribute" from the "DaltonSite"
// table in DynamoDB
func fetchValueForAttribute(attr string, db *dynamodb.DynamoDB) (string, error) {
	input := &dynamodb.GetItemInput{
		TableName: aws.String("DaltonSite"),
		Key: map[string]*dynamodb.AttributeValue{
			"Attribute": {S: aws.String(attr)},
		},
	}
	res, err := db.GetItem(input)
	if err != nil {
		return "", err
	}

	value := res.Item["Value"]
	if value == nil {
		return "", notFound
	}

	return *value.S, nil
}

// Set a string "Value" for a specified string "Attribute" from the "DaltonSite"
// table in DynamoDB
func setValueForAttribute(attr string, value string, db *dynamodb.DynamoDB) error {
	input := &dynamodb.PutItemInput{
		Item: map[string]*dynamodb.AttributeValue{
			"Attribute": {S: aws.String(attr)},
			"Value":     {S: aws.String(value)},
		},
		TableName: aws.String("DaltonSite"),
	}
	_, err := db.PutItem(input)
	return err
}

// RefreshResponse from token refresh request
type RefreshResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresAt    int64  `json:"expires_at"`
}

// Event is the event passed to the lambda handle function
type Event struct {
	Name string `json:"name"`
}

const (
	stravaAccessTokenKey  = "strava_access_token"
	stravaRefreshTokenKey = "strava_refresh_token"
	stravaExpiresAtKey    = "strava_expires_at"
)

// FetchError is an error when fetching items from DynamoDB
type FetchError int

const (
	badAWSSession           FetchError = iota
	tokenRefreshFailed      FetchError = iota
	activitiesRequestFailed FetchError = iota
	notFound                FetchError = iota
)

func (err FetchError) Error() string {
	switch err {
	case badAWSSession:
		return "Unable to create AWS session"
	case tokenRefreshFailed:
		return "Failed to refresh the strava token"
	case activitiesRequestFailed:
		return "Failed to request activities"
	case notFound:
		return "Not found"
	default:
		return "An unknown error occurred"
	}
}
