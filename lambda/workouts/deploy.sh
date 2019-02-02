#! /bin/bash

GOOS=linux go build workouts.go
zip workouts.zip ./workouts

aws lambda update-function-code \
  --function-name dalton-workouts \
  --zip-file fileb://workouts.zip \
  --publish
