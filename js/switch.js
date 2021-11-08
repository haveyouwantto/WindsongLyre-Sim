let musicalInstrument = document.getElementsByClassName('musicalInstrument');

function choice(musicName) {
    let musicClef = document.getElementsByClassName('musicClef');
    let note1 = document.getElementsByClassName('note1');
    let note2 = document.getElementsByClassName('note2');
    let note3 = document.getElementsByClassName('note3');
    let note4 = document.getElementsByClassName('note4');
    let note5 = document.getElementsByClassName('note5');
    let note6 = document.getElementsByClassName('note6');
    let note7 = document.getElementsByClassName('note7');
    let note8 = document.getElementsByClassName('note8');
    let note9 = document.getElementsByClassName('note9');
    switch (musicName) {
        case 'windsongLyre':
            for (let i = 0; i < musicClef.length; i++) musicClef[i].setAttribute('class', 'musicClef musicColor');
            for (let i = 0; i < note1.length; i++) note1[i].setAttribute('class', 'note1 musicColor');
            for (let i = 0; i < note2.length; i++) note2[i].setAttribute('class', 'note2 musicColor');
            for (let i = 0; i < note3.length; i++) note3[i].setAttribute('class', 'note3 musicColor');
            for (let i = 0; i < note4.length; i++) note4[i].setAttribute('class', 'note4 musicColor');
            for (let i = 0; i < note5.length; i++) note5[i].setAttribute('class', 'note5 musicColor');
            for (let i = 0; i < note6.length; i++) note6[i].setAttribute('class', 'note6 musicColor');
            for (let i = 0; i < note7.length; i++) note7[i].setAttribute('class', 'note7 musicColor');
            for (let i = 0; i < note8.length; i++) note8[i].setAttribute('class', 'note8 musicColor');
            for (let i = 0; i < note9.length; i++) note9[i].setAttribute('class', 'note9 musicColor');
            break;
        case 'otherLyre':
            for (let i = 0; i < musicClef.length; i++) musicClef[i].setAttribute('class', 'musicClef musicColor_2');
            for (let i = 0; i < note1.length; i++) note1[i].setAttribute('class', 'note1 musicColor_2');
            for (let i = 0; i < note2.length; i++) note2[i].setAttribute('class', 'note2 musicColor_2');
            for (let i = 0; i < note3.length; i++) note3[i].setAttribute('class', 'note3 musicColor_2');
            for (let i = 0; i < note4.length; i++) note4[i].setAttribute('class', 'note4 musicColor_2');
            for (let i = 0; i < note5.length; i++) note5[i].setAttribute('class', 'note5 musicColor_2');
            for (let i = 0; i < note6.length; i++) note6[i].setAttribute('class', 'note6 musicColor_2');
            for (let i = 0; i < note7.length; i++) note7[i].setAttribute('class', 'note7 musicColor_2');
            for (let i = 0; i < note8.length; i++) note8[i].setAttribute('class', 'note8 musicColor_2');
            for (let i = 0; i < note9.length; i++) note9[i].setAttribute('class', 'note9 musicColor_2');
            break;
    }
    for (let i = 0; i < musicalInstrument.length; i++)
        musicalInstrument[i].classList.remove('checked');
    document.getElementById(musicName).classList.add('checked');
}