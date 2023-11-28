import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const datePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
const timerFields = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

let timerInterval = null;

startButton.disabled = true;

startButton.addEventListener('click', () => {
    timerInterval  = setInterval(() => {
        const selectedDate = new Date(datePicker.value).getTime();
        const timeDiff = selectedDate - Date.now()
        if (timeDiff  <= 0) {
            clearInterval(timerInterval);
            Notiflix.Notify.success('Time is up!');
            startButton.disabled = false;
        } else {
            const { days, hours, minutes, seconds } = convertMs(timeDiff);
            timerFields.days.textContent = addLeadingZero(days);
            timerFields.hours.textContent = addLeadingZero(hours);
            timerFields.minutes.textContent = addLeadingZero(minutes);
            timerFields.seconds.textContent = addLeadingZero(seconds);
        };
    }, 1000);
    startButton.disabled = true;
});

function addLeadingZero(value) {
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

flatpickr(datePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        if (selectedDate < Date.now()) {
            Notiflix.Notify.warning('Please choose a date in the future')
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    },
});