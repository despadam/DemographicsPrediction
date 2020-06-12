const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const naivebayes = require('ml-naivebayes');

const {Metric} = require('./models/metric');

const port = 8002;
const app = express();

var agegroup_classifier;
var gender_classifier;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(process.env.PORT || port, () => {
    const url = 'mongodb+srv://root:1593572468@cluster0-jloqm.mongodb.net/test?retryWrites=true&w=majority';

    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, res) {
        if (err) {
            return console.log(err);
        }
        else {
            return console.log('Application started successfully.');
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

// train classifiers
app.get('/train', (req, res) => {
    Metric.find()
    .then((metrics) =>{
        // prepare data for training
        data = [];
        labels_agegroup = [];
        labels_gender = [];
        for(var i=0, l=metrics.length; i < l; i++){
            point = [];
            point.push(metrics[i].mouseSpeedAvg);
            point.push(metrics[i].mouseSpeedMin);
            point.push(metrics[i].mousespeedMax);
            point.push(metrics[i].nofKeysPressed);
            point.push(metrics[i].nofMouseClicks);
            point.push(metrics[i].nofMouseMoves);
            point.push(metrics[i].puzzleAvgMoveTime);
            point.push(metrics[i].puzzleMoves);
            point.push(metrics[i].timeBetweenClicksAvg);
            point.push(metrics[i].timeBetweenClicksMax);
            point.push(metrics[i].timeBetweenClicksMin);
            point.push(metrics[i].timeBetweenKeysAvg);
            point.push(metrics[i].timeBetweenClicksMax);
            point.push(metrics[i].timeBetweenKeysMin);
            point.push(metrics[i].typingErrors);
            point.push(metrics[i].typingTime);
            data.push(point);
            labels_agegroup.push(metrics[i].agegroup);
            labels_gender.push(metrics[i].gender);
        }
        genders = ['female', 'male'];
        agegroups = ['underaged', 'young', 'adult', 'elderly'];
        labels_gender = labels_gender.map((elem) => genders.indexOf(elem));
        labels_agegroup = labels_agegroup.map((elem) => agegroups.indexOf(elem));
        
        // train the classifiers
        agegroup_classifier = new naivebayes.MultinomialNB();
        gender_classifier = new naivebayes.MultinomialNB();

        agegroup_classifier.train(data, labels_agegroup);
        gender_classifier.train(data, labels_gender);
    },
    (error) => {
        res.status(400).send(error);
    })
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
