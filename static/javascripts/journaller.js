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