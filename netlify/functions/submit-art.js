const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process if MongoDB connection fails
});

const artSchema = new mongoose.Schema({
    name: String,
    reason: String,
    // Optionally include other fields as needed
});

const Art = mongoose.model('Art', artSchema);

// Middleware to handle multipart/form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/.netlify/functions/submit-art', async (req, res) => {
    try {
        console.log('Received request body:', req.body); // Log received request body
        const { name, reason } = req.body;

        if (!name || !reason) {
            return res.status(400).json({ error: 'Name and reason are required fields' });
        }

        // Rest of your function code
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports.handler = serverless(app);
