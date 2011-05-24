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
			doneski.lists_container = document.body.getElementsByTagName("lists")[0];
			doneski.list_nav = document.body.getElementsByTagName("listnav")[0];
			doneski.toolbar = document.body.getElementsByTagName("toolbar")[0];
			doneski.fudge = document.body.getElementsByTagName("content")[0];
			if('localStorage' in window && window['localStorage'] !== null) {
				doneski.touch();
				window.scrollTo(0,35);
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
			window.addEventListener("keyup",doneski.bkp,true);
			if(typeof TouchyFeely != "undefined") {
				doneski.toucher = new TouchyFeely(document,{capturescroll : false});
				document.addEventListener("swipestart",doneski.swipeStarter,true);
				document.addEventListener("swipemove",doneski.swipeMoveHandler,true);
				document.addEventListener("swipeend",doneski.swipeHandler,true);
				document.addEventListener("scrollstart",doneski.scrollStart,true);
				document.addEventListener("scrollmove",doneski.scrollHandler,true);
			};
			window.setTimeout(function(){document.getElementsByTagName('body')[0].className += ' loaded';},500);
			window.setTimeout(function(){doneski.noisify(doneski.toolbar,{opacity:0.3,range:50});},0);
			window.setTimeout(function(){doneski.notebookify(document.body.getElementsByTagName("content")[0]);},0);
			window.scrollTo(0,0);
			doneski.loaded = true;
		},
		noisify: function(element,options) {
			var opts = {
				opacity: 0.2,
				range: 100
			};
			if(options) {for(var i in options) opts[i]=options[i];};
			if(!!!document.createElement('canvas').getContext) { return false; }
			var ctx = (canvas = document.createElement("canvas")).getContext('2d');
			canvas.width = element.clientWidth;
			canvas.height = element.clientHeight;
			for(var x=0;x<canvas.width;x++) {
				for(var y=0;y<canvas.height;y++) {
					var number = Math.floor(Math.random()*opts.range);
					ctx.fillStyle = "rgba("+number+","+number+","+number+","+opts.opacity+")";
					ctx.fillRect(x, y, 1, 1);
				};
			};
			element.style.backgroundImage = "url("+canvas.toDataURL("image/png")+")";  
			return(true);
		},
		notebookify: function(element) {
			if(!!!document.createElement('canvas').getContext) { return false; }
			var canvas = document.createElement("canvas"), ctx = canvas.getContext('2d'), offset = 20;
			canvas.width = 4;
			canvas.height = 1;
			ctx.fillStyle = "rgba(236,0,140,.2)";
			ctx.fillRect(0, 0, 1, 1);
			ctx.fillRect(3, 0, 1, 1);
			element.style.backgroundImage = "url("+canvas.toDataURL("image/png")+")";
			element.style.backgroundRepeat = "repeat-y";
			element.style.backgroundPosition = offset+"px top";
			return(true);
		},
		swipeStarter: function(event) {
			// event.direction=="left"?doneski.goNext() : doneski.goPrevious();
		},
		swipeHandler: function(event) {
			event.direction=="left"?doneski.goNext() : doneski.goPrevious();
		},
		swipeMoveHandler: function(event) {
			//
		},
		scrollHandler: function(event) {
			// console.log(event.vD);
			// console.log(event.cY);
			if((top = doneski.scrollstart - event.vD) < 0) top = 0;
			// console.log("top: "+top);
			if(top > (max=doneski.maxScroll())) top = max;
			// console.log("moving top to: "+top+" (max: "+max+")");
			window.scrollTo(0,top);
		},
		scrollStart: function(event) {
			doneski.scrollstart = window.pageYOffset || window.scrollY;
			// console.log("started scroll at position: "+doneski.scrollstart);
			// console.log("started scroll at cY: "+event.cY);
		},
		maxScroll: function() {
			return(document.body.clientHeight-window.innerHeight);
		},
		loadList: function(id) {
			var a = new Doneski.List(id);
			var b = new Doneski.ListNav(a);
			a.nav_item = b;
			doneski.lists.push(a);
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
			var b = doneski.loadList(doneski.generateListId());
			b.className = "after";
			window.setTimeout(function(){doneski.go(b);},200);
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
					doneski.fudge.style.height = lst.clientHeight;
					aft = "after";
				};
			};
			doneski.current_list = lst;
			doneski.setFudgeHeight();
			localStorage["last_list"] = lst.id;
			//lst.activate();
		},
		setFudgeHeight: function() {
			if(!(cl=doneski.current_list)) return;
			doneski.fudge.style.height = ((cL = cl.clientHeight+50) > (wh=window.innerHeight) ? cL : wh) + "px";
			window.setTimeout(function(){doneski.setFudgeHeight();},200);
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
		intercept: function(obj) {
			if(obj.intercepts) {
				for(var i=0;i<obj.intercepts.length;i++) {
					var method = obj[obj.intercepts[i]];
					if(method) {
						console.log(method.constructor);
					};
				};
			};
		},
		perform: function() {
			var args = Array.prototype.slice.call(arguments);
			var obj = args.shift(), action = args.shift();
			doneski.journal(obj,action,args);
			return(obj[action].apply(obj,args));
		},
		journal: function() {
			console.log(doneski.serialize(Array.prototype.slice.call(arguments)));
		},
		serialize: function(obj) {
			return(JSON.stringify(obj));
		}
	};
	for(var i in core) {
		// doneski[i] = doneski.bind(core[i]);
		doneski[i] = core[i];
	};	
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
		// taskClick: function(event) {
		// 	var tgt = event.target;
		// 	if(!tgt.nocancel && tgt.clickable) {
		// 		tgt.className += " clicky";
		// 		window.setTimeout(function(){list.completed_container.insertBefore(tgt,list.completed_container.firstChild);},1000);
		// 	};
		// 	tgt.nocancel = false;
		// },
		taskMove: function(event) {
			var targt = event.target;
			targt.nocancel = true;
		},
		push: function(obj) {
			var tsk = new Doneski.Task(list,obj);
			list.task_container.insertBefore(tsk,list.task_container.firstChild);
			list.items.push(tsk.id);
			if(Doneski.loaded) list.save();
			list.task_input.setAttribute("placeholder","Add another one");
			Doneski.setFudgeHeight();
		},
		loadTask: function(id) {
			var tsk = new Doneski.Task(list,false,id);
			if(tsk.completed) list.completed_container.insertBefore(tsk,list.completed_container.firstChild);
			else list.task_container.insertBefore(tsk,list.task_container.firstChild);
			list.items.push(tsk.id);
			list.task_input.setAttribute("placeholder","Add another one");
		},
		save: function() {
			if(!localStorage["lists"] || localStorage["lists"].split(",").indexOf(list.id)==-1) {
				var cur = localStorage["lists"] ? localStorage["lists"].split(",") : [];
				cur.push(list.id);
				localStorage["lists"] = cur;
			};
			localStorage["lists."+list.id] = list.items.join(",");
		},
		remove: function(target) {
			target.className = target.className.replace("active","");
			window.setTimeout(function(){target.parentNode.removeChild(target);},200);
			list.items[target.innerHTML] = true;
			list.save();
		},
		focus: function() {
			list.task_input.focus();
		},
		activate: function() {
			list.className = "active";
			//list.task_input.focus();
			list.nav_item.className = "active";
		},
		deactivate: function(cls) {
			cls = cls || "";
			list.className = cls;
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
			};
			task.nocancel = false;
		},
		taskMove: function(event) {
			task.nocancel = true;
		},
		save: function() {
			localStorage["tasks."+task.id] = [task.innerHTML,task.completed].join(Doneski.separator);
		},
		complete: function() {
			console.log("complete");
			task.className = "";
			task.list.completed_container.insertBefore(task,task.list.completed_container.firstChild);
			task.completed = true;
			task.save();
		},
		uncomplete: function() {
			console.log("uncomplete");
			task.list.task_container.insertBefore(task,task.list.task_container.firstChild);
			task.className = "active";
			task.completed = false;
			task.save();
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
		window.setTimeout(function(){task.className = "active";},1);
	};
	
	task.save();
	
	return(task);	
};
window.Doneski = new _Doneski();
// window.applicationCache.addEventListener("cached",function(){console.log("cached");},true);
// window.applicationCache.addEventListener("noupdate",function(){console.log("cache up to date");},true);
window.applicationCache.addEventListener("updateready",function(){/*console.log("got updated stuff");*/window.applicationCache.swapCache();/*console.log("swapped");*/},true);
window.setTimeout("Doneski._init();",0);