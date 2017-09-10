var express=require('express');
var app=express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var Cloudant = require('cloudant');
var me = 'pavanig'; // Set this to your own account
var password = 'Pavani@439';
var cloudant = Cloudant({
    account: me,
    password: password
});
var cloudant1 = Cloudant({
    account: "gkotha",
    password: "1234567890"
});
var contactdb = cloudant.db.use("lineman");
var contactdb1 = cloudant1.db.use("policstationinfo");
var contactdb2 = cloudant1.db.use("Aadhar office") ;

var getContactInfo = function(location, callback) {
	console.log(location);
    var query = {
        "selector": {
            "division": {
				"$elemMatch":{
                "Area":{
                "$eq": location
               }
				}
            }
        },
        "fields": []
    }

    contactdb.find(query, function(err, result) {
		
		if(result.docs){
		if(result.docs.length ==0){
			 var json = {
                "error": "no records found"
            }
			callback(json);
		}
		else{
				callback(result.docs[0].division[0])
			
		}
		}
		else{
      var json = {
                "error": "something went wrong"
            }
			callback(json);
		}
      
    })

};
var getContactInfo1 = function(location, callback) {
    var query = {
        "selector": {
                "Area":{
                "$eq": location
				}
            },
        "fields": []
    }

    contactdb1.find(query, function(err, result) {
		if(result.docs){
		if(result.docs.length ==0){
			 var json = {
                "error": "no records found"
            }
			callback(json)
		}
		else{
			callback(result.docs[0]);
		}
		}
        else{
			 var json = {
                "error": "error"
            }
		  callback(json);
        } 
    })

};
var getContactInfo2 = function(location, callback) {
    var query = {
        "selector": {
                "Area":{
                "$eq": location
				}
            },
        "fields": []
    }

    contactdb1.find(query, function(err, result) {
		if(result.docs){
		if(result.docs.length ==0){
			 var json = {
                "error": "no records found"
            }
			callback(json)
		}
		else{
			callback(result.docs[0]);
		}
		}
        else{
			 var json = {
                "error": "error"
            }
		  callback(json);
        } 
    })

};

app.post('/test',function(req,res){
if(req.body.result.action == "Nearest_location" && req.body.result.parameters.NearTopic == "Police Station"){
	if(req.body.result.parameters.NearTopic == "Police Station"){
	getContactInfo1(req.body.result.parameters.area,function(result){
		if(result.error){
			 return res.json({
	     speech: "I did not understand that. Try to rephrase your sentence",
        displayText: "speech234",
        source: 'webhook-echo-sample'
    }); 
		}else{
		  return res.json({
	     speech: "Here you go! The address is "+result.Address+" and the phone number is "+result.PhoneNumber,
        displayText: "speech234",
        source: 'webhook-echo-sample'
    }); 
		}
	}) 
}else if(req.body.result.action == "Nearest_location" && req.body.result.parameters.NearTopic == "Adhaar Card"){
	console.log('dnvbjg');
	 return res.json({
	     speech: "fill aadhar deatails",
        displayText: "speech234",
        source: 'webhook-echo-sample'
    });  
	
}
	}
	
else if(req.body.result.action == "line_man"){
	console.log(req.body.result.parameters.location);
	return new Promise(function(resolve,reject){
		getContactInfo(req.body.result.parameters.location, function(response){
            resolve(response);
	})
	}).then(function(result){
		if(result.error){
			
			 return res.json({
        speech: "I did not understand that. Try to rephrase your sentence",
        displayText: "speech123",
        source: 'webhook-echo-sample' 
		})
		}else{
			 return res.json({
        speech: "The mobile number for lineman of "+result.Area+" is "+result.mobile+" and the landline number is "+result.landline,
        displayText: "speech123",
        source: 'webhook-echo-sample' 
				 
}); 
		}
		
 
	})
}
	

});



app.listen(8000,function(){
console.log('running on 8000');
});

