// Set test environment variables
process.env.NODE_ENV = "test";
process.env.DB_NAME = "bulk_data_manager_test";
process.env.DB_USER = "postgres";
process.env.DB_PASSWORD = "postgres";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "5432";

// Increase timeout for tests
jest.setTimeout(10000);
