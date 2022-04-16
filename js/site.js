const element = document.querySelector('form');
let timeField = document.getElementById('time');
let message = document.getElementById('message');
element.addEventListener('submit', event => {
    event.preventDefault();

    let time = new Date('1970-01-01T' + timeField.value);
    let minutes = inMinutes(time);
    let progress = document.getElementById('meeting-progress');
    progress.max = minutes;
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
                console.log('Прошло 5 минут');
                say(time);
            }, 5 * 1000)
        }
        if (minutes === 0) {
            clearInterval(timer1);
            clearInterval(timer5);
            message.innerText = "Конец собрания"
        }
    }, 1000);
});
function say(time) {
    let audio = new Audio('sounds/1.m4a');
    audio.play();
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
