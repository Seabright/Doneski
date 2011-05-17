// /*
//  TouchyFeely
// 	Swipe controller library - handles swipes, touches, and pinches on any object, icnluding the body
// 	Created by John Bragg for Seabright Studios
// */

var TouchyFeely = function(element,options) {
	var touchy = this;
	var TouchHooks = {
		touchstart : function(event) {
			if(event.touches.length == 1) {
				touchy.update(event,false);
				touchy.currentEvent.target = touchy.getTarget(event);
			};
		},
		touchmove : function(event) {
			if(touchy.currentEvent) {
				touchy.update(event);
				if(touchy.currentEvent.type) { TouchEvent(touchy.currentEvent.type+"move"); };
				return(false);
			};
			return(true);
		},
		touchend : function(event) {
			if(touchy.currentEvent) {
				touchy.update(event);
				if(touchy.currentEvent.type) { TouchEvent(touchy.currentEvent.type+"end"); };
			};
			touchy.cancel();
		},
		touchcancel : function(event) { touchy.cancel(); }
	};
	var TouchEvent = function(type) {
		var evObj = document.createEvent('UIEvents');
		evObj.initUIEvent(type, true, true, window, 1);
		for(var i in touchy.currentEvent) { evObj[i] = touchy.currentEvent[i]; };
		touchy.element.dispatchEvent(evObj);
		// console.log("Event: "+type,evObj);
	};
	var baseEvent = {
		history : []
	};
	touchy.element = element;
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
	touchy.hook = function(elem) { for(var i in TouchHooks) { elem.addEventListener(i, TouchHooks[i], true); }; };
	touchy.swipeLength = function() {
		return(Math.round(Math.sqrt(Math.pow(touchy.currentEvent.deltaX,2)+Math.pow(touchy.currentEvent.deltaY,2))));
	};
	touchy.calculateAngle = function() {
		var ang = Math.round((Math.atan2(touchy.currentEvent.vertDiff,touchy.currentEvent.horzDiff))*180/Math.PI); //angle in degrees
		if(ang < 0) ang = 360 - Math.abs(ang);
		return(ang);
	};
	touchy.swipeDirection = function() {
		if ( ((this.currentEvent.swipeAngle <= 45) && (this.currentEvent.swipeAngle >= 0)) || ((this.currentEvent.swipeAngle <= 360) && (this.currentEvent.swipeAngle >= 315)) ) {
			return('left');
		} else if ( (this.currentEvent.swipeAngle >= 135) && (this.currentEvent.swipeAngle <= 225) ) {
			return('right');
		} else if ( (this.currentEvent.swipeAngle > 45) && (this.currentEvent.swipeAngle < 135) ) {
			return('down');
		};
		return('up');
	};
	touchy.getType = function() {
		var cev = touchy.currentEvent;
		if(cev.swipeDirection=="left"||cev.swipeDirection=="right") return("swipe");
		else if(cev.swipeDirection=="up"||cev.swipeDirection=="down") return("scroll");
		else return(undefined);
	};
	touchy.getTarget = function(event) {
		return(event.currentTarget);
	};
	touchy.update = function(event,capture) {
		if(!touchy.currentEvent) touchy.newEvent();
		var tch = event["touches"][0] || event["changedTouches"][0], cev = touchy.currentEvent;
		cev.curX = tch.pageX;
		cev.curY = tch.pageY;
		cev.history = cev.history || [];
		cev.history.push([cev.curX,cev.curY]);
		if(!cev.fingerCount) cev.fingerCount = event["touches"].length;
		if(!cev.startX) cev.startX = cev.curX;
		if(!cev.startY) cev.startY = cev.curY;
		cev.deltaX = cev.curX - cev.startX;
		cev.deltaY = cev.curY - cev.startY;
		cev.horzDiff = cev.startX - cev.curX;
		cev.vertDiff = cev.curY - cev.startY;
		if(cev.deltaX > 0 || cev.deltaY > 0) {
			cev.swipeLength = touchy.swipeLength();
			if(cev.swipeLength >= touchy.config.minLength) {
				cev.swipeAngle = touchy.calculateAngle();
				cev.swipeDirection = touchy.swipeDirection();
				if(!cev.type) {
					cev.type = touchy.getType();
					if(cev.type) TouchEvent(cev.type+"start");
				};
			} else {
				cev.swipeAngle = undefined;
				cev.swipeDirection = undefined;
			};
		};
		if(capture && (!cev.type || touchy.config["capture"+cev.type]==true)) event.preventDefault();
		// if(cev.type) console.log(touchy.config["capture"+cev.type]+"");
	};
	touchy.newEvent = function() { delete touchy["currentEvent"]; touchy.currentEvent = touchy.clone(touchy.baseEvent); };
	touchy.cancel = function() { delete touchy["currentEvent"]; };
	touchy.currentEvent = false;
	touchy.hook(element);
	return(touchy);
};