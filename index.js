const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let bookings = [];

app.post('/book-room', (req, res) => {
    const { customerName, roomName, date, startTime, endTime, bookingId, bookingDate, bookingStatus } = req.body;

    if (!customerName || !roomName || !date || !startTime || !endTime) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingBooking = bookings.find(booking => 
        booking.roomName === roomName &&
        booking.date === date &&
        booking.startTime === startTime &&
        booking.endTime === endTime
    );

    if (existingBooking) {
        return res.status(409).json({ message: 'Room already booked for this time slot' });
    }

    const newBooking = {
        customerName,
        roomName,
        date,
        startTime,
        endTime,
        bookingId: bookingId || bookings.length + 1,
        bookingDate: bookingDate || new Date().toISOString(),
        bookingStatus: bookingStatus || 'confirmed',
    };

    bookings.push(newBooking);

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
});

app.get('/', (req, res) => {
    res.json(bookings);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port at http://localhost:${PORT}`);
});
