var express=require('express');


var app1=express();
var cfEnv=require('cfenv');
var path=require('path');

var bodyParser = require('body-parser');

var unirest=require('unirest');

var http = require('http').Server(app1);
var io = require('socket.io')(http);

app1.use(bodyParser.urlencoded({
    extended: true
}));
app1.use(bodyParser.json())

var appEnv=cfEnv.getAppEnv();

var apiai = require('apiai');

 //781e89caa950487f92ef6882a9b2f04e
//fc306bd335e143a3a01d02a6965b2b96
 //8a5771bd65d44ab18c3f4fe9146fa0d7
 var app = apiai("50b9c46e5d4f457eb085378baae988a9"); 
 
app1.use('/', express.static('public'))

app1.get('/',function(req,res){
res.sendFile(path.join(__dirname + '/public/chatui.html'));
});


io.on('connection',function(socket){
	socket.on("chat message", function(msg){
		console.log('--------------------------------------------')
		console.log(msg)
		console.log('--------------------------------------------')
		console.log('chat message',msg);
				
 var request = app.textRequest(msg, {
    sessionId: '12'
});		


request.on('response', function(response) {
	if(response.result.action=="input.welcome"){
			var myObject={
	 message:response.result.fulfillment.speech
 }
 io.emit('cf',myObject);
	}
	else if(response.result.action=="application_process"){
		console.log('testing1');
         if(response.result.parameters.Cards=="PAN Card")
         {
         
         var myObject={
     message:"You can apply for PAN card directly at the office or online by filling and downloading form 49 A here, https://tin.tin.nsdl.com/pan2/servlet/NewPanAppDSC"
} 
        io.emit('cf',myObject);
         }
		 
         else if(response.result.parameters.Cards=="Aadhar Card"){
             console.log('aadhar....');
            var myObject={
     message:"Go to the Nearest Aadhar Card Kendra > Fill up Aadhar Application > Provide all the Documents > Provide Biometric like Finger Prints. It’s Done. You will be Given Aadhar Slip for Future Reference. Your Aadhar Card Will be Delivered within 90 Days By Courier."
} 
        io.emit('cf',myObject); 
         }
	     
    else if(response.result.parameters.Cards=="Voter Card"){
        
         var myObject={
     message:"Here is the process for applying Voter card1. Visit www.eci.nic.in 2. Select 'Enroll Now'3. Enter your details and click on 'Proceed'4. Enter the confirmation code received on your mobile 5. Fill the online form and Submit"

} 
        io.emit('cf',myObject);
    }
	}
	else if(response.result.action=="Complaint_track"){
var json={};

if(response.result.actionIncomplete==false){

var json={};
         json.area=response.result.parameters.area;
         json.description=response.result.parameters.description;
         json.problem=response.result.parameters.issueTrack;
         json.name=response.result.parameters.name;
         json.phone=response.result.parameters.phoneNumber;
         json.time=response.timestamp;
         db.insert(json,function(err,result){
             if(err){
                 console.log(err)

            }         else{
                 console.log(result);
             }
		 });
}
	}
	else if(response.result.parameters.NearTopic == "Aadhar card"){
		
	    var myObject={
     message:response.result.fulfillment.speech
} 
        io.emit('cf',myObject); 
	}
	else if(response.result.parameters.NearTopic == "Police Station"){
		   var myObject={
     message:response.result.fulfillment.speech
} 
        io.emit('cf',myObject); 
	}
	else if(response.result.action == "line_man"){
		   var myObject={
     message:response.result.fulfillment.speech
} 
        io.emit('cf',myObject); 
	}
	else if(response.result.action == "thank_you"){
		   var myObject={
     message:response.result.fulfillment.speech
} 
        io.emit('cf',myObject); 
	}
	else if(response.result.action == "documents"){
		   var myObject={
     message:response.result.fulfillment.speech
} 
        io.emit('cf',myObject); 
	}

	
});
 
request.on('error', function(error) {
    console.log(error);
});
 
request.end();
	});
  
 });
 
 
 
http.listen(process.env.PORT || 8001, function(){
	console.log("running on port "+ process.env.PORT || 8001);	
});