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


window.AudioContext = window.AudioContext || window.webkitAudioContext;
let aCtx = new AudioContext();
function playSound(buffer) {
    var source = aCtx.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(aCtx.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
  }

function loadingAudio() {
    for (let e in keyMap) {
        let newAudio = new Audio('audio/' + keyMap[e] + '.mp3');
        newAudio.setAttribute('id', 'audio');
        musicNum.set(e, keyMap[e]);
        musicKey.set(keyMap[e], newAudio);
    }
}

let notes = {};
let lastTime = Date.now();

let stopped = false;
let bpm = 60;
let delay = [4000, 2000, 1000, 500, 250, 125, 62.5, 31.25];// 60BPM
let newDelay = [];// ???BPM

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
        
        //playSound(audioMap.get(file));
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

function playSheet(string, i = 0) {
    let delayTime = newDelay[3];
    let group = [];
    if (i >= string.length || stopped) {
        stopped = false;
        for (delayNum in delay) newDelay[delayNum] = delay[delayNum];
        return;
    } else if (string[i] == '(') {
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
        }
        setTimeout(playSheet, delayTime, string, i);
    }
}

function getStringLetter(string, i) {
    let stringLetter;
    switch (string[i]) {
        case "E": stringLetter = string[i].toLowerCase();
            break;
        case "U": stringLetter = string[i].toLowerCase();
            break;
        case "D": stringLetter = string[i].toLowerCase();
            break;
        case "J": stringLetter = string[i].toLowerCase();
            break;
        case "C": stringLetter = string[i].toLowerCase();
            break;
        case "M": stringLetter = string[i].toLowerCase();
            break;
        default:
            stringLetter = string[i];
    }
    return stringLetter;
}

function getNewDelayTime(string, i) {
    let newDelayTime = newDelay[string[++i]];
    if (string[++i] == "+") {
        do {
            newDelayTime += newDelay[string[++i]];
        } while (string[++i] == "+");
    }
    return [newDelayTime, i];
}

function startMusic() {
    stopped = false;
    bpm = document.getElementById("bpm").value;
    if (bpm != "") {
        if (input != "") {
            updateBpm(bpm);
            let input = document.getElementById("textareaInput").value;
            showTextarea();
            playSheet(input.replaceAll('\n', ''));
        }
    }
}

function updateBpm(bpm) {
    let multiplier = 60 / bpm;
    for (delayNum in delay) {
        newDelay[delayNum] = delay[delayNum] * multiplier;
    }
}

function pauseMusic() {
    stopped = true;
}

function clearMusic() {
    stopped = true;
    document.getElementById("textareaInput").value = "";
}
