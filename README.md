# Bulk Data Manager

A full-stack application for managing bulk data operations with PostgreSQL, Node.js backend, and React frontend.

## Features

- Bulk data creation and management
- Real-time data validation
- Pagination and sorting
- RESTful API endpoints
- Modern React frontend with Material-UI
- PostgreSQL database integration
- Docker containerization

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v16 or higher)
- Docker and Docker Compose
- npm or yarn package manager

## Project Structure

```
BulkDataManager/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── tests/         # Backend tests
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/        # Custom React hooks
│   │   └── services/     # API services
│   └── Dockerfile
└── docker-compose.yml     # Docker configuration
```

## Setup Instructions

### Using Docker (Recommended)

1. Install Docker Desktop:

   - Download from [Docker's official website](https://www.docker.com/products/docker-desktop)
   - Install and start Docker Desktop
   - Ensure Docker is running (check system tray icon)

2. Clone the repository:

   ```bash
   git clone <repository-url>
   cd BulkDataManager
   ```

3. Start the application:

   ```bash
   # Build and start all services
   docker-compose up --build -d

   # View logs
   docker-compose logs -f
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - PostgreSQL: localhost:5432

### Manual Setup

1. Backend Setup:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Frontend Setup:

   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Database Setup:
   - Create PostgreSQL database named 'bulk_data_manager'
   - Update environment variables in backend/.env

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bulk_data_manager
DB_USER=postgres
DB_PASSWORD=root
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:3001/api
```

## API Endpoints

### Data Management

- `POST /api/data/bulk` - Create multiple records
- `GET /api/data` - Get paginated records
- `PUT /api/data/:id` - Update a record
- `DELETE /api/data/:id` - Delete a record

### Example API Usage

```bash
# Create bulk records
curl -X POST http://localhost:3001/api/data/bulk \
  -H "Content-Type: application/json" \
  -d '[{"name": "Record 1", "value": 100}, {"name": "Record 2", "value": 200}]'

# Get paginated records
curl http://localhost:3001/api/data?page=1&limit=10
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style

- Backend follows ESLint configuration
- Frontend uses Prettier for formatting
- Follow the existing code style in the project

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up -d --build backend

# Remove all containers and volumes
docker-compose down -v
```

## Troubleshooting

### Common Issues

1. Docker Issues:

   - Ensure Docker Desktop is running
   - Check Docker service status
   - Verify Windows features (WSL2, Hyper-V)

2. Database Connection:

   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure ports are not blocked

3. Frontend Issues:
   - Clear browser cache
   - Check API URL configuration
   - Verify CORS settings

### Debugging

1. Backend:

   ```bash
   # View backend logs
   docker-compose logs backend

   # Access backend container
   docker-compose exec backend sh
   ```

2. Frontend:

   ```bash
   # View frontend logs
   docker-compose logs frontend

   # Access frontend container
   docker-compose exec frontend sh
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the maintainers.
