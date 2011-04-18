var _Doneski = function(options) {
	var doneski = this;
	doneski.separator = "::D::";
	doneski.list_name = "def";
	var List = function(id, title) {
		var list = doneski.list_template.cloneNode(true);
		list.className = "";
		list.formHandler = function(event) {
			event.preventDefault();
			doneski.rollup();
			var lst = event.target.list, tsk = list.getElementsByClassName("task")[0];
			list.add(tsk.value);
			tsk.value = "";
			return(false);
		};
		list.form = list.getElementsByTagName("form")[0];
		list.form.list = list;
		list.form.addEventListener("submit",list.formHandler,true);
		list.task_container = list.getElementsByTagName("tasks")[0];
		list.id = id;
		list.title = title || "";
		list.items = [];
		// list.scroller = new iScroll(list.getElementsByTagName("wrapper")[0]);
		list.add = function(obj) {
			var el = document.createElement("task"), txt, val;
			if(typeof obj=="string") {
				txt = obj;
				val = false;
			} else {
				txt = obj[0];
				val = obj[1]=="true";
			};
			el.innerHTML = txt;
			el.clickable = true;
			el.addEventListener("click",list.taskClick,true);
			el.addEventListener("touchmove",list.taskMove,true);
			el.addEventListener("touchend",list.taskClick,true);
			list.task_container.insertBefore(el,list.task_container.firstChild);
			if(!val) window.setTimeout(function(){el.className = "active";},1);
			list.items[txt] = val;
			list.store();
		};
		list.store = function() {
			var st = [];
			for(var k in list.items) {
				var str = [k,list.items[k]].join(doneski.separator);
				if(!list.items[k]) st.push(str);
			};
			localStorage["doneski.lists."+list.id] = st.join(",");
		};
		list.taskClick = function(event) {
			var tgt = event.target;
			if(!tgt.nocancel && tgt.clickable) {
				tgt.className += " clicky";
				window.setTimeout(function(){list.deleteItem(tgt);},1000);
			};
			tgt.nocancel = false;
		};
		list.taskMove = function(event) {
			var targt = event.target;
			targt.nocancel = true;
		};
		list.deleteItem = function(target) {
			target.className = target.className.replace("active","");
			window.setTimeout(function(){target.parentNode.removeChild(target);},200);
			list.items[target.innerHTML] = true;
			list.store();
		};
		if(!localStorage["doneski.lists"] || localStorage["doneski.lists"].split(",").indexOf(list.id)==-1) {
			var cur = localStorage["doneski.lists"] ? localStorage["doneski.lists"].split(",") : [];
			cur.push(list.id);
			//localStorage["doneski.lists"] = cur;
		};
		return(list);
	};
	var core = {
		_init: function(options) {
			doneski.lists_container = document.body.getElementsByTagName("lists")[0];
			doneski.list_template = document.body.getElementsByClassName("list_template")[0];
			if('localStorage' in window && window['localStorage'] !== null) {
				doneski.touch();
				window.scrollTo(0,35);
				doneski.captureInputs();
				if(localStorage["doneski.lists"]) {
					var lists = localStorage["doneski.lists"].split(",");
					doneski.rollup();
					for(var i=0;i<lists.length;i++) {
						doneski.loadList(lists[i]);
					};
				} else {
					var lst = new List(doneski.list_name);
					doneski.lists_container.appendChild(lst);
				};
			} else {
				// No local storage - hmmm...
				console.log("no LS",doneski._hasLS);
			};
			window.setTimeout("document.getElementsByTagName('body')[0].className += ' loaded';",500);
		},
		captureInputs: function() {
			var inp = document.body.getElementsByClassName("task");
			for(var i=0;i<inp.length;i++) {
				inp[i].addEventListener("focus",doneski.inputHandler,true);
			};
			var btn = document.body.getElementsByTagName("button");
			for(i=0;i<btn.length;i++) {
				btn[i].addEventListener("click",doneski.buttonHandler,true);
			};
			inp[0].focus();
		},
		loadList: function(id) {
			var liststr = localStorage["doneski.lists."+id], dat = liststr ? liststr.split(",") : [];
			var lst = new List(id);
			for(var i=0;i<dat.length;i++) {
				var obj = dat[i].split(doneski.separator);
				lst.add(obj);
			};
			doneski.lists_container.appendChild(lst);
		},
		inputHandler: function(event) {
			
		},
		buttonHandler: function(event) {
			// event.preventDefault();
			// return(false);
		},
		addItem: function(lst,obj) {
			var el = document.createElement("task"), txt, val;
			if(typeof obj=="string") {
				txt = obj;
				val = false;
			} else {
				txt = obj[0];
				val = obj[1]=="true";
			};
			el.innerHTML = txt;
			lst.add(el);
			if(!val) el.className = "active"; //window.setTimeout(function(){el.className = "active";},200);
			el.addEventListener("click",doneski.taskClick,true);
			el.addEventListener("touchend",doneski.taskClick,true);
			doneski.tasks[txt] = val;
			doneski.store();
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
		bind: function(f,obj) {
			obj = obj || doneski;
			return(function(){f.apply(obj,arguments);});
		}
	};
	for(var i in core) {
		doneski[i] = core.bind(core[i]);
	};
	doneski.tasks = {};
};

window.Doneski = new _Doneski();
window.setTimeout("Doneski._init();",0);