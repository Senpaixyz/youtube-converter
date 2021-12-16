const host = window.location.origin;
const progressIndicatorID = document.querySelector('#progressIndicatorID');
let progressLoader =   document.querySelector('.progress');
let warningLoader = document.querySelector('.warning-loader');
var LOADER;
let BYTES_ARRAY  = [];
let VideoDOM = "";
let AudioDOM = "";
let detailsNode = {
                        thumbnails: document.querySelector('.thumbnail-img'),
                        title: document.querySelector('.video-data .info h2'),
                        duration: document.querySelector('.video-data .info p'),
                        videoURL : document.querySelector('.video-data .controls #video-url'),
                        videosOption: document.querySelector('.video-data .controls #videos-options'),
                        audioOption: document.querySelector('.video-data .controls #audio-options')
};

function convertHMS(value) {
    const sec = parseInt(value, 10); 
    let hours   = Math.floor(sec / 3600); 
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60); 
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds; 
};
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0){
        return 'n/a';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    if (i === 0){
        return `${bytes} ${sizes[i]})`;
    }
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
  };

function retrieveDataLoader(){
    progressIndicatorID.innerText =0;
    progressIndicatorID.setAttribute('aria-valuenow',0);
    progressIndicatorID.setAttribute('style',`width: ${0};`);
    warningLoader.setAttribute('hidden',true);
    BYTES_ARRAY  = [];
    LOADER = null;
};
function setProgress(){
    return new Promise((resolve,reject) =>{
        let isDone=false;
        progressLoader.removeAttribute('hidden');
        LOADER = setInterval(()=>{
            isDone = progress();
            if(isDone==true){
                resolve();
            }
        },1300);
    });
};
function progress(){
    let loaded = BYTES_ARRAY[0];
    let total = BYTES_ARRAY[BYTES_ARRAY.length-1];
    if(BYTES_ARRAY.length>0){
        let progressValue = Math.round(parseInt(loaded)/parseInt(total)*100);
        let progressPercentage = String(progressValue+'%');
        console.log(`PROGRSS VALUE: ${progressValue} while PROGRESS PERCENTAGE: ${progressPercentage}`);
        progressIndicatorID.innerText = String(parseInt(progressValue) + '%');
        progressIndicatorID.setAttribute('aria-valuenow',String(progressValue))
        progressIndicatorID.setAttribute('style',`width: ${progressPercentage};`) ; 
        BYTES_ARRAY.shift();
        console.log(LOADER);
        return false;
    }
    else{
        console.log("CLEAR TIMEOUT NOW");
        clearTimeout(LOADER);
        return true;
    }
}
const Callback = async (this_url)=> {
    let videoURL = this_url.trim();
    console.log(videoURL);
    const response = async ()=>{
                try{
                    const res = await fetch(host+'/videoInfo?videoURL='+ videoURL);
                    const resClone = res.clone();
                    const total = parseInt(res.headers.get('content-length'), 10);
                    let bytesReceived = 0;
                    if(res.status==200){
                            const new_res = new Response(new ReadableStream({
                            
                                async start(controller) {
                                console.log("RETRIEVING DATA...");
                                retrieveDataLoader();
                                const reader = res.body.getReader();
                                while(true) {
                                    const {done, value} = await reader.read();
                                    if (done) break;
                                    bytesReceived += value.byteLength;
                                    controller.enqueue(value);
                                    console.log(`RECEIVED: ${bytesReceived} / TOTAL ${total}`);
                                    BYTES_ARRAY.push(bytesReceived);
                                }
                                setProgress().then((res)=>{
                                    controller.close();
                                });
                                
                                },
                            }));

                            const blob = await new_res.blob();

                            return await  resClone.json();
                    } 
                }
                catch(error){
                    return error;
                }
            };
            ;
            await response().then((data)=>{
                    console.log(data);
                    setTimeout(()=>{
                        progressLoader.setAttribute('style','display:none');
                    },2500);
                    $('#get-video-info-btn').button('reset');
                    data.video_and_audio.forEach((formats)=>{
                        let currentFileSize = typeof formats.contentLength != 'undefined' ? bytesToSize(formats.contentLength): '';
                        VideoDOM += `<tr>`;
                        VideoDOM += `
                                                            <td class="details-section"><i class="fas fa-video text-success"></i></td>
                                                            <td class="details-section">(.${formats.container}) ${formats.qualityLabel}</td>
                                                            <td class="details-section">${currentFileSize}</td> 
                                                            <td><button class="btn btn-primary download-buttons"  type="button"  onclick="downloadEvent(this)" name="${formats.itag}/${formats.container}/video-audio">Download</button></td>
                                `;
                        VideoDOM += `</tr>`;
                    });
                    data.video_only.forEach((formats)=>{
                        if(formats.qualityLabel=="1080p"){
                            let currentFileSize = typeof formats.contentLength != 'undefined' ? bytesToSize(formats.contentLength): '';
                            VideoDOM += `<tr>`;
                            VideoDOM += `
                                                                <td class="details-section"><i class="fas fa-volume-mute text-danger" aria-hidden="true"></i></td>
                                                                <td class="details-section">(.${formats.container}) ${formats.qualityLabel}</td>
                                                                <td class="details-section">${currentFileSize}</td> 
                                                                <td><button class="btn btn-primary download-buttons" type="button"  onclick="downloadEvent(this)" name="$${formats.itag}/${formats.container}/video-only">Download</button></td>
                                    `;
                            VideoDOM += `</tr>`;
                        }
                    });
                    data.audio_only.forEach((formats)=>{
                        if(formats.audioQuality=="AUDIO_QUALITY_MEDIUM"||formats.audioQuality=="AUDIO_QUALITY_HIGH"){
                            let currentFileSize = typeof formats.contentLength != 'undefined' ? bytesToSize(formats.contentLength): '';
                            AudioDOM += `<tr>`;
                            AudioDOM += `
                                                                <td class="details-section"><i class="fas fa-music text-success" aria-hidden="true"></i></td>
                                                                <td class="details-section">(.mp3)</td>
                                                                <td class="details-section">${currentFileSize}</td> 
                                                                <td><button class="btn btn-primary download-btn download-buttons" type="button" onclick="downloadEvent(this)"  name="${formats.itag}/mp3/audio-only">Download</button></td>
                                    `;
                            AudioDOM += `</tr>`;
                        }
                    });
                    detailsNode.thumbnails.src = data.videoInfo.thumbnail.thumbnails[data.videoInfo.thumbnail.thumbnails.length-1].url; 
                    detailsNode.title.innerText = data.videoInfo.title;
                    detailsNode.duration.innerText =   `Duration: ${convertHMS(parseInt(data.videoInfo.lengthSeconds))}`;
                    detailsNode.videoURL.value = videoURL;
                    detailsNode.videosOption.innerHTML = VideoDOM;
                    detailsNode.audioOption.innerHTML = AudioDOM;
                    document.querySelector('.video-data').style.display = 'block';
                    document.querySelector('.video-data').scrollIntoView({
                                    behavior:'smooth'
                    });

            }).catch((error)=>{
                return new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        console.log("THERE IS SOMETHING WRONG " + error);
                        warningLoader.removeAttribute('hidden');
                        resolve();
                        $('#get-video-info-btn').button('reset');
                    },1500);
            });
    })
    
};
$('#videoURL').on('paste',async (e)=>{
    let videoURL = e.originalEvent.clipboardData.getData('Text');
    $('#get-video-info-btn').button('loading');
    setTimeout(await Callback(videoURL),1000);
});

$('#get-video-info-btn').on('click',async  function(){
    let videoURL = document.querySelector('#videoURL').value;
    if(videoURL.length==0){
        swal({
            title: "EMPTY URL!",
            text: "Please paste valid Youtube URL!",
            icon: "warning",
          });
    }
    else{
        $('#get-video-info-btn').button('loading');
        await Callback(videoURL);
    }
});
