var _Doneski=function(d){var a=this,e=this,b={_init:function(){if(e.hasLocalStorage()){localStorage["doneski.lastSeen"]&&console.log(localStorage["doneski.lastSeen"]);localStorage["doneski.lastSeen"]=new Date}},hasLocalStorage:function(){return"localStorage"in window&&window.localStorage!==null},bind:function(f){return function(){f.apply(a,arguments)}},ping:function(){console.log("Redrum! Redrum!",a)}},c;for(c in b)a[c]=b.bind(b[c]);a._init(d)};window.Doneski=new _Doneski;Doneski.ping();
