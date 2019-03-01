#! /bin/bash

GOOS=linux go build
zip books.zip ./books

aws lambda update-function-code \
  --function-name dalton-books-v2 \
  --zip-file fileb://books.zip \
  --publish
