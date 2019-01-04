import urllib.request as requester
import urllib.parse as encoder
import xml.etree.ElementTree as parser
import re as regex
import json
from json import JSONEncoder
import os

class Book:
    def __init__(self, element):
        self.title = element.find('title').text
        self.imageURL = element.find('image_url').text
        self.link = element.find('link').text
        authorElements = element.find('authors').iter('author')
        transform = lambda e: regex.sub(' +', ' ', e.find('name').text)
        self.authors = list(map(transform, authorElements))

class BookEncoder(JSONEncoder):
    def default(self, o): # pylint: disable=E0202
        return o.__dict__

def lambda_handler(event, context):
    params = {}
    params['v'] = '2'
    params['key'] = os.environ['GOODREADS_API_KEY']
    params['id'] = os.environ['GOODREADS_USER_ID']
    params['shelf'] = 'currently-reading'
    query = encoder.urlencode(params)
    url = 'https://www.goodreads.com/review/list.xml?' + query

    responseString = requester.urlopen(url).read().decode('utf-8')
    root = parser.fromstring(responseString)
    reviewElements = root.find('reviews').iter('review')
    bookTransform = lambda e: Book(e.find('book'))
    books = list(map(bookTransform, reviewElements))
    output = { 'data': books[:3] }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': "*" # Required for CORS support to work
        },
        'body': json.dumps(output, cls=BookEncoder)
    }
