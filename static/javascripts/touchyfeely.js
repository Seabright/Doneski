// /*
//  TouchyFeely
// 	Swipe controller library - handles swipes, touches, and pinches on any object, icnluding the body
// 	Created by John Bragg for Seabright Studios
// */

var TouchyFeely = function(element,options) {
	var touchy = this;
	var TouchHooks = {
		start : function(event) {
			if(event.touches.length == 1) {
				touchy.update(event,false);
				// touchy.cE.trg = touchy.trg(event);
			};
		},
		move : function(event) {
			if(touchy.cE) {
				touchy.update(event);
				if(touchy.cE.type) { TouchEvent(touchy.cE.type+"move"); };
				return(false);
			};
			return(true);
		},
		end : function(event) {
			if(touchy.cE) {
				touchy.update(event);
				if(touchy.cE.type) { TouchEvent(touchy.cE.type+"end"); };
			};
			touchy.cancel();
		},
		cancel : function(event) { touchy.cancel(); }
	};
	var TouchEvent = function(type) {
		var evObj = document.createEvent('UIEvents');
		evObj.initUIEvent(type, true, true, window, 1);
		for(var i in touchy.cE) { evObj[i] = touchy.cE[i]; };
		touchy.el.dispatchEvent(evObj);
		// console.log("Event: "+type,evObj);
	};
	var bE = {
		h : []
	};
	touchy.el = element;
	touchy.config = {
		minLength : 20,
		capturescroll : true,
		captureswipe : true
	};
	for(var o in (options||{})) {
		touchy.config[o] = options[o];
	};
	touchy.clone = function(obj) {
	  var newObj = (obj instanceof Array) ? [] : {};
	  for(i in obj) {
	    if(obj[i] && typeof obj[i] == "object") {
	      newObj[i] = touchy.clone(obj[i]);
	    } else newObj[i] = obj[i];
	  };
		return newObj;
	};
	touchy.hook = function(elem) { for(var i in TouchHooks) { elem.addEventListener("touch"+i, TouchHooks[i], true); }; };
	touchy.length = function() {
		return(Math.round(Math.sqrt(Math.pow(touchy.cE.dX,2)+Math.pow(touchy.cE.dY,2))));
	};
	touchy.ang = function() {
		var ang = Math.round((Math.atan2(touchy.cE.vD,touchy.cE.hD))*180/Math.PI); //angle in degrees
		if(ang < 0) ang = 360 - Math.abs(ang);
		return(ang);
	};
	touchy.dir = function() {
		if ( ((touchy.cE.angle <= 45) && (touchy.cE.angle >= 0)) || ((touchy.cE.angle <= 360) && (touchy.cE.angle >= 315)) ) {
			return('left');
		} else if ( (touchy.cE.angle >= 135) && (touchy.cE.angle <= 225) ) {
			return('right');
		} else if ( (touchy.cE.angle > 45) && (touchy.cE.angle < 135) ) {
			return('down');
		};
		return('up');
	};
	touchy.type = function() {
		var cev = touchy.cE;
		if(cev.direction=="left"||cev.direction=="right") return("swipe");
		else if(cev.direction=="up"||cev.direction=="down") return("scroll");
		else return(undefined);
	};
	touchy.trg = function(event) {
		return(event.currentTarget);
	};
	touchy.update = function(event,capture) {
		var tch = event["touches"][0] || event["changedTouches"][0], cev = touchy.cE || touchy.nE();
		cev.cX = tch.pageX;
		cev.cY = tch.pageY;
		cev.h = cev.h || [];
		cev.h.push([cev.cX,cev.cY]);
		if(!cev.fC) cev.fC = event["touches"].length;
		if(!cev.sX) cev.sX = cev.cX;
		if(!cev.sY) cev.sY = cev.cY;
		cev.dX = cev.cX - cev.sX;
		cev.dY = cev.cY - cev.sY;
		cev.hD = cev.sX - cev.cX;
		cev.vD = cev.cY - cev.sY;
		if(cev.dX > 0 || cev.dY > 0) {
			cev.length = touchy.length();
			if(cev.length >= touchy.config.minLength) {
				cev.angle = touchy.ang();
				cev.direction = touchy.dir();
				if(!cev.type) {
					cev.type = touchy.type();
					if(cev.type) TouchEvent(cev.type+"start");
				};
			} else {
				cev.angle = undefined;
				cev.direction = undefined;
			};
		};
		if(capture && (!cev.type || touchy.config["capture"+cev.type]==true)) event.preventDefault();
		// if(cev.type) console.log(touchy.config["capture"+cev.type]+"");
	};
	touchy.nE = function() { delete touchy["cE"]; touchy.cE = touchy.clone(touchy.bE); return(touchy.cE); };
	touchy.cancel = function() { delete touchy["cE"]; };
	touchy.cE = false;
	touchy.currentEvent = touchy.cE;
	touchy.hook(element);
	return(touchy);
};