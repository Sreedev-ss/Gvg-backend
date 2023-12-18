const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: String,
    description: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
    system: String,
    level: Number,
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;