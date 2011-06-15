var _Doneski = function() {
	var doneski = this;
	doneski.linger = 1000;
	doneski.list_name = "default";
	doneski.separator = "::";
	doneski.tag = function(id,attr,content){var tg=document.createElement(id);if(!content && typeof attr=="string"){attr=undefined;content=attr;};if(attr){for(var k in attr){tg.setAttribute(k,attr[k]);};};if(content){tg.innerHTML=content;};return(tg);};
	doneski.bind = function(f,obj) {obj=obj||doneski;return(function(){f.apply(obj,arguments);});};
	doneski.l = [];
	var core = {
		_init: function(options) {
			doneski.lcon = (gtn=doneski.gtn)((l="list")+"s")[0];
			doneski.ln = gtn(l+"nav")[0];
			doneski.tb = (t=gtn((tb="toolbar"))[0]);
			doneski.fudge = gtn("content")[0];
			if((ls='localStorage') in (w=window) && w[ls] !== null) {
				doneski.touch();
				w.scrollTo(0,35);
				if(localStorage[l+"s"]) {
					var lists = w[ls][l+"s"].split(",");
					doneski.rollup();
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
				doneski.toucher = new TouchyFeely(document,{cscroll : 0});
				ael((a="swipe")+"start",doneski.swS,true);
				ael(a+"move",doneski.swM,true);
				ael(a+"end",doneski.swE,true);
				ael((a="scroll")+"start",doneski.scS,true);
				ael(a+"move",doneski.scM,true);
			};
			(st=w.setTimeout)(function(){doneski.gtn('body')[0].className += ' loaded';},500);
			st(function(){doneski.cachedTexture(tb,doneski.ns,{opacity:0.3,range:50},tb);},0);
			st(function(){doneski.cachedTexture("body "+l+"s "+l,doneski.nb,{bg:{position:"20px top",repeat:"repeat-y"}},"nb");},0);
			st(function(){doneski.cachedTexture("body header",doneski.nb,{bg:{position:"20px top",repeat:"repeat-y"}},"nb");},0);
			w.scrollTo(0,0);
			st(function(){doneski.sync();},1000);
			doneski.loaded = true;
		},
		sync: function() {
			doneski.syncer||(doneski.syncer = new Doneski.Synchro());
			if(doneski.syncer.onLine) {
				console.log("syncing");
			} else {
				console.log("offline");
			};
		},
		ael: function(a,b,c) {
			return(document.addEventListener(a,b,c));
		},
		gtn: function(a) {
			return(document.getElementsByTagName(a));
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
			if((a=(doneski.swT=doneski.cL)["get"+(a="Attribute")]("style")||"").indexOf((w="-webkit-transform:translate3d("))==-1) {
				doneski.swT["set"+a]("style", a+w+"0px,0px,0px);");
			};
			//doneski.swT.orig = a;
		},
		swM: function(event) {
			doneski.swT["set"+(a="Attribute")]("style", doneski.swT["get"+a]("style").replace(/-webkit-transform:translate3d\((-)?[0-9]{1,5}(px)?,/,"-webkit-transform:translate3d("+event.dX+"px,"));
		},
		swE: function(event) {
			var a = doneski.swT;
			window.setTimeout(function(){a.setAttribute("style","");},100);
			event.direction=="left"?doneski.goN() : doneski.goP();
		},
		scS: function(event) {
			if((a=(doneski.scT=doneski.cL).getAttribute("style")||"").indexOf((w="-webkit-transform:translate3d("))==-1) {
				doneski.scT.setAttribute("style", a+w+"0px,0px,0px);");
				doneski.scS = 0;
			} else {
				doneski.scS = parseInt(a.replace(/.*-webkit-transform:translate3d\((-)?[0-9]{1,5}(px)?,((-)?[0-9]{1,5})(px)?,.*/,"$3"),10);
			};
		},
		scM: function(event,b) {
			b = ((e=doneski.scS + event.dY) > 0 ? 0 : e < (d=doneski.mSc()) ? d : e);
			doneski.scT.setAttribute("style", doneski.scT.getAttribute("style").replace(/-webkit-transform:translate3d\(((-)?[0-9]{1,5}(px)?),(-)?[0-9]{1,5}(px)?,/,"-webkit-transform:translate3d($1,"+b+"px,"));
		},
		mSc: function() {
			return(0-doneski.scT.clientHeight+window.innerHeight);
		},
		lL: function(id,cls,a,b) {
			(a = new Doneski.List(id)).nav_item = (b = new Doneski.ListNav(a));
			doneski.l.push(a);
			cls && (a.className += cls);
			doneski.lcon.appendChild(a);
			doneski.ln.appendChild(b);
			doneski.rN();
			return(a);
		},
		rN: function() {
			ln=doneski.ln;
			if(ln.clientWidth > (doneski.tb.clientWidth*0.9)) {
				a="tight";
				for(i=4;i--;) { ln.className = ln.className.replace(a+(i-1),a+i); };
			};
		},
		newList: function() {
			var b = doneski.lL(doneski.gLId(),"after");
			doneski.go(b);
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
		sFH: function(again) {
			again==false||(again=true);
			if(!(cl=doneski.cL)) return;
			cl.style.height = "";
			doneski.fudge.style.height = ((cL = cl.clientHeight) > (wh=window.innerHeight) ? cL : wh) + "px";
			cl.style.height = (cL > wh) ? "" : wh+"px";
			again&&window.setTimeout(function(){doneski.sFH(false);},200);
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
		saveLists: function() {
			var out = [];
			for(var i=0;i<doneski.l.length;i++) {
				var a = doneski.l[i];
				out.push(a.id);
			};
			localStorage["lists"] = out;
		},
		store: function() {
			localStorage["lists"] = [doneski.list_name,false];
			var st = [];
			for(var k in doneski.tasks) {
				var str = [k,doneski.tasks[k]].join(doneski.separator);
				if(!doneski.tasks[k]) st.push(str);
			};
			localStorage["lists."+doneski.list_name] = st.join(",");
		},
		rollup: function() {
			if((bdy = document.getElementsByTagName("body")[0]) && bdy.className.indexOf("compact")<0) bdy.className += " compact";
			window.scrollTo(0,0);
		},
		rollupQuick: function() {
			if((bdy = document.getElementsByTagName("body")[0]) && bdy.className.indexOf("quick")<0) bdy.className += " quick";
			if((bdy = document.getElementsByTagName("body")[0]) && bdy.className.indexOf("compact")<0) bdy.className += " compact";
			window.scrollTo(0,0);
		},
		add: function(event) {
			
		},
		touch: function() {
			doneski.hLS() && (localStorage["lastSeen"] = new Date());
		},
		lastSeen: function() {
			return(doneski.hLS() && localStorage["lastSeen"]);
		},
		hLS: function() {
			return('localStorage' in window && window['localStorage'] !== null);
		},
		ping: function() {
			console.log("Yeah yeah.", doneski);
		},
		bkp: function(event) {
			if(event.keyCode==39) {
				doneski.goN();
			} else if(event.keyCode==37) {
				doneski.goP();
			};
		},
		swipe: function(event) {
			// console.log(event);
		},
		intercepts: [],
		queue: [0,1,2,3,4,5,6,7,8,9],
		currentJournal: 0,
		// intercept: function(obj) {
		// 	if(obj.intercepts) {
		// 		for(var i=0;i<obj.intercepts.length;i++) {
		// 			var method = obj[obj.intercepts[i]];
		// 			if(method) {
		// 				console.log(method.constructor);
		// 			};
		// 		};
		// 	};
		// },
		// perform: function() {
		// 	var args = Array.prototype.slice.call(arguments);
		// 	var obj = args.shift(), action = args.shift();
		// 	doneski.journal(obj,action,args);
		// 	return(obj[action].apply(obj,args));
		// },
		newJournal: function() {
			doneski.currentJournal += 1;
			localStorage["journal.current"] = doneski.currentJournal;
		},
		journal: function() {
			(a = Array.prototype.slice.call(arguments)[0]).unshift(new Date().getTime()+"-"+(d=doneski.queue.shift()));
			doneski.queue.push(doneski.queue[doneski.queue.length-1]+1);
			localStorage[(b="journal."+doneski.currentJournal)] = localStorage[b] || "[]";
			c = JSON.parse(localStorage[b]);
			c.push(a);
			localStorage[b] = doneski.serialize(c);
		},
		serialize: function(obj) {
			return(JSON.stringify(obj));
		}
	};
	for(var i in core) {
		doneski[i] = core[i];
	};
	return(new _Journaller(doneski));
};

// TODO: rework online detection to go only very infrequently except when accessed - ex: ping every few minutes, but ping if used after 60 seconds
_Doneski.prototype.Synchro = function(obj,opts,synchro) {
	synchro = this;
	var core = {
		intervals: [30000,90000,360000],
		retries: 4,
		offs: 0,
		speed: -1,
		_init: function(o) {
			synchro.ping();
			// synchro.setSpeed(0);
		},
		online: function() {
			synchro.onLine = false;
			try {
				var x=new XMLHttpRequest();
				x.open('HEAD', '/ping', false);
				x.send();
				synchro.onLine = true;
				synchro.offs = 0;
				synchro.setSpeed(0);
			} catch(e) {
				synchro.onLine = false;
				synchro.offs++;
				if(synchro.offs>synchro.retries) synchro.setSpeed(parseInt(synchro.offs/synchro.retries,10));
			};
			return(synchro.onLine);
		},
		setSpeed: function(speed) {
			if(speed!=synchro.speed && synchro.intervals[speed]) {
				if(synchro.timer) window.clearInterval(synchro.timer);
				synchro.timer = window.setInterval(synchro.ping,synchro.intervals[speed]);
				synchro.speed = speed;
			};
		},
		ping: function() {
			if(synchro.online()) {
				
			};
		}
	};
	for(var i in core) synchro[i] = core[i];
	synchro._init();
	return(synchro);
};

_Doneski.prototype.List = function(id,title,tasks) {
	var tag = Doneski.tag;
	var list = tag("list");
	list.name_input = tag("input",{ "type":"text", "name":"title", "placeholder":"Name this list", "class":"delayed"});
	list.appendChild(list.name_input);
	list.form = tag("form",{"action":"/task","method":"post","class":"tasklist"});
	list.appendChild(list.form);
	list.task_input = tag("input",{"type":"text", "class":"task", "placeholder":"Add your first to-do"});
	list.form.appendChild(list.task_input);
	list.form.appendChild(tag("button",{"class":"add"},"+"));
	list.form.appendChild(tag("input",{"type":"submit", "value":"Add", "style":"display:none;"}));
	list.task_container = tag("tasks",{"class":"active"});
	list.appendChild(list.task_container);
	list.completed_container = tag("tasks",{"class":"completed"});
	list.appendChild(list.completed_container);
	
	var core = {
		name: function(name) {
			localStorage["lists."+list.id+".name"] = name;
			list.name_input.className = "setted";
			list.task_input.focus();
			task.updated("name");
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
		push: function(obj) {
			var tsk = new Doneski.Task(list,obj);
			list.task_container.insertBefore(tsk,list.task_container.firstChild);
			(!(l=localStorage["lists"]) || l.split(",").indexOf(list.id)==-1) && list.create(list.id);
			list.addTask(tsk.id);
			tsk.addEventListener("kill",list.deathWatch,true);
			tsk.addEventListener("update",function(e){console.log("update",e.target);},true);
		},
		addTask: function(id) {
			(a=list.items.indexOf(id))==-1 && list.items.push(id);
			list.updated("add");
		},
		updated: function(type,evObj) {
			if(Doneski.loaded) list.save();
			list.task_input.setAttribute("placeholder",list.items.length?"Add another one":"Add your first to-do");
			Doneski.sFH();
			(evObj = document["create"+(e="Event")]('UI'+e+'s'))["initUI"+e](type || "update", true, true, window, 1);
			evObj.l_id = list.id;
			list["dispatch"+e](evObj);
		},
		loadTask: function(id) {
			var tsk = new Doneski.Task(list,false,id);
			if(tsk.completed) list.completed_container.insertBefore(tsk,list.completed_container.firstChild);
			else list.task_container.insertBefore(tsk,list.task_container.firstChild);
			list.items.push(tsk.id);
			list.task_input.setAttribute("placeholder","Add another one");
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
		},
		deactivate: function(cls) {
			list.className = cls || "";
			list.nav_item.className = "";
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
	// list.scroller = new iScroll(list.getElementsByTagName("wrapper")[0]);
	if(localStorage["lists."+list.id+".name"]) {
		list.name_input.value = localStorage["lists."+list.id+".name"];
		list.name_input.className = "setted";
	};
	if(localStorage["lists."+list.id]) {
		var itms = localStorage["lists."+list.id].split(",");
		for(i=0;i<itms.length;i++) {
			list.loadTask(itms[i]);
		};
	};
	list.intercepts = ["create","addTask","removeTask"];
	list.journal = Doneski.journal;
	return(new _Journaller(list));
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
	// nav.addEventListener("click",function(){Doneski.go(nav.list);},true);
	return(nav);
};

_Doneski.prototype.Task = function(list,obj,id) {
	
	var task = Doneski.tag("task",{});
	task.list = list;

	var txt, val;
	if(id && localStorage["tasks."+id]) {
		var s = localStorage["tasks."+id].split(Doneski.separator); txt = s[0]; val = s[1]=="true";
		task.id = id;
	} else {
		if(typeof obj=="string") {
			txt = obj;
			val = false;
		} else {
			txt = obj[0];
			val = obj[1]=="true";
		};
		task.id = Doneski.gTId();
	};
	
	task.innerHTML = txt;
	
	var core = {
		taskClick: function(event) {
			if(!task.nocancel) {
				task.className += " clicky";
				if(task.completed) window.setTimeout(function(){task.uncomplete();},1000);
				else window.setTimeout(function(){task.complete();},1000);
				// if(task.completed) task.uncomplete();
				// else task.complete();
			};
			task.nocancel = false;
		},
		taskMove: function(event) {
			task.nocancel = true;
		},
		save: function() {
			(task.killed && localStorage.removeItem("tasks."+task.id)) || (localStorage["tasks."+task.id] = [task.innerHTML,task.completed].join(Doneski.separator));
		},
		complete: function() {
			task.className = "";
			task.list.completed_container.insertBefore(task,task.list.completed_container.firstChild);
			task.completed = true;
			task.updated("complete");
		},
		uncomplete: function() {
			task.list.task_container.insertBefore(task,task.list.task_container.firstChild);
			task.className = "active";
			task.completed = false;
			task.updated("uncomplete");
		},
		kill: function() {
			task.killed && task.updated("kill");
		},
		updated: function(type,evObj) {
			if(Doneski.loaded) task.save();
			Doneski.sFH();
			(evObj = document["create"+(e="Event")]('UI'+e+'s'))["initUI"+e](type || "update", true, true, window, 1);
			evObj.t_id = task.id;
			task["dispatch"+e](evObj);
			console.log("dispatched",type);
		}
	};
	for(var i in core) {
		task[i] = core[i];
	};
	
	task.addEventListener("click",task.taskClick,true);
	task.addEventListener("touchmove",task.taskMove,true);
	task.addEventListener("touchend",task.taskClick,true);
	
	task.completed = val;

	if(!task.completed) {
		task.className = "active";
	};
	
	task.save();
	
	task.journal = Doneski.journal;
	task.intercepts = ["complete","uncomplete","kill"];
	
	return(new _Journaller(task));	
};

var _Journaller = function(obj,intercept,perform,journal,serialize,i,g,j) {
	j=this;
	if(obj.intercepts) {
		serialize = function(obj) {
			return(JSON.stringify(obj));
		};
		journal = function() {
			if(obj.journal) {
				obj.journal(Array.prototype.slice.call(arguments));
			} else {
				console.log("Journal: "+serialize(Array.prototype.slice.call(arguments)));
			};
		};
		perform = function(name,args) {
			args = Array.prototype.slice.call(args);
			journal(obj.id,name,args);
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
	return(obj);
};

window.Doneski = new _Doneski();
// window.applicationCache.addEventListener("cached",function(){console.log("cached");},true);
// window.applicationCache.addEventListener("noupdate",function(){console.log("cache up to date");},true);
window.applicationCache.addEventListener("updateready",function(){/*console.log("got updated stuff");*/window.applicationCache.swapCache();/*console.log("swapped");*/},true);
window.setTimeout("Doneski._init();",0);