const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const {Metric} = require('./models/metric');

const port = 8002;
const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.listen(port, () => {
    const url = 'mongodb+srv://root:1593572468@cluster0-jloqm.mongodb.net/test?retryWrites=true&w=majority';

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, res) {
        if (err) {
            return console.log(err);
        }
        else {
            return console.log('Started on port', port);
        }
    });
});

app.get('/', (req,res) => {
    res.status(200).send('Hello :)');
});

// get all
app.get('/metrics', (req, res) => {
    Metric.find()
    .then((metrics) => {
        res.status(200).send(metrics);
    },
    (error) => {
        res.status(400).send(error);
    });
});

// create new
app.post('/metrics', (req, res) => {
    const newMetric = new Metric({
        gender: req.body.gender,
        agegroup: req.body.agegroup,
        mouseSpeedAvg: req.body.mouseSpeedAvg,
        mouseSpeedMin: req.body.mouseSpeedMin,
        mousespeedMax: req.body.mousespeedMax,
        nofKeysPressed: req.body.nofKeysPressed,
        nofMouseClicks: req.body.nofMouseClicks,
        nofMouseMoves: req.body.nofMouseMoves,
        nofWheelEvents: req.body.nofWheelEvents,
        puzzleAvgMoveTime: req.body.puzzleAvgMoveTime,
        puzzleMoves: req.body.puzzleMoves,
        timeBetweenClicksAvg: req.body.timeBetweenClicksAvg,
        timeBetweenClicksMax: req.body.timeBetweenClicksMax,
        timeBetweenClicksMin: req.body.timeBetweenClicksMin,
        timeBetweenKeysAvg: req.body.timeBetweenKeysAvg,
        timeBetweenKeysMax: req.body.timeBetweenKeysMax,
        timeBetweenKeysMin: req.body.timeBetweenKeysMin,
        typingErrors: req.body.typingErrors,
        typingTime: req.body.typingTime
    });

    newMetric.save()
    .then(() => {
        res.status(200).send({
            message: 'Metric created successfully.'
        });
    },
    (error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

// delete one
app.delete('/metrics/:id', (req, res) => {
    Metric.findOneAndDelete({
        _id: req.params.id
    })
    .then((metric) => {
        if (!metric) {
            return res.status(404).send({
                message: 'Unable to find metric.'
            });
        }

        res.status(200).send({
            message: 'Metric deleted successfully.'
        });
    },
    (error) => {
        res.status(400).send(error);
    });
});
