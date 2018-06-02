let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let infoSchema = new Schema({
    date: String,
    speed: Number,
    tempIn: Number,
    tempOut:Number,
    tempTarget:Number
});
infoSchema.methods.printInfo = function() {

    console.log("date: "+this.time+", speed: "+this.speed+", temperatureIn: "+this.tempIn+", temperatureOut: "+this.tempOut,"temperatureTarget: "+this.tempTarget);
};

let Info = mongoose.model('Info', infoSchema);
module.exports = Info;
