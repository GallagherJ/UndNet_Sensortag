//connect to server
var socket = io.connect('http://localhost:8080/');


// var SensorTag = require('sensortag');       // sensortag library

// SensorTag.discover(function(tag) {
//     // when you disconnect from a tag, exit the program:
//     tag.on('disconnect', function() {
//         console.log('disconnected!');
//         process.exit(0);
//     });

//     function connectAndSetUpMe() {          // attempt to connect to the tag
//      console.log('connectAndSetUp');
//      tag.connectAndSetUp(enableAccelMe);        // when you connect and device is setup, call enableAccelMe
//    }

//    function enableAccelMe() {       // attempt to enable the accelerometer
//      console.log('enableAccelerometer');
//      // when you enable the accelerometer, start accelerometer notifications:
//      tag.enableAccelerometer(notifyMe);
//    }

//     function notifyMe() {
//     tag.notifyAccelerometer(listenForAcc);      // start the accelerometer listener
//         tag.notifySimpleKey(listenForButton);       // start the button listener
//    }

//    // When you get an accelermeter change, print it out:
//     function listenForAcc() {
//         tag.on('accelerometerChange', function(x, y, z) {
//          console.log('\tx = %d G', x.toFixed(1));
//          console.log('\ty = %d G', y.toFixed(1));
//          console.log('\tz = %d G', z.toFixed(1));
//        });
//     }

//     // when you get a button change, print it out:
//     function listenForButton() {
//         tag.on('simpleKeyChange', function(left, right) {
//             if (left) {
//                 console.log('left: ' + left);
//             }
//             if (right) {
//                 console.log('right: ' + right);
//             }
//             // if both buttons are pressed, disconnect:
//             if (left && right) {
//                 tag.disconnect();
//             }
//        });
//     }

//     // Now that you've defined all the functions, start the process:
//     connectAndSetUpMe();
// });





//array of peripheral objects
var peripheralsList = [];

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

    
	document.getElementById('found').innerHTML ="Peripherals found - click to explore:";

    var newPeripheral = true;

    peripheralsList.forEach(function(element){
    	if(element.uuid === data.uuid){
    		newPeripheral = false;
    	}
    });

    if(newPeripheral){
	//display in HTML
	var Pdiv= document.createElement('div');
	Pdiv.className= 'peripheralDiv btn';
	Pdiv.setAttribute('id', data.uuid);
	var Pname = document.createElement('p');
	Pname.innerHTML = data.name+'<br/><span> UUID: '+data.uuid+'</span>';
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

