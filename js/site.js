const element = document.querySelector('form');
let timeField = document.getElementById('time');
let message = document.getElementById('message');
let startButton = document.getElementById('start');
window.onbeforeunload = function() {
    return true;
}
element.addEventListener('submit', event => {
    event.preventDefault();
    message.innerText = ""
    startButton.value = 'В процессе';

    let time = new Date('1970-01-01T' + timeField.value);
    let minutes = inMinutes(time);
    let progress = document.getElementById('meeting-progress');
    progress.max = minutes;
    progress.optimum = minutes;
    progress.value = minutes;
    let timer5;

    let timer1 = setInterval(function () {
        subtractMinutes(1, time);

        minutes = inMinutes(time);
        progress.value = minutes;
        decreaseTimeFieldVal(time);
        if (check15(minutes)) {
            say(time);
        }
        if (minutes === 15) {
            timer5 = setInterval(function () {
                say(time);
            }, 5 * 60 * 1000)
        }
        if (minutes === 0) {
            clearInterval(timer1);
            clearInterval(timer5);
            message.innerText = "Собрание окончено"
        }
    }, 60 * 1000);
});
function say(time) {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    var i = -1;
    let sounds = [];
    const playSnd = () => {
        i++;
        if (i === sounds.length) return;
        sounds[i].addEventListener('ended', playSnd);
        sounds[i].play();
    }

    let hoursFile = 'sounds/'+ hours +'.m4a';
    let minutesFile = 'sounds/'+ minutes +'.m4a';
    sounds.push(new Audio('sounds/pre.m4a'));
    if (hours !== 0 && !fileExists(hoursFile)) {
        playSnd();
        return;
    }
    if (minutes !== 0 && !fileExists(minutesFile)) {
        playSnd();
        return;
    }
    if (hours === 0 && minutes === 0) {
        sounds.push(new Audio('sounds/end.m4a'));
        playSnd();
        return;
    }

    sounds.push(new Audio('sounds/до-конца.m4a'));
    if (hours > 0) {
        sounds.push(new Audio(hoursFile));
        if (hours === 2 || hours === 3) {
            sounds.push(new Audio('sounds/часа.m4a'));
        } else {
            sounds.push(new Audio('sounds/час.m4a'));
        }
    }
    if (minutes > 0) {
        sounds.push(new Audio(minutesFile));
        sounds.push(new Audio('sounds/минут.m4a'));
    }
    playSnd();
}

function decreaseTimeFieldVal(time) {
    let hours = String(time.getHours()).padStart(2, "0");
    let minutes = String(time.getMinutes()).padStart(2, "0");
    timeField.value = hours + ":" + minutes;
}

function check15(minutes) {
    return minutes % 15 === 0;
}

function inMinutes(time) {
    let minutes = time.getHours() * 60;
    minutes += time.getMinutes();
    return minutes;
}

function subtractMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() - numOfMinutes);
}

function fileExists(url)
{
    let http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status !== 404;
}