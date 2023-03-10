import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/custom.css';

import {histogram} from "./openCVAlgorithms/histogram";
import {backProjection, initBackProjection} from "./openCVAlgorithms/backProjectionHistogram";


/*
let imgElement = document.getElementById('imageSrc');
let inputElement = document.getElementById('fileInput');

inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

imgElement.onload = () => {
    histogram(imgElement,'canvasOutput')
};*/


let btn = document.getElementById('histBtn');
let video = document.getElementById('video');
let firstCanvas = document.getElementById('firstCanvas');
let helperCanvas = document.getElementById('helperCanvas');
let output = document.getElementById('output');
let readyInfo = document.getElementById('readyInfo');

let firstCtx = firstCanvas.getContext('2d', {willReadFrequently: true});
let ctx = helperCanvas.getContext('2d', {willReadFrequently: true});

let counter = 0;

async function updateHistogram(){

    if(counter === 4000){
        counter = 0;
        return;
    }

    if(counter === 0){
        firstCtx.drawImage(video, 0, 0, firstCanvas.width, firstCanvas.height);
    }

    ctx.drawImage(video, 0, 0, helperCanvas.width, helperCanvas.height);

    await histogram(helperCanvas, 'canvasOutput');

    counter++;

    setTimeout(updateHistogram,3);
}



navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })

video.onloadeddata = () => {

    helperCanvas.width = firstCanvas.width = output.width       = video.videoWidth;
    helperCanvas.height = firstCanvas.height = output.height    = video.videoHeight;

    initBackProjection(firstCanvas);

    readyInfo.setAttribute('style', 'display: flex !important; max-height: 50px; max-width: 300px; padding: 0px 0px 0px 15px');
    btn.disabled = false;

    setTimeout(()=>{
        readyInfo.setAttribute('style', 'display: none !important;');
    },3000);

    btn.addEventListener('click', () => {

        updateHistogram();
        backProjection(helperCanvas, output);
    });
};



