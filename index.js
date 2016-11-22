var config = {
    "animationUrl": "animation",
    "imageType": "png",
    "startFrame": 0,
    "endFrame": 1750,
    "frameStep": 5,
    "frameDigits": 4,
    "transitionFrames": 50,
    "contentFrames": 250,
    "maxFPS": 24
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
        
        var startFrame = config.startFrame;
        var endFrame = startFrame + config.contentFrames;
        var frame = startFrame;
        var isTransitioning = false;
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
                startFrame += diff;
                endFrame += diff;
                isTransitioning = true;
                if ( startFrame >= config.endFrame ) {
                    startFrame = config.startFrame;
                    endFrame = startFrame + config.contentFrames;
                    frame = startFrame;
                    isTransitioning = false;
                }
            }
        };
    };
    
    var frame = config.startFrame;
    var loadFrame = function() {
        var img = document.createElement("img");
        var tmp = zeros + frame;
        img.src = config.animationUrl + "/" + tmp.substr(tmp.length - config.frameDigits) + "." + config.imageType;
        frames[frame] = img;
        progressbar.innerHTML = frame + "/" + config.endFrame;
        progressbar.style.width = (frame / config.endFrame * 100) + "%";
        img.onload = function() {
            frame += config.frameStep;
            if ( frame < config.endFrame ) {
                loadFrame();
            } else {
                showAnimation();
            }
        };
        document.body.appendChild(img);
    };
    loadFrame();
}
