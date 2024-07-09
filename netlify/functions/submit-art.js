const mongoose = require('mongoose');
const multer = require('multer');
const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: '/tmp' }); // Use /tmp directory for serverless functions

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const artSchema = new mongoose.Schema({
    name: String,
    reason: String,
    image: String,
});

const Art = mongoose.model('Art', artSchema);

// Middleware to handle multipart/form-data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/submit-art', upload.single('image'), async (req, res) => {
    try {
        const { name, reason } = req.body;
        const { file } = req;
        const tempPath = file.path;
        const targetPath = path.join(__dirname, 'uploads', file.originalname);

        fs.rename(tempPath, targetPath, async err => {
            if (err) return res.status(500).send(err);

            const newArt = new Art({
                name,
                reason,
                image: targetPath,
            });

            await newArt.save();
            res.status(200).send('Art submitted successfully');
        });
    } catch (error) {
        console.error('Error in submit-art function:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports.handler = serverless(app);