const express = require('express');
const ytdl = require('ytdl-core');
const {YTDL_MOD} = require('./api/YTDL_MOD');
const ytdl_discord = require("discord-ytdl-core");
const nodemailer = require('./api/nodemailer');
const validator = require('email-validator');
const app = express();
const PORT = process.env.PORT || 2525;
const { createWriteStream } = require('fs');
var bar;
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'public/index.html');
});
app.get('/privacy-policy',(req,res)=>{
    res.sendFile(__dirname+'/public/privacy-policy.html');
});
app.get('/terms-of-service',(req,res)=>{
    res.sendFile(__dirname+'/public/terms-of-service.html');
});
app.get('/contact-us',(req,res)=>{
    res.sendFile(__dirname+'/public/contact-us.html');
});
app.get('/thankyou',(req,res)=>{
    res.sendFile(__dirname+'/public/thankyou.html');
})
app.post('/sent',async (req,res)=>{
    let {name,email,message} = req.body;
    const regex = /\d/; // has number in name
    let validEmail=true;
    let invalidName=false;
    if(email.length>0){
        validEmail = validator.validate(email);
    }
    else{
        email = "Anonymous@gmail.com";
    }
    if(name.length>0){
        invalidName = regex.test(name);
    }
    else{
        name = "Anonymous";
    }
    if(!validEmail || invalidName){
        res.status(200).redirect(`/contact-us?success=false&error=InvalidInput`)
    }
    else{
        const Txtmessage = `
            From ${name}, ${message}, his/her mailing address is ${email}.
        `;
        const HTMLmessage =   `
        <p style='font-weight:bold'>FROM: ${name}</p>
                <br>
                <p> ${message} </p>
                <br>
            <p>Email: ${email}</p>
        `;
        let mailDetails = {
            from: email,
            to: "jhicer@gmail.com",
            sender: email,
            subject: `Email Notification for Y2BC`,
            text:  Txtmessage,
            html: HTMLmessage
        };
        try{
            await nodemailer.mailTransporter.sendMail(mailDetails,(err,data)=>{
                if (err) {
                    res.status(500).redirect(`/contact-us?success=false&error=${err}`)
                    console.log("Error Occurs");
                    console.log(err)
                } else {
                    res.status(200).redirect(`/contact-us?success=true&data=${data}`)
                    console.log("Email sent successfully");
                    console.log(data)
                }
            });
        }
        catch(err){
            res.status(200).redirect(`/contact-us?success=false&error=InvalidEmailAddress`)
        }
    }
    
})
app.get('/videoInfo',async (req,res)=>{
 const videoURL = req.query.videoURL;
 try{
        const videoIDURL = ytdl.getURLVideoID(videoURL);
        if(ytdl.validateID(videoIDURL)){
            const info = await ytdl.getInfo(videoURL);
            let YTDL_FETCH = new YTDL_MOD(videoURL,info);
            let videoInfo = YTDL_FETCH.getVideoInfo();
            let video_and_audio_format = YTDL_FETCH.getAudio_and_Video();
            let video_only_format = YTDL_FETCH.getVideo_only();
            let audio_only_format = YTDL_FETCH.getAudio_only();
            const videoData = {
                'videoInfo': videoInfo,
                'video_and_audio': video_and_audio_format.reverse(),
                'video_only': video_only_format.reverse(),
                'audio_only': audio_only_format.reverse()
            };
            return res.status(200).json(videoData);  

        }
        res.status(204).json([{error:"ERROR 2 found!"}]);

 }
 catch(error){
    console.log(error)
    return res.status(204).json({error:"Invalid Video URL or Video ID is not exist!"});
    // throw error;
 }

});

app.get('/download/:videoURL/:itag/:title/:extension/:type',(req,res)=>{
    // const videoURL = req.query.videoURL;
    // const itag = req.query.itag;
    const encrypted_URL = req.params.videoURL;
    const itag = req.params.itag
    const encodedTitle = req.params.title;
    const extension = req.params.extension;
    const type = req.params.type;
    const videoURL = decodeURIComponent(encrypted_URL.replace(/\+/g,  " "));
    const title = decodeURIComponent(encodedTitle.replace(/\+/g,  " "));
    try{
        res.header('Content-Disposition',`attachment;\ filename="y2bCONVERTER-${title}.${extension}"`);
        if(type=="video-only"){
            res.status(200);
            ytdl(videoURL)
            .on('error', (error)=>{
                console.log('Error : ', error);
                res.redirect('/error');
            }).pipe(res) // res
        }
        else if(type=="video-audio"){
            res.status(200);
            ytdl(videoURL,{
                filter: format=> format.itag == itag,
                highWaterMark: 1 << 25
            })
            .on('error', (error)=>{
                console.log('Error : ', error);
                res.redirect('/error')
            }).pipe(res) // res
        }
        else if(type=="audio-only"){
            console.log("AUDIO ONLY NOW");
            res.status(200);
            ytdl_discord(videoURL, {
                filter: "audioonly",
                quality: "highestaudio",
                highWaterMark: 1 << 25,
                encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
                //encoderArgs: ["-af", "asetrate=44100*1.25,bass=g=20,dynaudnorm=f=150"],
                fmt: "mp3",
                opusEncoded: false
            })
            .on('error', (error)=>{
                console.log('Error : ', error);
                res.redirect('/error')
            }).pipe(res) // res
        }
        else{
            res.redirect('/error');
        }
    }
    catch(error){
        res.redirect('/error');
    }
  
});
app.get('/validate/:url_encrypt',(req,res)=>{
    const url = decodeURIComponent(req.params.url_encrypt.replace(/\+/g,  " "));
    try{
        const isValidURL = ytdl.validateURL(url);
        if(isValidURL==true){
            const ID = ytdl.getURLVideoID(url);
            const isvalidID = ytdl.validateID(ID);
            if(isvalidID==true){
                res.status(200).json({'validation':true});
            }
        }
    }catch(error){
        res.status(204).json({'validation':false,"error":error})
    }
});


app.get('/error',(req,res)=>{
    res.status(404).sendFile(__dirname+'/public/404.html');
});
app.use((req,res,next)=>{
    res.status(404).sendFile(__dirname+'/public/404.html');
})
app.get('/test',(req,res)=>{
    
    let url = 'https://www.youtube.com/watch?v=eo_A7_G1wHI';
    const id = ytdl.getURLVideoID(url);
    res.header('Content-Disposition',`attachment;\ filename="WEBCONVERTER.mp3`);
    res.status(200);
    let stream = ytdl_discord(url, {
        filter: "audioonly",
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200'],
        //encoderArgs: ["-af", "asetrate=44100*1.25,bass=g=20,dynaudnorm=f=150"],
        fmt: "mp3",
        opusEncoded: false
    });

    stream.pipe(res);
})
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})