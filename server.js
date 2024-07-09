const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
mongoose.connect('mongodb+srv://evancopas:Tc5mggYDBkZ1KTv8@cluster0.2vs0ctf.mongodb.net/milkjug/milkart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const artSchema = new mongoose.Schema({
    name: String,
    reason: String,
    image: String,
});

const Art = mongoose.model('Art', artSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/submit', upload.single('image'), (req, res) => {
    const { name, reason } = req.body;
    const image = req.file.path;

    const newArt = new Art({ name, reason, image });
    newArt.save((err) => {
        if (err) {
            return res.status(500).send('Error saving to database');
        }
        res.send('Form submitted successfully');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
