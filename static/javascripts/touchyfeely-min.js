var TouchyFeely=function(g,h){var a=this,j={start:function(c){c.touches.length==1&&a.update(c,!1)},move:function(c){if(a.cE)return a.update(c),a.cE.type&&f(a.cE.type+"move"),!1;return!0},end:function(c){a.cE&&(a.update(c),a.cE.type&&f(a.cE.type+"end"));a.cancel()},cancel:function(){a.cancel()}},f=function(c){var d=document.createEvent("UIEvents");d.initUIEvent(c,!0,!0,window,1);for(var e in a.cE)d[e]=a.cE[e];a.el.dispatchEvent(d)};a.el=g;a.config={minLength:20,capturescroll:!0,captureswipe:!0};for(var k in h||
{})a.config[k]=h[k];a.clone=function(c){var d=c instanceof Array?[]:{};for(i in c)d[i]=c[i]&&typeof c[i]=="object"?a.clone(c[i]):c[i];return d};a.hook=function(a){for(var d in j)a.addEventListener("touch"+d,j[d],!0)};a.length=function(){return Math.round(Math.sqrt(Math.pow(a.cE.dX,2)+Math.pow(a.cE.dY,2)))};a.ang=function(){var c=Math.round(Math.atan2(a.cE.vD,a.cE.hD)*180/Math.PI);c<0&&(c=360-Math.abs(c));return c};a.dir=function(){if(a.cE.angle<=45&&a.cE.angle>=0||a.cE.angle<=360&&a.cE.angle>=315)return"left";
else if(a.cE.angle>=135&&a.cE.angle<=225)return"right";else if(a.cE.angle>45&&a.cE.angle<135)return"down";return"up"};a.type=function(){var c=a.cE;if(c.direction=="left"||c.direction=="right")return"swipe";else if(c.direction=="up"||c.direction=="down")return"scroll"};a.trg=function(a){return a.currentTarget};a.update=function(c,d){var e=c.touches[0]||c.changedTouches[0],b=a.cE||a.nE();b.cX=e.pageX;b.cY=e.pageY;b.h=b.h||[];b.h.push([b.cX,b.cY]);if(!b.fC)b.fC=c.touches.length;if(!b.sX)b.sX=b.cX;if(!b.sY)b.sY=
b.cY;b.dX=b.cX-b.sX;b.dY=b.cY-b.sY;b.hD=b.sX-b.cX;b.vD=b.cY-b.sY;if(b.dX>0||b.dY>0)if(b.length=a.length(),b.length>=a.config.minLength){if(b.angle=a.ang(),b.direction=a.dir(),!b.type)b.type=a.type(),b.type&&f(b.type+"start")}else b.angle=void 0,b.direction=void 0;d&&(!b.type||a.config["capture"+b.type]==!0)&&c.preventDefault()};a.nE=function(){delete a.cE;a.cE=a.clone(a.bE);return a.cE};a.cancel=function(){delete a.cE};a.cE=!1;a.currentEvent=a.cE;a.hook(g);return a};