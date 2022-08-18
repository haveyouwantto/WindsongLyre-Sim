var show = true;
var isMobile = 'ontouchstart' in document.documentElement;
function showTextarea(id) {
    let inputDiv = document.getElementById(id);
    if (show == false) {
        inputDiv.classList.remove('input-active')
        inputDiv.classList.add('input-inactive')
        show = true;
    } else {
        inputDiv.classList.remove('input-inactive')
        inputDiv.classList.add('input-active')
        show = false;
    }
}

// // 检测回车事件
// function clickEnter(e) {
//     var theEvent = e || window.event;
//     var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
//     if (code == 13) {
//         // 阻止事件的默认行为
//         e.preventDefault();
//         startMusic();
//     }
// }

for (let node of document.querySelectorAll('.triangle')) {
    let key = node.querySelector('.key').id;
    if (isMobile) {
        node.addEventListener('touchstart', e => {
            if (show != -1) play(key, true);
        });
    } else {
        node.addEventListener('mousedown', e => {
            if (show != -1) play(key, true);
        });
    }
    removeID(node.parentNode.childNodes[1]);
}

let bpmField = document.getElementById("bpm");
bpmField.addEventListener('focusout', () => {
    updateBpm(bpmField.value);
});

document.getElementById('transpose-num').addEventListener('change', e => {
    transpose= parseInt(e.target.value);
});

function removeID(spread) {
    spread.addEventListener("animationend", function () {
        spread.removeAttribute('id');
    }, false);
}

function selectMode(node){
    mode = node.innerText;
    document.querySelector("#transpose > span:nth-child(4) > div > span").innerText = node.innerText;
    document.querySelector("#transpose > span:nth-child(4) > div > div").visibility = "hidden";
}