let constraints = { video: true};
let videoPlayer = document.querySelector("video");
let frame = document.querySelector(".frame");
frame.style["max-width"] = videoPlayer.offsetWidth + "px";
let vidRecordBtn = document.querySelector("#record-video");
let captureBtn = document.querySelector("#click-picture");

let recordState = false;
let mediaRecorder;
let chunks = [];
let zoom = 1;
let zoomIn = document.querySelector(".zoom-in");
zoomIn.addEventListener("click", function(){
    if(zoom < 2.5){
    zoom += 0.1;
    videoPlayer.style.transform = `scale(${zoom})`;
    }
})
let zoomOut = document.querySelector(".zoom-out");
zoomOut.addEventListener("click", function(){
    if(zoom > 1){
    zoom -= 0.1;
    videoPlayer.style.transform = `scale(${zoom})`;
    }
})
captureBtn.addEventListener("click", function(e){
    capture();
})
// vidRecordBtn.addEventListener("click", function () {
//     if (!recordState) {
//         mediaRecorder.start();
//         recordState = true;
//         vidRecordBtn.innerText = "Recording...";
//     } else {
//         mediaRecorder.stop();
//         recordState = false;
//         vidRecordBtn.innerText = "Record";
//     }
// });

let timerInterval;
let second = 0;
let minute = 0;
vidRecordBtn.addEventListener("click", function () {
    if (!recordState) {
        mediaRecorder.start();
        recordState = true;
        timerInterval = setInterval(() => {
            second++;
            if (second == 60) {
                minute++;
                second = 0;
            }
            if(minute < 10) {
                document.querySelector(".minute").innerText = "0" + minute;
            } else {
                document.querySelector(".minute").innerText = minute;
            }

            if(second < 10) {
                document.querySelector(".second").innerText = "0" + second;
            } else {
                document.querySelector(".second").innerText = second;
            }
            
        }, 1000);
        vidRecordBtn.innerHTML = `<img src="https://img.icons8.com/flat-round/60/000000/stop.png"/>`;
    } else {
        mediaRecorder.stop();
        recordState = false;
        clearInterval(timerInterval);
        second = 0;
        minute = 0;
        document.querySelector(".minute").innerText = "00";
        document.querySelector(".second").innerText = "00";
        vidRecordBtn.innerHTML = `<img src="https://img.icons8.com/flat-round/60/000000/record.png"/>`;
    }
});
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
    console.log(mediaStream.getVideoTracks()[0].getCapabilities());
    videoPlayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);
    console.log(mediaRecorder);
    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
    }

    mediaRecorder.onstop = function() {
        let blob  = new Blob(chunks, {type: "video/mp4"});
        chunks = [];
        let blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);
        let a = document.createElement("a");
        a.href = blobUrl;
        a.download = "temp.mp4";
        a.click();
    }
})
function capture(){
    let canvas = document.createElement("canvas");
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;
    console.log(videoPlayer.videoWidth , videoPlayer.videoHeight);
    let ctx = canvas.getContext("2d");
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(zoom,zoom);
    ctx.translate(-(canvas.width/2),-(canvas.height/2));
    ctx.drawImage(videoPlayer, 0, 0);
    if(filter != ""){
        ctx.fillStyle = filter;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
    let link = document.createElement("a");
    link.download = "img.png";
    link.href = canvas.toDataURL();
    link.click();
}
let filter = "";
let allFilters = document.querySelectorAll(".filter");

for(let i of allFilters){
    i.addEventListener("click", function(e){
        filter = e.currentTarget.style.backgroundColor;
        addFilterToScreen(filter);
    })
}
function addFilterToScreen(filter){
    let prevScreenFilter = document.querySelector(".screen-filter");
    if(prevScreenFilter){
        prevScreenFilter.remove();
    }
    let filterScreen = document.createElement("div");
    filterScreen.classList.add("screen-filter");
    filterScreen.style.height = videoPlayer.offsetHeight + "px";
    filterScreen.style.width = videoPlayer.offsetWidth + "px";
    filterScreen.style.backgroundColor = filter;
    document.querySelector(".filter-screen-parent").append(filterScreen);
}
