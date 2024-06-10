const app = require('express')();
const express = require('express');
const http = require('http').Server(app)
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./db/db');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

let attendSchema = require('./models/attendSchema');
let facultySchema = require('./models/facultySchema');
let imageSchema = require('./models/imageSchema');

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// Serve static files

app.use(express.static('images'));

// Connect DB
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected.");
},
    error => {
        console.log("Could not connect to database : " + error);
    }
)

// Function to save filename to MongoDB
const saveFilenameToMongo = async (filename) => {
    console.log(filename)
    try {
      const newImage = await imageSchema.create({ "name": filename });
      console.log("Saved");
      res.send("Saved")
    } catch (error) {
      console.error(error);
    }
  }  


// Storage for saving files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadFolder = './images';
        // Create the 'uploads' folder if it doesn't exist
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder);
        }
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        console.log(file)
        // Save the filename to MongoDB
        const filename = Date.now() + '-' + file.originalname;
        saveFilenameToMongo(filename);
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });



// Upload image
app.post('/upload', upload.single('image'), (req, res) => {
    console.log("Request received");
    res.status(200).json({ message: 'Image uploaded successfully' });
  });

// faculty save data
app.post('/facRegister', async (req, res) => {
    let data = await facultySchema.create({ "id": req.body.id, "password": req.body.password, "name": req.body.name });
    if (data) {
        res.json({ "data": data, "msg": "success" })
        return
    }
    res.json({ "msg": "Failed!" })
})

// faculty login
app.post('/facLogin', async (req, res) => {
    let data = await facultySchema.find({ "id": req.body.id, "password": req.body.password });
    if (data.length > 0) {
        res.json({ "data": data, "msg": "success" })
        return
    }
    res.json({ "msg": "Authentication Failed!" })
})

// add new student
app.post('/registerStudent', async (req, res) => {
    let data = await attendSchema.findOneAndUpdate(
        { "_id": '656325e671f8235381da21bc' },
        { "$push": { "studentsAttendance": req.body } })
    console.log(data)
    res.send("Done");
})

// get todays present
app.post('/getTodaysPresent', async (req, res) => {
    let getRolls = [];
    getRolls = req.body.data;
    console.log("rolls : "+getRolls)
    let date = new Date()
     console.log(req.body)
    let data = await attendSchema.find()
    getRolls.map((item, index) => {
        data[0].studentsAttendance.map((sitem, sindex) => {
            if (parseInt(item) === sitem.id) {
                sitem.totalAttendance += 1
                sitem.dates.push(date.toISOString())
            }
        })
    })
    let query = await attendSchema.updateOne({}, { $set: { "studentsAttendance": data[0].studentsAttendance } })
    res.json(query)
})


// get student details
app.get('/getDetails', async (req, res) => {
    let details;
    if (req.query.id) {
        details = await attendSchema.find(
            { "studentsAttendance": { $elemMatch: { "id": req.query.id } } },
            { "studentsAttendance.$": 1 })
        console.log(details)
        res.json(details)
        return
    }
    details = await attendSchema.find();
    res.json(details)
})


app.get('/', async (req, res) => {
    res.send("Hii")
})

app.get('/genPdf', async (req, res) => {

})


http.listen(4000, function () {
    console.log("Listening at port 4000");
})
