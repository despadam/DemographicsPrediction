const mongoose = require('mongoose');

const Example = mongoose.model('Example', {
    field: {
        type: String,
        required: true
    }
});

module.exports = {
    Example
};
