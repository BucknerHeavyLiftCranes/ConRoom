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
    // createUsersTable: `
    //     IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
    //     BEGIN
    //         CREATE TABLE users (
    //             user_id INT IDENTITY(1,1) PRIMARY KEY,
    //             name VARCHAR(255),
    //             email VARCHAR(255) UNIQUE
    //         );
    //     END;
    // `,

    createRoomsTable: `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            CREATE TABLE rooms (
                room_id INT IDENTITY(1,1) PRIMARY KEY,
                room_name VARCHAR(255) NOT NULL,
                room_email VARCHAR(255) NOT NULL,
                room_status BIT NOT NULL DEFAULT 1,
                seats SMALLINT CHECK (seats >= 0),
                projector BIT NOT NULL DEFAULT 0,
                summary VARCHAR(500),
                open_hour TIME NOT NULL,
                close_hour TIME NOT NULL
            );

        END;
    `,

    createReservationsTable: `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations') AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            CREATE TABLE reservations (
            reservation_id BIGINT IDENTITY(1,1) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            room_id INT NOT NULL,
            user_email VARCHAR(255) NOT NULL,
            date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT 'Confirmed',

            -- Constraints
            CONSTRAINT chk_time CHECK (start_time < end_time),
            CONSTRAINT chk_status CHECK (status IN ('Confirmed', 'In Progress', 'Completed', 'Cancelled')), -- Allowed string status values
            CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
        );

        END;
    `,

    /* CREATE INDEX COMMANDS*/
    createIndexReservationsDate: `
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
    BEGIN
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_date' AND object_id = OBJECT_ID('reservations'))
        BEGIN
            CREATE INDEX idx_reservations_date ON reservations (date);
        END
    END
  `,

    createIndexReservationsRoomTime: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_room_time' AND object_id = OBJECT_ID('reservations'))
            BEGIN
                CREATE INDEX idx_reservations_room_time ON reservations (room_id, date, start_time, end_time);
            END
        END
    `,

    createIndexReservationsUser: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_user' AND object_id = OBJECT_ID('reservations'))
            BEGIN
                CREATE INDEX idx_reservations_user ON reservations (user_email);
            END
        END
    `,

    createIndexReservationsStatus: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_status' AND object_id = OBJECT_ID('reservations'))
            BEGIN
                CREATE INDEX idx_reservations_status ON reservations (status);
            END
        END
    `,


    /* DROP TABLE COMMANDS*/
    // dropUsersTable: `
    //     IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
    //     BEGIN
    //         DROP TABLE users;
    //     END
    // `,

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
    `,

    /* VIEW TABLE COMMANDS*/
    // getUsersTable: `
    //     IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
    //     BEGIN
    //         SELECT * FROM users;
    //     END
    // `,

    /* ROOMS TABLE CRUD COMMANDS */
    getAllRooms: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            SELECT * FROM rooms;
        END
    `,

    getRoomById:`
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            SELECT * FROM rooms WHERE room_id = @room_id;
        END
    `,

    getRoomByNameAndEmail:`
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            SELECT * FROM rooms WHERE room_name = @room_name AND room_email = @room_email;
        END
    `,

    createNewRoom: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM rooms WHERE room_name = @room_name AND room_email = @room_email)
            BEGIN
                INSERT INTO rooms (room_name, room_email, room_status, seats, projector, summary, open_hour, close_hour)
                OUTPUT INSERTED.* 
                VALUES (@room_name, @room_email, @room_status, @seats, @projector, @summary, @open_hour, @close_hour);
            END;
        END;
      `,

      updateRoom: `
      IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
      BEGIN
          -- Check if room exists by room_id
          IF EXISTS (SELECT 1 FROM rooms WHERE room_id = @room_id)
          BEGIN
              -- Check if room_name (excluding the current room)
              IF NOT EXISTS (SELECT 1 FROM rooms WHERE (room_name = @room_name) AND room_id != @room_id)
              BEGIN
                  UPDATE rooms
                  SET room_name = @room_name,
                      room_email = @room_email,
                      room_status = @room_status,
                      seats = @seats,
                      projector = @projector,
                      summary = @summary,
                      open_hour = @open_hour,
                      close_hour = @close_hour
                  WHERE room_id = @room_id;
  
                  SELECT * FROM rooms WHERE room_id = @room_id;
              END
          END
      END
  `
  ,

      deleteRoom: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            DELETE FROM rooms WHERE room_id = @room_id;
        END
    `,

    /* RESERVATIONS TABLE CRUD COMMANDS */
    getAllReservations: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations;
        END
    `,
    
}