const File = require('./models/file');

const fs = require('fs');

const connectDB = require('./config/db');

connectDB();

async function dataCollect() {
    const pastDate = new Date(Date.now() - 6 *  60 * 60 * 1000);
    //delete old files in heroku server and mongo db
    const files = await File.find({ createdAt: { $lt: pastDate } });
    if(files.length){
       for(const file of files){
            try{
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted.${file.filename}`);
            }catch(err){
                console.log(`Error while deleting file ${err}`);
            }

       } 
       console.log('Job Done!');
    }
}

dataCollect().then(process.exit);