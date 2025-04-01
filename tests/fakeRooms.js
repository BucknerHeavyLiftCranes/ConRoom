import Room from "../backend/model/Room.js"

const room1 = new Room({
    roomName: 'Mindscape',
    roomEmail: 'MindscapeRoom@abc.com',
    seats: 500,
    projector: 1, 
    summary: 'Large lecture hall designed for symposiums and presentations',
    openHour: '08:00:00',
    closeHour: '16:00:00'
})

const room2 = new Room({
    roomName: 'Twinnings',
    roomEmail: 'TwinningsRoom@abc.com',
    seats: 2,
    projector: 0, 
    summary: 'Small rooms setup with dual monitors for daily scrum sessions',
    openHour: '08:00:00',
    closeHour: '20:00:00'
})

const room3 = new Room({
    roomName: 'Hillary',
    roomEmail: 'HillaryRoom@abc.com',
    seats: 20,
    projector: 1, 
    summary: 'Medium sized room for presentations and team discussions',
    openHour: '07:00:00',
    closeHour: '17:00:00'
})

const room4 = new Room({
    roomName: 'Waxmore',
    roomEmail: 'Waxmore@abc.com',
    seats: 30,
    projector: 0, 
    summary: 'Basic work office',
    openHour: '08:00:00',
    closeHour: '20:00:00'
})

export const fakeRooms = [room1, room2, room3, room4]