var Syncer = function(obj,sync,perform,methods) {
	if(obj.sync_intercepts) {
		sync = function() {
			if(obj.sync && !!obj.sync.call) {
				obj.sync(Array.prototype.slice.call(arguments));
			};
		};
		perform = function(name,args) {
			sync(obj.id,name,(args = Array.prototype.slice.call(args)));
			return(methods[name].apply(obj,args));
		};
		methods = [];
		for(i=0;i<obj.sync_intercepts.length;i++) {
			methods[(m=obj.sync_intercepts[i])] = obj[m];
			(function(obj,method) {
				if(method) {
					obj[method] = function(){perform.apply(obj,[method,arguments]);};
				};
			})(obj,m);
		};
	};
	return(obj);
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