/**
 * Commands to manipulate MSSQL Database.
 */
const DB_COMMANDS = {
    /* CREATE DATABASE COMMAND*/
    createBucknerConroomDatabase: `
        IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'Buckner_Conroom')
        BEGIN
            CREATE DATABASE [Buckner_Conroom];
        END
    `,


    /* CREATE TABLE COMMANDS*/
    createAdminsTable: `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            CREATE TABLE admins (
                id VARCHAR(255) PRIMARY KEY NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                refresh_token VARCHAR(2000)
            );
        END;
    `,

    createRoomsTable: `
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            CREATE TABLE rooms (
                room_id INT IDENTITY(1,1) PRIMARY KEY,
                room_name VARCHAR(255) UNIQUE NOT NULL,
                room_email VARCHAR(255) UNIQUE NOT NULL,
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
            canceled BIT NOT NULL DEFAULT 0,

            -- Constraints
            CONSTRAINT chk_time CHECK (start_time < end_time),
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

    createIndexReservationsCanceled: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_reservations_canceled' AND object_id = OBJECT_ID('reservations'))
            BEGIN
                CREATE INDEX idx_reservations_canceled ON reservations (canceled);
            END
        END
    `,


    /* DROP TABLE COMMANDS*/
    dropAdminsTable: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            DROP TABLE admins;
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
    


    /* ADMINS TABLE CRUD COMMANDS */
    getAllAdmins: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            SELECT * FROM admins;
        END
    `,

    getAdminById:`
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            SELECT * FROM admins WHERE id = @id;
        END
    `,

    getAdminByEmail:`
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            SELECT * FROM admins WHERE email = @email;
        END
    `,

    getAdminByRefreshToken:`
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            SELECT * FROM admins WHERE refresh_token = @refresh_token;
        END
    `,

    createNewAdmin: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM admins WHERE email = @email)
            BEGIN
                INSERT INTO admins (id, name, email, refresh_token)
                OUTPUT INSERTED.* 
                VALUES (@id, @name, @email, @refresh_token);
            END;
        END;
    `,

    updateAdminRefreshToken: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            -- Check if admin exists by finding its unique id
            IF EXISTS (SELECT 1 FROM admins WHERE id = @id)
            BEGIN
                -- Check if another admin with the same refresh token already exists
                IF NOT EXISTS (SELECT 1 FROM admins WHERE refresh_token = @refresh_token AND id != @id)
                BEGIN
                    UPDATE admins
                    SET  refresh_token = @refresh_token
                    WHERE id = @id;

                    SELECT * FROM admins WHERE id = @id;
                END
            END
        END
    `,

    deleteAdmin: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'admins')
        BEGIN
            DELETE FROM admins WHERE id = @id;
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

    getRoomByName:`
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            SELECT * FROM rooms WHERE room_name = @room_name;
        END
    `,

    getRoomByEmail:`
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'rooms')
        BEGIN
            SELECT * FROM rooms WHERE room_email = @room_email;
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
    `,

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

    getReservationById: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations WHERE reservation_id = @reservation_id;
        END
    `,

    getReservationsByRoomId: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations WHERE room_id = @room_id;
        END
    `,

    getReservationsByDate: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations WHERE date = @date;
        END
    `,

    getReservationsByRoomAndDate: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations WHERE room_id = @room_id AND date = @date ;
        END
    `,

    getActiveReservationsByRoomAndDate: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations 
            WHERE room_id = @room_id
            AND date = @date
            AND canceled = 0;
        END
    `,

    getReservationsByUserEmail: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations WHERE user_email = @user_email;
        END
    `,

    getAllActiveReservations: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations WHERE canceled = 0;
        END
    `,

    getAllCanceledReservations: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT * FROM reservations WHERE canceled = 1;
        END
    `,

    getReservationPerRoom: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            SELECT  FROM reservations WHERE 🚨🚨🚨🚨 THIS WILL NEED A JOIN;
        END
    `,

    createNewReservation: `
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM reservations
                WHERE room_id = @room_id
                AND date = @date
                AND (
                    (@start_time < end_time AND @end_time > start_time) -- Overlapping time range
                )
                AND canceled = 0 -- Reservation is active
            )
            BEGIN
                INSERT INTO reservations (title, room_id, user_email, date, start_time, end_time)
                OUTPUT INSERTED.* 
                VALUES (@title, @room_id, @user_email, @date, @start_time, @end_time);
            END;
        END;
    `,

    updateReservation: `
        IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            -- Check if reservation exists by reservation_id
            IF EXISTS (SELECT 1 FROM reservations WHERE reservation_id = @reservation_id)
            BEGIN
                -- Check if conflicting active reservation exists
                IF NOT EXISTS (
                    SELECT 1 FROM reservations
                    WHERE reservation_id != @reservation_id
                    AND room_id = @room_id
                    AND date = @date
                    AND (
                        (@start_time < end_time AND @end_time > start_time) -- Overlapping time range
                    )
                    AND canceled = 0 -- Reservation is active
                )
                BEGIN
                    UPDATE reservations
                    SET title = @title,
                        room_id = @room_id,
                        user_email = @user_email,
                        date = @date,
                        start_time = @start_time,
                        end_time = @end_time,
                        canceled = @canceled
                    WHERE reservation_id = @reservation_id;
    
                    SELECT * FROM reservations WHERE reservation_id = @reservation_id;
                END
            END
        END
    `,

    deleteReservation: `
        IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'reservations')
        BEGIN
            DELETE FROM reservations WHERE reservation_id = @reservation_id;
        END
    `,
}


export default DB_COMMANDS