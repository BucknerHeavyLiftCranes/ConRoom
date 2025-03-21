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
                room_id INT IDENTITY(1,1) PRIMARY KEY,
                room_name VARCHAR(255) NOT NULL,
                building VARCHAR(255) NOT NULL,
                room_number SMALLINT NOT NULL,
                seats SMALLINT CHECK (seats >= 0),
                projector BIT NOT NULL DEFAULT 0,
                summary VARCHAR(500),
                open_hour TIME NOT NULL,
                close_hour TIME NOT NULL
            );

        END;
    `,

    createReservationsTable: `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations') AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms') AND
        EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
        BEGIN
            CREATE TABLE reservations (
            reservation_id BIGINT IDENTITY(1,1) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            room_id INT NOT NULL,
            user_id INT NOT NULL,
            date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            status TINYINT NOT NULL DEFAULT 0,

            -- Constraints
            CONSTRAINT chk_time CHECK (start_time < end_time),
            CONSTRAINT chk_status CHECK (status IN (0, 1, 2, 3)), -- Valid status range
            CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
            CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            
            
        );

        END;
    `,

    /* CREATE INDEX COMMANDS*/
    createIndexReservationsDate: `
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_date' AND object_id = OBJECT_ID('reservations'))
    BEGIN
      CREATE INDEX idx_reservations_date ON reservations (date);
    END
  `,

    createIndexReservationsRoomTime: `
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_room_time' AND object_id = OBJECT_ID('reservations'))
        BEGIN
        CREATE INDEX idx_reservations_room_time ON reservations (room_id, date, start_time, end_time);
        END
    `,

    createIndexReservationsUser: `
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_user' AND object_id = OBJECT_ID('reservations'))
        BEGIN
        CREATE INDEX idx_reservations_user ON reservations (user_id);
        END
    `,

    createIndexReservationsStatus: `
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_status' AND object_id = OBJECT_ID('reservations'))
        BEGIN
        CREATE INDEX idx_reservations_status ON reservations (status);
        END
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
    `,

    /* VIEW TABLE COMMANDS*/
    getUsersTable: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
        BEGIN
            SELECT * FROM users;
        END
    `,

    getReservationsTable: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations;
        END
    `,

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

    createNewRoom: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM rooms WHERE room_name = @room_name OR room_number = @room_number)
            BEGIN
                INSERT INTO rooms (room_name, building, room_number, seats, projector, summary, open_hour, close_hour)
                OUTPUT INSERTED.* 
                VALUES (@room_name, @building, @room_number, @seats, @projector, @summary, @open_hour, @close_hour);
            END;
        END;
      `,

      updateRoom: `
      IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
      BEGIN
          -- Check if room exists by room_id
          IF EXISTS (SELECT 1 FROM rooms WHERE room_id = @room_id)
          BEGIN
              -- Check if room_name or room_number is unique (excluding the current room)
              IF NOT EXISTS (SELECT 1 FROM rooms WHERE (room_name = @room_name OR room_number = @room_number) AND room_id != @room_id)
              BEGIN
                  UPDATE rooms
                  SET room_name = @room_name,
                      building = @building,
                      room_number = @room_number,
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
    `
}