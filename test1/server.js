const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const mongoURI = 'mongodb://127.0.0.1:27017/bengal';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const HospitalSchema = new mongoose.Schema({
    'unique-id': Number,
    name: String,
    address: String,
    phone: String,
    website: String,
    coordinates: {
        latitude: Number,
        longitude: Number
    }
}, { collection: 'hospital' });

const Hospital = mongoose.model('Hospital', HospitalSchema);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to fetch hospital data
app.get('/api/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find({});
        console.log(`Total hospitals found: ${hospitals.length}`);
        hospitals.forEach((hospital, index) => {
            console.log(`Hospital ${index + 1}: ${hospital.name}`);
            // console.log(`Coordinates: ${JSON.stringify(hospital.coordinates)}`);
        });
        res.json(hospitals);
    } catch (err) {
        console.error('Error fetching hospitals:', err);
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
});