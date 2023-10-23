// Import
const express = require('express')
const requestIp = require('request-ip');
// const controller = require('controllers/')
const app = express()
const port = 3000
const uploadMiddleware = require('./middleware/uploadMiddleware');

// var multer = require('multer');


/*var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/clients/')
    },
    filename: function (req, file, cb) {
      cb(null, requestIp.getClientIp(req)+"#$@$#"+file.originalname) 
    }
  })
  
  var upload = multer({ storage: storage });*/

// Static Files


// Global variables
var dataDict = {}
var dictSize = 0;



app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'));

app.use("/api/v1/uploadimage",uploadMiddleware, require("./routes/uploader"));
// app.use("/api/v1/uploadimage",uploadMiddleware, require("./routes/uploader"));




// Set Views
app.set('views', './views')
app.set('view engine', 'ejs')



app.get('/', (req, res, next) => {
    // const clientIp = requestIp.getClientIp(req); 
    res.render('index', {dataDict:dataDict, dictSize: dictSize, results: process.env.RESULT_FILES })
    next();
})

app.get('/about', (req, res, next) => {
    res.render('about', { text: 'About Page'})
    next();
})



// require("./routes/index")(app);

// app.use("/api/upload", require("./routes/uploader"));
/* Send request for sqs and s3*/
/*
app.post('/api/photo',async function(req,res){

    upload(req,res,function(err) {
    
        if(err) {
          console.log(err)
            return res.end("Error uploading file.");
        }
        // Reset the dictionary when user uploads new images.
        dataDict = {};
        for (const index in req.files) {  
          uploadFile(req.files[index].filename)
    
        }
        res.end("File uploaded! Starting the process...");
    
    });
    
    });

    */
//  Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`))