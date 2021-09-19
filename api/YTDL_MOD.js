const ytdl = require('ytdl-core');


class YTDL_MOD {
    constructor(URL,data) {
        console.log("URL FETCHING...");
        this.videoURL = URL;
        this.DATA = {...data}
    }
    getVideoInfo(){
        const data = this.DATA;
        return  data.player_response.videoDetails;
    }

    getAudio_and_Video(){
            const data = this.DATA;
            let vaformats = ytdl.filterFormats(data.formats, 'videoandaudio');
            let fetch_va = this.getDataLength(vaformats);
            return fetch_va;
    }
    getVideo_only(){
            const data = this.DATA;
            //let voformats= ytdl.chooseFormat(data.formats, { quality: 'highestvideo'});
            let voformats= ytdl.filterFormats(data.formats, 'videoonly');
            let fetch_video_only = this.getDataLength(voformats);
            return fetch_video_only
    }
    getAudio_only(){
            const data = this.DATA;
            let aoformats= ytdl.filterFormats(data.formats, 'audioonly');
            let fetch_audio_only = this.getDataLength(aoformats);
            return fetch_audio_only;
    }
    getDataLength(input_stream){
        console.log("input stream: " + input_stream.length)
        if(input_stream.length>0){
            return input_stream ;
        }
        else{
            return []
        }
    }



}

// exports.getMP4_no_video = (URL)=>{

// }

module.exports = {YTDL_MOD};

