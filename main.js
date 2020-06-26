let pathPreset = {};
`
diamond: M 0,-100 100,0 0,100 -100,0 z

q: M -50,-50 50,-50 30,50 M 50,50 -50,50 -30,-50 M 0,50 5,25 35,25
w: M -50,-50 -30,-50 -50,50 50,50 M 30,50 50,-50 M -10,50 6,-30
e: M -50,-50 50,-50 46,-30 M -30,-50 -50,50 50,50 M 30,50 34,30 M -40,0 20,0
r: M -50,50 -30,-50 M -50,-50 50,-50 40,0 0,0 30,50, 50,50
t: M -50,-50 -30,-50 -50,50 50,50 M 30,50 35,25 M -35,-25 45,-25
y: M -50,-50 -30,-50 -40,0 40,0 M 50,-50 30,50 M 50,50 -50,50 -45,25
u: M -50,-50 -30,-50 -50,50 50,50 M 30,50 50,-50
i: M -50,-50 -10,-50 M 50,-50 10,-50 -10,50 -50,50 M 10,50 50,50
o: M -50,-50 50,-50 30,50 M 50,50 -50,50 -30,-50
p: M -50,50 -30,-50 M -50,-50 50,-50 40,0 0,0

a: M -50,50 -30,-50 M -50,-50 50,-50 30,50 50,50 M -40,0 40,0
s: M -50,50 50,50 M 30,50 40,0 -40,0 -30,-50 M -50,-50 50,-50
d: M -50,-50 30,-50 42,-10 30,50 M 50,50 -50,50 -30,-50
f: M -50,50 -30,-50 M -50,-50 50,-50 M -40,0 40,0
g: M 50,-50 -50,-50 -30,-50 -50,50 50,50 M 30,50 40,0 0,0
h: M -50,-50 -30,-50 -50,50 M -40,0 40,0 M 50,50 30,50 50,-50
j: M 10,-50 50,-50 30,50 M 50,50 -50,50 -42,10
k: M -50,-50 -30,-50 -50,50 M 50,-50 -10,0 30,50 50,50
l: M -50,-50 -30,-50 -50,50 50,50 30,50 35,25
;: M -35,-25 -30,-50 -50,-50 50,-50 30,50 50,50 -50,50 -45,25

z: M 50,50 H 30 M -50,-50 h 20 M 35,25 30,50 H -50 L 50,-50 h -80 l -5,25
x: M -10,0 H 10 M 50,-50 10,0 30,50 H 50 M -50,-50 h 20 l 20,50 -40,50
c: M 30,50 35,25 M -30,-50 -50,50 H 30 50 M -50,-50 H 50 l -5,25
v: M 50,50 H -10 M -50,-50 h 20 V 50 L 50,-50
b: M -50,-50 H 50 L 42.5,-12.5 0,0 37.5,12.5 30,50 m -80,0 20,-100 M -50,50 H 50
n: M 30,50 50,-50 M -50,50 v 0 l 20,-100 m -20,0 h 20 L 30,50 h 20
m: m -50,50 v 0 l 20,-100 m -20,0 h 20 L 0,0 50,-50 30,50 h 20
,: M -50,-50 H 5 L 0,-25 M -30,-50 -50,50 h 35 l 5,-25 M 50,50 H -5 L 15,-50 H 50 L 30,50
.: M -30,-50 -50,50 M 50,50 H -5 L 5,0 H 40 M 30,50 50,-50 m -100,0 H 5 L -5,0 h -35
/: M 30,50 35,25 M 50,50 H -5 L 15,-50 m -45,0 -10,50 h 35 l -10,50 h -35 l 5,-25 m -5,-75 H 5 l -5,25

`.split("\n").filter(x=>x).forEach(x => pathPreset[x.substring(0, x.indexOf(" ") - 1)] = new Path2D(x.substring(x.indexOf(" "))));
let score = {},
    title,
    author,
    bgm, 
    bgmvol,
    bpm, 
    offset, 
    pathes = {}, 
    laneStates = {},
    notes = [], 
    laneMoves = [],
    metaData = [],
    effects = [], 
    drewId = {}, 
    longlotesEffect = 0, 
    startedTime, 
    nowTime, 
    pressedTime = new Array(10).fill(-Infinity),
    pressed = [],
    newPressed = new Array(10).fill(false),
    fullComboAmount = 0,
    laneKeys = (localStorage.getItem("lanekey") || "qwertyuiop").split(""),
    noteSlot = 0;
    infoStyle = {
        ypos: 0, 
        alpha: 0
    },
    judgeStatus = {
        score: 0,
        maxCombo: 0,
        combo: 0,
        perfect: 0,
        good: 0,
        far: 0,
        lost: 0
    };

const judgeRate = {
    far:350, 
    good:150, 
    perfect:50,
    perfect_supereme: 30,
    longNoteTerm:300
};
const themes = {
    theme_default: {
        backGround: "#101020",
        white: "#d0d0ff",
        tapNote: "#88eeff",
        tapNoteFill: "#88eeff66",
        slideNote: "#ffff88",
        slideNoteFill:"#ffff8866",
        perfect: "#ffff88",
        good: "#88eeff",
        far: "#ff8888"
    },
    theme_purple: {
        backGround: "#101020",
        white: "#b0b0ff",
        tapNote: "#b0b0ffff",
        tapNoteFill: "#7d7dff77",
        slideNote: "#d0d0ff",
        slideNoteFill:"#d0d0ff88",
        perfect: "#7070ff",
        good: "#8080a0",
        far: "#ff8888"
    }
}

const colorList = themes.theme_default;

document.body.style.backgroundColor = colorList.backGround;

const diagLeng = (3200 ** 2 + 1800 ** 2) ** 0.5;

let note = class {
    constructor(type, lane, path, endTime, speed, id, reversed, isMultiNote){
        this.type = type;
        this.lane = lane;
        this.path = path;
        this.endTime = endTime;
        this.speed = speed;
        this.id = id || 0;
        this.reversed = reversed ? -1 : 1;
        this.isMultiNote = isMultiNote || false;
        this.judge = false;
        this.effected = false;
    }
}

let laneMove = class {
    constructor(type, lane, path, endTime, speed, min, max){
        this.type = type;
        this.lane = lane;
        this.path = path;
        this.endTime = endTime;
        this.speed = speed;
        this.min = min;
        this.max = max;
    }
}

let defineLane = class {
    constructor(laneId, time, xpos, ypos, direction, alpha, keyNum){
        this.laneId = laneId;
        this.time = time;
        this.xpos = xpos * 1;
        this.ypos = ypos * 1;
        this.alpha = alpha * 1;
        this.direction = direction * Math.PI * 2;
        this.keyNum = keyNum * 1;
    }

    isExpired(time) {
        return time >= this.time;
    }
}

let deleteLane = class {
    constructor(laneId, time){
        this.laneId = laneId;
        this.time = time;
    }
    
    isExpired(time) {
        return time >= this.time;
    }
}

let lane = class {
    constructor(xpos, ypos, direction, alpha, keyNum){
        this.xpos = xpos;
        this.ypos = ypos;
        this.direction = direction;
        this.alpha = alpha;
        this.keyNum = keyNum;

        this.latestDispatchedNoteJudge;
        this.latestDispatchedNoteTime = -Infinity;
    }
}

let effect = class {
    constructor(lane, judge, sound = false){
        this.lane = lane;
        this.judge = judge;
        this.sound = sound;
        this.time = new Date().getTime();
        this.particle = new Array(judge == "perfect" ? 6 : judge == "good" ? 3 : 0).fill(0).map(() => {return {rad: Math.random() * Math.PI * 2, size: 0.1 + Math.random() * 0.3}});

        laneStates[lane].latestDispatchedNoteTime = nowTime;
        laneStates[lane].latestDispatchedNoteJudge = judge;
    }
}

let getBezier =(x1, y1, x2, y2, x3, y3, x4, y4, t)=> [
    (1 - t) ** 3 * x1 + 3 * (1 - t) ** 2 * t * x2 + 3 * (1 - t) * t ** 2 * x3 + t ** 3 * x4,
    (1 - t) ** 3 * y1 + 3 * (1 - t) ** 2 * t * y2 + 3 * (1 - t) * t ** 2 * y3 + t ** 3 * y4
];

let getBezierYfromX =(x1, y1, x2, y2, x3, y3, x4, y4, px, trails = 16)=> {
    let t = 0.5;
    
    for (let i = 0; i < trails; i++) {
        let bezierX = (1 - t) ** 3 * x1 + 3 * (1 - t) ** 2 * t * x2 + 3 * (1 - t) * t ** 2 * x3 + t ** 3 * x4;
        if (bezierX < px) t += 0.5 ** (i + 2);
        else if (bezierX > px) t -= 0.5 ** (i + 2);
        else break;
    }

    return (1 - t) ** 3 * y1 + 3 * (1 - t) ** 2 * t * y2 + 3 * (1 - t) * t ** 2 * y3 + t ** 3 * y4;
}

let getPosByPath =(pathStr)=> {
    let pos = [], lastPath = [], command = "";
    let path = pathStr.split(" ").filter(x=>x).map(x => x.split(",").map(x => x == x * 1 ? x * 1 : x));

    for (let i = 0; i < path.length; i++) {
        if (path[i][0] * 1 != path[i][0]) command = path[i][0];
        else {
            if (lastPath.length) {
                switch (command) {
                    case "M": case "L": pos.push([lastPath, path[i]]); break;
                    case "m": case "l": pos.push([lastPath, [lastPath[0] + path[i][0], lastPath[1] + path[i][1]]]); break;

                    case "H": pos.push([lastPath, [path[i][0], lastPath[1]]]); break;
                    case "h": pos.push([lastPath, [path[i][0] + lastPath[0], lastPath[1]]]); break;

                    case "V": pos.push([lastPath, [lastPath[0], path[i][0]]]); break;
                    case "v": pos.push([lastPath, [lastPath[0], path[i][0] + lastPath[1]]]); break;

                    case "C": pos.push([lastPath, path[i], path[i+1], path[i+2]]); i += 2; break;
                    case "c": pos.push([lastPath, [lastPath[0] + path[i][0], lastPath[1] + path[i][1]], [lastPath[0] + path[i+1][0], lastPath[1] + path[i+1][1]], [lastPath[0] + path[i+2][0], lastPath[1] + path[i+2][1]]]); i += 2; break;
                }
            }
            if (pos.length) lastPath = pos.slice(-1)[0].slice(-1)[0];
            else lastPath = path[i];
        }
    }

    return pos;
}

let getYposFromPath =(pos, px)=> {
    px = Math.max(0, Math.min(px, 100));
    let i = 0;
    for (i = 0; i < pos.length - 1; i++) if (pos[i + 1][0][0] > px) break;
    if (pos[i].length == 4) return getBezierYfromX(pos[i][0][0], pos[i][0][1], pos[i][1][0], pos[i][1][1], pos[i][2][0], pos[i][2][1], pos[i][3][0], pos[i][3][1], px);
    else return pos[i][0][1] + (pos[i][0][0] - px) / (pos[i][1][0] - pos[i][0][0]) * (pos[i][0][1] - pos[i][1][1]);
}

let getYposFromPathArr =(pathArr, px)=> {
    let lastYpos = px;
    pathArr.reverse().forEach(x => lastYpos = getYposFromPath(pathes[x], lastYpos));
    pathArr.reverse();
    return lastYpos;
}

let drawqwerty =()=> {
    ctx.strokeStyle = colorList.white;
    ctx.fillStyle = colorList.white;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.globalAlpha = 1;
    
    Object.values(laneStates).forEach(x => {
        ctx.save();

        ctx.translate(x.xpos, x.ypos);
        ctx.rotate(x.direction);

        ctx.globalAlpha = 0.05 * x.alpha;
        ctx.fillRect(-120, -diagLeng, 240, diagLeng * 2);

        ctx.globalAlpha = (0.25 * pressed[x.keyNum] + Math.max(1 - (nowTime - pressedTime[x.keyNum]) / 500 || 0, 0) * 0.75) * Math.min(x.alpha, 1) * 0.3;
        ctx.fillRect(-120, -diagLeng, 240, diagLeng * 2);

        if (nowTime - x.latestDispatchedNoteTime < 1000) {
            ctx.globalAlpha = Math.max(Math.min(((nowTime - x.latestDispatchedNoteTime) / 1000 - 1) ** 2 * x.alpha * 0.65, 0.65), 0);
            let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 500);
            gradient.addColorStop(0, colorList[x.latestDispatchedNoteJudge] + "ff");
            gradient.addColorStop(0.3, colorList[x.latestDispatchedNoteJudge] + "88");
            gradient.addColorStop(1, colorList[x.latestDispatchedNoteJudge] + "00");
            ctx.fillStyle = gradient;
            ctx.fillRect(-120, -500, 240, 1000);
            ctx.fill();
        }

        ctx.globalCompositeOperation = "lighter";

        ctx.globalAlpha = Math.max(0, Math.min(1, x.alpha));
        ctx.stroke(pathPreset.diamond);
        ctx.stroke(pathPreset[laneKeys[x.keyNum]]);

        ctx.beginPath();
        ctx.moveTo(-120, diagLeng);
        ctx.lineTo(-120, -diagLeng);
        ctx.moveTo(120, diagLeng);
        ctx.lineTo(120, -diagLeng);
        ctx.stroke();
        
        ctx.restore();
    });
}

let readMetaData =()=> {
    metaData.some(x => {
        switch (x.constructor.name) {
            case "defineLane": {
                if (x.time <= nowTime) laneStates[x.laneId] = new lane(x.xpos, x.ypos, x.direction, x.alpha, x.keyNum);
            } break;
            case "deleteLane": {
                if (x.time <= nowTime) delete laneStates[x.laneId];
            } break;
        }
    })
}

let moveLanes =()=> {
    laneMoves.some(x => {
        if (x.endTime - x.speed > nowTime) return true;

        let time;
        if (x.speed == 0) time = 0;
        else time = (x.endTime - nowTime) / x.speed;

        switch (x.type) {
            case "a": laneStates[x.lane].alpha = Math.max(0, getYposFromPathArr(x.path, (1 - time) * 100) / 100 * (x.max - x.min) + x.min); break;
            case "d": laneStates[x.lane].direction = (getYposFromPathArr(x.path, (1 - time) * 100) / 100 * (x.max - x.min) + x.min) * Math.PI * 2; break;
            case "x": laneStates[x.lane].xpos = getYposFromPathArr(x.path, (1 - time) * 100) / 100 * (x.max - x.min) + x.min; break;
            case "y": laneStates[x.lane].ypos = getYposFromPathArr(x.path, (1 - time) * 100) / 100 * (x.max - x.min) + x.min; break;
        }
    });
}

let drawNotes =()=> {
    ctx.textAlign = "center";
    ctx.globalAlpha = 1;
    longlotesEffect = ++longlotesEffect % 12;

    notes.some(x => {

        if (x.endTime - x.speed > nowTime) return true;

        if (!laneStates[x.lane]) return false;

        let time = (x.endTime - nowTime) / x.speed;
    
        let ypos = time > 0 ? (x.reversed == -1 ? 1600 + getYposFromPathArr(x.path, (1 - time) * 100) * -16 : -1600 + getYposFromPathArr(x.path, (1 - time) * 100) * 16) : (x.id ? 0 : (nowTime - x.endTime) / 1000 * 200 * x.reversed);

        ctx.save();
        ctx.lineWidth = 3;
        ctx.globalAlpha = (x.type == "3" || x.type == "4") ? 1 : x.id || time > 0 ? Math.max(Math.min((1600 - Math.abs(Math.sin(laneStates[x.lane].direction) * -ypos + laneStates[x.lane].xpos)) / 100, 1) * Math.min((900 - Math.abs(Math.cos(laneStates[x.lane].direction) * ypos + laneStates[x.lane].ypos)) / 100, 1), 0) : 1 - Math.min((nowTime - x.endTime) / 1000, 1);
        ctx.globalAlpha *= laneStates[x.lane].alpha;
        if (x.effected) ctx.globalAlpha *= (x.judge == "lost" || x.judge == "far") ? 0.5 : 1;

        ctx.translate(laneStates[x.lane].xpos, laneStates[x.lane].ypos);
        ctx.rotate(laneStates[x.lane].direction);
        ctx.translate(0, ypos);

        switch (x.type) {
            case "1": {
                ctx.strokeStyle = colorList.tapNote;
                ctx.fillStyle = colorList.tapNoteFill;
                ctx.fill(pathPreset.diamond);
                ctx.stroke(pathPreset.diamond);
                ctx.stroke(pathPreset[laneKeys[laneStates[x.lane].keyNum]]);
            } break;
            case "2": {
                ctx.strokeStyle = colorList.slideNote;
                ctx.fillStyle = colorList.slideNoteFill;
                ctx.fill(pathPreset.diamond);
                ctx.stroke(pathPreset.diamond);
                ctx.stroke(pathPreset[laneKeys[laneStates[x.lane].keyNum]]);
            } break;
            case "3": {
                ctx.strokeStyle = colorList.tapNote;
                ctx.fillStyle = colorList.tapNoteFill;
            } break;
            case "4": {
                ctx.strokeStyle = colorList.slideNote;
                ctx.fillStyle = colorList.slideNoteFill;
            } break;
        }
        
        if (time < 1 && time > 0 && !x.effected && ((x.type == "1" || x.type == "2") || (drewId[x.id].judge == "good" || drewId[x.id].judge == "perfect"))) {
            if (x.type == "3" || x.type == "4") ctx.translate(0, -ypos);
            let size = (1 - time) ** 3;
            ctx.lineWidth = size * 5;
            ctx.scale(-size + 2, -size + 2);
            ctx.stroke(pathPreset.diamond);
            if (x.isMultiNote) {
                ctx.scale(1.2, 1.2);
                ctx.stroke(pathPreset.diamond);
            }
        }

        if (x.id && !drewId[x.id]) drewId[x.id] = {
            start: -diagLeng * x.reversed,
            end: -diagLeng * x.reversed,
            lane: x.lane,
            color: ctx.fillStyle,
            endTime: Infinity,
            judge: false
        }

        if (x.id && (x.type == "1" || x.type == "2")) {
            drewId[x.id].start = time > 0 ? ypos : 0;
            if (x.effected) drewId[x.id].judge = x.judge;
            if (longlotesEffect == 0 && (x.judge == "good" || x.judge == "perfect") && x.effected) effects.push(new effect(x.lane, x.judge, false));
        } else if (x.type == "3" || x.type == "4") {
            drewId[x.id].end = ypos;
            drewId[x.id].endTime = x.endTime;
            if (time <= 0) delete drewId[x.id];
        }

        ctx.restore();
        
        return false;

    });

    Object.keys(drewId).forEach(x=>{
        ctx.save();

        ctx.fillStyle = drewId[x].color;
        ctx.globalAlpha = ((drewId[x].judge == "lost" || drewId[x].judge == "far") ? 0.5 : 1) * laneStates[drewId[x].lane].alpha;

        ctx.translate(laneStates[drewId[x].lane].xpos, laneStates[drewId[x].lane].ypos);
        ctx.rotate(laneStates[drewId[x].lane].direction);

        ctx.beginPath();
        if (drewId[x].start < drewId[x].end) {
            ctx.moveTo(-75, drewId[x].start + 25);
            ctx.lineTo(0, drewId[x].start + 100);
            ctx.lineTo(75, drewId[x].start + 25);
            ctx.lineTo(75, drewId[x].end + 25);
            ctx.lineTo(0, drewId[x].end + 100);
            ctx.lineTo(-75, drewId[x].end + 25);
        } else {
            ctx.moveTo(-75, drewId[x].start - 25);
            ctx.lineTo(0, drewId[x].start - 100);
            ctx.lineTo(75, drewId[x].start - 25);
            ctx.lineTo(75, drewId[x].end - 25);
            ctx.lineTo(0, drewId[x].end - 100);
            ctx.lineTo(-75, drewId[x].end - 25);
        }
        ctx.closePath();

        ctx.fill();
        ctx.restore();
    });
}

let judgeNotes =()=> {
    let nearestTapnote = new Array(10).fill({endTime: Infinity});
    let judgeQueue = [];

    notes.some(x => {

        if (x.endTime - judgeRate.lost > nowTime) return true;
        if (!laneStates[x.lane]) return false;
        
        if ((x.type == "1" || x.type == "2") && !x.judge && x.endTime - nowTime < -judgeRate.far) {
            x.judge = "lost";
            judgeQueue.push(x.judge);
            x.effected = true;
            return false;
        }
        
        switch (x.type) {
            case "1": {
                if (!x.effected && Math.abs(nearestTapnote[laneStates[x.lane].keyNum].endTime - nowTime) > Math.abs(x.endTime - nowTime)) nearestTapnote[laneStates[x.lane].keyNum] = x;
            } break;
            case "2": {
                if (!x.effected && pressed[laneStates[x.lane].keyNum]) {
                    if (Math.abs(x.endTime - nowTime) < judgeRate.perfect) x.judge = "perfect";
                    else if (Math.abs(x.endTime - nowTime) < judgeRate.good) x.judge = "good";
                    else if (Math.abs(x.endTime - nowTime) < judgeRate.far) x.judge = "far";
                }
            } break;
        }

        if (x.type == "2" && !x.effected && x.judge && ((x.judge == "perfect" && x.endTime <= nowTime) || (x.judge == "good" && x.endTime + judgeRate.perfect <= nowTime) || (x.judge == "far" && x.endTime + judgeRate.good <= nowTime))) {
            effects.push(new effect(x.lane, x.judge, x.judge == "good" || x.judge == "perfect"));
            if (!x.id) judgeQueue.push(x.judge);
            x.effected = true;
        }

        if ((x.type == "1" || x.type == "2") && drewId[x.id] && x.judge != "lost" && x.effected) {
            if (drewId[x.id].endTime - nowTime > judgeRate.longNoteTerm) {
                if (!pressed[laneStates[x.lane].keyNum]) {
                    x.judge = "lost";
                    judgeQueue.push(x.judge);
                    x.effected = true;
                }
            } else if (drewId[x.id].endTime < nowTime) {
                judgeQueue.push(x.judge);
                x.effected = true;
            }
        }
        
        return false;
    });

    nearestTapnote.forEach(x => {
        if (x.endTime == Infinity) return;

        if (newPressed[laneStates[x.lane].keyNum] && Math.abs(pressedTime[laneStates[x.lane].keyNum] - x.endTime) < judgeRate.far) {
            if (Math.abs(pressedTime[laneStates[x.lane].keyNum] - x.endTime) < judgeRate.perfect) x.judge = "perfect";
            else if (Math.abs(pressedTime[laneStates[x.lane].keyNum] - x.endTime) < judgeRate.good) x.judge = "good";
            else x.judge = "far";
            
            if (!x.id) judgeQueue.push(x.judge);
            effects.push(new effect(x.lane, x.judge, x.judge == "good" || x.judge == "perfect"));
            x.effected = true;
        }
    });
    
    if (judgeQueue.length) {
        if (judgeQueue.some(x => x == "perfect" || x == "good")) {
            infoStyle.alpha = 0.3;
            infoStyle.ypos = -100;
        }
        judgeQueue.sort((a,b) => ["perfect", "good", "far", "lost"].indexOf(a) - ["perfect", "good", "far", "lost"].indexOf(b));

        judgeQueue.forEach(x=>{
            judgeStatus[x]++;

            if (x == "good" || x == "perfect") {
                judgeStatus.combo++;
                if (judgeStatus.maxCombo < judgeStatus.combo) judgeStatus.maxCombo = judgeStatus.combo;
            }
             else judgeStatus.combo = 0;
        });

        judgeQueue = [];
    }

    judgeStatus.score = (judgeStatus.perfect * 1 + judgeStatus.good * 0.75) / fullComboAmount * 900000 + judgeStatus.maxCombo / fullComboAmount * 100000 + judgeStatus.perfect_supereme;

    newPressed = new Array(10).fill(false);
}

let drawEffects =()=> {
    ctx.globalCompositeOperation = "lighter";

    effects.forEach(x=>{
        let size = ((new Date().getTime() - x.time) / 750 - 1) ** 3 + 1;

        if (size >= 1 || !laneStates[x.lane]) return;
        
        switch (x.judge) {
            case "far": {
                ctx.strokeStyle = colorList.far;
                ctx.fillStyle = colorList.far;
            } break;
            case "good": {
                ctx.strokeStyle = colorList.good;
                ctx.fillStyle = colorList.good;
            } break;
            case "perfect": {
                ctx.strokeStyle = colorList.perfect;
                ctx.fillStyle = colorList.perfect;
            } break;
        }

        ctx.save();
        ctx.translate(laneStates[x.lane].xpos, laneStates[x.lane].ypos);
        ctx.rotate(laneStates[x.lane].direction);

        switch (x.judge) {
            case "far": {
                ctx.lineWidth = Math.max((1 - size) * 10, 0);
                ctx.scale(size * 0.5 + 1, size * 0.5 + 1);
                ctx.stroke(pathPreset.diamond);
                ctx.globalAlpha = (1 - size) * 0.5
                ctx.fill(pathPreset.diamond);
            } break;
            case "good": {
                ctx.lineWidth = Math.max((1 - size) * 10, 0);
                ctx.scale(size * 1.5 + 1, size * 1.5 + 1);
                ctx.stroke(pathPreset.diamond);
            } break;
            case "perfect": {
                ctx.lineWidth = Math.max((1 - size) * 10, 0);
                ctx.scale(size * 2.5 + 1, size * 2.5 + 1);
                ctx.stroke(pathPreset.diamond);
            } break;
        }

        ctx.restore();

        x.particle.forEach(i=>{
            ctx.save();
            ctx.translate(laneStates[x.lane].xpos, laneStates[x.lane].ypos);
            ctx.rotate(i.rad);
            ctx.translate(0, 100);
            ctx.scale(i.size, i.size);
            ctx.translate(0, size * 1000);
            ctx.scale(1 - size, 1 - size);
            ctx.fill(pathPreset.diamond);
            ctx.restore();
        })

        if (x.sound) {
            noteSlot = ++noteSlot % 16;
            snd[`note_slot${noteSlot}`].currentTime = 0.025;
            snd[`note_slot${noteSlot}`].play();
            x.sound = false;
        }
    });

    effects = effects.filter(x => new Date().getTime() - x.time < 1000);

    ctx.globalCompositeOperation = "source-over";
}

let drawInfos =()=> {
    ctx.globalCompositeOperation = "lighter";

    let time = Math.min(nowTime / 1000, (snd[bgm] || []).duration);

    infoStyle.ypos += -infoStyle.ypos / 10;
    infoStyle.alpha += (0.1 - infoStyle.alpha) / 30;

    ctx.save();
    
    if (title) {
        ctx.translate(0, infoStyle.ypos / 3 + Math.sin(time / 5 * Math.PI * 2) * 30);
        ctx.globalAlpha = infoStyle.alpha;
        ctx.fillStyle = colorList.white;
        ctx.textAlign = "left";
        ctx.font = "200 150px Oswald";
        ctx.fillText(title, -1450, 0);
        ctx.font = "300 100px Oswald";
        ctx.fillText(author, -1450, 100);
        ctx.fillRect(-1500, -125, 25, 250 * snd[bgm].currentTime / snd[bgm].duration);
        ctx.globalAlpha *= 0.4;
        ctx.fillRect(-1500, -125 + 250 * snd[bgm].currentTime / snd[bgm].duration, 25, 225 * (1 - snd[bgm].currentTime / snd[bgm].duration));
        
        ctx.globalAlpha = infoStyle.alpha;
        ctx.fillStyle = colorList.white;
        ctx.textAlign = "right";
        ctx.font = "300 150px Oswald";
        ctx.fillText(("0000000" + Math.floor(judgeStatus.score)).substr(-7), 1450, 60);
        ctx.fillStyle = colorList.good;
        ctx.globalAlpha = judgeStatus.far || judgeStatus.lost ? 0.05 : 0.25 + Math.sin(time / 2 * Math.PI * 2) * 0.05;
        ctx.fillRect(1500, -60, -25, 60);
        ctx.fillStyle = colorList.perfect;
        ctx.globalAlpha = judgeStatus.good || judgeStatus.far || judgeStatus.lost ? 0.05 : 0.25 + Math.sin(time / 2 * Math.PI * 2) * 0.05;
        ctx.fillRect(1500, 0, -25, 60);
    }

    ctx.restore();
    ctx.save();
    ctx.translate(0, infoStyle.ypos + Math.sin(time / 5 * Math.PI * 2) * 30);
    ctx.globalAlpha = infoStyle.alpha;
    
    if (judgeStatus.combo > 2) {
        ctx.fillStyle = colorList.white;
        ctx.textAlign = "center";
        ctx.font = "200 200px Oswald";
        ctx.fillText("COMBO", 0, -400);
        ctx.font = "200 900px Oswald";
        ctx.fillText(judgeStatus.combo, 0, 400);
    }

    ctx.restore();

    ctx.globalCompositeOperation = "source-over";
}

let deleteNotes =()=> {
    laneMoves = laneMoves.filter(x => x.endTime - nowTime > 0);
    notes = notes.filter(x => (!(x.effected && x.judge != "lost") && x.endTime - nowTime > (x.id ? 0 : -1000)) || drewId[x.id]);
    metaData = metaData.filter(x => !x.isExpired(nowTime));
}

let getKeyInput =()=> {
    laneKeys.forEach((x, y)=>{
        if (keydown[x] && !pressed[y]) {
            pressed[y] = true;
            pressedTime[y] = new Date().getTime() - startedTime;
            newPressed[y] = true;
        } else if (!keydown[x]) pressed[y] = false;
    })
}

let generateScore =(scoreName)=> {
    drewId = {};
    pressedTime = new Array(10).fill(-Infinity);
    laneStates = {};
    for (let i = 0; i < 10; i++) laneStates[i] = new lane(-1125 + 250 * i, 700, 0, 1, i);
    title = score[scoreName].match(/title:(.*?)\n/)[1];
    author = score[scoreName].match(/author:(.*?)\n/)[1];
    bgm = "bgm/" + score[scoreName].match(/bgm:(.*?)\n/)[1];
    bgmvol = (score[scoreName].match(/bgmvol:(.*?)\n/) || [0,1])[1] * 1;
    bpm = score[scoreName].match(/bpm:(.*?)\n/)[1] * 1;
    offset = (score[scoreName].match(/offset:(.*?)\n/) || [0,0])[1] * 1;
    pathes = {};
    score[scoreName].match(/path:((.|\n)*)score:/)[1].split("\n").filter(x=>x).forEach(x=>pathes[x.substr(0, x.indexOf(" "))] = getPosByPath(x.substr(x.indexOf(" ") + 1)));
    notes = [];
    laneMoves = [];
    metaData = [];

    let notesTime = [];
    fullComboAmount = 0;
    score[scoreName].match(/score:((.|\n)*)/)[1].split("\n").filter(x=>x).forEach(x=>{

        let arr = x.split(/ +/), reversed = 0, isMultiNote;

        if (["1", "2", "3", "4", "a", "d", "x", "y"].indexOf(arr[0]) > -1) {

            arr[2] = arr[2].split(",");
            
            if (arr[2][0].charAt(0) == "-") {
                reversed = true;
                arr[2][0] = arr[2][0].substr(1);
            }

            arr[3] *= 60 / bpm * 1000;
            arr[4] *= 60 / bpm * 1000;
            
        } else {
            arr[2] *= 60 / bpm * 1000;
        }

        if (arr[0] == "1" || arr[0] == "2") {

            isMultiNote = arr[1].length != 1;

            fullComboAmount += arr[1].length;
            let index = notesTime.findIndex(x => x[0] <= arr[3]);

            if ((notesTime[index] || [])[0] == arr[3]) {

                isMultiNote = true;
                notes[notesTime[index][1]].isMultiNote = true;
                
            } else notesTime.splice(index, 0, [arr[3], notes.length]);
        }

        switch (arr[0]) {
            case "1": case "2": case "3": case "4": {
                arr[1].split("").forEach(x => notes.push(new note(arr[0], x, arr[2], arr[3], arr[4], arr[5] ? arr[5] + x : 0, reversed, isMultiNote)));
            } break;
            case "a": case "d": case "x": case "y": {
                arr[1].split("").forEach(x => laneMoves.push(new laneMove(arr[0], x, arr[2], arr[3], arr[4], arr[5] * 1, arr[6] * 1)));
            } break;
            case "#defineLane": {
                arr[1].split("").forEach(x => metaData.push(new defineLane(x, arr[2], arr[3], arr[4], arr[5], arr[6], arr[7])));
            } break;
            case "#deleteLane": {
                arr[1].split("").forEach(x => metaData.push(new deleteLane(x, arr[2])));
            } break;
        }
    });
    notes.sort((a, b) => (a.endTime - a.speed) - (b.endTime - b.speed));
    laneMoves.sort((a, b) => (a.endTime - a.speed) - (b.endTime - b.speed));
    metaData.sort((a, b) => a.time - b.time);

    showScore = 0;
    effects = [];
    longlotesEffect = 0;
    infoStyle = {
        ypos: 0, 
        alpha: 0
    };
    judgeStatus = {
        score:0,
        maxCombo: 0,
        combo: 0,
        perfect_supereme: 0,
        perfect: 0,
        good: 0,
        far: 0,
        lost: 0
    };
}