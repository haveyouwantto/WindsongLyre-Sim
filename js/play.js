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

var audioMap = new Map();
let fallback = false;


window.AudioContext = window.AudioContext || window.webkitAudioContext;
let aCtx = new AudioContext();
let compressor = new DynamicsCompressorNode(aCtx);
let volume = aCtx.createGain();
volume.gain.value = 0.5;
let masterVolume = aCtx.createGain();
masterVolume.gain.value = 1;
volume.connect(compressor);
compressor.connect(masterVolume);
masterVolume.connect(aCtx.destination);

function playSound(buffer) {
    if (fallback) {
        buffer.volume = 0.5;
        buffer.currentTime = 0;
        buffer.play();
    } else {
        let source = aCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(volume);
        source.start();
    }
}

function loadAudio(id = "windsong_lyre") {
    let loaded = 0;
    onLoad(id);
    for (let key in keyMap) {
        let url = `instruments/${id}/audio/${keyMap[key]}.mp3`;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            aCtx.decodeAudioData(this.response, buffer => audioMap.set(key, buffer));
            loaded++;
            onLoadProgress(id, loaded);
            if (loaded == 21) {
                onLoadComplete(id);
            }
        };
        xhr.onerror = function () {
            fallback = true;
            console.warn('XHR failed. Using fallback implementation.')
            let audio = new Audio(url);
            loaded++;
            onLoadProgress(id, loaded);
            audioMap.set(key, audio);
        };
        xhr.send();
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
    let note = keyMap[key];
    if (note != null) {
        notes[note] = true;
        document.getElementById(key).parentNode.classList.add('key-press');
        let spread = document.getElementById(key).parentNode.childNodes[1];
        if (spread.getAttribute('id') == 'spread1') {
            spread.setAttribute('id', 'spread2')
        } else {
            spread.setAttribute('id', 'spread1')
        };
        playSound(audioMap.get(key));
        if (autoRelease) setTimeout(release, 100, key);
    }
}

function release(key) {
    let note = keyMap[key];
    if (note != null) {
        notes[note] = false;
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


// TODO 添加加载提示

function onLoad(instId) {
    console.log("正在加载音色...");
}

function onLoadProgress(instId, progress) {
    console.log(`正在加载音色...  ${progress} / 21`);
}

function onLoadComplete(instId) {
    console.log("加载完成");
}