# Quick Start - Theatre UI Deployment

## First Time Setup (One-Time Only)

```bash
# 1. Authenticate with Google Cloud
gcloud auth login
gcloud auth application-default login

# 2. Set your project
gcloud config set project YOUR_PROJECT_ID

# 3. Create bucket (if it doesn't exist)
gsutil mb -p YOUR_PROJECT_ID -c STANDARD -l us-central1 gs://blue-cloud-movies

# 4. Configure bucket
gsutil iam ch allUsers:objectViewer gs://blue-cloud-movies
gsutil cors set cors.json gs://blue-cloud-movies

# 5. Install dependencies
cd Theatre_UI
npm install
```

## Regular Deployment (After Making Changes)

```bash
cd Theatre_UI

# Option 1: Use the deployment script (Recommended)
./deploy.sh

# Option 2: Manual deployment
npm run build
gsutil -m rsync -r dist gs://blue-cloud-movies
noglob gsutil -m setmeta -h "Content-Type:application/javascript" gs://blue-cloud-movies/assets/*.js
noglob gsutil -m setmeta -h "Content-Type:text/css" gs://blue-cloud-movies/assets/*.css
noglob gsutil -m setmeta -h "Content-Type:text/html" gs://blue-cloud-movies/*.html
```

## Access Your Site

```
https://storage.googleapis.com/blue-cloud-movies/index.html
```

## Troubleshooting

If page is blank:
1. Check MIME types: `gsutil stat gs://blue-cloud-movies/assets/*.js | grep Content-Type`
2. Check CORS: `gsutil cors get gs://blue-cloud-movies`
3. Check permissions: `gsutil iam get gs://blue-cloud-movies`

For detailed information, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

