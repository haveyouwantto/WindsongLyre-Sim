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

for (let node of document.querySelectorAll('.key')) {
    node.addEventListener('click', e => {
        play(node.id, true);
    });
}

let notes = {};
let lastTime = Date.now();
document.onkeydown = e => {
    let note = keyMap[e.key];
    if (!notes[note]) {
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
let delay = 480;

function playSheet(string, i = 0) {
    if (i >= string.length || stopped) {
        stopped = false;
        return;
    }
    if (string[i] == '(') {
        i++;
        while (string[i] != ')') {
            play(string[i].toLowerCase())
            i++;
        }
        setTimeout(playSheet, delay, string, ++i);
    } else {
        play(string[i].toLowerCase())
        i++;
        setTimeout(playSheet, delay, string, i);
    }
}