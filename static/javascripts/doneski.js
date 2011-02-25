var _Doneski = function(options) {
	var doneski = this;
	var core = {
		_init: function(context,options) {
			if(doneski.hasLocalStorage()) {
				doneski.touch();
			} else {
				// No local storage - hmmm...
				
			};
		},
		touch: function() {
			doneski.hasLocalStorage() && (localStorage["doneski.lastSeen"] = new Date());
		},
		lastSeen: function() {
			return doneski.hasLocalStorage() && localStorage["doneski.lastSeen"];
		},
		hasLocalStorage: function() {
			doneski._hasLS = doneski._hasLS || ('localStorage' in window && window['localStorage'] !== null);
			return doneski._hasLS;
		},
		ping: function() {
			console.log("Redrum! Redrum!", doneski);
		},
		bind: function(f) {
			return(function(){f.apply(doneski,arguments);});
		}
	};
	for(var i in core) {
		doneski[i] = core.bind(core[i]);
	};
	doneski._init(options);
};

window.Doneski = new _Doneski();