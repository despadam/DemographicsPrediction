const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cart = require('ml-cart');

const {Metric} = require('./models/metric');
const {prepareTrain} = require('./utils');

const port = 8002;
const app = express();

var agegroup_classifier;
var gender_classifier;

const genders = ['female', 'male'];
const agegroups = ['underaged', 'young', 'adult', 'elderly'];

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
            const options = { gainFunction: 'gini', maxDepth: 20, minNumSamples: 1 };
            agegroup_classifier = new cart.DecisionTreeClassifier(options);
            gender_classifier = new cart.DecisionTreeClassifier(options);

            Metric.find()
            .then((metrics) => {
                // prepare data 
                const results = prepareTrain(metrics, genders, agegroups);
        
                // train the classifiers
                agegroup_classifier.train(results.data, results.labels_agegroup);
                gender_classifier.train(results.data, results.labels_gender);
        
                return console.log('Application started successfully.');
            },
            (error) => {
                return console.log(error);
            });
        }
    });
});

app.get('/', (req, res) => {
    res.status(200).send('Demographics backend is working');
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
    .then((metrics) => {
        // prepare data 
        const results = prepareTrain(metrics, genders, agegroups);

        // train the classifiers
        agegroup_classifier.train(results.data, results.labels_agegroup);
        gender_classifier.train(results.data, results.labels_gender);

        res.status(200).send({
            message: 'Training completed successfully.'
        });
    },
    (error) => {
        res.status(400).send(error);
    })
});

// predict
app.post('/predict', (req, res) => {
    let point = [];

    point.push(req.body.mouseSpeedAvg);
    point.push(req.body.mouseSpeedMin);
    point.push(req.body.mouseSpeedMax);
    point.push(req.body.nofKeysPressed);
    point.push(req.body.nofMouseClicks);
    point.push(req.body.nofMouseMoves);
    point.push(req.body.puzzleAvgMoveTime);
    point.push(req.body.puzzleMoves);
    point.push(req.body.timeBetweenClicksAvg);
    point.push(req.body.timeBetweenClicksMax);
    point.push(req.body.timeBetweenClicksMin);
    point.push(req.body.timeBetweenKeysAvg);
    point.push(req.body.timeBetweenKeysMax);
    point.push(req.body.timeBetweenKeysMin);
    point.push(req.body.typingErrors);
    point.push(req.body.typingTime);

    const pred_age = agegroup_classifier.predict([point]);
    const pred_gender = gender_classifier.predict([point]);

    const predicted_agegroup = agegroups[pred_age[0]];
    const predicted_gender = genders[pred_gender[0]];

    res.status(200).send({
        agegroup: predicted_agegroup,
        gender: predicted_gender
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
