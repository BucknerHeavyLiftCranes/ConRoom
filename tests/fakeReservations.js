import Reservation from "../backend/model/Reservation.js"

const reservation1 = new Reservation({
    title: "All-Hands Meeting",
    roomId: 1,
    userEmail: "Mimi@abc.com", 
    date: "2025-03-31",
    startTime: '11:00:00',
    endTime: '12:00:00'
})

const reservation2 = new Reservation({
    title: "Hello Kitty Fest",
    roomId: 2,
    userEmail: "Hugo@abc.com", 
    date: "2025-03-25",
    startTime: '14:22:45',
    endTime: '23:58:00'
})

const reservation3 = new Reservation({
    title: "Faculty Pizza Party",
    roomId: 3,
    userEmail: "externalrelations@abc.com", 
    date: "2025-04-15",
    startTime: '14:00:00',
    endTime: '16:00:00'
})

export const fakeReservations = [reservation1, reservation2, reservation3]