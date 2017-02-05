var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongoose');


var app = express();
app.set('view engine', 'ejs');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
mongo.connect('mongodb://reaper:qwerty123@ds139267.mlab.com:39267/trackemdatabase');


var schema = new mongo.Schema({
    name: String,
    number: String,
    online: String,
    lat: String,
    lng: String,
    password: String,
    email: String
});
var Trackinfo = mongo.model('Trackeminfo', schema);

//what?!
app.get('/', function (req, res) {
    res.render('home');
});
app.post('/',jsonParser, function (req, res) {
    console.log(req.body);
    Trackinfo.find({ number: req.body.number }, function (err, res) {
        if (res.length == 0) {
            var first = Trackinfo({ name: req.body.who, number: req.body.number, lat: req.body.lat, lng:req.body.lng, online: 'true', password: req.body.password, email: req.body.email }).save(function (err) {
                if (err) throw err;
                console.log("item saved");
            });
        }
    });
    res.send("added");
    
    //Trackinfo.update({number:"qwerty"}, {$set: {number:"9717762183"}});
    /*
    Trackinfo.findOne({ number: "9717762183" }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (doc) {
                doc.lat = '00000';
                doc.lng = '00000';
                doc.online = 'true';
                doc.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else res.send("updated");
                });
            }
        }
    });*/
 

});

app.post('/update', jsonParser, function (req, res) {
     
    Trackinfo.findOne({ number: req.body.number }, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            if (doc) {
                doc.lat = req.body.lat;
                doc.lng = req.body.lng;
                doc.online = 'true';
                doc.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else res.send("updated");
                });
            }
        }
    });
    /*
    Trackinfo.findOneAndUpdate({ number:"9717762183" }, number = '1', function (err, doc) {
        if (err) throw err;
        doc.lat = '0000';
        doc.lng = '0000';
        doc.online = 'true';
        doc.save();
        res.send(doc);
        console.log(doc);
    });*/
});

app.get('/offline', function (req, res) {
    Trackinfo.findOneAndUpdate({ number: req.query.number }, number = '1', function (err, doc) {
        if (err) throw err;
        doc.online = 'false';
        doc.save();
        res.send("offline");
    });
});

app.get('/confirm-login', function (req, response) {
    var match = 0;
    Trackinfo.find({ number: req.query.number }, function (err, res) {
        var jsonRes=JSON.parse(res);
        
        response.send(jsonRes[0]);
        if (err) throw err;
        if (res.length != 0) {
            //if (res.password =="qwerty")
               response.send("matched");
            //else response.send(res.password);
        }else response.send("no result");
    });

});

/*
app.get('/update', function (req, res) {
   
    Trackinfo.findOneAndUpdate({ number: req.query.number }, number = '1', function (err, doc) {
        if (err) throw err;
        doc.lat = req.query.lat;
        doc.lng = req.query.lng;
        doc.save();
        res.send(doc);
        console.log(doc);
    });
});*/

app.get('/getinfo', function (req, res) {

    Trackinfo.find({ number: req.query.number }, function (err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
    });
});

app.listen(process.env.PORT || 3000);
