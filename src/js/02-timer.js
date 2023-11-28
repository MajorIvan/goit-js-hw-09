import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const timer = document.querySelector('.timer');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

let targetDate = null;
let timerId = null;

startBtn.addEventListener('click', () => {
    timerId = setInterval(() => {
        const result = targetDate - Date.now();
        const { days, hours, minutes, seconds } = convertMs(result);
        const formattedDays = addLeadingZero(days);
        const formattedHours = addLeadingZero(hours);
        const formattedMinutes = addLeadingZero(minutes);
        const formattedSeconds = addLeadingZero(seconds);
        timer.days.textContent = formattedDays;
        timer.hours.textContent = formattedHours;
        timer.minutes.textContent = formattedMinutes;
        timer.seconds.textContent = formattedSeconds;
        if (result <= 0) {
            clearInterval(timerId);
            Notiflix.Notify.success('Time is up!');
            timer.days.textContent = '00';
            timer.hours.textContent = '00';
            timer.minutes.textContent = '00';
            timer.seconds.textContent = '00';
            startBtn.disabled = false;
        };
    }, 1000);
    startBtn.disabled = true;
});

const addLeadingZero = value => {
    return value < 10 ? `0${value}` : value;
};

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const data = selectedDates[0];
        if (data > Date.now()) {
            targetDate = data;
            startBtn.disabled = false;
        } else {
            Notiflix.Notify.failure('Please choose a date in the future')
        }
    },
};

flatpickr(input, options);