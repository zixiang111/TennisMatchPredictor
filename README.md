# Tennis Match Predictor

AI-powered tennis match prediction system using machine learning (XGBoost, RandomForest, LightGBM).

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Java 17+ (for local backend development)
- Python 3.11+ (for local ML service development)

### Run with Docker
```bash
npm run docker:up
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- ML Service: http://localhost:5000/api
- PostgreSQL: localhost:5432

### Stop
```bash
npm run docker:down
```

## Project Structure

```
TennisMatchPredictor/
├── backend/           # Spring Boot REST API
├── ml-service/        # Python Flask ML service
├── frontend/          # React Vite frontend
├── docker-compose.yml
└── package.json
```

## API Endpoints

- `POST /api/predictions` - Predict match outcome
- `GET /api/predictions/history` - Historical predictions
- `GET /api/players/search?query={name}` - Search players
- `GET /api/health` - Health check

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Material-UI
- **Backend**: Spring Boot 3 + PostgreSQL + Lombok
- **ML Service**: Python + Flask + sklearn/XGBoost/LightGBM
- **Database**: PostgreSQL
- **Deployment**: Docker Compose

## License

MIT
