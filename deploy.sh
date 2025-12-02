#!/bin/bash

# Build the project first
echo "Building the project..."
npm run build

# Upload all files using rsync
echo "Uploading files to Google Cloud Storage..."
gsutil -m rsync -r dist gs://blue-cloud-movies

# Set correct MIME types for JavaScript files
echo "Setting MIME types for JavaScript files..."
for file in $(gsutil ls gs://blue-cloud-movies/assets/*.js 2>/dev/null); do
  gsutil setmeta -h "Content-Type:application/javascript" "$file"
done

# Set correct MIME types for CSS files
echo "Setting MIME types for CSS files..."
for file in $(gsutil ls gs://blue-cloud-movies/assets/*.css 2>/dev/null); do
  gsutil setmeta -h "Content-Type:text/css" "$file"
done

# Set correct MIME types for HTML files
echo "Setting MIME types for HTML files..."
for file in $(gsutil ls gs://blue-cloud-movies/*.html 2>/dev/null); do
  gsutil setmeta -h "Content-Type:text/html" "$file"
done

# Set public read access
echo "Setting public read access..."
gsutil iam ch allUsers:objectViewer gs://blue-cloud-movies

# Set CORS configuration (optional, but recommended)
echo "Setting CORS configuration..."
if [ -f cors.json ]; then
  gsutil cors set cors.json gs://blue-cloud-movies
else
  echo "CORS file not found, skipping..."
fi

echo "Deployment complete!"
echo "Visit: https://storage.googleapis.com/blue-cloud-movies/index.html"

