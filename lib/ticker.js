"use strict";

class Ticker {
    constructor(fps) {
        this.fps = fps || 24;
        this._tickers = [];
    }
    start() {
        this._timer = setTimeout(() => {
            this.tick();
            this.start();
        }, 1000 / this.fps);
    }
    stop() {
        clearTimeout(this._timer);
    }
    tick() {
        let curTime = new Date;
        let deltaTime = this._lastTickTime ? curTime - this._lastTickTime : 0;
        this._lastTickTime = curTime;

        this._tickers.forEach(obj => obj.tick(deltaTime));
    }
    add(obj) {
        this._tickers.push(obj);
    }
    remove(obj) {
        this._tickers = this._tickers.filter(o => o !== obj);
    }
}

module.exports = Ticker;