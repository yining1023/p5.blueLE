(function(root, factory) {
  if (typeof define === 'function' && define.amd)
    define('p5.ble', ['p5'], function(p5) {
      (factory(p5));
    });
  else if (typeof exports === 'object')
    factory(require('../p5'));
  else
    factory(root['p5']);
}(this, function(p5) {

	p5.BluetoothLE = function(_IPAddress, _port) {
		var self = this;

		this.peripheralList = [];

		if (typeof _hostname === 'string') {
      this.hostname = _hostname;
    } else {
      //console.log("typeof _hostname " + typeof _hostname + " setting to locahost");
      this.hostname = "localhost";
    }

    if (typeof _serverport === 'number') {
      this.serverport = _serverport;
    } else {
      //console.log("typeof _serverport " + typeof _serverport + " setting to 8081");
      this.serverport = 9000;
    }

    //connect to server
		this.socket = io.connect('http://localhost:9000/');
		// this.socket = new WebSocket("ws://" + this.hostname + ":" + this.serverport);

		//array of peripheral objects
		var peripheralsList = [];

		//when connect
		this.socket.on('connect', function() {
			console.log("Socket connected");
		});

		// when receive a message
		this.socket.on('peripheral', function(data) {

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

	    if(newPeripheral) {
				//display in HTML
				var Pdiv= document.createElement('div');
				Pdiv.className= 'peripheralDiv btn';
				Pdiv.setAttribute('id', data.uuid);
				var Pname = document.createElement('p');
				Pname.innerHTML = data.name+'<br/><span> UUID: '+data.uuid+'</span>';

				//attach event listener to the peripheral divs
				Pdiv.addEventListener("click", this.explore);
				Pdiv.appendChild(Pname);
				document.getElementById('peripherals').appendChild(Pdiv);
				
			  data["connected"] = false;

				//save to the peripherals array
				peripheralsList.push(data);
		  }
		});


		this.socket.on('disconnectedPeripheral', function(data){
	    document.getElementById('explore').innerHTML = "";

			peripheralsList.forEach(function(element){
		    	if(element.uuid === data){
		    		document.getElementById(data).style.backgroundColor = "#FFF";
		    		element.connected = false;
		    	}
		    });
		 });

		this.socket.on('dataLogged', function(data){
			console.log(data);

			document.getElementById('explore').innerHTML = data;

		});

  };

  p5.BluetoothLE.prototype.startScanning = function() {
		//empty peripherals list
		peripheralsList = [];
	    document.getElementById('found').innerHTML ="";

		var Plist = document.getElementById('peripherals');
		while (Plist.hasChildNodes()) {   
	    	Plist.removeChild(Plist.firstChild);
		}

		//ask for scanning
		this.socket.emit('scan');
	}

	p5.BluetoothLE.prototype.explore = function() {
		console.log('explore');
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
			this.socket.emit('explorePeripheral', peripheral.uuid);
		  document.getElementById('explore').innerHTML = "<p>Trying to connect to "+peripheral.name+"</p>";
	  }
    else{
			this.style.backgroundColor = "#999";
			this.socket.emit('disconnectPeripheral', peripheral.uuid);
			document.getElementById('explore').innerHTML = "<p>Trying to disconnect from "+peripheral.name+"</p>";
    }
	}

}));

// var init = function(){	
// 	document.getElementById('scan').addEventListener("click", requestScan);
// }

