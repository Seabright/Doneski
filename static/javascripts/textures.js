// st(function(){doneski.cachedTexture(tb,doneski.ns,{opacity:0.3,range:50},tb);},0);
// st(function(){doneski.cachedTexture("body "+l+"s "+l,doneski.nb,{bg:{position:"20px top",repeat:"repeat-y"}},"nb");},0);
// st(function(){doneski.cachedTexture("body header",doneski.nb,{bg:{position:"20px top",repeat:"repeat-y"}},"nb");},0);
ns: function(options,opts,canvas,ctx) {
	opts = {
		opacity: 0.2,
		range: 100
	};
	if(options) {for(var i in options) opts[i]=options[i];};
	if(!!!(d=document)[(ce="createElement")]('canvas').getContext) { return false; }
	ctx = (canvas = d[ce]("canvas")).getContext('2d');
	canvas.width = opts.width || 960;
	canvas.height = opts.height || 30;
	for(var x=0;x<canvas.width;x++) {
		for(var y=0;y<canvas.height;y++) {
			var number = Math.floor(Math.random()*opts.range);
			ctx.fillStyle = "rgba("+number+","+number+","+number+","+opts.opacity+")";
			ctx.fillRect(x, y, 1, 1);
		};
	};
	return("url("+canvas.toDataURL("image/png")+")");
},
nb: function(selector,strg,offset,d,canvas,ctx) {
	if(!!!(d=document)[(ce="createElement")]('canvas').getContext) { return false; }
	ctx = (canvas = d[ce]("canvas")).getContext('2d');
	canvas.width = 4;
	canvas.height = 1;
	ctx.fillStyle = "rgba(236,0,140,.2)";
	ctx.fillRect(0, 0, 1, 1);
	ctx.fillRect(3, 0, 1, 1);
	return("url("+canvas.toDataURL("image/png")+")");
},
cachedTexture: function(selector,func,options,id,opts,strg,i) {
	id&&(w=window)[(ls="localStorage")][(id="tx."+id)]&&(strg = w[ls][id]);
	opts = {
		bg: {
			repeat: "no-repeat",
			position: "left top"
		}
	};
	if(options) {for(i in options) opts[i]=options[i];};
	if(!strg) {
		strg = func(options);
		w[ls][id] = strg;
	};
	(st=doneski.styles()).innerHTML += selector+"{"+(b="background-")+"image:"+strg+";";
	for(i in (bg=opts.bg)) {
		st.innerHTML += b+i+":"+bg[i]+";";
	};
	st.innerHTML += "}\n";
	return(true);
},