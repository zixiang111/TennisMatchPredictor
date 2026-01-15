# Tennis Match Predictor - Setup Guide

## Prerequisites
- Java 17+
- Gradle 8.5+ (or use included wrapper)
- Node.js 20+
- Docker & Docker Compose
- Python 3.11+

## Quick Start with Docker (Recommended)

```bash
npm run docker:up
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- ML Service: http://localhost:5000/api
- PostgreSQL: localhost:5432

To stop all services:
```bash
npm run docker:down
```

## Manual Setup (Development)

### 1. Build Backend with Gradle

```bash
cd backend

# On Windows:
./gradlew clean build

# On Mac/Linux:
chmod +x gradlew
./gradlew clean build
```

To skip tests during build:
```bash
./gradlew clean build -x test
```

To run application directly:
```bash
./gradlew bootRun
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3000

### 3. Setup ML Service

```bash
cd ml-service
python -m venv venv

# Activate virtual environment:
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python app.py
```

ML Service will run on http://localhost:5000

### 4. Setup PostgreSQL

Use Docker to run PostgreSQL:

```bash
docker run -d \
  -e POSTGRES_DB=tennis_predictor_db \
  -e POSTGRES_USER=tennis_admin \
  -e POSTGRES_PASSWORD=secure_password_123 \
  -p 5432:5432 \
  postgres:15-alpine
```

### 5. Run Backend

After building with Gradle:

```bash
./gradlew bootRun
```

Backend will run on http://localhost:8080/api

## Gradle Commands

### Build & Test
- `./gradlew clean` - Clean build directory
- `./gradlew build` - Build application
- `./gradlew build -x test` - Build without running tests
- `./gradlew test` - Run tests only
- `./gradlew check` - Run all checks

### Run
- `./gradlew bootRun` - Run Spring Boot application
- `./gradlew run` - Run application

### IDE Integration
- `./gradlew idea` - Generate IntelliJ IDEA project files
- `./gradlew eclipse` - Generate Eclipse project files

### Tasks
- `./gradlew tasks` - List all available tasks
- `./gradlew dependencies` - Show dependency tree

## Project Structure

```
TennisMatchPredictor/
├── backend/                  # Gradle Spring Boot application
│   ├── build.gradle.kts     # Gradle build configuration
│   ├── settings.gradle.kts  # Gradle settings
│   ├── gradlew              # Gradle wrapper (Unix)
│   ├── gradlew.bat          # Gradle wrapper (Windows)
│   ├── gradle/              # Gradle wrapper files
│   └── src/
├── frontend/                # React + Vite
│   └── package.json
├── ml-service/              # Python Flask
│   ├── app.py
│   └── requirements.txt
├── docker-compose.yml       # Docker orchestration
└── package.json             # Root scripts
```

## Troubleshooting

### Gradle Build Fails

**Problem**: Gradle build fails or hangs

**Solution**: 
1. Clear Gradle cache: `./gradlew clean`
2. Update Gradle wrapper: `./gradlew wrapper --gradle-version=8.5`
3. Run with more memory: `GRADLE_OPTS="-Xmx2048m" ./gradlew build`

### Spring Import Errors in IDE

**Problem**: IDE can't find Spring classes

**Solution**: 
1. Run `./gradlew clean build`
2. Refresh IDE project (F5 or right-click project > Refresh)
3. Rebuild project in IDE

### Port Already in Use

**Solution**: Change ports in config files or stop the service using the port:
- Frontend: 3000
- Backend: 8080
- ML Service: 5000
- PostgreSQL: 5432

### Database Connection Failed

**Solution**: Ensure PostgreSQL is running and accessible at localhost:5432

## Development Tips

1. **Always run Gradle build first** - `./gradlew clean build` resolves all dependencies
2. Use Docker Compose for full stack testing
3. Frontend proxy to backend at port 8080
4. ML Service runs independently on port 5000
5. PostgreSQL required for persistence (uses default port 5432)

## Production Deployment

1. Build all components:
   ```bash
   ./gradlew clean build
   cd frontend && npm run build
   ```

2. Use Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Change default passwords in environment variables
4. Set up proper SSL/TLS certificates
5. Configure firewall rules
6. Set up monitoring and logging

## Gradle vs Maven

**Advantages of Gradle:**
- Faster builds (incremental compilation, parallel builds)
- More flexible configuration (Kotlin DSL)
- Better for multi-module projects
- Gradle Wrapper ensures consistent builds
- Shorter learning curve for new developers

**Gradle Wrapper Benefits:**
- No need to pre-install Gradle
- Guaranteed same Gradle version across machines
- Automatic downloading on first use
- Included in version control
