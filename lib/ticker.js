"use strict";

class Ticker {
    constructor(fps) {
        this.fps = fps || 24;
        this._tickers = [];
        this._lastTickTime = new Date;
    }
    start(force) {
        if (this._isStart && !force) {
            return;
        }
        this._isStart = true;

        this._timer = setTimeout(() => {
            this.tick();
            this.start(true);
        }, 1000 / this.fps);
    }
    stop() {
        this._isStart = false;
        clearTimeout(this._timer);
    }
    tick() {
        let curTime = new Date;
        let deltaTime = curTime - this._lastTickTime;
        this._lastTickTime = curTime;

        this._tickers.forEach(obj => obj.tick(deltaTime));
    }
    add(obj) {
        this._tickers.push(obj);
    }
    remove(obj) {
        this._tickers = this._tickers.filter(o => o !== obj);
    }
    timeout(ms, callback) {
        Ticker.timeout(ms, callback, this);
    }
    static timeout(ms, callback, ticker) {
        let isCreateTicker = !ticker;
        if (isCreateTicker) {
            ticker = new Ticker(1000 / ms);
        }
        let obj = {
            tick: (deltaTime) => {
                console.log(deltaTime);
                ms -= deltaTime;
                if (ms <= 0) {
                    callback();
                    ticker.remove(obj);
                    if (isCreateTicker) {
                        ticker.stop();
                    }
                }
            }
        };
        ticker.add(obj);
        ticker.start();
    }
}

module.exports = Ticker;