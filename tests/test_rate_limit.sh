#!/bin/bash

# Simple rate limiting test script
echo "Testing rate limiting with 10 rapid requests..."

for i in {1..10}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/books \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Test Book $i\",\"author\":\"Author $i\",\"isbn\":\"ISBN-$RANDOM-$i\",\"quantity\":5,\"shelfLocation\":\"A$i\"}" \
    -w "\nHTTP Status: %{http_code}\n\n"
done
