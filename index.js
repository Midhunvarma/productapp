const Joi = require('joi');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dbURL = require('./properties').DB_URL;
const cors = require('cors');
var ProductModel = require('./productSchema.js');
var ProductFileModel = require('./fileSchema.js')
const multer = require("multer")
const dotenv = require('dotenv');
const config = require('config');

dotenv.config()

mongoose.connect(
    process.env.MONGODB_URL)


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(express.static('uploads'));




app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

//banners crud operations begin

//fetch
app.get('/api/products', (req, res) => {
    ProductModel.findOne({ unqId: req.params.unqId},
        function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
                console.log("Data Fetched");
            }
        }
        
        )

});

//delete
app.delete('/api/products', (req, res) => {
    ProductModel.deleteOne({ unqId: req.params.unqId },
        console.log(req.params.unqId),
        function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(data);
                console.log("Data Deleted!");
            }
        });
});

//create
app.post('/api/products', (req, res) => {
    var time = Math.floor(new Date().getTime() / 1000)
    var newUser = new ProductModel(
        {

            unqId: 'PROD' + time,
            name: req.body.name,
            file: req.body.file,
            description: req.body.description,
        }
    );
    newUser.save(function (err, data) {
        if (err) {
            console.log(error);
        }
        else {
            res.send(data);
            res.status(200)
        }
    });
})


//update
app.put('/api/products', (req, res) => {

    console.log(req.body)
    ProductModel.updateOne({ unqId: req.body.unqId },
        {

            // unqId: req.body.unqId,
            name: req.body.name,
            file: req.body.file,
            description: req.body.description,
           

        },

        function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send({ "message": "Data Updated", "data": data })
                console.log("Data updated!");
            }
        }

    );



});
 
//end crud operations

// File Upload Api begin
var fileArray = [];
var filePathUrl = '';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filePath = `banners/${Date.now()}${ext}`;
        filePathUrl = filePath;
        file["filePath"] = filePath;
        fileArray.push(file);
        cb(null, filePath);
    }
});
const upload = multer({ storage });
const fileFields = upload.fields([
    { name: 'banner', maxCount: 1 }
])
app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log(fileArray);
    var newFile = new ProductFileModel(
        {
            unqId: req.body.unqId,
            file: fileArray[0]
        });
    newFile.save(function (err, data) {
        if (err) {
            console.log(error);
        }
        else {
            fileArray = [];
            res.send({ status: 'OK', unqId: req.body.unqId, filePathUrl });
        }
    });
});
// File upload end

// Fetch prduct

app.get('/api/products/files', (req, res) => {

    ProductFileModel.findOne(

        { unqId: req.query.unqId },

        function (err, data) {

            if (err) {

                console.log(err);

            }

            else {

                res.send(data);

            }

        }

    );

});

const port = process.env.port || 8000;
app.listen(port, () => console.log(`Listening on port ${port}..`))