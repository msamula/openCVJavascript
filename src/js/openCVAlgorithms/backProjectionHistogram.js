let src, srcVec, mask, hist, none;

let channels = [0];
let histSize = [50];
let ranges = [0, 180];
let accumulate = false;

export function initBackProjection(input){
     src = cv.imread(input);
     cv.cvtColor(src, src, cv.COLOR_RGB2HSV, 0);
     srcVec = new cv.MatVector();
     srcVec.push_back(src);

     mask = new cv.Mat();
     hist = new cv.Mat();
     none = new cv.Mat();

    cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
    cv.normalize(hist, hist, 0, 255, cv.NORM_MINMAX, -1, none);
}

export function backProjection(input, output){
    let dst, dstVec;

    dst = cv.imread(input);
    cv.cvtColor(dst, dst, cv.COLOR_RGB2HSV, 0);
    dstVec = new cv.MatVector();
    dstVec.push_back(dst);

    let backproj = new cv.Mat();
    cv.calcBackProject(dstVec, channels, hist, backproj, ranges, 1);

    cv.imshow(output, backproj);

    dst.delete();
    dstVec.delete();
    backproj.delete();


    setTimeout(()=>{
        backProjection(input, output);
    },3);
}

