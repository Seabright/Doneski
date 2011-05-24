// /*
//  TouchyFeely
// 	Swipe controller library - handles swipes, touches, and pinches on any object, icnluding the body
// 	Created by John Bragg for Seabright Studios
// */

var TouchyFeely = function(element,options) {
	var touchy = this;
	var TouchHooks = {
		start : function(event) {
			(event.touches.length == 1)&&touchy.u(event,true);
			touchy.b.s = event;
		},
		move : function(event) {
			if(touchy.b) {
				touchy.u(event);
				touchy.b.type&&TouchEvent(touchy.b.type+"move");
				return(false);
			};
			return(true);
		},
		end : function(event) {
			if(touchy.b) {
				touchy.u(event);
				touchy.b.type&&TouchEvent(touchy.b.type+"end");
			};
			touchy.z();
		},
		cancel : function(event) { touchy.z(); }
	};
	var TouchEvent = function(type) {
		(evObj = document.createEvent('UIEvents')).initUIEvent(type, true, true, window, 1);
		for(i in touchy.b) { evObj[i] = touchy.b[i]; };
		touchy.e.dispatchEvent(evObj);
	};
	touchy.e = element;
	touchy.c = {
		mL : 20,
		cscroll : true,
		cswipe : true
	};
	for(o in (options||{})) {
		touchy.c[o] = options[o];
	};
	touchy.h = function(elem) { for(i in TouchHooks) { elem.addEventListener("touch"+i, TouchHooks[i], true); }; };
	touchy.l = function() {
		return(Math.round(Math.sqrt(Math.pow(touchy.b.dX,2)+Math.pow(touchy.b.dY,2))));
	};
	touchy.a = function() {
		var ang = Math.round((Math.atan2(touchy.b.vD,touchy.b.hD))*180/Math.PI); //angle in degrees
		return(ang||(360 - Math.abs(ang)));
	};
	touchy.d = function() {
		if ( (((b=touchy.b.angle) <= 45) && (b >= 0)) || ((b <= 360) && (b >= 315)) ) return('left');
		else if ( (b >= 135) && (b <= 225) ) return('right');
		else if ( (b > 45) && (b < 135) ) return('down');
		return('up');
	};
	touchy.t = function() {
		var v = touchy.b;
		if(v.direction in {left:0,right:0}) return("swipe");
		if(v.direction in {up:0,down:0}) return("scroll");
		return(undefined);
	};
	touchy.u = function(event) {
		var o="ouches", tch = event["t"+o][0] || event["changedT"+o][0], v = touchy.b || touchy.n();
		v.cX = tch.pageX;
		v.cY = tch.pageY;
		v.h = v.h || [];
		v.h.push([v.cX,v.cY]);
		v.fC||(v.fC = event["t"+o].length);
		v.sX||(v.sX = v.cX);
		v.sY||(v.sY = v.cY);
		v.dX = v.cX - v.sX;
		v.dY = v.cY - v.sY;
		v.hD = v.sX - v.cX;
		v.vD = v.cY - v.sY;
		if(v.dX||v.dY) {
			if((v.length = touchy.l()) >= touchy.c.mL) {
				v.angle = touchy.a();
				v.direction = touchy.d();
				if(!v.type&&(v.type = touchy.t())) {
					TouchEvent(v.type+"start");
				};
			} else {
				v.angle = undefined;
				v.direction = undefined;
			};
		};
		event.preventDefault();
	};
	touchy.n = function() { delete touchy["b"]; touchy.b = {h : []}; return(touchy.b); };
	touchy.z = function() { delete touchy["b"]; };
	touchy.b = false;
	touchy.Event = touchy.b;
	touchy.h(element);
	return(touchy);
};