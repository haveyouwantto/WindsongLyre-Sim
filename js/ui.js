var show = true;
function showTextarea() {
    let inputDiv = document.getElementById("input");
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

for (let node of document.querySelectorAll('.key')) {
    node.addEventListener('mousedown', e => {
        if (show != -1) play(node.id, true);
    });
    removeID(node.parentNode.childNodes[1]);
    // node.addEventListener('touchstart', e => {
    //     if (show != -1) play(node.id, true);
    // });
}

let bpmField = document.getElementById("bpm");
bpmField.addEventListener('focusout', () => {
    updateBpm(bpmField.value);
});

function removeID(spread) {
    spread.addEventListener("animationend", function () {
        spread.removeAttribute('id');
    }, false);
}