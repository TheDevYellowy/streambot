const { model, Schema} = require("mongoose");
const config = require("../config/config");

module.exports = new model("Guild", new Schema({
    
    id: { type: String },
    prefix: { type: String, default: config.prefix },
    songData: {
        loop: { type: Boolean, default: false }
    }
}));