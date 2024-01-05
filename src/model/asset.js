const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    parent: String,
    system: String,
    level: Number,
    plant: { type: mongoose.Schema.Types.ObjectId },
    children: Array,
    color: {
        type: String,
        default: "#3773ca"
    }
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;