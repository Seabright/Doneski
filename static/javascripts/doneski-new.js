var _Doneski = function() {
	var doneski = this;
	doneski.linger = 1000;
	doneski.tag = function(id,attr,content){var tg=document.creatElement(id);if(!content && typeof attr=="string"){attr=undefined;content=attr;};if(attr){for(var k in attr){tg[k]=attr[k];};};if(content){tg.innerHTML=content;};return(tg);};
	doneski.bind = function(f,obj) {obj=obj||doneski;return(function(){f.apply(obj,arguments);});};
};

_Doneski.prototype.List = function(id,title,tasks) {
	// <list class="list_template">
	// 	<input type="text" name="title" placeholder="Name this list" class="delayed"/>
	// 	<form action="/task" method="post" class="tasklist">
	// 		<input type="text" class="task" placeholder="Add your first to-do"/><button class="add">+</button>
	// 		<input type="submit" value="Add" style="display:none;"/>
	// 	</form>
	// 	<tasks></tasks>
	// 	<tasks class="completed"></tasks>
	// </list>
	// function tag(id,attr,content){var tg=document.creatElement(id);if(!content && typeof attr=="string"){attr=undefined;content=attr;};if(attr){for(var k in attr){tg[k]=attr[k];};};if(content){tg.innerHTML=content;};return(tg);};
	var tag = _Doneski.tag;
	var list = tag("list");
	list.appendChild(tag("input",{ "type":"text", "name":"title", "placeholder":"Name this list", "class":"delayed"}));
	list.form = tag("form",{"action":"/task","method":"post","class":"tasklist"});
	list.appendChild(list.form);
	list.form.appendChild(tag("input",{"type":"text", "class":"task", "placeholder":"Add your first to-do"}));
	list.form.appendChild(tag("button",{"class":"add"},"+"));
	list.form.appendChild(tag("input",{"type":"submit", "value":"Add", "placeholder":"Add your first to-do"}));
	list.task_container = tag("tasks",{"class":"active"});
	list.appendChild(list.task_container);
	list.appendChild(tag("tasks",{"class":"completed"}));
	
	var core = {
		formHandler: function(event) {
			event.preventDefault();
			doneski.rollup();
			var lst = event.target.list, tsk = list.getElementsByClassName("task")[0];
			list.add(tsk.value);
			tsk.value = "";
			return(false);
		},
		taskClick: function(event) {
			var tgt = event.target;
			if(!tgt.nocancel && tgt.clickable) {
				tgt.className += " clicky";
				window.setTimeout(function(){list.deleteItem(tgt);},1000);
			};
			tgt.nocancel = false;
		},
		taskMove: function(event) {
			var targt = event.target;
			targt.nocancel = true;
		},
		push: function(obj) {
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
		},
		save: function() {
			var st = [];
			for(var k in list.items) {
				var str = [k,list.items[k]].join(doneski.separator);
				if(!list.items[k]) st.push(str);
			};
			localStorage["doneski.lists."+list.id] = st.join(",");
		},
		remove: function(target) {
			target.className = target.className.replace("active","");
			window.setTimeout(function(){target.parentNode.removeChild(target);},200);
			list.items[target.innerHTML] = true;
			list.store();
		}
	};
	for(var i in core) {
		list[i] = _Doneski.bind(core[i],list);
	};
	list.form.list = list;
	list.form.addEventListener("submit",list.formHandler,true);
	list.id = id;
	list.title = title || "";
	list.items = [];
	// list.scroller = new iScroll(list.getElementsByTagName("wrapper")[0]);
	if(!localStorage["doneski.lists"] || localStorage["doneski.lists"].split(",").indexOf(list.id)==-1) {
		var cur = localStorage["doneski.lists"] ? localStorage["doneski.lists"].split(",") : [];
		cur.push(list.id);
		//localStorage["doneski.lists"] = cur;
	};
	return(list);
};

_Doneski.prototype.Task = function(content) {
	function tag(id,attr,content){var tg=document.creatElement(id);if(!content && typeof attr=="string"){attr=undefined;content=attr;};if(attr){for(var k in attr){tg[k]=attr[k];};};if(content){tg.innerHTML=content;};return(tg);};
	
	var task = tag("task",{"class":"active"},content);
	
	task.events = {
		click: function(event) {
			var tgt = event.target;
			if(!tgt.nocancel && tgt.clickable) {
				tgt.className += " clicky";
				window.setTimeout(function(){tgt.events.destroy();},_Doneski.linger);
			};
			tgt.nocancel = false;
		},
		move: function(event) {
			var targt = event.target;
			targt.nocancel = true;
		}
	};
	el.addEventListener("click",task.events["click"],true);
	el.addEventListener("touchend",doneski.taskClick,true);
	el.addEventListener("touchmove",list.taskMove,true);
	
	
	for(var i in core) {
		list[i] = _Doneski.bind(core[i],task);
	};
	task.id = id;
	list.title = title || "";
	list.items = [];
	// list.scroller = new iScroll(list.getElementsByTagName("wrapper")[0]);
	if(!localStorage["doneski.lists"] || localStorage["doneski.lists"].split(",").indexOf(list.id)==-1) {
		var cur = localStorage["doneski.lists"] ? localStorage["doneski.lists"].split(",") : [];
		cur.push(list.id);
		//localStorage["doneski.lists"] = cur;
	};
	return(list);	
};
window.Doneski = new _Doneski();
window.setTimeout("Doneski._init();",0);