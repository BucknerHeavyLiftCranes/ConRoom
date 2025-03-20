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

// const STATUS_MAP = {
//     1: "Scheduled",
//     2: "Ongoing",
//     3: "Completed",
//     4: "Cancelled",
// }


/**
 * Commands to manipulate MSSQL Database.
 */
export const DB_COMMANDS = {
    /* CREATE DATABASE COMMAND*/
    createBucknerConroomDatabase: `
        IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Buckner_Conroom')
        BEGIN
            CREATE DATABASE [Buckner_Conroom];
        END
    `,


    /* CREATE TABLE COMMANDS*/
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
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            CREATE TABLE rooms (
                
            );
        END;
    `,

    createReservationsTable: `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            CREATE TABLE reservations (
                
            );
        END;
    `,


    /* DROP TABLE COMMANDS*/
    dropUsersTable: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
        BEGIN
            DROP TABLE users;
        END
    `,

    dropRoomsTable: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            DROP TABLE rooms;
        END
    `,

    dropReservationsTable: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            DROP TABLE reservations;
        END
    `
}