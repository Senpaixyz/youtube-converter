const express = require('express');
const ytdl = require('ytdl-core');
const {YTDL_MOD} = require('./api/YTDL_MOD');

const ytdl_discord = require("discord-ytdl-core");
const Discord = require("discord.js");
const client = new Discord.Client();

const app = express();
const PORT = 3000;
const { createWriteStream } = require('fs');
var bar;
app.use(express.json());
app.use(express.static('public'));


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'public/index.html');
});
app.get('/privacy-policy',(req,res)=>{
    res.sendFile(__dirname+'/public/privacy-policy.html');
});
app.get('/terms-of-service',(req,res)=>{
    res.sendFile(__dirname+'/public/terms-of-service.html');
});
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
        res.header('Content-Disposition',`attachment;\ filename="WEBCONVERTER-${title}.${extension}"`);
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