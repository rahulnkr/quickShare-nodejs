const router = require('express').Router();

const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');


let storage = multer.diskStorage({
    destination: (req, file, cb) =>cb(null, 'uploads/'),
    filename:(req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() *
             1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);

    } 
})

let upload = multer({
    storage, //both key and variable name is same so ,
    limit: { fileSize: 1000000 * 100}, //100mb upload size(in bytes)

}).single('myfile');

router.post('/', (req, res) => {
    
    //store file
    upload(req, res, async (err) => {
        //Validation req
        if(!req.file){
            return res.json({ error : 'All fields are required.'});
    
        }
        
        if(err){
            return res.status(500).send({ error: err.message })
        }
    //sotre in db
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });


        const response = await file.save(); //used async and await
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
        //http://localhost:3000/files/uuid(2882dn2n-akd.zip)
    });

})

module.exports = router;
