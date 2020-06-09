const mongoose = require('mongoose');

const Metric = mongoose.model('Metric', {
    gender: {
        type: String,
        required: true
    },
    agegroup: {
        type: String,
        required: true
    },
    mouseSpeedAvg: {
        type: Number,
        required: true
    },
    mouseSpeedMin: {
        type: Number,
        required: true
    },
    mousespeedMax: {
        type: Number,
        required: true
    },
    nofKeysPressed: {
        type: Number,
        required: true
    },
    nofMouseClicks: {
        type: Number,
        required: true
    },
    nofMouseMoves: {
        type: Number,
        required: true
    },
    nofWheelEvents: {
        type: Number,
        required: true
    },
    puzzleAvgMoveTime: {
        type: Number,
        required: true
    },
    puzzleMoves: {
        type: Number,
        required: true
    },
    timeBetweenClicksAvg: {
        type: Number,
        required: true
    },
    timeBetweenClicksMax: {
        type: Number,
        required: true
    },
    timeBetweenClicksMin: {
        type: Number,
        required: true
    },
    timeBetweenKeysAvg: {
        type: Number,
        required: true
    },
    timeBetweenKeysMax: {
        type: Number,
        required: true
    },
    timeBetweenKeysMin: {
        type: Number,
        required: true
    },
    typingErrors: {
        type: Number,
        required: true
    },
    typingTime: {
        type: Number,
        required: true
    }
});

module.exports = {
    Metric
};
