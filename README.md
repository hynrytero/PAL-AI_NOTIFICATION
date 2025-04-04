# PAL AI Notification Service

A notification service for rice farmers that provides weather alerts and disease warnings.

## Features

- Weather monitoring and alerts
- Disease risk notifications (Tungro, Blast, Bacterial Leaf Blight)
- Configurable alert thresholds
- RESTful API endpoints for testing

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your configuration (optional)
4. Start the server:
   ```
   npm start
   ```

## Docker Build

Build the Docker image:

```
docker build -t pal-ai-notification .
```

Run the container locally:

```
docker run -p 8080:8080 pal-ai-notification
```

## Deployment to Google Cloud Run

### Prerequisites

- Google Cloud SDK installed
- Docker installed
- A Google Cloud project with billing enabled

### Steps

1. Authenticate with Google Cloud:
   ```
   gcloud auth login
   ```

2. Set your project ID:
   ```
   gcloud config set project YOUR_PROJECT_ID
   ```

3. Build and push the Docker image to Google Container Registry:
   ```
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/pal-ai-notification
   ```

4. Deploy to Cloud Run:
   ```
   gcloud run deploy pal-ai-notification \
     --image gcr.io/YOUR_PROJECT_ID/pal-ai-notification \
     --platform managed \
     --region asia-southeast1 \
     --allow-unauthenticated
   ```

5. Set environment variables (if needed):
   ```
   gcloud run services update pal-ai-notification \
     --set-env-vars="API_KEY=your_api_key,OPENWEATHER_API_KEY=your_openweather_api_key"
   ```

## API Endpoints

- `GET /`: Health check
- `GET /test-notification`: Send a test notification
- `GET /test-weather`: Check current weather and send a test weather alert

## Configuration

The application can be configured through environment variables or by modifying the `src/config/config.js` file. 