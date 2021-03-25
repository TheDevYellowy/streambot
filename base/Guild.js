const mongoose = require("mongoose");
const config = require("../config");

module.exports = new mongoose.model("Guild", new mongoose.Schema({
    
    id: { type: String },
    prefix: { type: String, default: config.prefix }
}));