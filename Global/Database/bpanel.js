let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let panelb = new Schema({
    guildID: String,
    userID: String,
    bpanelrol:{type:String, default:undefined},
    bpanelrenk:{type:String, default:undefined},
    rolicon:{type:String, default:undefined},
    kullanıcılar:{type:Array,default:[]},
    date: { type: Number, default: Date.now() },
})

module.exports = mongoose.model("luhux-panel", panelb)