"use strict";

const Ticker = require('../index').Ticker;

let ticker = new Ticker(2);
let obj = {
    tick: deltaTime => console.log('ticker 1', deltaTime, new Date)
};
// ticker.add(obj);
// setTimeout(() => {
//     ticker.remove(obj);
//     ticker.add({
//         tick: deltaTime => console.log('ticker 2', deltaTime, new Date)
//     });
// }, 5000);
ticker.start();

ticker.timeout(1000, () => console.log('timout 1000:' + Date.now()));

Ticker.timeout(2000, () => console.log('timout 2000:' + Date.now()));