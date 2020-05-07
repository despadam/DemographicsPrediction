const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const {Example} = require('./models/example');

const port = 8002;
const app = express();

app.use(bodyParser.json());

app.listen(port, () => {
    mongoose.connect('mongodb+srv://root:bosgavMAuEtKj1Ng@cluster0-havrp.azure.mongodb.net/demographics-db?retryWrites=true&w=majority', {
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
app.get('/examples', (req, res, next) => {
    Example.find()
    .then((examples) => {
        res.status(200).send(examples);
    },
    (error) => {
        res.status(400).send(error);
    })
    .catch((e) => {
        next(e);
    });
});

// get one
app.get('/examples/:id', (req, res, next) => {
    Example.findOne({
        _id: req.params.id
    })
    .then((example) => {
        if (!example) {
            return res.status(404).send({
                message: 'Unable to find example.'
            });
        }
        res.status(200).send(example);
    },
    (error) => {
        res.status(400).send(error);
    })
    .catch((e) => {
        next(e);
    });
});

// create new
app.post('/examples', (req, res, next) => {
    const newExample = new Example({
        field: req.body.field
    });

    newExample.save()
    .then((response) => {
        res.status(200).send({
            message: 'Example created successfully.'
        });
    },
    (error) => {
        res.status(400).send(error);
    })
    .catch((e) => {
        next(e);
    });
});

// edit existing
app.post('/examples/:id', (req, res, next) => {
    Example.findOne({
        _id: req.params.id
    })
    .then((example) => {
        if (!example) {
            return res.status(404).send({
                message: 'Unable to find example.'
            });
        }

        example.field = req.body.field;
        example.save()
        .then((response) => {
            res.status(200).send({
                message: 'Example updated successfully.'
            });
        },
        (error) => {
            res.status(400).send(error);
        });
    },
    (error) => {
        res.status(400).send(error);
    })
    .catch((e) => {
        next(e);
    });
});

// delete one
app.delete('/examples/:id', (req, res, next) => {
    Example.findOneAndDelete({
        _id: req.params.id
    })
    .then((example) => {
        if (!example) {
            return res.status(404).send({
                message: 'Unable to find example.'
            });
        }

        res.status(200).send({
            message: 'Example deleted successfully.'
        });
    },
    (error) => {
        res.status(400).send(error);
    })
    .catch((e) => {
        next(e);
    });
});
