const File = require('./models/file');
const fs = require('fs');
const connectDb = require('.config/db');
connectDb();


async function fetchData(){
    const beforeDate = new Date(Dare.now() -(1000*60*60*24));
    const files = File.find({ createdAt : { $lt :beforeDate }});
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted${file.filename}`);
            }catch(err){
                console.log(`error while deleting file${err}`);
            }
            
        }

    }
}

fetchData().then( process.exit);