function Spaceship(track) {
	this.isFlying = true;
	this.flag = track;
	this.element;
	this.direction = "clockwise";
	this.duration;
	this.rotateDeg;
	this.timeOut;
	this.controlPanel;
	this.chargeInterval;
	this.fuelSurplus = 100;
	this.element = document.getElementsByClassName("ship ship"+track)[0];
	this.element.style.visibility = "visible";
	this.controlPanel = document.getElementsByClassName("control cship"+track)[0];
	this.controlPanel.style.display = "block";
	this.rotateDeg = 0;
};
Spaceship.prototype.charge  = function() {
	var that = this;
	this.chargeInterval = setInterval(function(){
		if (that.fuelSurplus < 100) {
			var charge = 1;
		} else {
			charge = 0;
		}
		console.log("charge被调用");
		that.fuelSurplus = that.fuelSurplus + parseInt(charge);
		that.element.firstElementChild.firstElementChild.textContent = that.fuelSurplus+"%";
	},400);
};
Spaceship.prototype.stopFly = function() {
	window.clearInterval(this.duration);
	this.isFlying = false;
	this.charge();
};
Spaceship.prototype.beginFly = function() {
	this.isFlying = true;
	var that = this;
	this.duration = setInterval(function() {
		if (that.fuelSurplus <= 0) {
			clearTimeout(that.timeOut);
			that.stopFly();
		}
		that.timeOut = setTimeout (function() {
			if (that.rotateDeg % 10 === 0) {
				that.fuelSurplus = that.fuelSurplus - 1;	//燃料消耗
				that.fuelSurplus = that.fuelSurplus + 0.5;	//燃料补给
			}
			that.element.firstElementChild.firstElementChild.textContent = that.fuelSurplus+"%";
			that.rotateDeg = that.rotateDeg + 1;
			that.element.style.transform = "rotate("+that.rotateDeg+"deg)";
		},21);
	},20);
};

Spaceship.prototype.destroy = function() {
	this.stopFly();
	this.element.style.visibility = "hidden";
	this.controlPanel.style.display = "none";
};
Spaceship.prototype.commandReceive = function(command) {
	if (parseInt(command.id) === parseInt(this.flag)) {
		if (command.command === "fly") {
			if (!this.isFlying) {
				this.beginFly();
			}
		} else if (command.command === "stop") {
			if (this.isFlying) {
				this.stopFly();
			}
		} else if (command.command === "destroy") {
			this.destroy();
		} else {
			alert("命令出错");
		}
	}
};
function Commander() {
	this.shipExist = [false,false,false,false];
	this.newShipButton = document.getElementsByClassName("create")[0];
	this.allShipControlButton = document.querySelectorAll(".control_panel div button");
	this.command = {
		id : 0,
		command: ""
	};
};
Commander.prototype.newShip = function() {
	var that = this;
	this.newShipButton.addEventListener ("click",function(){
		var newShipNumber = that.shipExist.indexOf(false);

		if (newShipNumber === -1) {
			alert("没有空轨道了");
			return false;
		}
		that.shipExist[newShipNumber] = new Spaceship(newShipNumber+1)
		that.shipExist[newShipNumber].beginFly();
	});
};
Commander.prototype.sendCommand = function() {
	var that = this;
	for (var i = 0 ; i<this.allShipControlButton.length ; i++) {
		this.allShipControlButton[i].addEventListener("click",function(event){
			that.command.id = event.target.parentNode.getAttribute("class").split("ship")[1];
			that.command.command = event.target.getAttribute("class");
			setTimeout(function(){
				for (var j = 0; j < 4; j++) {
					if (that.shipExist[j]) {
						var num = Math.floor(Math.random() * 10);
						if (num % 3 !== 0 && num !== 0) {
							that.shipExist[j].commandReceive(that.command);
							if (that.command.command === "destroy" && that.command.id == (j+1)) {
								that.shipExist[that.command.id-1] = false;
							}
						}
					}
				}
			},1000);
		});
	}
};
function Common() {
	this.addLoadEvent;
	this.init;
};
Common.prototype.addLoadEvent = function (func){
	var oldonload = window.onload;
	if (typeof window.onload != 'function'){
		window.onload = func;
	}else {
		window.onload = function(){
			oldonload();
			func();
		};
	}
};
Common.prototype.init = function () {
	var commander = new Commander();
	commander.newShip();
	commander.sendCommand();
};
var common = new Common();
common.addLoadEvent(common.init);