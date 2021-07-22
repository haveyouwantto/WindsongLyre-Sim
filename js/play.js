let keyMap = {
    "a": "1",
    "s": "2",
    "d": "3",
    "f": "4",
    "g": "5",
    "h": "6",
    "j": "7",

    "q": "1+",
    "w": "2+",
    "e": "3+",
    "r": "4+",
    "t": "5+",
    "y": "6+",
    "u": "7+",

    "z": "1-",
    "x": "2-",
    "c": "3-",
    "v": "4-",
    "b": "5-",
    "n": "6-",
    "m": "7-",
};

var musicNum = new Map();
var musicKey = new Map();
var audioMap = new Map();

function loadingAudio() {
    for (let e in keyMap) {
        let newAudio = new Audio('audio/' + keyMap[e] + '.mp3');
        newAudio.setAttribute('id', 'audio');
        musicNum.set(e, keyMap[e]);
        musicKey.set(keyMap[e], newAudio);
    }
}

var show = 1;
function showTextarea() {
    let inputDiv = document.getElementById("input");
    if (show == -1) {
        inputDiv.style = "display:none";
        show = 1;
    } else {
        inputDiv.style = "display: inline-block";
        show = -1;
    }
}

// 检测回车事件
function clickEnter(e) {
    var theEvent = e || window.event;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
        // 阻止事件的默认行为
        e.preventDefault();
        startMusic();
    }
}

for (let node of document.querySelectorAll('.key')) {
    node.addEventListener('click', e => {
        if(show != -1)play(node.id, true);
    });
}

let notes = {};
let lastTime = Date.now();
document.onkeydown = e => {
    let note = keyMap[e.key];
    if (!notes[note] && show != -1) {
        play(e.key, false);
    }
}
document.onkeyup = e => {
    let note = keyMap[e.key];
    if (notes[note]) {
        release(e.key);
    }
}

function removeID(spread) {
    spread.addEventListener("animationend", function () {
        spread.removeAttribute('id');
    }, false);
}

function play(key, autoRelease = true) {
    let file = keyMap[key];
    if (file != null) {
        notes[file] = true;
        document.getElementById(key).parentNode.classList.add('key-press');
        let spread = document.getElementById(key).parentNode.childNodes[1];
        if (spread.getAttribute('id') == 'spread1') {
            spread.setAttribute('id', 'spread2')
        } else {
            spread.setAttribute('id', 'spread1')
        };
        audioMap.set(file, musicKey.get(file));
        audioMap.get(file).currentTime = 0;
        audioMap.get(file).play();
        removeID(spread);
        if (autoRelease) setTimeout(release, 100, key);
    }
}

function release(key) {
    let file = keyMap[key];
    if (file != null) {
        notes[file] = false;
        document.getElementById(key).parentNode.classList.remove('key-press');
    }
}

let stopped = false;
let bpm = 60;
let delay = [4000, 2000, 1000, 500, 250, 125, 62.5, 31.25];// 60BPM
let newDelay = [];// ???BPM

function playSheet(string, i = 0) {
    let delayTime = newDelay[3];
    let group = [];
    if (i >= string.length || stopped) {
        stopped = false;
        for (delayNum in delay) newDelay[delayNum] = delay[delayNum];
        return;
    }
    if (string[i] == '(') {
        i++;
        while (string[i] != ')') {
            play(string[i].toLowerCase());
            i++;
        }
        if (string[++i] == '|') {
            group = getNewDelayTime(string, i);
            delayTime = group[0];
            i = group[1];
        }
        setTimeout(playSheet, delayTime, string, i);
    } else {
        play(string[i].toLowerCase());
        if (string[++i] == '|') {
            group = getNewDelayTime(string, i);
            delayTime = group[0];
            i = group[1];
            i++;
        }
        console.log("\u5ef6\u8fdf: " + delayTime + "ms");
        setTimeout(playSheet, delayTime, string, i);
    }
}

function getNewDelayTime(string, i) {
    let newDelayTime = newDelay[string[++i]];
    if (string[++i] == "+") {
        do {
            newDelayTime += newDelay[string[++i]];
        } while (string[++i] == "+");
    }
    i--;
    return [newDelayTime, i];
}

function startMusic() {
    bpm = document.getElementById("bpm").value;
    if (bpm != "") {
        let multiplier = 60 / bpm;
        for (delayNum in delay) newDelay[delayNum] = delay[delayNum] * multiplier;
        let input = document.getElementById("textareaInput").value;
        if(input != "") {
            showTextarea();
            playSheet(input);
        }
    }
}

function pauseMusic() {
    stopped = true;
}

function clearMusic() {
    document.getElementById("bpm").value = "";
    document.getElementById("textareaInput").value = "";
}