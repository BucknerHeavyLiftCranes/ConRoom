/**
 * Enum of various HTTP status codes for error checking.
 */
export const HTTP_STATUS_CODES = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    REQUEST_CONFLICT: 409,
    SERVER_ERROR: 500
}

const STATUS_MAP = {
    1: "Scheduled",
    2: "Ongoing",
    3: "Completed",
    4: "Cancelled",
}

export const DB_COMMANDS = {
    createBucknerConroomDatabase: `
        IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Buckner_Conroom')
        BEGIN
            CREATE DATABASE [Buckner_Conroom];
        END
    `,
    
    createUsersTable: `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
        BEGIN
            CREATE TABLE users (
                user_id INT IDENTITY(1,1) PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE
            );
        END;
    `,

    createRoomsTable: `
    CREATE TABLE IF NOT EXISTS rooms ()
    `,

    createReservationsTable: `
    CREATE TABLE IF NOT EXISTS reservations ()
    `
}