var _Doneski = function(options) {
	var doneski = this;
	var core = {
		_init: function(options) {
			if('localStorage' in window && window['localStorage'] !== null) {
				doneski.touch();
				window.scrollTo(0,35);
				doneski.captureInputs();
				if(localStorage["doneski.lists"]) {
					var lists = localStorage["doneski.lists"].split(",");
					console.log(lists);
					doneski.rollupQuick();
					for(var i=0;i<lists.length;i++) {
						doneski.loadList(lists[i]);
					};
				};
			} else {
				// No local storage - hmmm...
				console.log("no LS",doneski._hasLS);
			};
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
			var frm = document.body.getElementsByTagName("form");
			for(i=0;i<frm.length;i++) {
				frm[i].addEventListener("submit",doneski.formHandler,true);
			};
			inp[0].focus();
		},
		loadList: function(id) {
			var liststr = localStorage["doneski.lists."+id], dat = liststr ? liststr.split(",") : [], frm = document.body.getElementsByTagName("form")[0];
			console.log(id,dat);
			for(var i=0;i<dat.length;i++) {
				doneski.addItem(frm,dat[i]);
			};
		},
		inputHandler: function(event) {
			
		},
		buttonHandler: function(event) {
			// event.preventDefault();
			// return(false);
		},
		addItem: function(frm,txt) {
			var el = document.createElement("task");
			el.innerHTML = txt;
			var tsk = frm.parentNode.getElementsByTagName("tasks")[0];
			tsk.insertBefore(el,tsk.firstChild);
			window.setTimeout(function(){el.className = "active";},200);
			el.addEventListener("click",doneski.taskClick,true);
			el.addEventListener("touchend",doneski.taskClick,true);
			doneski.tasks[txt] = false;
			doneski.store();
		},
		taskClick: function(event) {
			var tgt = event.target;
			tgt.className += " clicky";
			window.setTimeout(function(){Doneski.deleteItem(tgt);},1000);
		},
		deleteItem: function(target) {
			target.className = target.className.replace("active","");
			window.setTimeout(function(){target.parentNode.removeChild(target);},200);
			doneski.tasks[target.innerHTML] = true;
			doneski.store();
		},
		store: function() {
			localStorage["doneski.lists"] = ["default","hmm"];
			var st = [];
			for(var k in doneski.tasks) {
				if(!doneski.tasks[k]) st.push(k);
			};
			localStorage["doneski.lists.default"] = st;
		},
		formHandler: function(event) {
			event.preventDefault();
			doneski.rollup();
			var frm = event.target, tsk = frm.getElementsByClassName("task")[0];
			doneski.addItem(frm,tsk.value);
			tsk.value = "";
			return(false);
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