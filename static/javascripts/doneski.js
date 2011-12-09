// var Class = function(core,mixins,init,cls,item,mixin) {
// 	cls = this;
// 	for(item in core) {
// 		cls[item] = core[item];
// 	};
// 	for(mixin in mixins) {
// 		cls = new mixins[mixin](cls);
// 	};
// 	if(cls[init] && cls[init].call) window.setTimeout(cls[init](),0);
// 	return(cls);
// };
//
var _Doneski = function() {
	var doneski = this;
	doneski.linger = 1000;
	doneski.list_name = "default";
	doneski.separator = "::";
	doneski.tag = function(id,attr,content){var tg=document.createElement(id);if(!content && typeof attr=="string"){attr=undefined;content=attr;};if(attr){for(var k in attr){tg.setAttribute(k,attr[k]);};};if(content){tg.innerHTML=content;};return(tg);};
	doneski.bind = function(f,obj) {obj=obj||doneski;return(function(){f.apply(obj,arguments);});};
	doneski.l = [];
	doneski.id = "doneski";
	var core = {
		_init: function(options) {
			doneski.lcon = (gtn=doneski.gtn)((l="list")+"s")[0];
			doneski.ln = gtn(l+"nav")[0];
			doneski.tb = (t=gtn((tb="toolbar"))[0]);
			doneski.fudge = gtn("content")[0];
			if((ls='localStorage') in (w=window) && w[ls] !== null) {
				// doneski.touch();
				// doneski.currentJournal = parseInt((w[ls][(j="journal.")+"current"] || 1),10);
				// doneski.lastSync = parseInt((w[ls][j+"lastsync"] || 0),10);
				// if(!w[ls][j+"started"]) {
				// 	doneski.do_journal = true;
				// };
				w.scrollTo(0,35);
				if(localStorage[l+"s"]) {
					var lists = w[ls][l+"s"].split(",");
					doneski.rollupQuick();
					for(var i=0;i<lists.length;i++) {
						doneski.lL(lists[i]);
					};
					var focus = w[ls]["last_"+l] ? doneski.find(w[ls]["last_"+l]) : doneski.l[0];
					if(!focus) focus = doneski.l[0];
					doneski.go(focus);
				} else {
					doneski.newList();
				};
				doneski.sFH();
			} else {
				// No local storage - hmmm...
			};
			(ael=doneski.ael)("keyup",doneski.bkp,true);
			if(typeof TouchyFeely != "undefined") {
				doneski.toucher = new TouchyFeely(document,{mL: 10, cscroll : 0});
				ael((a="swipe")+"start",doneski.swS,true);
				ael(a+"move",doneski.swM,true);
				ael(a+"end",doneski.swE,true);
				ael((a="scroll")+"start",doneski.scS,true);
				ael(a+"move",doneski.scM,true);
				ael(a+"end",doneski.scE,true);
			};
			
			(st=w.setTimeout)(function(){doneski.gtn('body')[0].className += ' loaded';},200);
			// st(function(){doneski.cachedTexture(tb,doneski.ns,{opacity:0.3,range:50},tb);},0);
			// st(function(){doneski.cachedTexture("body "+l+"s "+l,doneski.nb,{bg:{position:"20px top",repeat:"repeat-y"}},"nb");},0);
			// st(function(){doneski.cachedTexture("body header",doneski.nb,{bg:{position:"20px top",repeat:"repeat-y"}},"nb");},0);
			// w[ls][j+"started"] = 1;
			doneski.dT();
			doneski.loaded = true; //doneski.do_journal = doneski.do_sync = true;
			// doneski.needsSync = 1;
			// doneski.sync();
			w.scrollTo(0,0);
		},
		ael: function(a,b,c) {
			return(document.addEventListener(a,b,c));
		},
		gtn: function(a) {
			return(document.getElementsByTagName(a));
		},
		dT: function(d) {
			try{(d=document).createEvent("TouchEvent") && (d.body.className += " touch");}catch(e){};
		},
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
		styles: function(a) {
			if(doneski.css) return(doneski.css);
			doneski.css = (d=document).createElement("style");
			d.getElementsByTagName("head")[0].appendChild(doneski.css);
			return(doneski.css);
		},
		swS: function(event) {
			// if((g=(doneski.swT=doneski.cL)["get"+(a="Attribute")]("style")||"").indexOf((w="-webkit-transform:translate3d("))==-1) {
			// 	// doneski.swT["set"+a]("style", g+w+"0px,0px,0px);");
			// };
			doneski.swiping = true;
			//doneski.swT.orig = a;
		},
		swM: function(event) {
			// doneski.swT["set"+(a="Attribute")]("style", doneski.swT["get"+a]("style").replace(/-webkit-transform:translate3d\((-)?[0-9]{1,5}(px)?,/,"-webkit-transform:translate3d("+event.dX+"px,"));
		},
		swE: function(event) {
			// (function(a){window.setTimeout(function(){a.removeAttribute("style");},200);})(doneski.swT);
			event.direction=="left" ? doneski.goN() : doneski.goP();
			doneski.swiping = false;
		},
		scS: function(event) {
			if((a=(doneski.scT=doneski.cL).getAttribute("style")||"").indexOf((w="-webkit-transform:translate3d("))==-1) {
				doneski.scT.setAttribute("style", a+w+"0px,0px,0px);");
				doneski.scS = 0;
			} else {
				doneski.scS = parseInt(a.replace(/.*-webkit-transform:translate3d\((-)?[0-9]{1,5}(px)?,((-)?[0-9]{1,5})(px)?,.*/,"$3"),10);
			};
			doneski.scrolling = true;
		},
		scM: function(event,b) {
			b = ((e=doneski.scS + event.dY) > 0 ? 0 : e < (d=doneski.mSc()) ? d : e);
			doneski.scT.setAttribute("style", doneski.scT.getAttribute("style").replace(/-webkit-transform:translate3d\(((-)?[0-9]{1,5}(px)?),(-)?[0-9]{1,5}(px)?,/,"-webkit-transform:translate3d($1,"+b+"px,"));
		},
		scE: function(event) {
			// doneski.scT.setAttribute("style", doneski.scT.getAttribute("style").replace("-webkit-transition:none;",''));
			doneski.scrolling = false;
		},
		mSc: function() {
			return(0-doneski.scT.clientHeight+window.innerHeight);
		},
		lL: function(id,cls,a,b) {
			(a = new Doneski.List(id)).nav_item = (b = new Doneski.ListNav(a));
			a.addEventListener("killed",doneski.lK,0);
			doneski.addList(a.id);
			cls && (a.className += cls);
			doneski.lcon.appendChild(a);
			doneski.ln.appendChild(b);
			doneski.rN();
			return(a);
		},
		lK: function(ev,e,i){
			(n=(e=ev.target).nav_item).parentNode.removeChild(n);
			i=doneski.removeList(e);
			if(doneski.l.length==0) doneski.newList();
			else doneski.go(doneski.l[i ? i-1 : 0]);
		},
		removeList: function(lid,i) {
			if((i = doneski.l.indexOf(lid))>-1) doneski.l.splice(i, 1);
			return(i);
		},
		addList: function(lid) {
			doneski.l.push(window.o_register[lid] || doneski.lL(lid));
			if(doneski.l.length>1) doneski.aCN(document.body,"manylists");
		},
		rN: function() {
			ln=doneski.ln;
			if(ln.clientWidth > (doneski.tb.clientWidth*0.9)) {
				a="tight";
				for(i=4;i--;) { ln.className = ln.className.replace(a+(i-1),a+i); };
			};
		},
		newList: function(nl) {
			nl = doneski.lL(doneski.gLId(),"after");
			doneski.go(nl);
		},
		hCN: function(element, className, elementClassName) {return(element && (elementClassName = element.getAttribute("className") || element.getAttribute("class") || "").length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));},
		aCN: function(element, className,g,cls) {
			if(element && !doneski.hCN(element, className)){
				cls = (g = element.className) + (g.length ? ' ': '') + className;
				element.className = cls;
			};
		},
		rCN: function(element, className) {
			if(element) {
				cls = (element.getAttribute("className") || element.getAttribute("class") || "").replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ');
				element.setAttribute("className",cls) || element.setAttribute("class",cls);
				// element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ');
			};
		},
		find: function(id) {
			for(var i=0;i<doneski.l.length;i++) {
				if(doneski.l[i].id==id) return(doneski.l[i]);
			};
			return(undefined);
		},
		go: function(lst) {
			var aft = "";
			for(var i=0;i<doneski.l.length;i++) {
				if(doneski.l[i]!=lst) {
					doneski.l[i].deactivate(aft);
				} else {
					doneski.l[i].activate();
					aft = "after";
				};
			};
			doneski.cL = lst;
			doneski.sFH();
			localStorage["last_list"] = lst.id;
			//lst.activate();
		},
		sFH: function() {
			if((s=doneski.styles())&&s.innerHTML.indexOf("/*fudge heights*/")==-1) {
				doneski.styles().innerHTML += "\n/*fudge heights*/content,lists list{min-height:"+(window.innerHeight + 60)+"px;}";
			} else {
				doneski.styles().innerHTML.replace("\n\/\*fudge heights\*\/content,lists list\{[^\}]+\}","\n/*fudge heights*/content,lists list{min-height:"+(window.innerHeight + 60)+"px;}");
			};
		},
		goN: function() {
			var idx = doneski.l.indexOf(doneski.cL) + 1;
			if(idx>=doneski.l.length) {
				doneski.newList();
			} else {
				doneski.go(doneski.l[idx]);
			};
		},
		goP: function() {
			var idx = doneski.l.indexOf(doneski.cL) - 1;
			if(idx>=0) {
				doneski.go(doneski.l[idx]);
			};
		},
		gTId: function() {
			return("t_"+doneski.gUU());
		},
		gLId: function() {
			return("l_"+doneski.gUU());
		},
		gUU: function() {
			return("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);})+"");
		},
		// saveLists: function() {
		// 	var out = [];
		// 	for(var i=0;i<doneski.l.length;i++) {
		// 		var a = doneski.l[i];
		// 		out.push(a.id);
		// 	};
		// 	localStorage["lists"] = out;
		// },
		// store: function() {
		// 	localStorage["lists"] = [doneski.list_name,false];
		// 	var st = [];
		// 	for(var k in doneski.tasks) {
		// 		var str = [k,doneski.tasks[k]].join(doneski.separator);
		// 		if(!doneski.tasks[k]) st.push(str);
		// 	};
		// 	localStorage["lists."+doneski.list_name] = st.join(",");
		// },
		rollup: function() {
			doneski.aCN(document.body,"compact");
			window.scrollTo(0,0);
		},
		rollupQuick: function() {
			doneski.aCN(document.body,"quick");
			doneski.aCN(document.body,"compact");
			window.scrollTo(0,0);
		},
		// add: function(event) {
		// 	
		// },
		// touch: function() {
		// 	doneski.hLS() && (localStorage["lastSeen"] = new Date());
		// },
		// lastSeen: function() {
		// 	return(doneski.hLS() && localStorage["lastSeen"]);
		// },
		hLS: function() {
			return('localStorage' in window && window['localStorage'] !== null);
		},
		// ping: function() {
		// 	//console.log("Yeah yeah.", doneski);
		// },
		bkp: function(event) {
			if(event.keyCode==39) {
				doneski.goN();
			} else if(event.keyCode==37) {
				doneski.goP();
			};
		},
		// intercepts: [], //["addList"],
		// queue: [0,1,2,3,4,5,6,7,8,9],
		// currentJournal: 0,
		// newJournal: function() {
		// 	(l=localStorage)[(j="journal.")+"unsynced"]||((l=localStorage)[(j="journal.")+"unsynced"]="");
		// 	if(doneski[(c="currentJournal")]) (l=localStorage)[(j="journal.")+"unsynced"] += doneski[c] + ",";
		// 	doneski[c] = doneski[c] ? doneski[c] + 1 : 1;
		// 	l[j+"current"] = doneski[c];
		// },
		// journal: function() {
		// 	// if(doneski.do_journal) {
		// 	// 	(a = Array.prototype.slice.call(arguments)[0]).unshift(new Date().getTime()-(d=doneski.queue.shift()));
		// 	// 	doneski.queue.push(doneski.queue[doneski.queue.length-1]+1);
		// 	// 	localStorage["journal."+doneski.currentJournal] = doneski.serialize(a);
		// 	// 	doneski.newJournal();
		// 	// 	doneski.needsSync = 1;
		// 	// };
		// },
		// sync: function(unsynced,i,s) {
		// 	if(doneski.replaying) return(false);
		// 	if(doneski.do_sync && !doneski.syncing && doneski.needsSync) {
		// 		doneski.syncing=1;
		// 		doneski.syncer||(doneski.syncer = new Doneski.Synchro(doneski));
		// 		if(doneski.syncer.online()) {
		// 			s = [];
		// 			(unsynced = (l=localStorage)[(j="journal.")+"unsynced"].split(","));
		// 			for(i in unsynced) {
		// 				if(l[j+i]) s.push([parseInt(i,10),JSON.parse(l[j+i])]);
		// 			};
		// 			doneski.upload(doneski.serialize({lastsync:doneski.lastSync,account:"test",device:"test",data:s}));
		// 		};
		// 		doneski.syncing=0;
		// 	};
		// 	return(true);
		// },
		// upload: function(str,x) {
		// 	try {
		// 		x=new XMLHttpRequest();
		// 		x.open('POST', '/sync', 1);
		// 		x.onreadystatechange = doneski.upback;
		// 		x.send(str);
		// 	} catch(e) {
		// 		return(0);
		// 	};
		// 	return(1);
		// },
		// upback: function(resp,reply,synced) {
		// 	if(resp.target.readyState==4) {
		// 		reply = eval("(" + resp.target.responseText + ")");
		// 		for(i in (synced=reply.synced)) {
		// 			(l=localStorage)[(j="journal.")+"unsynced"].replace(new RegExp("^"+(n=synced[i])+"\,|\,"+n+"\,"),',');
		// 			l.removeItem(j+n);
		// 		};
		// 		doneski.replay(reply.replay);
		// 		doneski.justsynced();
		// 	};
		// },
		// justsynced: function() {
		// 	doneski.lastSync = new Date().getTime();
		// 	l["journal.lastsync"] = doneski.lastSync;
		// 	doneski.needsSync = 0;
		// },
		// replay: function(jnl) {
		// 	doneski.replaying = 1;
		// 	for(i=0;i<jnl.length;i++) {
		// 		var itm = eval("(" + jnl[i] + ")");
		// 		// [timestamp,id,function_name,args]
		// 		var obj = window.o_register[itm[1]];
		// 		obj.replaying = 1;
		// 		if(obj && obj[itm[2]]) obj[itm[2]].apply(obj,itm[3]);
		// 		obj.replaying = 0;
		// 		console.log(itm,obj);
		// 	};
		// 	doneski.replaying = 0;
		// 	return(true);
		// },
		serialize: function(obj) {
			return(JSON.stringify(obj));
		}
	};
	for(var i in core) {
		doneski[i] = core[i];
	};
	return(new _Journaller(doneski));
	// return(new Syncer(new _Journaller(doneski)));
};

// TODO: rework online detection to go only very infrequently except when accessed - ex: ping every few minutes, but ping if used after 60 seconds
// _Doneski.prototype.Synchro = function(obj,opts,synchro,sync,perform) {
// 	synchro = this;
// 	var core = {
// 		intervals: [30000,90000,360000],
// 		retries: 4,
// 		offs: 0,
// 		speed: -1,
// 		_init: function(o) {
// 			// synchro.ping();
// 			// synchro.setSpeed(0);
// 		},
// 		online: function() {
// 			synchro.onLine = 0;
// 			try {
// 				var x=new XMLHttpRequest();
// 				x.open('HEAD', '/ping', 0);
// 				x.send();
// 				synchro.onLine = 1;
// 				synchro.offs = 0;
// 				synchro.setSpeed(0);
// 			} catch(e) {
// 				synchro.onLine = 0;
// 				synchro.offs++;
// 				if(synchro.offs>synchro.retries) synchro.setSpeed(parseInt(synchro.offs/synchro.retries,10));
// 			};
// 			return(synchro.onLine);
// 		},
// 		setSpeed: function(speed) {
// 			if(speed!=synchro.speed && synchro.intervals[speed]) {
// 				if(synchro.timer) window.clearInterval(synchro.timer);
// 				synchro.timer = window.setInterval(synchro.ping,synchro.intervals[speed]);
// 				synchro.speed = speed;
// 			};
// 		},
// 		ping: function() {
// 			if(synchro.online()) {
// 				
// 			};
// 		}
// 	};
// 	for(var i in core) synchro[i] = core[i];
// 	synchro._init(opts);
// 	return(synchro);
// };
// 
_Doneski.prototype.List = function(id,title,tasks,itms) {
	var tag = Doneski.tag;
	var list = tag("list");
	list.name_input = tag("input",{ "type":"text", "name":"title", "placeholder":"Name this list", "class":"delayed"});
	list.appendChild(list.name_input);
	list.form = tag("form",{"action":"/task","method":"post","class":"tasklist"});
	list.appendChild(list.form);
	list.task_input = tag("input",{"type":"text", "class":"task", "placeholder":"Add your first to-do"});
	list.form.appendChild(list.task_input);
	// list.form.appendChild(tag("button",{"class":"add"},"+"));
	list.form.appendChild(tag("input",{"type":"submit", "value":"Add", "style":"display:none;"}));
	list.task_container = tag("tasks",{"class":"active"});
	list.appendChild(list.task_container);
	list.completed_container = tag("tasks",{"class":"completed"});
	list.appendChild(list.completed_container);
	
	var core = {
		name: function(name) {
			if(!name.length) return;
			localStorage["lists."+list.id+".name"] = name;
			list.nm = name;
			list.name_input.value = name;
			list.convertNameBox();
			list.task_input.focus();
			list.updated("name");
		},
		convertNameBox: function(nm) {
			if(list.converted) return;
			list.nm_e = document.createElement("name");
			list.nm_e.innerHTML = "<span>" + list.nm + "</span>";
			list.nm_e.addEventListener("click",list.name_click,0);
			list.replaceChild(list.nm_e, list.name_input);
			list.converted = 1;
			return;
		},
		rename: function(nm) {
			if(!list.converted) return;
			list.replaceChild(list.name_input, list.nm_e);
			list.name_input.focus();
			list.name_input.select();
			list.converted = 0;
			return;
		},
		kill: function(i,t,cur) {
			for(i in list.tasks) {
				if((t=list.tasks[i]) && t.kill) t.kill();
			};
			localStorage.removeItem("lists."+list.id);
			localStorage.removeItem("lists."+list.id+".name");
			cur = localStorage["lists"] ? localStorage["lists"].split(",") : [];
			if((i = cur.indexOf(list.id))>-1) cur.splice(i, 1);
			localStorage["lists"] = cur;
			list.parentNode.removeChild(list);
			list.updated("killed");
		},
		name_click: function(ev,e,m) {
			e=list.nm_e;
			m=e.menu||(e.menu=list.newMenu());
			if(!e.popped) {
				e.style.webkitTransition = 'background-color 2s linear;';
				Doneski.aCN(e,"popped");
				m.setAttribute("style",'height:0;');
				setTimeout(function(){m.style.height = "70px";},0);
				e.popped = true;
			} else {
				Doneski.rCN(e,"popped");
				m.setAttribute("style",'height:0;');
				setTimeout(function(){m.style.display = "none";},300);
				e.popped = false;
			};
			ev.preventDefault();
			return(false);
		},
		newMenu: function(m,it,r,d) {
			m = document.createElement("menu");
			// m.innerHTML = list.nm_e.innerHTML;
			m.appendChild((it=document.createElement("items")));
			it.appendChild((r=document.createElement("item")));
			r.addEventListener("click",list.rename,1);
			r.className = "rename";
			r.innerHTML = "Rename";
			it.appendChild((d=document.createElement("item")));
			d.addEventListener("click",list.kill,1);
			d.className = "delete";
			d.innerHTML = "Delete";
			m.style.display = 'none';
			list.nm_e.appendChild(m);
			return(m);
		},
		nameB: function(event) {
			list.name(event.target.value);
		},
		nameK: function(event) {
			if(event.keyCode==13) {
				list.name(event.target.value);
			};
		},
		formHandler: function(event) {
			event.preventDefault();
			Doneski.rollup();
			list.push(list.task_input.value);
			list.task_input.value = "";
			return(false);
		},
		tasks: [],
		push: function(obj) {
			(!(l=localStorage["lists"]) || l.split(",").indexOf(list.id)==-1) && list.create(list.id);
			var tid = Doneski.gTId();
			list.addTask(tid);
			var tsk = new Doneski.Task(list,obj,tid);
			list.tasks.push(tsk);
			list.task_container.insertBefore(tsk,list.task_container.firstChild);
			tsk.addEventListener("kill",list.deathWatch,true);
			tsk.addEventListener("update",function(e){/*console.log("update",e.target);*/},true);
		},
		addTask: function(id) {
			(a=list.items.indexOf(id))==-1 && list.items.push(id) && list.updated("add");
		},
		updated: function(type,evObj) {
			if(Doneski.loaded) list.save();
			list.task_input.setAttribute("placeholder",list.items.length?"Add another one":"Add your first to-do");
			Doneski.sFH();
			(evObj = document["create"+(e="Event")]('UI'+e+'s'))["initUI"+e](type || "update", true, true, window, 1);
			evObj.l_id = list.id;
			list["dispatch"+e](evObj);
			if(list.items.length>1) Doneski.aCN(document.body,"manyitems");
		},
		loadTask: function(id) {
			var tsk = new Doneski.Task(list,false,id);
			if(tsk.completed) list.completed_container.insertBefore(tsk,list.completed_container.firstChild);
			else list.task_container.insertBefore(tsk,list.task_container.firstChild);
			list.items.push(tsk.id);
			list.task_input.setAttribute("placeholder","Add another one");
			if(list.items.length>1) Doneski.aCN(document.body,"manyitems");
		},
		create: function(id) {
			var cur = localStorage["lists"] ? localStorage["lists"].split(",") : [];
			cur.push(id);
			localStorage["lists"] = cur;
		},
		save: function() {
			(!(l=localStorage["lists"]) || l.split(",").indexOf(list.id)==-1) && list.create(list.id);
			localStorage["lists."+list.id] = list.items.join(",");
		},
		deathWatch: function(event) {
			list.removeTask(event.t_id);
		},
		removeTask: function(id) {
			(a=list.items.indexOf(id))>-1 && list.items.splice(list.items.indexOf(id), 1);
			list.updated("remove");
		},
		focus: function() {
			list.task_input.focus();
		},
		activate: function() {
			list.className = "active";
			list.nav_item.className = "active";
			if(list.old_style) list.setAttribute("style",list.old_style);
		},
		deactivate: function(cls) {
			list.className = cls || "";
			list.nav_item.className = "";
			list.old_style = list.getAttribute("style");
			list.removeAttribute("style");
		}
	};
	for(var i in core) {
		list[i] = core[i];
	};
	list.form.list = list;
	list.form.addEventListener("submit",list.formHandler,true);
	
	list.name_input.addEventListener("blur",list.nameB,true);
	list.name_input.addEventListener("keypress",list.nameK,true);
	
	list.id = id;
	list.title = title || "";
	list.items = [];
	
	if(localStorage["lists."+list.id+".name"]) {
		list.name(localStorage["lists."+list.id+".name"]);
	};
	if(localStorage["lists."+list.id] && (itms = localStorage["lists."+list.id].split(","))) {
		for(i=0;i<itms.length;i++) {
			list.loadTask(itms[i]);
		};
	};
	list.intercepts = []; //["addTask","removeTask","name"];
	// list.sync_intercepts = list.intercepts;
	list.journal = Doneski.journal;
	list.sync = Doneski.sync;
	
	// list = new Syncer(list);
	list = new _Journaller(list);
	return(list);
};

_Doneski.prototype.ListNav = function(list) {
	var tag = Doneski.tag;
	var nav = tag("list",{"class":"hidden"});
	nav.list = list;
	// var core = {
	// };
	// for(var i in core) {
	// 	nav[i] = core[i];
	// };
	nav.addEventListener("click",function(){Doneski.go(nav.list);},true);
	return(nav);
};

_Doneski.prototype.Task = function(list,obj,id) {
	
	var task = Doneski.tag("task",{});
	task.list = list;

	var txt, val;
	if(id && localStorage["tasks."+id]) {
		var s = localStorage["tasks."+id].split(Doneski.separator); txt = s[0]; val = s[1]=="true";
	} else {
		if(typeof obj=="string") {
			txt = obj;
			val = false;
		} else {
			txt = obj[0];
			val = obj[1]=="true";
		};
	};

	task.id = id || Doneski.gTId();
	
	var core = {
		taskClick: function(event) {
			if(!task.nocancel && !Doneski.swiping && !Doneski.scrolling && !task.moving) {
				task.className += " clicky";
				event.stopPropagation();
				event.preventDefault();
				if(task.completed) setTimeout(function(){task.uncomplete();},1000);
				else setTimeout(function(){task.complete();},1000);
				// if(task.completed) task.uncomplete();
				// else task.complete();
			};
			task.nocancel = false;
			return(false);
		},
		taskMove: function(event) {
			task.nocancel = true;
		},
		save: function() {
			if(task.killed) {
				localStorage.removeItem("tasks."+task.id);
				task.list.removeTask(task.id);
				task.parentNode.removeChild(task);
			} else {
				localStorage["tasks."+task.id] = [task.innerHTML.replace(/<\/?delete>/g,''),task.completed].join(Doneski.separator);
			};
			return(1);
		},
		clone: function(o) {
			o = Doneski.tag("task",{});
			o.className = task.className;
			o.innerHTML = task.innerHTML;
			return(o);
		},
		moveTo: function(container,curtop) {
			if(task.moving) return(false);
			task.moving = true;
			curtop = task.offsetTop;
			task.className = task.completed ? "moving" : "active moving";
			task.srcclone = task.clone();
			task.dstclone = task.clone();
			task.parentNode.replaceChild(task.srcclone,task);
			task.style.position = "absolute";
			task.style.top = 0;
			task.style.webkitTransform = "translate3d(0,"+curtop+"px,0)";
			task.style.zIndex = "9999";
			task.list.appendChild(task);
			container.appendChild(task.dstclone);
			task.dest = container;
			task.style.webkitTransition = "-webkit-transform .3s ease-in";
			task.style.webkitTransform = "translate3d(0,"+task.dstclone.offsetTop+"px,0)";
			setTimeout(task.animDone,300);
			return(true);
		},
		complete: function() {
			task.className += " moving";
			task.completed = true;
			task.moveTo(task.list.completed_container);
			task.updated("complete");
		},
		animDone: function(ev) {
			if(!task.dest) return;
			dst = task.dest;
			task.dest = undefined;
			task.srcclone.style.display = "none";
			task.dstclone.style.display = "none";
			task.srcclone.parentNode.removeChild(task.srcclone);
			task.dstclone.parentNode.removeChild(task.dstclone);
			// task.dstclone = task.srcclone = undefined;
			task.style.webkitTransition = "";
			task.setAttribute("style","");
			task.className = task.completed ? "" : "active";
			dst.appendChild(task);
			task.moving = false;
		},
		uncomplete: function() {
			task.className += " moving";
			task.completed = false;
			task.moveTo(task.list.task_container);
			task.updated("uncomplete");
		},
		kill: function(ev) {
			(task.killed=1) && task.save() && task.updated("kill");
			ev.stopPropagation();
			ev.preventDefault();
		},
		updated: function(type,evObj) {
			if(Doneski.loaded) task.save();
			Doneski.sFH();
			(evObj = document.createEvent('UIEvents')).initUIEvent(type || "update", true, true, window, 1);
			evObj.t_id = task.id;
			task.dispatchEvent(evObj);
		},
		setText: function(txt) {
			task.innerHTML = txt;
		}
	};
	for(var i in core) {
		task[i] = core[i];
	};
	
	task.addEventListener("click",task.taskClick,false);
	task.addEventListener("touchmove",task.taskMove,true);
	task.addEventListener("touchend",task.taskClick,true);
	
	task.completed = val;

	if(!task.completed) {
		task.className = "active";
	};
	
	task.intercepts = []; //["complete","uncomplete","kill","setText","create"];
	task.sync_intercepts = task.intercepts;
	task.journal = Doneski.journal;
	task.sync = Doneski.sync;

	// task = new Syncer(task);
	task = new _Journaller(task);

	task.setText(txt);
	task.del = task.querySelector("delete");
	if(!task.del) {
		del = Doneski.tag("delete",{});
		task.appendChild(del);
		del.addEventListener("click",task.kill,true);
	};
	task.save();
	
	return(task);
};

var _Journaller = function(obj,intercept,perform,journal,serialize,i,g,j) {
	if(obj.intercepts) {
		serialize = function(obj) {
			return(JSON.stringify(obj));
		};
		journal = function() {
			if(obj.journal && !!obj.journal.call) {
				obj.journal(Array.prototype.slice.call(arguments));
			} else {
				// console.log("Journal: "+serialize(Array.prototype.slice.call(arguments)));
			};
		};
		perform = function(name,args) {
			if(!obj.replaying) {
				args = Array.prototype.slice.call(args);
				journal(obj.id,name,args);
			};
			return(methods[name].apply(obj,args));
		};
		var methods = [];
		for(i=0;i<obj.intercepts.length;i++) {
			methods[(m=obj.intercepts[i])] = obj[m];
			(function(obj,method) {
				if(method) {
					obj[method] = function(){perform.apply(obj,[method,arguments]);};
				};
			})(obj,m);
		};
	};
	window.o_register || (window.o_register = {});
	window.o_register[obj.id] = obj;
	return(obj);
};

// var Syncer = function(obj,sync,perform,methods) {
// 	if(obj.sync_intercepts) {
// 		sync = function() {
// 			if(obj.sync && !!obj.sync.call) {
// 				obj.sync(Array.prototype.slice.call(arguments));
// 			};
// 		};
// 		perform = function(name,args) {
// 			sync(obj.id,name,(args = Array.prototype.slice.call(args)));
// 			return(methods[name].apply(obj,args));
// 		};
// 		methods = [];
// 		for(i=0;i<obj.sync_intercepts.length;i++) {
// 			methods[(m=obj.sync_intercepts[i])] = obj[m];
// 			(function(obj,method) {
// 				if(method) {
// 					obj[method] = function(){perform.apply(obj,[method,arguments]);};
// 				};
// 			})(obj,m);
// 		};
// 	};
// 	return(obj);
// };

window.Doneski = new _Doneski();
// window.applicationCache.addEventListener("cached",function(){console.log("cached");},true);
// window.applicationCache.addEventListener("noupdate",function(){console.log("cache up to date");},true);
window.applicationCache.addEventListener("updateready",function(){/*console.log("got updated stuff");*/window.applicationCache.swapCache();/*console.log("swapped");*/},true);
window.setTimeout("Doneski._init();",0);