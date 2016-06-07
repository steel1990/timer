"use strict";

// 'hh:mm:ss'
var TIME_FORMAT_REG = /(h+|m+|s+|S+)/g;
var TIME_FORMAT_MAP = {
    h: function (second) {
        return Math.floor(second / 3600) % 60;
    },
    m: function (second) {
        return Math.floor(second / 60) % 60;
    },
    s: function (second) {
        return second % 60;
    },
    S: function (second) {
        return second;
    }
};

function padLeft(num, len, char) {
    num = String(num);
    if (num.length >= len) {
        return num;
    }
    char = char || '0';
    return (new Array(len + 1).join(char) + num).slice(-len);
}

function formatTime(second, formatStr) {
    return formatStr.replace(TIME_FORMAT_REG, function ($, name) {
        return padLeft(TIME_FORMAT_MAP[name.charAt(0)](second), name.length);
    });
}

module.exports = { padLeft, formatTime };