let keyMap = {
    "q": "natural/1+@c-2",
    "w": "natural/2+@d-2",
    "e": "natural/3+@e-2",
    "r": "natural/4+@f-2",
    "t": "natural/5+@g-2",
    "y": "natural/6+@a-2",
    "u": "natural/7+@b-2",

    "a": "natural/1@c-1",
    "s": "natural/2@d-1",
    "d": "natural/3@e-1",
    "f": "natural/4@f-1",
    "g": "natural/5@g-1",
    "h": "natural/6@a-1",
    "j": "natural/7@b-1",

    "z": "natural/1-@c-",
    "x": "natural/2-@d-",
    "c": "natural/3-@e-",
    "v": "natural/4-@f-",
    "b": "natural/5-@g-",
    "n": "natural/6-@a-",
    "m": "natural/7-@b-",

    "Q": "sharp/1+@c-2",
    "W": "sharp/2+@d-2",
    "R": "sharp/4+@f-2",
    "T": "sharp/5+@g-2",
    "Y": "sharp/6+@a-2",

    "A": "sharp/1@c-1",
    "S": "sharp/2@d-1",
    "F": "sharp/4@f-1",
    "G": "sharp/5@g-1",
    "H": "sharp/6@a-1",

    "Z": "sharp/1-@c-",
    "X": "sharp/2-@d-",
    "V": "sharp/4-@f-",
    "B": "sharp/5-@g-",
    "N": "sharp/6-@a-",
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
        if (show != -1) play(node.id, true);
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
        document.getElementById(key.toLowerCase()).parentNode.classList.add('key-press');
        let spread = document.getElementById(key.toLowerCase()).parentNode.childNodes[1];
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
        document.getElementById(key.toLowerCase()).parentNode.classList.remove('key-press');
    }
}

let stopped = false;
let bpm = 60;
let delay = [4000, 2000, 1000, 500, 250, 125, 62.5, 31.25];// 60BPM
let newDelay = [];// ???BPM

function playSheet(string, i = 0) {
    let delayTime = 3;
    if (i >= string.length || stopped) {
        stopped = false;
        for (delayNum in delay) newDelay[delayNum] = delay[delayNum];
        return;
    }
    if (string[i] == '(') {
        i++;
        while (string[i] != ')') {
            play(getStringLetter(string, i));
            i++;
        }
        if (string[++i] == '|') {
            delayTime = string[++i];
        }
        setTimeout(playSheet, newDelay[delayTime], string, i);
    } else {
        play(getStringLetter(string, i));
        if (string[++i] == '|') {
            delayTime = string[++i];
            i++;
        }
        setTimeout(playSheet, newDelay[delayTime], string, i);
    }
}

function startMusic() {
    bpm = document.getElementById("bpm").value;
    if (bpm != "") {
        let multiplier = 60 / bpm;
        for (delayNum in delay) newDelay[delayNum] = delay[delayNum] * multiplier;
        let input = document.getElementById("textareaInput").value;
        if (input != "") {
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