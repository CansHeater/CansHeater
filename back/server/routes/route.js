let Info = require('./info');
let Client = require('node-rest-client').Client;
let fs = require('fs');
let options ={  
    mimetypes:{
        json:["application/json","application/json; charset=utf-8"]
    } 
};

let client = new Client(options);
let file = fs.readFileSync('/root/chauffage-a-cannette/back/server/routes/settings.json');

let settings = JSON.parse(file);
console.log (settings);



let appRouter = function (app) {

    function finished() {
        console.log("saved to file");
    }

    app.get("/", function(req, res) {
        res.status(200).send("Welcome to our restful API");
    });

    //Méthode pour demander tout les fichiers dans la base
    app.get("/info", function(req, res) {
        Info.find({},function (err,infos) {
            if (err) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(infos);
        });
    });



    //Méthode pour envoyer les données de la carte au serveur et les stocker en base de donnée
    app.post('/info',function(req, res) {

        let tempIn=req.body.tempIn;
        let tempOut=req.body.tempOut;
        let speed;
        if ((tempIn>tempOut)||(tempIn>=settings.targetTemp)||(!settings.state)) {
            speed=0;
        }else{
            if((((tempOut/tempIn)-1)*100)>100){
                speed=100;
            }else{
                speed =(Number(((tempOut/tempIn)-1)*100).toFixed(2));
            }
        }
        let infos = new Info({
            date: new Date().toLocaleString(),
            speed: speed,
            tempIn:tempIn,
            tempOut:tempOut,
            tempTarget:settings.targetTemp
        });
        infos.save(function(err) {
            if (err) throw err;

            console.log('Infos are added');
        });
        res.setHeader("Content-Type", "application/json");
        res.status(201).send(infos); // 201 pour confirmer la bonne création de la ressource
    });



    //Méthode pour demander les temperatures
        app.get("/info/temperatures", function(req, res) {

            if(req.query.date){
                Info.find({},function (err,infos) {
                    if (err) throw err;
                    let date=req.query.date;
                    let temperatures = [];
                    infos.forEach(function (info) {
                        if(new Date(info.date).setHours(0,0,0,0) === new Date(date).setHours(0,0,0,0)){
                            temperatures.push({"date":info.date,"tempIn":info.tempIn,"tempOut":info.tempOut,"tempTarget":info.tempTarget});
                        }
                    });

                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).send(temperatures);

                });
            }else {
                Info.find({}, function (err, infos) {
                    if (err) throw err;

                    let temperatures = [];
                    infos.forEach(function (info) {
                        if(new Date(info.date).getTime()> new Date(new Date().getTime()-(24 * 60 * 60 * 1000)))
                        temperatures.push({"date": info.date, "tempIn": info.tempIn, "tempOut": info.tempOut,"tempTarget":info.tempTarget});
                    });
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).send(temperatures);
                });
            }
    });

    //Méthode pour envoyer la vitesse
    app.get("/info/fanspeed", function(req, res) {

        Info.find().sort({date:-1}).findOne({},function (err,info) {
            if (err) throw err;

		    res.setHeader('Content-Type', 'application/json');
		    res.status(200).send(String(info.speed));
        });

    });


    app.get("/info/current", function(req, res) {

        res.setHeader('Content-Type', 'application/json');
        Info.find().sort({date:-1}).findOne({},function (err,info) {
            if (err) throw err;
            res.status(200).send({"tempIn":info.tempIn,"tempOut":info.tempOut,"tempTarget":settings.targetTemp,"speed":info.speed,"state":settings.state});
        });

    });


    app.post("/info/target", function (req,res) {
        settings.targetTemp = req.body.target;
        fs.writeFile("/root/chauffage-a-cannette/back/server/routes/settings.json",JSON.stringify(settings,null,2),finished);
        res.status(200).send(String(settings.targetTemp));

    });

    app.post("/info/state", function (req,res) {
        settings.state = req.body.state;
        fs.writeFile("/root/chauffage-a-cannette/back/server/routes/settings.json",JSON.stringify(settings,null,2),finished);
        console.log(state);
        res.status(200).send(state);

    });

    app.get("/info/sleepTime",function (req,res) {
	console.log("sleeTime start");
        client.get("https://www.prevision-meteo.ch/services/json/rennes",function (data,response) {
		let cityInfo=JSON.parse(data).city_info;
		
		let sunrise = new Date();
		sunrise.setHours(parseInt(cityInfo.sunrise.slice(0,2)));
		sunrise.setMinutes(parseInt(cityInfo.sunrise.slice(3,5)));
		let sunset = new Date();
		sunset.setHours(parseInt(cityInfo.sunset.slice(0,2)));
		sunset.setMinutes(parseInt(cityInfo.sunset.slice(3,5)));
		let now = new Date();		
		if (now >sunset || now <sunrise){
			console.log("sleeTime end");
			res.status(200).send(String(60));
		}		
		else{
			Info.find().sort({date:-1}).findOne({}, function (err,info){
				if(err) throw err;
				console.log(info.speed);
				if(info.speed != 0){
				console.log("sleeTime end");
				res.status(200).send(String(0));
				}else{
				console.log("sleeTime end");
				res.status(200).send(String(1));
				}
			});
		}
	    
	 });
    });

    app.get("/info/city",function(req,res){
	
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({"city":settings.city});

    });

   app.post("/info/city",function(req,res){
	console.log(req.body.city);	
	client.get("https://www.prevision-meteo.ch/services/json/"+req.body.city, function(data,response){
	let test = JSON.parse(data).city_info;
	if(test !== undefined){
	    settings.city=test.name;
	    fs.writeFile("/root/chauffage-a-cannette/back/server/routes/settings.json",JSON.stringify(settings,null,2),finished);
	}
	res.status(200).send({"city":settings.city});

	});
   });


    app.use(function(req, res){
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Page introuvable !');
    });

};

module.exports = appRouter;
