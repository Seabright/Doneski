// /*
//  TouchyFeely
// 	Swipe controller library - handles swipes, touches, and pinches on any object, icnluding the body
// 	Created by John Bragg for Seabright Studios
// */

var TouchyFeely = function(element) {
	var touchy = this;
	var TouchHooks = {
		"touchstart" : function(event) {
			touchy.currentEvent.target = touchy.getTarget(event);
			event.preventDefault();
			touchy.currentEvent.fingerCount = event.touches.length;
			if(touchy.currentEvent.fingerCount == 1) {
				touchy.currentEvent.startX = event.touches[0].pageX;
				touchy.currentEvent.startY = event.touches[0].pageY;
			} else {
				touchy.touchCancel(event);
			};
		},
		"touchmove" : function(event) {
			event.preventDefault();
			if(event.touches.length == 1) {
				touchy.currentEvent.curX = event.touches[0].pageX;
				touchy.currentEvent.curY = event.touches[0].pageY;
				touchy.currentEvent.swipeLength = touchy.swipeLength();
				touchy.currentEvent.swipeAngle = touchy.calculateAngle();
				touchy.currentEvent.swipeDirection = touchy.swipeDirection();
				if(touchy.currentEvent.target) TouchEvent("swipemove");
			} else {
				touchy.touchCancel(event);
			};
		},
		"touchend" : function(event) {
			if(touchy.swipeLength()>0) event.preventDefault();
			// check to see if more than one finger was used and that there is an ending coordinate
			if(touchy.currentEvent.fingerCount == 1 && touchy.currentEvent.curX != 0) {
				touchy.currentEvent.swipeLength = touchy.swipeLength();
				if(touchy.currentEvent.swipeLength >= touchy.config.minLength) {
					touchy.currentEvent.swipeAngle = touchy.calculateAngle();
					touchy.currentEvent.swipeDirection = touchy.swipeDirection();
				} else {
					touchy.currentEvent.swipeAngle = null;
					touchy.currentEvent.swipeDirection = null;
				};
				TouchEvent(swipe);
				touchy.touchCancel(event); // reset the variables
			} else {
				touchy.touchCancel(event);
			};
		},
		"touchcancel" : function(event) {
			touchy.currentEvent = touchy.clone(touchy.baseEvent);
		}
	};

	touchy.swipemove = function(event) {
		
	};

	touchy.scrollmove = function(event) {
		
	};

	var TouchEvent = function(type) {
		var evObj = document.createEvent('UIEvents');
		evObj.initUIEvent('type', true, true, window, 1);
		for(var i in touchy.currentEvent) { evObj[i] = touchy.currentEvent[i]; };
		touchy.element.dispatchEvent(evObj);
	};
	var baseEvent = {
		target : null,
		fingerCount : 0,
		startX : 0,
		startY : 0,
		curX : 0,
		curY : 0,
		deltaX : 0,
		deltaY : 0,
		horzDiff : 0,
		vertDiff : 0,
		swipeLength : 0,
		swipeAngle : null,
		swipeDirection : null,
		type : undefined
	};
	touchy.element = element;
	touchy.config = {
		minLength : 20
	};
	touchy.clone = function(obj) {
	  var newObj = (obj instanceof Array) ? [] : {};
	  for (i in obj) {
	    if (i == 'clone') continue;
	    if (obj[i] && typeof obj[i] == "object") {
	      newObj[i] = touchy.clone(obj[i]);
	    } else newObj[i] = obj[i];
	  }; return newObj;
	};
	touchy.hook = function(elem) { for(var i in TouchHooks) { elem.addEventListener(i, TouchHooks[i], true); }; };
	touchy.swipeLength = function() {
		touchy.currentEvent.deltaX = touchy.currentEvent.curX - touchy.currentEvent.startX;
		touchy.currentEvent.deltaY = touchy.currentEvent.curY - touchy.currentEvent.startY;
		return(Math.round(Math.sqrt(Math.pow(touchy.currentEvent.deltaX,2)+Math.pow(touchy.currentEvent.deltaY,2))));
	};
	touchy.calculateAngle = function() {
		touchy.currentEvent.horzDiff = touchy.currentEvent.startX-touchy.current.curX;
		touchy.currentEvent.vertDiff = touchy.currentEvent.curY-touchy.current.startY;
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
	touchy.currentEvent = touchy.clone(touchy.baseEvent);
	touchy.hook(element);
	return(touchy);
};