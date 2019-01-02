import urllib.request
import urllib.parse
import json
from json import JSONEncoder
import os

class Location:
    def __init__(self, dict):
        self.lat = dict['lat']
        self.long = dict['lng']
        self.city = dict['city']
        self.state = dict['state']

class Checkin:
    def __init__(self, dict):
        venue = dict['venue']
        self.venueName = venue['name']
        self.createdAt = dict['createdAt']
        self.location = Location(venue['location'])
        self.imageURL = self.makeImageURL(dict)

    def makeImageURL(self, dict):
        sticker = dict.get('sticker')
        if sticker is None: return None

        image = sticker['image']
        sizes = image['sizes']
        maxSize = sizes[len(sizes) - 1]
        return image['prefix'] + str(maxSize) + image['name']

class CheckinEncoder(JSONEncoder):
    def default(self, o): # pylint: disable=E0202
        return o.__dict__

def lambda_handler(event, context):
    params = {}
    params['oauth_token'] = os.environ['FOURSQUARE_TOKEN']
    params['v'] = '20190101'
    query = urllib.parse.urlencode(params)
    url = 'https://api.foursquare.com/v2/users/self/checkins?' + query

    response = json.load(urllib.request.urlopen(url))
    items = response['response']['checkins']['items']
    checkins = list(map(lambda dict: Checkin(dict).__dict__, items))
    output = { 'data': checkins[:3] }
    
    return {
        'statusCode': 200,
        'body': json.dumps(output, cls=CheckinEncoder)
    }
