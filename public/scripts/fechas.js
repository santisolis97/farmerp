"use strict"

function DateFromDate(date = null) {
    if (!date) date = new Date();
    const seconds = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateToString = () => {
        return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
    }
    const timeToString = () => {
        return hours + ':' + minutes + ':' + seconds;
    }

    return {
        toString: () => {
            return dateToString();
        },
        fullToString: () => {
            dateToString() + " " + timeToString()
        },
        dateToString,
        timeToString,
        seconds,
        minutes,
        hours,
        day,
        month,
        year,
        date
    }
}

function DateFromString(stringDate = null) {
    return DateFromDate(stringDate ? new Date(stringDate) : null);
}

function DateAddDays(date, days) {
    var newDate = new Date(date.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}