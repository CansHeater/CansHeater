let express = require("express");
let mongoose = require('mongoose');
let bodyParser = require("body-parser");
let routes = require("./routes/route.js");

// Ces options sont recommandées par mLab pour une connexion à la base
let options = {
    "keepAlive" : 300000,
    "connectTimeoutMS" : 30000
};
//URL de notre base
let urlmongo = "mongodb://localhost/chauffagecannette";

mongoose.connect(urlmongo,options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function (){
    console.log("Connexion à la base OK");
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options('/*',function(req,res,next){
res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
res.status(200).send();
});

routes(app);

let server = app.listen(8080, function () {
    console.log("app running on port.", server.address().port);
});
