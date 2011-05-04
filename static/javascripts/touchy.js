// /*
//  TouchyFeely
// 	Swipe controller library - handles swipes, touches, and pinches on any object, icnluding the body
// 	Created by John Bragg for Seabright Studios
// */

var _TouchyFeely = function() {
	var touchy = this;
	this.defaultEvent = {
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
		swipeDirection : null
	};
	this.clone = function(obj) {
	  var newObj = (obj instanceof Array) ? [] : {};
	  for (i in obj) {
	    if (i == 'clone') continue;
	    if (obj[i] && typeof obj[i] == "object") {
	      newObj[i] = touchy.clone(obj[i]);
	    } else newObj[i] = obj[i];
	  }; return newObj;
	};
	this.current = this.clone(this.defaultEvent);
	this.config = {
		minLength : 20
	};
	this.bhookSwipe = function(elem,cb,options) {
		elem.addEventListener("touchstart", touchy.touchStart, false);
		elem.addEventListener("touchmove", touchy.touchMove, false);
		elem.addEventListener("touchend", touchy.touchEnd, false);
		elem.addEventListener("touchcancel", touchy.touchCancel, false);
	};
	this.touchStart = function(event) {
		touchy.current.target = event.currentTarget;
		// disable the standard ability to select the touched object
		event.preventDefault();
		// get the total number of fingers touching the screen
		touchy.current.fingerCount = event.touches.length;
		// since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
		// check that only one finger was used
		if(touchy.current.fingerCount == 1) {
			// get the coordinates of the touch
			touchy.current.startX = event.touches[0].pageX;
			touchy.current.startY = event.touches[0].pageY;
		} else {
			// more than one finger touched so cancel
			touchy.touchCancel(event);
		};
	};
	this.touchMove = function(event) {
		event.preventDefault();
		if(event.touches.length == 1) {
			touchy.current.curX = event.touches[0].pageX;
			touchy.current.curY = event.touches[0].pageY;
			touchy.current.swipeLength = touchy.swipeLength();
			touchy.current.swipeAngle = touchy.calculateAngle();
			touchy.current.swipeDirection = touchy.swipeDirection();
			if(touchy.current.target) {
				var evObj = document.createEvent('UIEvents');
				evObj.initUIEvent( 'swipemove', true, true, window, 1);
				evObj.swipeEvent = touchy.current;
				touchy.current.target.dispatchEvent(evObj);
			};
		} else {
			touchy.touchCancel(event);
		};
	};
	this.touchEnd = function(event) {
		if(touchy.swipeLength()>0) event.preventDefault();
		// check to see if more than one finger was used and that there is an ending coordinate
		if(touchy.current.fingerCount == 1 && touchy.current.curX != 0) {
			// use the Distance Formula to determine the length of the swipe
			touchy.current.swipeLength = touchy.swipeLength();
			// if the user swiped more than the minimum length, perform the appropriate action
			if(touchy.current.swipeLength >= touchy.config.minLength) {
				touchy.current.swipeAngle = touchy.calculateAngle();
				touchy.current.swipeDirection = touchy.swipeDirection();
			} else {
				touchy.current.swipeAngle = null;
				touchy.current.swipeDirection = null;
			};
			var evObj = document.createEvent('UIEvents');
			evObj.initUIEvent( 'swipe', true, true, window, 1);
			evObj.swipeEvent = touchy.current;
			touchy.current.target.dispatchEvent(evObj);
			touchy.touchCancel(event); // reset the variables
		} else {
			touchy.touchCancel(event);
		};
	};
	this.touchCancel = function() {
		touchy.current = touchy.clone(touchy.defaultEvent);
	};
	this.swipeLength = function() {
		return(Math.round(Math.sqrt(Math.pow(touchy.current.curX - touchy.current.startX,2) + Math.pow(touchy.current.curY - touchy.current.startY,2))));
	};
	this.calculateAngle = function() {
		touchy.current.horzDiff = touchy.current.startX-touchy.current.curX;
		touchy.current.vertDiff = touchy.current.curY-touchy.current.startY;
		var ang = Math.round((Math.atan2(touchy.current.vertDiff,touchy.current.horzDiff))*180/Math.PI); //angle in degrees
		if(ang < 0) ang = 360 - Math.abs(ang);
		return(ang);
	};
	this.swipeDirection = function() {
		if ( ((this.current.swipeAngle <= 45) && (this.current.swipeAngle >= 0)) || ((this.current.swipeAngle <= 360) && (this.current.swipeAngle >= 315)) ) {
			return('left');
		} else if ( (this.current.swipeAngle >= 135) && (this.current.swipeAngle <= 225) ) {
			return('right');
		} else if ( (this.current.swipeAngle > 45) && (this.current.swipeAngle < 135) ) {
			return('down');
		};
		return('up');
	};
	this.bhookGesture = function(elem,cb,options) {
		elem.addEventListener("gesturemove", touchy.gestureMove, false);
		elem.addEventListener("gestureend", touchy.gestureEnd, false);
	};
	this.gestureMove = function(event) {
		event.preventDefault();
		var evObj = document.createEvent('UIEvents');
		evObj.initUIEvent( 'gesturemove', true, true, window, 1);
		evObj.gestureEvent = event;
		event.currentTarget.dispatchEvent(evObj);
		touchy.touchCancel(event); // reset the variables
	};
	this.gestureEnd = function(event) {
		event.preventDefault();
		var evObj = document.createEvent('UIEvents');
		evObj.initUIEvent( 'gesture', true, true, window, 1);
		evObj.gestureEvent = event;
		event.currentTarget.dispatchEvent(evObj);
		touchy.touchCancel(event); // reset the variables
	};
	return(touchy);
};

var TouchyFeely = new _TouchyFeely();

TouchyFeely.touchify = function(obj,cb,options) {
	TouchyFeely.bhookSwipe.apply(TouchyFeely,[obj,cb,options]);
	//TouchyFeely.bhookGesture.apply(TouchyFeely,[obj,cb,options]);
};