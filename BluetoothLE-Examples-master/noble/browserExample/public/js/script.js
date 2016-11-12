//connect to server
var socket = io.connect('http://localhost:8080/');

//array of peripheral objects
var peripheralsList = [];


//Tonejs Markov

// function loadScript(url, callback){

//     var script = document.createElement("script")
//     script.type = "text/javascript";

//     if (script.readyState){  //IE
//         script.onreadystatechange = function(){
//             if (script.readyState == "loaded" ||
//                     script.readyState == "complete"){
//                 script.onreadystatechange = null;
//                 callback();
//             }
//         };
//     } else {  //Others
//         script.onload = function(){
//             callback();
//         };
//     }

//     script.src = url;
//     document.getElementsByTagName("head")[0].appendChild(script);
// };

// loadScript("http://cdn.tonejs.org/latest/Tone.min.js", function(){
//     //initialization code

//     var chain = new Tone.CtrlMarkov({
//     "1" : ["c"],
//     "2" :["h"],
//     "3":["a"],
//     "4":["i"],
//     "5":["n"]

// });
//     chain.value = "1";
//     chain.next();
//     console.log(chain);
// });









//when connect
socket.on('connect', function() {
	console.log("Connected");

});

// when receive a message
socket.on('peripheral', function(data) {

	if (typeof data.name ===  undefined ||
		typeof data.name ===  'undefined') {
		return;
	}

    
	document.getElementById('found').innerHTML ="Your Word is here!!";

    var newPeripheral = true;

    peripheralsList.forEach(function(element){
    	if(element.uuid === data.uuid){
    		newPeripheral = false;
    	}
    });



    //random text
var words = ["A", "P", "P", "L", "E"];

var getRandomWord = function () {
    return words[Math.floor(Math.random() * words.length)];
};

var word = getRandomWord();

console.log(word);

    // Taking only Sensor Tag
    if(newPeripheral && data.name == "SensorTag"){
	//display in HTML
	var Pdiv= document.createElement('div');
	Pdiv.className= 'peripheralDiv btn';
	Pdiv.setAttribute('id', data.uuid);
	var Pname = document.createElement('p');
	Pname.innerHTML = word//data.name+'<br/><span> UUID: '+data.uuid+'</span>'+ word;
    console.log(data);


 





	//attach event listener to the peripheral divs
	Pdiv.addEventListener("click", explore);
	Pdiv.appendChild(Pname);
	document.getElementById('peripherals').appendChild(Pdiv);
	
    data["connected"] = false;

	//save to the peripherals array
	peripheralsList.push(data);
    }
});





socket.on('disconnectedPeripheral', function(data){
    document.getElementById('explore').innerHTML = "";

	peripheralsList.forEach(function(element){
    	if(element.uuid === data){
    		document.getElementById(data).style.backgroundColor = "#FFF";
    		element.connected = false;
    	}




    });
 });

socket.on('dataLogged', function(data){

	document.getElementById('explore').innerHTML = data;
        console.log(data);


 });


function explore(){
	var Pdiv = this;
	var peripheral;

    peripheralsList.forEach(function(element){
    	if(element.uuid === Pdiv.id){
    		peripheral = element;
    		peripheral.connected = !peripheral.connected;		
    	}
    });

    if(peripheral.connected === true){
		this.style.backgroundColor = "#9ed1f0";
		socket.emit('explorePeripheral', peripheral.uuid);

		 document.getElementById('explore').innerHTML = "<p>Trying to connect to "+peripheral.name+"</p>";
        


    }
    else{
		this.style.backgroundColor = "#999";
		socket.emit('disconnectPeripheral', peripheral.uuid);
		document.getElementById('explore').innerHTML = "<p>Trying to disconnect from "+peripheral.name+"</p>";

    }
}











function requestScan(){
	//empty peripherals list
	peripheralsList = [];
    document.getElementById('found').innerHTML ="";

	var Plist = document.getElementById('peripherals');
	while (Plist.hasChildNodes()) {   
    	Plist.removeChild(Plist.firstChild);
	}

	//ask for scanning
	socket.emit('scan');
}

var init = function(){	
	document.getElementById('scan').addEventListener("click", requestScan);
}

