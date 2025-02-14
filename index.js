var config = {
    "animationUrl": "animation",
    "imageType": "png",
    "startFrame": 0,
    "endFrame": 1750,
    "frameStep": 1,
    "frameDigits": 4,
    "transitionFrames": 50,
    "contentFrames": 250,
    "maxFPS": 24,
    "loadingThreads": 10
};

function startLoad() {
    var progressbar = document.getElementById("progress");
    var canvas = document.getElementById("canvas");
    var loadingdiv = document.getElementById("loading");
    var playdiv = document.getElementById("play");
    var ctx = canvas.getContext("2d");
    
    var frames = {};
    var zeros = "";
    
    for ( var i = 0; i < config.frameDigits; ++i ) {
        zeros += "0";
    }
    
    var showAnimation = function() {
        playdiv.style.display = "block";
        loadingdiv.style.display = "none";
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        
        var startFrame;
        var endFrame;
        var frame;
        var isTransitioning;
        
        window.restartAnimation = function() {
            startFrame = config.startFrame;
            endFrame = startFrame + config.contentFrames;
            frame = startFrame;
            isTransitioning = false;
        };
        restartAnimation();
        
        var render = function() {
            ctx.drawImage(frames[frame], 0, 0, canvas.width, canvas.height);
            frame += config.frameStep;
            if ( frame > endFrame ) {
                frame = startFrame;
            } else if ( isTransitioning && frame > startFrame ) {
                isTransitioning = false;
            }
        };
        setInterval(render, 1000 * config.frameStep / config.maxFPS);
        
        window.nextSlide = function() {
            if ( !isTransitioning ) {
                var diff = config.transitionFrames + config.contentFrames;
                if ( startFrame + diff > config.endFrame ) {
                    $("#restart").modal("show");
                } else {
                    startFrame += diff;
                    endFrame += diff;
                    isTransitioning = true;
                }
            }
        };
    };
    
    var nextFrameToLoad = config.startFrame;
    var framesLoading = 0;
    var framesLoaded = 0;
    var framesTotal = (config.endFrame - config.startFrame) / config.frameStep + 1;
    var loadingThread = function() {
        var img = document.createElement("img");
        var tmp = zeros + nextFrameToLoad;
        img.src = config.animationUrl + "/" + tmp.substr(tmp.length - config.frameDigits) + "." + config.imageType;
        frames[nextFrameToLoad] = img;
        progressbar.innerHTML = framesLoaded + "/" + framesTotal;
        progressbar.style.width = (framesLoaded * 100 / framesTotal) + "%";
        ++framesLoading;
        nextFrameToLoad += config.frameStep;
        img.onload = function() {
            --framesLoading;
            ++framesLoaded;
            if ( nextFrameToLoad < config.endFrame ) {
                loadingThread();
            } else if ( framesLoading == 0 ) {
                showAnimation();
            }
        };
        document.body.appendChild(img);
    };
    for ( var i = 0; i < config.loadingThreads; ++i ) {
        loadingThread();
    }
}
