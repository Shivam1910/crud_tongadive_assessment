# Bulk Data Manager

A full-stack web application for managing bulk data operations with a Node.js backend and React frontend.

## Features

- Bulk data creation
- Data listing with pagination
- Bulk data deletion
- Modern UI with Material-UI
- RESTful API
- PostgreSQL database
- Docker support

## Tech Stack

### Backend

- Node.js
- Express
- PostgreSQL
- Sequelize ORM
- Jest for testing

### Frontend

- React
- Material-UI
- React Query
- Axios

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (for local development)

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd bulk-data-manager
   ```

2. Using Docker (Recommended):

   ```bash
   docker-compose up --build
   ```

   This will start:

   - PostgreSQL database on port 5432
   - Backend API on port 3001
   - Frontend application on port 3000

3. Local Development Setup:

   Backend:

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run dev
   ```

   Frontend:

   ```bash
   cd frontend
   npm install
   npm start
   ```

## API Endpoints

- `POST /api/data/bulk` - Create multiple records
- `GET /api/data` - List all records with pagination
- `PUT /api/data/bulk` - Update multiple records
- `DELETE /api/data/bulk` - Delete multiple records

## Testing

Backend tests:

```bash
cd backend
npm test
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── tests/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
