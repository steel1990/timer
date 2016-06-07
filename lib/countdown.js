"use strict";

const ee = require('event-emitter');
const Ticker = require('./ticker');
const util = require('./util');

class Countdown {
    /**
     * 利用 ticker 实现的一个倒计时实现
     *
     * @param {Object} opt 初始化参数
     * @param {Ticker} opt.ticker 用于倒计时的 Ticker 实例，如果不传将执行初始化一个
     * @param {number} opt.time 倒计时的总时间，单位为ms
     * @param {boolean} opt.isIncrement 倒计时是否从0开始(0-1-2-3)，默认为false(3-2-1-0)
     * @param {boolean} opt.isLoop 是否循环，结束后自动重新开始
     * @param {string} opt.format 输出字符串的format格式，支持h(小时)m(分钟)s(秒)
     *  示例 'hh:mm:ss' 输出 01:01:01, 'm:ss' 输出 1:01
     */
    constructor(opt) {
        this.time = opt.time;
        // 是否递增
        this.isIncrement = !!opt.isIncrement;
        this.isLoop = !!opt.isLoop;
        this.currentTime = this.isIncrement ? 0 : this.time;
        this.currentSeconds = Math[this.isIncrement ? 'floor' : 'ceil'](this.currentTime / 1000);
        this.format = opt.format || 'mm:ss';

        this._timeListener = [];

        this.ticker = opt.ticker;
        if (!this.ticker) {
            this._isTickerAutoCreated = true;
            this.ticker = new Ticker(2);
        }

        ee(this);
    }
    start() {
        if (this._isStart) {
            return;
        }
        this._isStart = true;
        this.ticker.add(this);
        this.ticker.start();
        this.emit('start');
        return this;
    }
    stop() {
        this._isStart = false;
        this.ticker.remove(this);
        if (this._isTickerAutoCreated) {
            this.ticker.stop();
        }
        this.emit('stop');
        return this;
    }
    reset() {
        this.stop();
        this.currentTime = this.isIncrement ? 0 : this.time;
        this.update();
        this.start();
        return this;
    }
    resetForLoop() {
        this._timeListener.forEach(listener => {
            if (listener.from) {
                listener.time = listener.from;
            }
            delete listener._called;
        });
    }
    when(time, callback) {
        this._timeListener.push({
            time: time,
            callback: callback
        });
        return this;
    }
    every(from, to, every, callback) {
        if ((this.isIncrement && from > to) || (!this.isIncrement && from < to)) {
            let t = from;
            from = to;
            to = t;
        }
        this._timeListener.push({
            every: every,
            from: from,
            time: from,
            to: to,
            status: 0,
            callback: callback
        });
        return this;
    }
    _checkTimeListener() {
        for (var i = this._timeListener.length - 1; i >= 0; i -= 1) {
            var listener = this._timeListener[i];
            if (listener._called) {
                continue;
            }
            var isArrival = this.isIncrement ? this.currentTime >= listener.time : this.currentTime <= listener.time;
            // console.log('isArrival', this.currentTime, listener.time);
            if (isArrival) {
                listener.callback(this.currentTime, listener.status);
                if (listener.every) {
                    listener.time += listener.every * (this.isIncrement ? 1 : -1);
                    listener.status += 1;
                }

                if (!listener.every || (this.isIncrement ? listener.time >= listener.to : listener.time <= listener.to)) {
                    if (this.isLoop) {
                        listener._called = true;
                    } else {
                        this._timeListener.splice(i, 1);
                    }
                }
            }
        }
    }
    update() {
        if (this.currentTime < 0 || this.currentTime > this.time) {
            this.currentTime = this.currentTime < 0 ? 0 : this.time;
        }

        this.currentSeconds = Math[this.isIncrement ? 'floor' : 'ceil'](this.currentTime / 1000);
        if (this.lastUpdateTime !== this.currentSeconds) {
            this.lastUpdateTime = this.currentSeconds;
            this.emit('update');
        }

        if (this.isIncrement ? this.currentTime >= this.time : this.currentTime <= 0) {
            this.emit('end');
            if (this.isLoop) {
                this.currentTime = this.isIncrement ? 0 : this.time;
                this.resetForLoop();
            } else {
                this.stop();
            }
        }

        this._checkTimeListener();
    }
    tick(deltaTime) {
        if (this.isIncrement) {
            this.currentTime += deltaTime;
        } else {
            this.currentTime -= deltaTime;
        }
        this.update();
        this.emit('tick');
    }
    isEnd() {
        return this.isIncrement ? this.time === this.currentTime : !this.currentTime;
    }
    toString(format) {
        return util.formatTime(this.currentSeconds, format || this.format);
    }
    attach(ele, format) {
        if (ele) {
            this.on('update', () => {
                ele.innerHTML = this.toString(format);
            });
        }
        return this;
    }
}

module.exports = Countdown;