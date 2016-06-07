"use strict";
const timer = require('../index');
const Ticker = timer.Ticker;
const Countdown = timer.Countdown;

const ticker = new Ticker(10);

const countdown1 = new Countdown({
    time: 5000,
    format: 'S',
    isLoop: true,
    ticker: ticker,
    isIncrement: true
});

// const countdown2 = new Countdown({
//     time: 10000,
//     format: 'mm:ss',
//     ticker: ticker
// });

countdown1
    .on('start',() => console.log('start'))
    .on('update', () => console.log(countdown1.toString()))
    .on('stop', () => console.log('stop'))
    .on('end', () => console.log('end'))
    .when(3000, () => console.log('when => 3000'))
    .every(2000, 1000, 100, () => console.log('every 100', countdown1.currentTime))
    .start();

// countdown2
//     .on('start',() => console.log('start'))
//     .on('update', () => console.log(countdown2.toString()))
//     .on('stop', () => console.log('stop'))
//     .on('end', () => console.log('end'))
//     .start();