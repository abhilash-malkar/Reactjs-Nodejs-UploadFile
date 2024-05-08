const express = require('express');
const multer = require('multer');
var cors = require('cors')
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors()) 
const port = 3001;

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Endpoint to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
    res.send(req.file);
});

// Endpoint to get all uploaded files
app.get('/files', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            const fileInfos = files.map((file) => ({
                name: file,
                url: `http://localhost:3001/uploads/${file}`
            }));
            res.json(fileInfos);
        }
    });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
