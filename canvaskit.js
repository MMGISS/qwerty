//canvas starter kit

//user settings

const sndPath = `
bgm/dead_soul_by_sound_souler.ogg
bgm/Destr0yer-feat-Nikki-Simmons.ogg
bgm/cut173_edition_brain_power.ogg
bgm/BPM_RT.ogg
bgm/3rd-Avenue.ogg

se/note.ogg note_slot0
se/note.ogg note_slot1
se/note.ogg note_slot2
se/note.ogg note_slot3
se/note.ogg note_slot4
se/note.ogg note_slot5
se/note.ogg note_slot6
se/note.ogg note_slot7
se/note.ogg note_slot8
se/note.ogg note_slot9
se/note.ogg note_slot10
se/note.ogg note_slot11
se/note.ogg note_slot12
se/note.ogg note_slot13
se/note.ogg note_slot14
se/note.ogg note_slot15
`.split("\n").filter(x=>x!=""&&x.charAt(0)!="#").map(x=>x.split(" "));

const imgPath = `

`.split("\n").filter(x=>x!=""&&x.charAt(0)!="#").map(x=>x.split(" "));

let pixelw = 3200, pixelh = 1800;

//end user setting

let getFPS_time, getFPS_fps, getFPS_timeStamp = [], getFPS =(sec = 1000)=> {
    getFPS_time = new Date().getTime();
    getFPS_timeStamp.push(getFPS_time);
    getFPS_timeStamp = getFPS_timeStamp.filter(x => getFPS_time - x <= sec);
    return getFPS_fps = getFPS_timeStamp.length / sec * 1000;
}

let mouseState = {
    wheel:0,
    x:0,
    y:0,
    left:false,
    middle:false,
    right:false,
}, keydown = {};

const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");

let ratio, resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / pixelw, canvas.height / pixelh);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}

canvas.addEventListener("mousedown", (event)=>{mouseState[["left","middle","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","middle","right"][event.button]] = false;});
document.addEventListener("mousemove", (event)=>{
    mouseState.x = (event.clientX - canvas.width / 2) / ratio;
    mouseState.y = (event.clientY - canvas.height / 2) / ratio;
});

canvas.addEventListener("wheel", (event)=>{mouseState.wheel += event.deltaY > 0 ? -1 : 1}, {passive: false});

document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});

window.addEventListener("resize", ()=>{resize()});

canvas.oncontextmenu =()=> {return false};

resize();


let img = {}, loadedImgs = 0;
imgPath.forEach(x=>{
    let i = new Image();
    i.src = x[0];
    i.addEventListener("load", ()=> {
        loadedImgs++;
        if (loadedImgs == imgPath.length) {
            canvas.dispatchEvent(new Event("imgLoaded"));
            if (loadedSnds == sndPath.length) canvas.dispatchEvent(new Event("allLoaded"));
        }
    });
    img[x[1]||x[0]] = i;
});

let snd = {}, loadedSnds = 0;
sndPath.forEach(x=>{
    let i = new Audio();
    i.src = x[0];
    i.addEventListener("loadeddata", ()=> {
        loadedSnds++;
        if (loadedSnds == sndPath.length) {
            canvas.dispatchEvent(new Event("sndLoaded"));
            if (loadedImgs == imgPath.length) canvas.dispatchEvent(new Event("allLoaded"));
        }
    });
    snd[x[1]||x[0]] = i;
});

ctx.__proto__.image =(name, x, y, w, h, ox = 0, oy = 0, r = 0)=> {
    if (Object.keys(img).indexOf(name) == -1) return 1;
    ctx.save();
    ctx.translate(x + ox * w, y + oy * h);
    ctx.rotate(r);
    ctx.drawImage(img[name], -w * ox, -h * oy, w, h);
    ctx.restore();
}

//end kit

document.title = "QWERTY";