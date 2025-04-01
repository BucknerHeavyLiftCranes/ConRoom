import Room from "../backend/api/model/Room.js"

const room1 = new Room({
    roomName: 'Mindscape',
    roomEmail: 'MindscapeRoom@abc.com',
    seats: 500,
    projector: 1, 
    summary: 'Large lecture hall designed for symposiums and presentations',
    openHour: '08:00',
    closeHour: '16:00'
})

const room2 = new Room({
    roomName: 'Twinnings',
    roomEmail: 'TwinningsRoom@abc.com',
    seats: 2,
    projector: 0, 
    summary: 'Small rooms setup with dual monitors for daily scrum sessions',
    openHour: '08:00',
    closeHour: '20:00'
})

const room3 = new Room({
    roomName: 'Hillary',
    roomEmail: 'HillaryRoom@abc.com',
    seats: 20,
    projector: 1, 
    summary: 'Medium sized room for presentations and team discussions',
    openHour: '07:00',
    closeHour: '17:00'
})

const room4 = new Room({
    roomName: 'Waxmore',
    roomEmail: 'Waxmore@abc.com',
    seats: 30,
    projector: 0, 
    summary: 'Basic work office',
    openHour: '07:00',
    closeHour: '20:00'
})

const room5 = new Room({
    roomName: 'Hilton',
    roomEmail: 'Hilton@abc.com',
    seats: 1000,
    projector: 1, 
    summary: 'Large work office',
    openHour: '09:00',
    closeHour: '21:00'
})

const room6 = new Room({
    roomName: 'Chesapeake',
    roomEmail: 'Chesapeake@abc.com',
    seats: 5,
    projector: 0, 
    summary: 'Small closet space',
    openHour: '12:00',
    closeHour: '17:00'
})

const room7 = new Room({
    roomName: 'Mouldings',
    roomEmail: 'Mouldings@abc.com',
    seats: 225,
    projector: 1, 
    summary: 'Disgusting and mouldy room',
    openHour: '09:00',
    closeHour: '17:00'
})



export const fakeRooms = [
    // room1, 
    // room2, 
    // room3, 
    // room4, 
    room5, 
    room6, 
    room7]