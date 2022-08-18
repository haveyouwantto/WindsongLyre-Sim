let global = document.querySelector('body');

function choice(id = "windsong_lyre") {
    loadAudio(id);
    global.style.setProperty('--note-color', insts[id].color);
    global.style.setProperty('--background-color-hover1', insts[id].bg1);
    global.style.setProperty('--background-color-hover2', insts[id].bg2);
    global.style.setProperty('--animation-color', insts[id].bg2);
    document.getElementById("instruments").innerText = insts[id].name;
}