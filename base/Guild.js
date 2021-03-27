const { model, Schema} = require("mongoose");
const config = require("../config/config");

module.exports = new model("Guild", new Schema({
    
    id: { type: String },
    prefix: { type: String, default: config.prefix },
    queue: {
        name: { type: String, required: true },
        id: { type: String, required: true },
        url: { type: String, required: true }
    }
}));