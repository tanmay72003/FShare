const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');
const emailTemplate = require('../services/emailTemplate');

let storage = multer.diskStorage({
    destination: (req , file , cb) => cb(null , 'uploads/'),
    filename : (req, file ,cb) => {
        const uniqueName  = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
})

let upload = multer({storage , limit: {fileSize:1000000 * 100 },}).single('myfile');

router.post('/' ,(req ,res) => {
    

    upload(req,res, async (err) =>{
        if(!req.file) {
            return res.json({error : ' All feilds are required. '});
        }
        if(err){
            return res.status(500).send({error: err.message});
        }
        const file = new File({
            filename : req.file.filename,
            uuid : uuid4(),
            path : req.file.path,
            size : req.file.size,
        });
        const responce = await file.save();
        return res.json({file : `${process.env.APP_BASE_URL}/files/${responce.uuid}`})
    });
   

});

router.post('/send' , async (req, res) => {
    const { uuid,emailTo, emailFrom } = req.body;
    if(!uuid || !emailFrom || !emailTo)
    {
        return res.status(442).send({ error : 'all feilds are required. '});
    }
    const file = await File.findOne({ uuid : uuid});
    if(file.sender){
        return res.status(442).send({ error : 'email already sent.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const responce = await file.save();

    const sendMail = require('../services/emailServices');
    sendMail({
        from : emailFrom,
        to : emailTo,
        subject : 'FShare automated file-sharing service',
        text : `${emailFrom} sended you the file`,
        html: emailTemplate({
            emailFrom: emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size : parseInt(file.size/1000) + 'KB',
            expires : '24 hours',
        })
    });

    return res.send({success : true });
});

module.exports = router;