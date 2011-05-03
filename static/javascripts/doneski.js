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
			var b = doneski.lists_container.getElementsByTagName("list");
			if('localStorage' in window && window['localStorage'] !== null) {
				doneski.touch();
				window.scrollTo(0,35);
				if(localStorage["doneski.lists"]) {
					var lists = localStorage["doneski.lists"].split(",");
					doneski.rollup();
					for(var i=0;i<lists.length;i++) {
						doneski.loadList(lists[i]);
					};
					doneski.lists[0].focus();
				} else {
					doneski.newList();
				};
			} else {
				// No local storage - hmmm...
				console.log("no LS",doneski._hasLS);
			};
			window.setTimeout("document.getElementsByTagName('body')[0].className += ' loaded';",500);
			doneski.loaded = true;
		},
		loadList: function(id) {
			var a = new Doneski.List(id);
			doneski.lists.push(a);
			doneski.lists_container.appendChild(a);
			return(a);
		},
		newList: function() {
			var lid = doneski.generateListId();
			console.log(lid);
			var cur = doneski.loadList(lid);
			doneski.go(doneski.lists[doneski.lists.length-1]);
		},
		go: function(lst) {
			for(var i=0;i<doneski.lists.length;i++) {
				doneski.lists[i].deactivate();
			};
			lst.activate();
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
			localStorage["doneski.lists"] = out;
		},
		store: function() {
			localStorage["doneski.lists"] = [doneski.list_name,false];
			var st = [];
			for(var k in doneski.tasks) {
				var str = [k,doneski.tasks[k]].join(doneski.separator);
				if(!doneski.tasks[k]) st.push(str);
			};
			localStorage["doneski.lists."+doneski.list_name] = st.join(",");
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
			doneski.hasLocalStorage() && (localStorage["doneski.lastSeen"] = new Date());
		},
		lastSeen: function() {
			return(doneski.hasLocalStorage() && localStorage["doneski.lastSeen"]);
		},
		hasLocalStorage: function() {
			return('localStorage' in window && window['localStorage'] !== null);
		},
		ping: function() {
			console.log("Yeah yeah.", doneski);
		},
		bkp: function(event) {
			if(event.keyCode==39) {
				doneski.newList();
			};
		}
	};
	
	for(var i in core) {
		// doneski[i] = doneski.bind(core[i]);
		doneski[i] = core[i];
	};
	// window.addEventListener("keyup",doneski.bkp,true);
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
	list.appendChild(tag("tasks",{"class":"completed"}));
	
	var core = {
		name: function(name) {
			localStorage["doneski.lists."+list.id+".name"] = name;
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
		taskClick: function(event) {
			var tgt = event.target;
			if(!tgt.nocancel && tgt.clickable) {
				tgt.className += " clicky";
				window.setTimeout(function(){list.remove(tgt);},1000);
			};
			tgt.nocancel = false;
		},
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
		},
		loadTask: function(id) {
			var tsk = new Doneski.Task(list,false,id);
			list.task_container.insertBefore(tsk,list.task_container.firstChild);
			list.items.push(tsk.id);
			list.task_input.setAttribute("placeholder","Add another one");
		},
		save: function() {
			if(!localStorage["doneski.lists"] || localStorage["doneski.lists"].split(",").indexOf(list.id)==-1) {
				var cur = localStorage["doneski.lists"] ? localStorage["doneski.lists"].split(",") : [];
				cur.push(list.id);
				localStorage["doneski.lists"] = cur;
			};
			localStorage["doneski.lists."+list.id] = list.items.join(",");
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
			list.task_input.focus();
		},
		deactivate: function() {
			list.className = "";
		}
	};
	for(var i in core) {
		list[i] = Doneski.bind(core[i],list);
	};
	list.form.list = list;
	list.form.addEventListener("submit",list.formHandler,true);
	
	list.name_input.addEventListener("blur",list.nameB,true);
	list.name_input.addEventListener("keypress",list.nameK,true);
	
	list.id = id;
	list.title = title || "";
	list.items = [];
	// list.scroller = new iScroll(list.getElementsByTagName("wrapper")[0]);
	if(localStorage["doneski.lists."+list.id+".name"]) {
		list.name_input.value = localStorage["doneski.lists."+list.id+".name"];
		list.name_input.className = "setted";
	};
	if(localStorage["doneski.lists."+list.id]) {
		var itms = localStorage["doneski.lists."+list.id].split(",");
		for(i=0;i<itms.length;i++) {
			list.loadTask(itms[i]);
		};
	};
	return(list);
};

_Doneski.prototype.Task = function(list,obj,id) {
	
	var task = Doneski.tag("task",{});
	task.list = list;

	if(id) {
		
	} else {
		var txt, val;
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
				window.setTimeout(function(){task.complete();},1000);
			};
			task.nocancel = false;
		},
		taskMove: function(event) {
			task.nocancel = true;
		},
		save: function() {
			if(!localStorage["doneski.lists"] || localStorage["doneski.lists"].split(",").indexOf(task.list.id)==-1) {
				var cur = localStorage["doneski.lists"] ? localStorage["doneski.lists"].split(",") : [];
				cur.push(task.list.id);
				localStorage["doneski.lists"] = cur;
			};
			var st = [];
			for(var i=0;i<task.list.items.length;i++) {
				var str = [task.list.items[i].innerHTML,task.list.items[i].completed?"true":"false"].join(Doneski.separator);
				st.push(str);
			};
			console.log(st.join(","));
			localStorage["doneski.lists."+task.list.id] = st.join(",");
		},
		complete: function() {
			task.className = task.className.replace("active","");
			window.setTimeout(function(){task.parentNode.removeChild(task);},200);
			task.completed = true;
			task.save();
		},
		uncomplete: function() {
			task.className = task.className.replace("active","");
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
		console.log("activating:",txt);
		window.setTimeout(function(){task.className = "active";},1);
	};
	
	// task.id = id;
	// list.title = title || "";
	// list.items = [];
	// // list.scroller = new iScroll(list.getElementsByTagName("wrapper")[0]);
	// if(!localStorage["doneski.lists"] || localStorage["doneski.lists"].split(",").indexOf(list.id)==-1) {
	// 	var cur = localStorage["doneski.lists"] ? localStorage["doneski.lists"].split(",") : [];
	// 	cur.push(list.id);
	// 	//localStorage["doneski.lists"] = cur;
	// };
	return(task);	
};
window.Doneski = new _Doneski();
window.setTimeout("Doneski._init();",0);