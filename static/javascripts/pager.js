var Pager = function(obj) {
	var pager = this;
	// if(!window.pagers) window.pagers = [];
	// window.pagers.push(pager);
	pager.container = obj;
	pager.loadNext = function(cur) {
		pager.load(cur+1);
	};
	pager.loadPrevious = function(cur) {
		pager.load(cur-1);
	};
	pager.navclick = function(ev){
		var x = 0;
		ev.preventDefault();
		window.pager.load(window.pager.current_index,{ days : parseInt(ev.currentTarget.getAttribute("days"),10) },true);
		ev.currentTarget.className += " loading";
		var top = ev.currentTarget;
		while(top.tagName!="BLOCK") {
			top = top.parentNode;
		};
		var header = top.getElementsByTagName("header")[0], graph = top.getElementsByClassName("graph")[0], current = top.getElementsByClassName("active")[0];
		ev.currentTarget.parentNode.className += " active";
		header.className += " disabled";
		graph.className += " disabled";
		current.className += " disabled";
		return(false);
	};
	pager.captureNav = function(container) {
		var a = container.getElementsByTagName("a");
		for(var i=0;i<a.length;i++) {
			var lnk = a[i];
			if(lnk.pagerCaptured) {
				//console.log("already captured");
			} else {
				lnk.addEventListener("touchend",pager.navclick,true);
				lnk.addEventListener("click",pager.navclick,true);
				lnk.onclick = function(ev){ev.preventDefault();return(false);};
				lnk.pagerCaptured = true;
			};
		};
	};
	pager.pageBack = function(req) {
		var resp = req.currentTarget;
		if(resp.readyState==4) {
			localStorage[resp.pgid] = resp.responseText;
			var pg = pager.makePage(resp.pgid, resp.responseText, resp.current ? "current" : null);
			if(pager.page_cache[pg.page_id]) {
				pager.container.replaceChild(pg,pager.page_cache[pg.page_id]);
			} else {
				pager.container.insertBefore(pg,pager.page_cache[pager.pageBefore(pg.page_id)]);
			};
			pager.page_cache[pg.page_id] = pg;
			if(resp.current) {
				var scr = pg.getElementsByTagName("script");
				for(var i=0;i<scr.length;i++) {
					eval(scr[i].innerHTML);
				};
			};
		};
	};
	pager.makePage = function(pid,content,classes) {
		var pg = document.createElement("page");
		if(classes) pg.className = classes;
		pg.page_id = pid;
		pg.id = "p_"+pg.page_id;
		pg.innerHTML = content;
		// pager.page_cache[pg.page_id] = pg;
		if(pager.current_index>-1 && (idx = pager.known.indexOf(pg.page_id)) && idx > pager.current_index) {
			pg.className += " after";
		};
		pager.captureNav(pg);
		return(pg);
	};
	pager.pageBefore = function(page) {
		var idx = pager.known.indexOf(page);
		if(!idx || idx==0) return(undefined);
		return(pager.known[idx-1]);
	};
	pager.load = function(id,options,current) {
		var label = pager.known[id];
		pager.page_cache = pager.page_cache || {};
		if(!options && pager.page_cache[label]) {
			return;
		} else {
			if(!options && localStorage[label]) {
				pager.page_cache[label] = pager.makePage(label,localStorage[label],"cached");
				var node = pager.page_cache[label];
				var bef = pager.page_cache[pager.pageBefore(label)];
				pager.container.insertBefore(node,bef);
			};
			var opt_str = "", opt_arr=[];
			if(options) {
				opt_str = "?";
				for(var i in options) {
					opt_arr.push(i+"="+options[i]);
				};
				opt_str += opt_arr.join("&");
			};
			var req = new XMLHttpRequest();
			req.open("GET", "http://"+window.location.host+"/page/"+label+opt_str);
			req.onreadystatechange = pager.pageBack;
			req.pgid = label;
			req.current = current;
			req.send();
		};
	};
	pager.goPrevious = function() {
		if(pager.current_index) {
			pager.go(pager.current_index-1);
			return(true);
		};
		return(false);
	};
	pager.goNext = function() {
		if(pager.current_index<pager.known.length-1) {
			pager.go(pager.current_index+1);
			return(true);
		};
		return(false);
	};
	pager.go = function(idx) {
		var cur = pager.known[pager.current_index];
		var g = pager.known[idx];
		if(pager.page_cache[g]) {
			pager.page_cache[cur].className = pager.current_index < idx ? "" : "after";
			pager.page_cache[g].className = "current";
			var scr = pager.page_cache[g].getElementsByTagName("script");
			for(var i=0;i<scr.length;i++) {
				eval(scr[i].innerHTML);
			};
			pager.current_index = idx;
			pager.current_page = pager.page_cache[g];
			if(pager.current_index<pager.known.length-1) pager.loadNext(pager.current_index);
			if(pager.current_index>0) pager.loadPrevious(pager.current_index);
			for(i=pager.current_index+1;i<pager.known.length;i++) {
				if((pg = pager.page_cache[pager.known[i]])) pg.className = " after";
			};
		};
		var cur_page = pager.known[pager.current_index];
		if(window.history && "pushState" in window.history) {
			window.history.pushState({ page: cur_page }, document.title, cur_page);
		} else {
			window.location.hash = cur_page;
		};
	};
	pager.init = function(container,options) {
		pager.options = options;
		var pages = (options && (options.pages || (options.page_selector && Sizzle && Sizzle.select(options.page_selector)))) || container.getElementsByTagName("page");
		var pg_init = [];
		for(var i=0;i<pages.length;i++) {
			pg_init.push(pages[i]);
		};
		pager.known = window.page_order || [pages[0].id];
		for(i=0;i<pg_init.length;i++) {
			var pg = pg_init[i];
			pg.page_id = pg.id.replace(/^p_/,'');
			pager.current_index = 0;
			pager.current_page = pg;
			pager.current_index = pager.known.indexOf(pg.page_id) || 0;
			pager.page_cache = pager.page_cache || {};
			pager.page_cache[pg.page_id] = pg;
			if(pager.current_index<pager.known.length-1) pager.loadNext(pager.current_index);
			if(pager.current_index>0) pager.loadPrevious(pager.current_index);
		};
		if(Pager.modules && Pager.modules.length>0) {
			for(i=0;i<Pager.modules.length;i++) {
				//console.log(Pager.modules[i]);
			};
		};
	};
	pager.goPrevious = function() {
		if(pager.current_index) {
			pager.go(pager.current_index-1);
			return(true);
		};
		return(false);
	};
	pager.goNext = function() {
		if(pager.current_index<pager.known.length-1) {
			pager.go(pager.current_index+1);
			return(true);
		};
		return(false);
	};
	pager.swipe = function(event) {
		if(event.swipeEvent && (dir = event.swipeEvent.swipeDirection)) {
			var old = pager.current_page;
			if(dir=="right" && pager.goPrevious()) {
				old.className = old.className.replace("current","after");
			} else if(dir=="left" && pager.goNext()) {
				old.className = old.className.replace("current","");
			};
		};
		old.removeAttribute("style");
	};
	pager.touchstart = function(event) {
		pager.current_page.setAttribute("style", "-webkit-transform:translate3d(0px,0px,0);");
	};
	pager.swipemove = function(event) {
		if(event && event.swipeEvent) {
			pager.current_page.setAttribute("style", pager.current_page.getAttribute("style").replace(/-webkit-transform:translate3d\((-)?[0-9]{1,5}(px)?,/,"-webkit-transform:translate3d("+(0-event.swipeEvent.horzDiff)+"px,"));
		};
	};
	pager.key = function(event) {
			if(event.keyCode==37) {
				pager.goPrevious();
			} else if(event.keyCode==39) {
				pager.goNext();
			};
	};
	pager.init(obj);
};
Pager.modules = [];
Pager.prototype.Touch = function(obj) {
	var toucher = this;
	pager.container = obj;
	
};
Pager.modules.push(Pager.prototype.Touch);

function initTouchEvents() {
	window.pager = new Pager(document.getElementsByTagName("lists")[0]);
	var cont = document.getElementsByTagName("content")[0];
	if(typeof TouchyFeely != "undefined") {
		TouchyFeely.touchify(cont);
		window.pager.captureNav(cont);
		cont.addEventListener("swipe",window.pager.swipe,true);
		cont.addEventListener("swipemove",window.pager.swipemove,true);
		cont.addEventListener("touchstart",window.pager.touchstart,true);
	};
	document.body.addEventListener("keyup",window.pager.key,true);
};
window.addEventListener("load",initTouchEvents,true);