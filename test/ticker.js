"use strict";

const Ticker = require('../index').Ticker;

let ticker = new Ticker(2);
let obj = {
    tick: deltaTime => console.log('ticker 1', deltaTime, new Date)
};
ticker.add(obj);
setTimeout(() => {
    ticker.remove(obj);
    ticker.add({
        tick: deltaTime => console.log('ticker 2', deltaTime, new Date)
    });
}, 5000);
ticker.start();