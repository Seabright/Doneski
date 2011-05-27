var _Doneski = function() {
	var doneski = this;
	doneski.linger = 1000;
	doneski.list_name = "default";
	doneski.separator = "::";
	doneski.tag = function(id,attr,content){var tg=document.createElement(id);if(!content && typeof attr=="string"){attr=undefined;content=attr;};if(attr){for(var k in attr){tg.setAttribute(k,attr[k]);};};if(content){tg.innerHTML=content;};return(tg);};
	doneski.bind = function(f,obj) {obj=obj||doneski;return(function(){f.apply(obj,arguments);});};
	doneski.lists = [];
	var core = {
		_init: function(options) {
			doneski.lists_container = (gtn=doneski.gtn)("lists")[0];
			doneski.list_nav = gtn("listnav")[0];
			doneski.toolbar = (t=gtn("toolbar")[0]);
			doneski.fudge = gtn("content")[0];
			if('localStorage' in (w=window) && w['localStorage'] !== null) {
				doneski.touch();
				w.scrollTo(0,35);
				if(localStorage["lists"]) {
					var lists = localStorage["lists"].split(",");
					doneski.rollup();
					for(var i=0;i<lists.length;i++) {
						doneski.loadList(lists[i]);
					};
					var focus = localStorage["last_list"] ? doneski.find(localStorage["last_list"]) : doneski.lists[0];
					if(!focus) focus = doneski.lists[0];
					doneski.go(focus);
				} else {
					doneski.newList();
				};
				doneski.setFudgeHeight();
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
			st(function(){doneski.noisify("toolbar",{opacity:0.3,range:50},"tb");},0);
			st(function(){doneski.notebookify("body lists list");},0);
			w.scrollTo(0,0);
			doneski.loaded = true;
		},
		ael: function(a,b,c) {
			return(document.addEventListener(a,b,c));
		},
		gtn: function(a) {
			return(document.getElementsByTagName(a));
		},
		noisify: function(selector,options,id,opts,strg) {
			id&&localStorage[(id="ns"+id)]&&(strg = localStorage[id]);
			d=(doneski.styles||(doneski.styles=doneski.newStyle()));
			if(!strg) {
				opts = {
					opacity: 0.2,
					range: 100
				};
				if(options) {for(var i in options) opts[i]=options[i];};
				if(!!!document.createElement('canvas').getContext) { return false; }
				var ctx = (canvas = document.createElement("canvas")).getContext('2d');
				canvas.width = 960;
				canvas.height = 30;
				for(var x=0;x<canvas.width;x++) {
					for(var y=0;y<canvas.height;y++) {
						var number = Math.floor(Math.random()*opts.range);
						ctx.fillStyle = "rgba("+number+","+number+","+number+","+opts.opacity+")";
						ctx.fillRect(x, y, 1, 1);
					};
				};
				strg = "url("+canvas.toDataURL("image/png")+")";
				localStorage[id] = strg;
			};
			d.innerHTML+=selector+"{background-image:"+strg+";background-repeat:repeat-y;background-position:left top;}\n";
			return(true);
		},
		notebookify: function(selector,strg,offset,d) {
			offset = 20;
			d=(doneski.styles||(doneski.styles=doneski.newStyle()));
			if(!(strg=localStorage["bg"])) {
				if(!!!document.createElement('canvas').getContext) { return false; }
				var canvas = document.createElement("canvas"), ctx = canvas.getContext('2d');
				canvas.width = 4;
				canvas.height = 1;
				ctx.fillStyle = "rgba(236,0,140,.2)";
				ctx.fillRect(0, 0, 1, 1);
				ctx.fillRect(3, 0, 1, 1);
				strg = "url("+canvas.toDataURL("image/png")+")";
				localStorage["bg"] = strg;
			};
			d.innerHTML+=selector+"{background-image:"+strg+";background-repeat:repeat-y;background-position:"+offset+"px top;}\n";
			return(true);
		},
		newStyle: function(a) {
			a = document.createElement("style");
			document.getElementsByTagName("head")[0].appendChild(a);
			return(a);
		},
		swS: function(event) {
			if((a=(doneski.swipetarget=doneski.current_list).getAttribute("style")||"").indexOf("-webkit-transform:translate3d(")==-1) {
				doneski.swipetarget.setAttribute("style", a+"-webkit-transform:translate3d(0px,0px,0px);");
			} else {
			};
			doneski.swipetarget.orig = a;
		},
		swM: function(event) {
			doneski.swipetarget.setAttribute("style", doneski.swipetarget.getAttribute("style").replace(/-webkit-transform:translate3d\((-)?[0-9]{1,5}(px)?,/,"-webkit-transform:translate3d("+event.dX+"px,"));
		},
		swE: function(event) {
			var a = doneski.swipetarget;
			window.setTimeout(function(){a.setAttribute("style","");},100);
			event.direction=="left"?doneski.goNext() : doneski.goPrevious();
		},
		scS: function(event) {
			if((a=(doneski.scrolltarget=doneski.current_list).getAttribute("style")||"").indexOf("-webkit-transform:translate3d(")==-1) {
				doneski.scrolltarget.setAttribute("style", a+"-webkit-transform:translate3d(0px,0px,0px);");
				doneski.scrollstart = 0;
			} else {
				doneski.scrollstart = parseInt(a.replace(/.*-webkit-transform:translate3d\((-)?[0-9]{1,5}(px)?,((-)?[0-9]{1,5})(px)?,.*/,"$3"),10);
			};
		},
		scM: function(event,b) {
			b = ((e=doneski.scrollstart + event.dY) > 0 ? 0 : e < (d=doneski.maxScroll()) ? d : e);
			doneski.scrolltarget.setAttribute("style", doneski.scrolltarget.getAttribute("style").replace(/-webkit-transform:translate3d\(((-)?[0-9]{1,5}(px)?),(-)?[0-9]{1,5}(px)?,/,"-webkit-transform:translate3d($1,"+b+"px,"));
		},
		maxScroll: function() {
			return(0-doneski.scrolltarget.clientHeight+window.innerHeight);
		},
		loadList: function(id,cls) {
			var a = new Doneski.List(id);
			var b = new Doneski.ListNav(a);
			a.nav_item = b;
			doneski.lists.push(a);
			if(cls) a.className += cls;
			doneski.lists_container.appendChild(a);
			doneski.list_nav.appendChild(b);
			doneski.rejig_nav();
			return(a);
		},
		rejig_nav: function() {
			ln=doneski.list_nav;
			if(ln.clientWidth > (doneski.toolbar.clientWidth*0.9)) {
				a="tight";
				for(i=4;i--;) { ln.className = ln.className.replace(a+(i-1),a+i); };
			};
		},
		newList: function() {
			var b = doneski.loadList(doneski.generateListId(),"after");
			doneski.go(b);
		},
		find: function(id) {
			for(var i=0;i<doneski.lists.length;i++) {
				if(doneski.lists[i].id==id) return(doneski.lists[i]);
			};
			return(undefined);
		},
		go: function(lst) {
			var aft = "";
			for(var i=0;i<doneski.lists.length;i++) {
				if(doneski.lists[i]!=lst) {
					doneski.lists[i].deactivate(aft);
				} else {
					doneski.lists[i].activate();
					aft = "after";
				};
			};
			doneski.current_list = lst;
			doneski.setFudgeHeight();
			localStorage["last_list"] = lst.id;
			//lst.activate();
		},
		setFudgeHeight: function(again) {
			again==false||(again=true);
			if(!(cl=doneski.current_list)) return;
			cl.style.height = "";
			doneski.fudge.style.height = ((cL = cl.clientHeight) > (wh=window.innerHeight) ? cL : wh) + "px";
			cl.style.height = (cL > wh) ? "" : wh+"px";
			again&&window.setTimeout(function(){doneski.setFudgeHeight(false);},200);
		},
		goNext: function() {
			var idx = doneski.lists.indexOf(doneski.current_list) + 1;
			if(idx>=doneski.lists.length) {
				doneski.newList();
			} else {
				doneski.go(doneski.lists[idx]);
			};
		},
		goPrevious: function() {
			var idx = doneski.lists.indexOf(doneski.current_list) - 1;
			if(idx>=0) {
				doneski.go(doneski.lists[idx]);
			};
		},
		generateTaskId: function() {
			return("t_"+doneski.generateUUID());
		},
		generateListId: function() {
			return("l_"+doneski.generateUUID());
		},
		generateUUID: function() {
			return("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);})+"");
		},
		saveLists: function() {
			var out = [];
			for(var i=0;i<doneski.lists.length;i++) {
				var a = doneski.lists[i];
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
			doneski.hasLocalStorage() && (localStorage["lastSeen"] = new Date());
		},
		lastSeen: function() {
			return(doneski.hasLocalStorage() && localStorage["lastSeen"]);
		},
		hasLocalStorage: function() {
			return('localStorage' in window && window['localStorage'] !== null);
		},
		ping: function() {
			console.log("Yeah yeah.", doneski);
		},
		bkp: function(event) {
			if(event.keyCode==39) {
				doneski.goNext();
			} else if(event.keyCode==37) {
				doneski.goPrevious();
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
			Doneski.setFudgeHeight();
			(evObj = document.createEvent('UIEvents')).initUIEvent(type || "update", true, true, window, 1);
			evObj.l_id = list.id;
			list.dispatchEvent(evObj);
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
		task.id = Doneski.generateTaskId();
	};
	
	task.innerHTML = txt;
	
	var core = {
		taskClick: function(event) {
			if(!task.nocancel && task.clickable) {
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
			task.updated();
		},
		uncomplete: function() {
			task.list.task_container.insertBefore(task,task.list.task_container.firstChild);
			task.className = "active";
			task.completed = false;
			task.updated();
		},
		kill: function() {
			task.killed && task.updated("kill");
		},
		updated: function(type,evObj) {
			if(Doneski.loaded) task.save();
			Doneski.setFudgeHeight();
			(evObj = document.createEvent('UIEvents')).initUIEvent(type || "update", true, true, window, 1);
			evObj.t_id = task.id;
			task.dispatchEvent(evObj);
			console.log(task,"dispatching",evObj.type);
		},
		focus: function() {
			// list.task_input.focus();
		}
	};
	for(var i in core) {
		task[i] = core[i];
	};
	
	task.clickable = true;
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