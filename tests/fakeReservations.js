import Reservation from "../backend/api/model/Reservation.js"

const reservation1 = new Reservation({
    title: "All-Hands Meeting",
    roomId: 1,
    userEmail: "Mimi@abc.com", 
    date: "2025-03-31",
    start: '11:00',
    end: '12:00'
})

const reservation2 = new Reservation({
    title: "Hello Kitty Fest",
    roomId: 2,
    userEmail: "Hugo@abc.com", 
    date: "2025-03-30",
    start: '15:25',
    end: '23:50'
})

const reservation3 = new Reservation({
    title: "Faculty Pizza Party",
    roomId: 3,
    userEmail: "externalrelations@abc.com", 
    date: "2025-04-15",
    start: '14:00',
    end: '16:00'
})

const reservation4 = new Reservation({
        title: "Monthly Inspection 4",
        roomId: 3,
        userEmail: "A@abc.com", 
        date: "2025-05-01",
        start: '08:00',
        end: '15:00'
})

const reservation5 = new Reservation({
    title: "Monthly Inspection 5",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-06-01",
    start: '08:00',
    end: '15:00'
})

const reservation6 = new Reservation({
    title: "Monthly Inspection 6",
    roomId: 2,
    userEmail: "G@abc.com", 
    date: "2025-07-01",
    start: '08:00',
    end: '15:00'
})

const reservation7 = new Reservation({
    title: "Monthly Inspection 7",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-08-01",
    start: '08:00',
    end: '15:00'
})

const reservation8 = new Reservation({
    title: "Monthly Inspection 8",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-09-01",
    start: '08:00',
    end: '15:00'
})

const reservation9 = new Reservation({
    title: "Monthly Inspection 9",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-10-01",
    start: '08:00',
    end: '15:00'
})

const reservation10 = new Reservation({
    title: "Monthly Inspection 10",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-11-01",
    start: '08:00',
    end: '15:00'
})

const reservation11 = new Reservation({
    title: "Monthly Inspection 11",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-12-01",
    start: '08:00',
    end: '15:00'
})

const reservation12 = new Reservation({
    title: "Monthly Inspection 12",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-12-02",
    start: '08:00',
    end: '15:00'
})

const reservation13 = new Reservation({
    title: "Monthly Inspection 13",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-12-03",
    start: '08:00',
    end: '15:00'
})

const reservation14 = new Reservation({
    title: "Monthly Inspection 14",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-12-04",
    start: '08:00',
    end: '15:00'
})

const reservation15 = new Reservation({
    title: "Monthly Inspection 15",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-12-05",
    start: '08:00',
    end: '15:00'
})

const reservation16 = new Reservation({
    title: "Monthly Inspection 16",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-12-06",
    start: '08:00',
    end: '15:00'
})

const reservation17 = new Reservation({
    title: "Monthly Inspection 17 + (plus a really really really long set of extra stuff to test how frontend handles overload behavior",
    roomId: 3,
    userEmail: "G@abc.com", 
    date: "2025-12-07",
    start: '08:00',
    end: '15:00'
})

/**
 * Fake reservations to insert into the database (for testing).
 */
export const fakeReservations = [
    reservation1, 
    reservation2, 
    reservation3,
    reservation4,
    reservation5,
    reservation6,
    reservation7,
    reservation8,
    reservation9,
    reservation10,
    reservation11,
    reservation12,
    reservation13,
    reservation14,
    reservation15,
    reservation16,
    reservation17
]
