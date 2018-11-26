!function(e){e.fn.prettyDropdown=function(t){(t=e.extend({classic:!1,customClass:"arrow",width:null,height:50,hoverIntent:200,multiDelimiter:"; ",multiVerbosity:99,selectedMarker:"&#10003;",afterLoad:function(){}},t)).selectedMarker='<span aria-hidden="true" class="checked"> '+t.selectedMarker+"</span>",isNaN(t.width)&&!/^\d+%$/.test(t.width)&&(t.width=null),isNaN(t.height)?t.height=50:t.height<8&&(t.height=8),(isNaN(t.hoverIntent)||t.hoverIntent<0)&&(t.hoverIntent=200),isNaN(t.multiVerbosity)&&(t.multiVerbosity=99);var a,i,s,r,l,d,n=["0","1","2","3","4","5","6","7","8","9",,,,,,,,"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],o=function(a){var s,r=e(a),l=a.size,n=a.name||a.id||"";if(!r.data("loaded")){if(r.data("size",l).removeAttr("size"),r.css("visibility","hidden").outerHeight(t.height),d=+new Date,a.id){var o=e("label[for="+a.id+"]");o.length&&(o.attr("id")&&!/^menu\d{13,}$/.test(o.attr("id"))?s=o.attr("id"):o.attr("id",s="menu"+d))}i=0;var v=e("optgroup, option",r),m=v.filter(":selected"),b=a.multiple,w="<ul"+(a.disabled?"":' tabindex="0"')+' role="listbox"'+(a.title?' title="'+a.title+'" aria-label="'+a.title+'"':"")+(s?' aria-labelledby="'+s+'"':"")+' aria-activedescendant="item'+d+'-1" aria-expanded="false" style="max-height:'+(t.height-2)+"px;margin:"+r.css("margin-top")+" "+r.css("margin-right")+" "+r.css("margin-bottom")+" "+r.css("margin-left")+';">';b?(w+=p(null,"selected"),v.each(function(){this.selected?w+=p(this,"",!0):w+=p(this)})):t.classic?v.each(function(){w+=p(this)}):(w+=p(m[0],"selected"),v.filter(":not(:selected)").each(function(){w+=p(this)})),w+="</ul>",r.wrap("<div "+(n?'id="prettydropdown-'+n+'" ':"")+'class="prettydropdown '+(t.classic?"classic ":"")+(a.disabled?"disabled ":"")+(b?"multiple ":"")+t.customClass+' loading"'+(b||l>1?' style="height:'+t.height+'px;"':"")+"></div>").before(w).data("loaded",!0);var k,y=r.parent().children("ul"),x=y.outerWidth(!0);if(v=y.children(),b?g(y):t.classic&&e('[data-value="'+m.val()+'"]',y).addClass("selected").append(t.selectedMarker),y.width()<=0){var C=y.parent().clone().css({position:"absolute",top:"-100%"});e("body").append(C),x=C.children("ul").outerWidth(!0),e("li",C).width(x),k=C.children("ul").outerWidth(!0),C.remove()}v.width(x).css("width",v.css("width")),t.width&&(y.parent().css("min-width",v.css("width")),y.css("width","100%"),v.css("width","100%")),v.click(function(){var a=e(this),i=y.children(".selected");if(!y.parent().hasClass("disabled"))if(!y.hasClass("active")||a.hasClass("disabled")||a.hasClass("label")||a.data("value")===i.data("value")||(b?(a.children("span.checked").length?a.children("span.checked").remove():a.append(t.selectedMarker),y.children(":not(.selected)").each(function(t){e("optgroup, option",r).eq(t).prop("selected",e(this).children("span.checked").length>0)}),g(y)):(i.removeClass("selected").children("span.checked").remove(),a.addClass("selected").append(t.selectedMarker),t.classic||y.prepend(a),y.removeClass("reverse").attr("aria-activedescendant",a.attr("id")),i.data("group")&&!t.classic&&y.children(".label").filter(function(){return e(this).text()===i.data("group")}).after(i),e("optgroup, option",r).filter(function(){return this.value==a.data("value")||this.text===a.contents().filter(function(){return 3===this.nodeType}).text()}).prop("selected",!0)),r.trigger("change")),!a.hasClass("selected")&&b||(y.toggleClass("active"),y.attr("aria-expanded",y.hasClass("active"))),y.hasClass("active")){e(".prettydropdown > ul.active").length>1&&f(e(".prettydropdown > ul.active").not(y)[0]);var s,d=window.innerHeight,n=y.offset().top,o=e(document).scrollTop(),c=y.outerHeight();l&&(s=l*(t.height-2))<c-2&&(c=s+2);var h=n-o+c;h>d&&(n-o>d-(n-o+t.height)?(y.addClass("reverse"),t.classic||y.append(i),n-o+t.height<c&&(y.outerHeight(n-o+t.height),y.scrollTop(c))):y.height(y.height()-(h-d))),s&&s<y.height()&&y.css("height",s+"px"),t.classic&&y.scrollTop(i.index()*(t.height-2))}else y.data("clicked",!0),f(y[0])}),y.on({focusin:function(){e(window).off("keydown",h).on("keydown",h)},focusout:function(){e(window).off("keydown",h)},mouseenter:function(){y.data("hover",!0)},mouseleave:f,mousemove:u}),s&&e("#"+s).off("click",c).click(c),y.parent().width(t.width||k||y.outerWidth(!0)).removeClass("loading"),t.afterLoad()}},c=function(t){e("ul[aria-labelledby="+t.target.id+"]").focus()},h=function(i){var d=e(".prettydropdown > ul.active, .prettydropdown > ul:focus");if(d.length)if(9!==i.which){i.preventDefault(),i.stopPropagation();var o,c=d.children(),h=d.hasClass("active"),u=d.height()/(t.height-2),p=u%1<.5?Math.floor(u):Math.ceil(u);switch(s=Math.max(0,d.children(".hover").index()),r=c.length-1,a=c.eq(s),d.data("lastKeypress",+new Date),i.which){case 13:h||(a=c.filter(".selected"),v(a,1)),a.click();break;case 27:h&&f(d[0]);break;case 32:h?o=" ":(a=c.filter(".selected"),v(a,1),a.click());break;case 33:h&&(v(a,0),v(c.eq(Math.max(s-p-1,0)),1));break;case 34:h&&(v(a,0),v(c.eq(Math.min(s+p-1,r)),1));break;case 35:h&&(v(a,0),v(c.eq(r),1));break;case 36:h&&(v(a,0),v(c.eq(0),1));break;case 38:h&&(v(a,0),v(s?c.eq(s-1):c.eq(r),1));break;case 40:h&&(v(a,0),v(s===r?c.eq(0):c.eq(s+1),1));break;default:h&&(o=n[i.which-48])}if(o){clearTimeout(l),d.data("keysPressed",void 0===d.data("keysPressed")?o:d.data("keysPressed")+o),l=setTimeout(function(){d.removeData("keysPressed")},300);var g=[],m=a.index();if(c.each(function(t){0===e(this).text().toLowerCase().indexOf(d.data("keysPressed"))&&g.push(t)}),g.length)for(var b=0;b<g.length;++b){if(g[b]>m){v(c,0),v(c.eq(g[b]),1);break}b===g.length-1&&(v(c,0),v(c.eq(g[0]),1))}}}else f(d[0])},u=function(t){var a=e(t.currentTarget);"LI"!==t.target.nodeName||!a.hasClass("active")||new Date-a.data("lastKeypress")<200||(v(a.children(),0,1),v(e(t.target),1,1))},p=function(a,s,r){var l,n="",o="";if(s=s||"",a){switch(a.nodeName){case"OPTION":"OPTGROUP"===a.parentNode.nodeName&&(n=a.parentNode.getAttribute("label")),o=(a.getAttribute("data-prefix")||"")+a.text+(a.getAttribute("data-suffix")||"");break;case"OPTGROUP":s+=" label",o=(a.getAttribute("data-prefix")||"")+a.getAttribute("label")+(a.getAttribute("data-suffix")||"")}(a.disabled||n&&a.parentNode.disabled)&&(s+=" disabled"),l=a.title,n&&!l&&(l=a.parentNode.title)}return'<li id="item'+d+"-"+ ++i+'"'+(n?' data-group="'+n+'"':"")+(a&&(a.value||t.classic)?' data-value="'+a.value+'"':"")+(a&&"OPTION"===a.nodeName?' role="option"':"")+(l?' title="'+l+'" aria-label="'+l+'"':"")+(s?' class="'+e.trim(s)+'"':"")+(50!==t.height?' style="height:'+(t.height-2)+"px;line-height:"+(t.height-4)+'px;"':"")+">"+o+(r||"selected"===s?t.selectedMarker:"")+"</li>"},f=function(a){var i=e(a.currentTarget||a);"mouseleave"!==a.type||i.hasClass("active")||i.data("clicked")||(i=e(".prettydropdown > ul.active")),i.data("hover",!1),clearTimeout(l),l=setTimeout(function(){i.data("hover")||(i.hasClass("reverse")&&!t.classic&&i.prepend(i.children(":last-child")),i.removeClass("active reverse").removeData("clicked").attr("aria-expanded","false").css("height",""),i.children().removeClass("hover nohover"))},"mouseleave"!==a.type||i.data("clicked")?0:t.hoverIntent)},v=function(e,i,s){if(i){if(e.removeClass("nohover").addClass("hover"),1===e.length&&a&&!s){var l=e.parent(),d=l.outerHeight(),n=e.offset().top-l.offset().top-1;0===e.index()?l.scrollTop(0):e.index()===r?l.scrollTop(l.children().length*t.height):n+t.height>d?l.scrollTop(l.scrollTop()+t.height+n-d):n<0&&l.scrollTop(l.scrollTop()+n)}}else e.removeClass("hover").addClass("nohover")},g=function(a){var i,s=a.parent().children("select"),r=e("option",s).map(function(){if(this.selected)return this.text}).get();if(i=t.multiVerbosity>=r.length?r.join(t.multiDelimiter)||"None selected":r.length+"/"+e("option",s).length+" selected"){var l=(s.attr("title")?s.attr("title"):"")+(r.length?"\nSelected: "+r.join(t.multiDelimiter):"");a.children(".selected").text(i),a.attr({title:l,"aria-label":l})}else a.children(".selected").empty(),a.attr({title:s.attr("title"),"aria-label":s.attr("title")})};return this.refresh=function(t){return this.each(function(){var t=e(this);t.prevAll("ul").remove(),t.unwrap().data("loaded",!1),this.size=t.data("size"),o(this)})},this.each(function(){o(this)})}}(jQuery);

/*!
    localForage -- Offline Storage, Improved
    Version 1.7.1
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.localforage=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c||a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";function d(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function e(){try{if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof webkitIndexedDB)return webkitIndexedDB;if("undefined"!=typeof mozIndexedDB)return mozIndexedDB;if("undefined"!=typeof OIndexedDB)return OIndexedDB;if("undefined"!=typeof msIndexedDB)return msIndexedDB}catch(a){return}}function f(){try{if(!ua)return!1;var a="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform),b="function"==typeof fetch&&-1!==fetch.toString().indexOf("[native code");return(!a||b)&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(a){return!1}}function g(a,b){a=a||[],b=b||{};try{return new Blob(a,b)}catch(f){if("TypeError"!==f.name)throw f;for(var c="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder,d=new c,e=0;e<a.length;e+=1)d.append(a[e]);return d.getBlob(b.type)}}function h(a,b){b&&a.then(function(a){b(null,a)},function(a){b(a)})}function i(a,b,c){"function"==typeof b&&a.then(b),"function"==typeof c&&a.catch(c)}function j(a){return"string"!=typeof a&&(console.warn(a+" used as a key, but it is not a string."),a=String(a)),a}function k(){if(arguments.length&&"function"==typeof arguments[arguments.length-1])return arguments[arguments.length-1]}function l(a){for(var b=a.length,c=new ArrayBuffer(b),d=new Uint8Array(c),e=0;e<b;e++)d[e]=a.charCodeAt(e);return c}function m(a){return new va(function(b){var c=a.transaction(wa,Ba),d=g([""]);c.objectStore(wa).put(d,"key"),c.onabort=function(a){a.preventDefault(),a.stopPropagation(),b(!1)},c.oncomplete=function(){var a=navigator.userAgent.match(/Chrome\/(\d+)/),c=navigator.userAgent.match(/Edge\//);b(c||!a||parseInt(a[1],10)>=43)}}).catch(function(){return!1})}function n(a){return"boolean"==typeof xa?va.resolve(xa):m(a).then(function(a){return xa=a})}function o(a){var b=ya[a.name],c={};c.promise=new va(function(a,b){c.resolve=a,c.reject=b}),b.deferredOperations.push(c),b.dbReady?b.dbReady=b.dbReady.then(function(){return c.promise}):b.dbReady=c.promise}function p(a){var b=ya[a.name],c=b.deferredOperations.pop();if(c)return c.resolve(),c.promise}function q(a,b){var c=ya[a.name],d=c.deferredOperations.pop();if(d)return d.reject(b),d.promise}function r(a,b){return new va(function(c,d){if(ya[a.name]=ya[a.name]||B(),a.db){if(!b)return c(a.db);o(a),a.db.close()}var e=[a.name];b&&e.push(a.version);var f=ua.open.apply(ua,e);b&&(f.onupgradeneeded=function(b){var c=f.result;try{c.createObjectStore(a.storeName),b.oldVersion<=1&&c.createObjectStore(wa)}catch(c){if("ConstraintError"!==c.name)throw c;console.warn('The database "'+a.name+'" has been upgraded from version '+b.oldVersion+" to version "+b.newVersion+', but the storage "'+a.storeName+'" already exists.')}}),f.onerror=function(a){a.preventDefault(),d(f.error)},f.onsuccess=function(){c(f.result),p(a)}})}function s(a){return r(a,!1)}function t(a){return r(a,!0)}function u(a,b){if(!a.db)return!0;var c=!a.db.objectStoreNames.contains(a.storeName),d=a.version<a.db.version,e=a.version>a.db.version;if(d&&(a.version!==b&&console.warn('The database "'+a.name+"\" can't be downgraded from version "+a.db.version+" to version "+a.version+"."),a.version=a.db.version),e||c){if(c){var f=a.db.version+1;f>a.version&&(a.version=f)}return!0}return!1}function v(a){return new va(function(b,c){var d=new FileReader;d.onerror=c,d.onloadend=function(c){var d=btoa(c.target.result||"");b({__local_forage_encoded_blob:!0,data:d,type:a.type})},d.readAsBinaryString(a)})}function w(a){return g([l(atob(a.data))],{type:a.type})}function x(a){return a&&a.__local_forage_encoded_blob}function y(a){var b=this,c=b._initReady().then(function(){var a=ya[b._dbInfo.name];if(a&&a.dbReady)return a.dbReady});return i(c,a,a),c}function z(a){o(a);for(var b=ya[a.name],c=b.forages,d=0;d<c.length;d++){var e=c[d];e._dbInfo.db&&(e._dbInfo.db.close(),e._dbInfo.db=null)}return a.db=null,s(a).then(function(b){return a.db=b,u(a)?t(a):b}).then(function(d){a.db=b.db=d;for(var e=0;e<c.length;e++)c[e]._dbInfo.db=d}).catch(function(b){throw q(a,b),b})}function A(a,b,c,d){void 0===d&&(d=1);try{var e=a.db.transaction(a.storeName,b);c(null,e)}catch(e){if(d>0&&(!a.db||"InvalidStateError"===e.name||"NotFoundError"===e.name))return va.resolve().then(function(){if(!a.db||"NotFoundError"===e.name&&!a.db.objectStoreNames.contains(a.storeName)&&a.version<=a.db.version)return a.db&&(a.version=a.db.version+1),t(a)}).then(function(){return z(a).then(function(){A(a,b,c,d-1)})}).catch(c);c(e)}}function B(){return{forages:[],db:null,dbReady:null,deferredOperations:[]}}function C(a){function b(){return va.resolve()}var c=this,d={db:null};if(a)for(var e in a)d[e]=a[e];var f=ya[d.name];f||(f=B(),ya[d.name]=f),f.forages.push(c),c._initReady||(c._initReady=c.ready,c.ready=y);for(var g=[],h=0;h<f.forages.length;h++){var i=f.forages[h];i!==c&&g.push(i._initReady().catch(b))}var j=f.forages.slice(0);return va.all(g).then(function(){return d.db=f.db,s(d)}).then(function(a){return d.db=a,u(d,c._defaultConfig.version)?t(d):a}).then(function(a){d.db=f.db=a,c._dbInfo=d;for(var b=0;b<j.length;b++){var e=j[b];e!==c&&(e._dbInfo.db=d.db,e._dbInfo.version=d.version)}})}function D(a,b){var c=this;a=j(a);var d=new va(function(b,d){c.ready().then(function(){A(c._dbInfo,Aa,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.get(a);h.onsuccess=function(){var a=h.result;void 0===a&&(a=null),x(a)&&(a=w(a)),b(a)},h.onerror=function(){d(h.error)}}catch(a){d(a)}})}).catch(d)});return h(d,b),d}function E(a,b){var c=this,d=new va(function(b,d){c.ready().then(function(){A(c._dbInfo,Aa,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.openCursor(),i=1;h.onsuccess=function(){var c=h.result;if(c){var d=c.value;x(d)&&(d=w(d));var e=a(d,c.key,i++);void 0!==e?b(e):c.continue()}else b()},h.onerror=function(){d(h.error)}}catch(a){d(a)}})}).catch(d)});return h(d,b),d}function F(a,b,c){var d=this;a=j(a);var e=new va(function(c,e){var f;d.ready().then(function(){return f=d._dbInfo,"[object Blob]"===za.call(b)?n(f.db).then(function(a){return a?b:v(b)}):b}).then(function(b){A(d._dbInfo,Ba,function(f,g){if(f)return e(f);try{var h=g.objectStore(d._dbInfo.storeName);null===b&&(b=void 0);var i=h.put(b,a);g.oncomplete=function(){void 0===b&&(b=null),c(b)},g.onabort=g.onerror=function(){var a=i.error?i.error:i.transaction.error;e(a)}}catch(a){e(a)}})}).catch(e)});return h(e,c),e}function G(a,b){var c=this;a=j(a);var d=new va(function(b,d){c.ready().then(function(){A(c._dbInfo,Ba,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.delete(a);f.oncomplete=function(){b()},f.onerror=function(){d(h.error)},f.onabort=function(){var a=h.error?h.error:h.transaction.error;d(a)}}catch(a){d(a)}})}).catch(d)});return h(d,b),d}function H(a){var b=this,c=new va(function(a,c){b.ready().then(function(){A(b._dbInfo,Ba,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.clear();e.oncomplete=function(){a()},e.onabort=e.onerror=function(){var a=g.error?g.error:g.transaction.error;c(a)}}catch(a){c(a)}})}).catch(c)});return h(c,a),c}function I(a){var b=this,c=new va(function(a,c){b.ready().then(function(){A(b._dbInfo,Aa,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.count();g.onsuccess=function(){a(g.result)},g.onerror=function(){c(g.error)}}catch(a){c(a)}})}).catch(c)});return h(c,a),c}function J(a,b){var c=this,d=new va(function(b,d){if(a<0)return void b(null);c.ready().then(function(){A(c._dbInfo,Aa,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=!1,i=g.openCursor();i.onsuccess=function(){var c=i.result;if(!c)return void b(null);0===a?b(c.key):h?b(c.key):(h=!0,c.advance(a))},i.onerror=function(){d(i.error)}}catch(a){d(a)}})}).catch(d)});return h(d,b),d}function K(a){var b=this,c=new va(function(a,c){b.ready().then(function(){A(b._dbInfo,Aa,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.openCursor(),h=[];g.onsuccess=function(){var b=g.result;if(!b)return void a(h);h.push(b.key),b.continue()},g.onerror=function(){c(g.error)}}catch(a){c(a)}})}).catch(c)});return h(c,a),c}function L(a,b){b=k.apply(this,arguments);var c=this.config();a="function"!=typeof a&&a||{},a.name||(a.name=a.name||c.name,a.storeName=a.storeName||c.storeName);var d,e=this;if(a.name){var f=a.name===c.name&&e._dbInfo.db,g=f?va.resolve(e._dbInfo.db):s(a).then(function(b){var c=ya[a.name],d=c.forages;c.db=b;for(var e=0;e<d.length;e++)d[e]._dbInfo.db=b;return b});d=a.storeName?g.then(function(b){if(b.objectStoreNames.contains(a.storeName)){var c=b.version+1;o(a);var d=ya[a.name],e=d.forages;b.close();for(var f=0;f<e.length;f++){var g=e[f];g._dbInfo.db=null,g._dbInfo.version=c}return new va(function(b,d){var e=ua.open(a.name,c);e.onerror=function(a){e.result.close(),d(a)},e.onupgradeneeded=function(){e.result.deleteObjectStore(a.storeName)},e.onsuccess=function(){var a=e.result;a.close(),b(a)}}).then(function(a){d.db=a;for(var b=0;b<e.length;b++){var c=e[b];c._dbInfo.db=a,p(c._dbInfo)}}).catch(function(b){throw(q(a,b)||va.resolve()).catch(function(){}),b})}}):g.then(function(b){o(a);var c=ya[a.name],d=c.forages;b.close();for(var e=0;e<d.length;e++){d[e]._dbInfo.db=null}return new va(function(b,c){var d=ua.deleteDatabase(a.name);d.onerror=d.onblocked=function(a){var b=d.result;b&&b.close(),c(a)},d.onsuccess=function(){var a=d.result;a&&a.close(),b(a)}}).then(function(a){c.db=a;for(var b=0;b<d.length;b++)p(d[b]._dbInfo)}).catch(function(b){throw(q(a,b)||va.resolve()).catch(function(){}),b})})}else d=va.reject("Invalid arguments");return h(d,b),d}function M(){return"function"==typeof openDatabase}function N(a){var b,c,d,e,f,g=.75*a.length,h=a.length,i=0;"="===a[a.length-1]&&(g--,"="===a[a.length-2]&&g--);var j=new ArrayBuffer(g),k=new Uint8Array(j);for(b=0;b<h;b+=4)c=Da.indexOf(a[b]),d=Da.indexOf(a[b+1]),e=Da.indexOf(a[b+2]),f=Da.indexOf(a[b+3]),k[i++]=c<<2|d>>4,k[i++]=(15&d)<<4|e>>2,k[i++]=(3&e)<<6|63&f;return j}function O(a){var b,c=new Uint8Array(a),d="";for(b=0;b<c.length;b+=3)d+=Da[c[b]>>2],d+=Da[(3&c[b])<<4|c[b+1]>>4],d+=Da[(15&c[b+1])<<2|c[b+2]>>6],d+=Da[63&c[b+2]];return c.length%3==2?d=d.substring(0,d.length-1)+"=":c.length%3==1&&(d=d.substring(0,d.length-2)+"=="),d}function P(a,b){var c="";if(a&&(c=Ua.call(a)),a&&("[object ArrayBuffer]"===c||a.buffer&&"[object ArrayBuffer]"===Ua.call(a.buffer))){var d,e=Ga;a instanceof ArrayBuffer?(d=a,e+=Ia):(d=a.buffer,"[object Int8Array]"===c?e+=Ka:"[object Uint8Array]"===c?e+=La:"[object Uint8ClampedArray]"===c?e+=Ma:"[object Int16Array]"===c?e+=Na:"[object Uint16Array]"===c?e+=Pa:"[object Int32Array]"===c?e+=Oa:"[object Uint32Array]"===c?e+=Qa:"[object Float32Array]"===c?e+=Ra:"[object Float64Array]"===c?e+=Sa:b(new Error("Failed to get type for BinaryArray"))),b(e+O(d))}else if("[object Blob]"===c){var f=new FileReader;f.onload=function(){var c=Ea+a.type+"~"+O(this.result);b(Ga+Ja+c)},f.readAsArrayBuffer(a)}else try{b(JSON.stringify(a))}catch(c){console.error("Couldn't convert value into a JSON string: ",a),b(null,c)}}function Q(a){if(a.substring(0,Ha)!==Ga)return JSON.parse(a);var b,c=a.substring(Ta),d=a.substring(Ha,Ta);if(d===Ja&&Fa.test(c)){var e=c.match(Fa);b=e[1],c=c.substring(e[0].length)}var f=N(c);switch(d){case Ia:return f;case Ja:return g([f],{type:b});case Ka:return new Int8Array(f);case La:return new Uint8Array(f);case Ma:return new Uint8ClampedArray(f);case Na:return new Int16Array(f);case Pa:return new Uint16Array(f);case Oa:return new Int32Array(f);case Qa:return new Uint32Array(f);case Ra:return new Float32Array(f);case Sa:return new Float64Array(f);default:throw new Error("Unkown type: "+d)}}function R(a,b,c,d){a.executeSql("CREATE TABLE IF NOT EXISTS "+b.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],c,d)}function S(a){var b=this,c={db:null};if(a)for(var d in a)c[d]="string"!=typeof a[d]?a[d].toString():a[d];var e=new va(function(a,d){try{c.db=openDatabase(c.name,String(c.version),c.description,c.size)}catch(a){return d(a)}c.db.transaction(function(e){R(e,c,function(){b._dbInfo=c,a()},function(a,b){d(b)})},d)});return c.serializer=Va,e}function T(a,b,c,d,e,f){a.executeSql(c,d,e,function(a,g){g.code===g.SYNTAX_ERR?a.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?",[name],function(a,h){h.rows.length?f(a,g):R(a,b,function(){a.executeSql(c,d,e,f)},f)},f):f(a,g)},f)}function U(a,b){var c=this;a=j(a);var d=new va(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){T(c,e,"SELECT * FROM "+e.storeName+" WHERE key = ? LIMIT 1",[a],function(a,c){var d=c.rows.length?c.rows.item(0).value:null;d&&(d=e.serializer.deserialize(d)),b(d)},function(a,b){d(b)})})}).catch(d)});return h(d,b),d}function V(a,b){var c=this,d=new va(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){T(c,e,"SELECT * FROM "+e.storeName,[],function(c,d){for(var f=d.rows,g=f.length,h=0;h<g;h++){var i=f.item(h),j=i.value;if(j&&(j=e.serializer.deserialize(j)),void 0!==(j=a(j,i.key,h+1)))return void b(j)}b()},function(a,b){d(b)})})}).catch(d)});return h(d,b),d}function W(a,b,c,d){var e=this;a=j(a);var f=new va(function(f,g){e.ready().then(function(){void 0===b&&(b=null);var h=b,i=e._dbInfo;i.serializer.serialize(b,function(b,j){j?g(j):i.db.transaction(function(c){T(c,i,"INSERT OR REPLACE INTO "+i.storeName+" (key, value) VALUES (?, ?)",[a,b],function(){f(h)},function(a,b){g(b)})},function(b){if(b.code===b.QUOTA_ERR){if(d>0)return void f(W.apply(e,[a,h,c,d-1]));g(b)}})})}).catch(g)});return h(f,c),f}function X(a,b,c){return W.apply(this,[a,b,c,1])}function Y(a,b){var c=this;a=j(a);var d=new va(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){T(c,e,"DELETE FROM "+e.storeName+" WHERE key = ?",[a],function(){b()},function(a,b){d(b)})})}).catch(d)});return h(d,b),d}function Z(a){var b=this,c=new va(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){T(b,d,"DELETE FROM "+d.storeName,[],function(){a()},function(a,b){c(b)})})}).catch(c)});return h(c,a),c}function $(a){var b=this,c=new va(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){T(b,d,"SELECT COUNT(key) as c FROM "+d.storeName,[],function(b,c){var d=c.rows.item(0).c;a(d)},function(a,b){c(b)})})}).catch(c)});return h(c,a),c}function _(a,b){var c=this,d=new va(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){T(c,e,"SELECT key FROM "+e.storeName+" WHERE id = ? LIMIT 1",[a+1],function(a,c){var d=c.rows.length?c.rows.item(0).key:null;b(d)},function(a,b){d(b)})})}).catch(d)});return h(d,b),d}function aa(a){var b=this,c=new va(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){T(b,d,"SELECT key FROM "+d.storeName,[],function(b,c){for(var d=[],e=0;e<c.rows.length;e++)d.push(c.rows.item(e).key);a(d)},function(a,b){c(b)})})}).catch(c)});return h(c,a),c}function ba(a){return new va(function(b,c){a.transaction(function(d){d.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",[],function(c,d){for(var e=[],f=0;f<d.rows.length;f++)e.push(d.rows.item(f).name);b({db:a,storeNames:e})},function(a,b){c(b)})},function(a){c(a)})})}function ca(a,b){b=k.apply(this,arguments);var c=this.config();a="function"!=typeof a&&a||{},a.name||(a.name=a.name||c.name,a.storeName=a.storeName||c.storeName);var d,e=this;return d=a.name?new va(function(b){var d;d=a.name===c.name?e._dbInfo.db:openDatabase(a.name,"","",0),b(a.storeName?{db:d,storeNames:[a.storeName]}:ba(d))}).then(function(a){return new va(function(b,c){a.db.transaction(function(d){function e(a){return new va(function(b,c){d.executeSql("DROP TABLE IF EXISTS "+a,[],function(){b()},function(a,b){c(b)})})}for(var f=[],g=0,h=a.storeNames.length;g<h;g++)f.push(e(a.storeNames[g]));va.all(f).then(function(){b()}).catch(function(a){c(a)})},function(a){c(a)})})}):va.reject("Invalid arguments"),h(d,b),d}function da(){try{return"undefined"!=typeof localStorage&&"setItem"in localStorage&&!!localStorage.setItem}catch(a){return!1}}function ea(a,b){var c=a.name+"/";return a.storeName!==b.storeName&&(c+=a.storeName+"/"),c}function fa(){var a="_localforage_support_test";try{return localStorage.setItem(a,!0),localStorage.removeItem(a),!1}catch(a){return!0}}function ga(){return!fa()||localStorage.length>0}function ha(a){var b=this,c={};if(a)for(var d in a)c[d]=a[d];return c.keyPrefix=ea(a,b._defaultConfig),ga()?(b._dbInfo=c,c.serializer=Va,va.resolve()):va.reject()}function ia(a){var b=this,c=b.ready().then(function(){for(var a=b._dbInfo.keyPrefix,c=localStorage.length-1;c>=0;c--){var d=localStorage.key(c);0===d.indexOf(a)&&localStorage.removeItem(d)}});return h(c,a),c}function ja(a,b){var c=this;a=j(a);var d=c.ready().then(function(){var b=c._dbInfo,d=localStorage.getItem(b.keyPrefix+a);return d&&(d=b.serializer.deserialize(d)),d});return h(d,b),d}function ka(a,b){var c=this,d=c.ready().then(function(){for(var b=c._dbInfo,d=b.keyPrefix,e=d.length,f=localStorage.length,g=1,h=0;h<f;h++){var i=localStorage.key(h);if(0===i.indexOf(d)){var j=localStorage.getItem(i);if(j&&(j=b.serializer.deserialize(j)),void 0!==(j=a(j,i.substring(e),g++)))return j}}});return h(d,b),d}function la(a,b){var c=this,d=c.ready().then(function(){var b,d=c._dbInfo;try{b=localStorage.key(a)}catch(a){b=null}return b&&(b=b.substring(d.keyPrefix.length)),b});return h(d,b),d}function ma(a){var b=this,c=b.ready().then(function(){for(var a=b._dbInfo,c=localStorage.length,d=[],e=0;e<c;e++){var f=localStorage.key(e);0===f.indexOf(a.keyPrefix)&&d.push(f.substring(a.keyPrefix.length))}return d});return h(c,a),c}function na(a){var b=this,c=b.keys().then(function(a){return a.length});return h(c,a),c}function oa(a,b){var c=this;a=j(a);var d=c.ready().then(function(){var b=c._dbInfo;localStorage.removeItem(b.keyPrefix+a)});return h(d,b),d}function pa(a,b,c){var d=this;a=j(a);var e=d.ready().then(function(){void 0===b&&(b=null);var c=b;return new va(function(e,f){var g=d._dbInfo;g.serializer.serialize(b,function(b,d){if(d)f(d);else try{localStorage.setItem(g.keyPrefix+a,b),e(c)}catch(a){"QuotaExceededError"!==a.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==a.name||f(a),f(a)}})})});return h(e,c),e}function qa(a,b){if(b=k.apply(this,arguments),a="function"!=typeof a&&a||{},!a.name){var c=this.config();a.name=a.name||c.name,a.storeName=a.storeName||c.storeName}var d,e=this;return d=a.name?new va(function(b){b(a.storeName?ea(a,e._defaultConfig):a.name+"/")}).then(function(a){for(var b=localStorage.length-1;b>=0;b--){var c=localStorage.key(b);0===c.indexOf(a)&&localStorage.removeItem(c)}}):va.reject("Invalid arguments"),h(d,b),d}function ra(a,b){a[b]=function(){var c=arguments;return a.ready().then(function(){return a[b].apply(a,c)})}}function sa(){for(var a=1;a<arguments.length;a++){var b=arguments[a];if(b)for(var c in b)b.hasOwnProperty(c)&&($a(b[c])?arguments[0][c]=b[c].slice():arguments[0][c]=b[c])}return arguments[0]}var ta="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},ua=e();"undefined"==typeof Promise&&a("lie/polyfill");var va=Promise,wa="local-forage-detect-blob-support",xa=void 0,ya={},za=Object.prototype.toString,Aa="readonly",Ba="readwrite",Ca={_driver:"asyncStorage",_initStorage:C,_support:f(),iterate:E,getItem:D,setItem:F,removeItem:G,clear:H,length:I,key:J,keys:K,dropInstance:L},Da="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ea="~~local_forage_type~",Fa=/^~~local_forage_type~([^~]+)~/,Ga="__lfsc__:",Ha=Ga.length,Ia="arbf",Ja="blob",Ka="si08",La="ui08",Ma="uic8",Na="si16",Oa="si32",Pa="ur16",Qa="ui32",Ra="fl32",Sa="fl64",Ta=Ha+Ia.length,Ua=Object.prototype.toString,Va={serialize:P,deserialize:Q,stringToBuffer:N,bufferToString:O},Wa={_driver:"webSQLStorage",_initStorage:S,_support:M(),iterate:V,getItem:U,setItem:X,removeItem:Y,clear:Z,length:$,key:_,keys:aa,dropInstance:ca},Xa={_driver:"localStorageWrapper",_initStorage:ha,_support:da(),iterate:ka,getItem:ja,setItem:pa,removeItem:oa,clear:ia,length:na,key:la,keys:ma,dropInstance:qa},Ya=function(a,b){return a===b||"number"==typeof a&&"number"==typeof b&&isNaN(a)&&isNaN(b)},Za=function(a,b){for(var c=a.length,d=0;d<c;){if(Ya(a[d],b))return!0;d++}return!1},$a=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},_a={},ab={},bb={INDEXEDDB:Ca,WEBSQL:Wa,LOCALSTORAGE:Xa},cb=[bb.INDEXEDDB._driver,bb.WEBSQL._driver,bb.LOCALSTORAGE._driver],db=["dropInstance"],eb=["clear","getItem","iterate","key","keys","length","removeItem","setItem"].concat(db),fb={description:"",driver:cb.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1},gb=function(){function a(b){d(this,a);for(var c in bb)if(bb.hasOwnProperty(c)){var e=bb[c],f=e._driver;this[c]=f,_a[f]||this.defineDriver(e)}this._defaultConfig=sa({},fb),this._config=sa({},this._defaultConfig,b),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver).catch(function(){})}return a.prototype.config=function(a){if("object"===(void 0===a?"undefined":ta(a))){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var b in a){if("storeName"===b&&(a[b]=a[b].replace(/\W/g,"_")),"version"===b&&"number"!=typeof a[b])return new Error("Database version must be a number.");this._config[b]=a[b]}return!("driver"in a&&a.driver)||this.setDriver(this._config.driver)}return"string"==typeof a?this._config[a]:this._config},a.prototype.defineDriver=function(a,b,c){var d=new va(function(b,c){try{var d=a._driver,e=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");if(!a._driver)return void c(e);for(var f=eb.concat("_initStorage"),g=0,i=f.length;g<i;g++){var j=f[g];if((!Za(db,j)||a[j])&&"function"!=typeof a[j])return void c(e)}(function(){for(var b=function(a){return function(){var b=new Error("Method "+a+" is not implemented by the current driver"),c=va.reject(b);return h(c,arguments[arguments.length-1]),c}},c=0,d=db.length;c<d;c++){var e=db[c];a[e]||(a[e]=b(e))}})();var k=function(c){_a[d]&&console.info("Redefining LocalForage driver: "+d),_a[d]=a,ab[d]=c,b()};"_support"in a?a._support&&"function"==typeof a._support?a._support().then(k,c):k(!!a._support):k(!0)}catch(a){c(a)}});return i(d,b,c),d},a.prototype.driver=function(){return this._driver||null},a.prototype.getDriver=function(a,b,c){var d=_a[a]?va.resolve(_a[a]):va.reject(new Error("Driver not found."));return i(d,b,c),d},a.prototype.getSerializer=function(a){var b=va.resolve(Va);return i(b,a),b},a.prototype.ready=function(a){var b=this,c=b._driverSet.then(function(){return null===b._ready&&(b._ready=b._initDriver()),b._ready});return i(c,a,a),c},a.prototype.setDriver=function(a,b,c){function d(){g._config.driver=g.driver()}function e(a){return g._extend(a),d(),g._ready=g._initStorage(g._config),g._ready}function f(a){return function(){function b(){for(;c<a.length;){var f=a[c];return c++,g._dbInfo=null,g._ready=null,g.getDriver(f).then(e).catch(b)}d();var h=new Error("No available storage method found.");return g._driverSet=va.reject(h),g._driverSet}var c=0;return b()}}var g=this;$a(a)||(a=[a]);var h=this._getSupportedDrivers(a),j=null!==this._driverSet?this._driverSet.catch(function(){return va.resolve()}):va.resolve();return this._driverSet=j.then(function(){var a=h[0];return g._dbInfo=null,g._ready=null,g.getDriver(a).then(function(a){g._driver=a._driver,d(),g._wrapLibraryMethodsWithReady(),g._initDriver=f(h)})}).catch(function(){d();var a=new Error("No available storage method found.");return g._driverSet=va.reject(a),g._driverSet}),i(this._driverSet,b,c),this._driverSet},a.prototype.supports=function(a){return!!ab[a]},a.prototype._extend=function(a){sa(this,a)},a.prototype._getSupportedDrivers=function(a){for(var b=[],c=0,d=a.length;c<d;c++){var e=a[c];this.supports(e)&&b.push(e)}return b},a.prototype._wrapLibraryMethodsWithReady=function(){for(var a=0,b=eb.length;a<b;a++)ra(this,eb[a])},a.prototype.createInstance=function(b){return new a(b)},a}(),hb=new gb;b.exports=hb},{undefined:void 0}]},{},[1])(1)});

localforage.config({
  name : 'CorePersonnelWA',
  version : 1.0,
  description : 'Local database solution for the Core Personnel WA web application'
});

(function($){
	$(function() {

		var emailRegx = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;

    var pwdVisibility = {

      toggle: function() {

        $('[class*="__input-pwd-eye"]').on('click', function() {
          $(this).toggleClass('__open__');

          // toggle field type
          var inputType = $(this).hasClass('__open__') ? 'text' : 'password';
          $(this).closest('.__pwd-eye__').find('input').prop('type', inputType);
        });

      }

    };

    pwdVisibility.toggle();

    // display server error
    var serverErrDisplay = {

      init: function(err) {
        if( err ) {
          console.log(err);
          $('.error-strip__list-item.__' + err.status + '__').slideDown(240).siblings('.error-strip__list-item').slideUp(300);

          // hide error
          setTimeout(function() {
            $('.error-strip__list-item').stop(true, true);
            $('.error-strip__list-item').slideUp(300);
          }, 3000);
        }
      },

      closeMsg: function() {

        $('.error-strip__hide').on('click', function() {
          $('.error-strip__list-item').slideUp(300);
        });

      }

    };

    var customErrMsg = {

      trigger: function(text) {
        $('.error-strip__list-item.__custom__').text(text).slideDown(240).siblings('.error-strip__list-item').slideUp(300);

        // hide error
        setTimeout(function() {
          $('.error-strip__list-item.__custom__').stop(true, true);
          $('.error-strip__list-item.__custom__').slideUp(300);
        }, 3000);
      }

    };

    serverErrDisplay.closeMsg();

		var signup = {

			config: {
				emailRegx: emailRegx,
        timeout: CLIENT_TIMEOUT,
				pwdMinLength: PWD_MIN_LENGTH,
				companyTest: false,
				emailTest: false,
				pwdTest: false,
				// subscription
				defaultDuration: 1,
				defaultCurrency: 'usd',
				defaultSymbol: '$',
				// strip
				stripeApiKey: STRIPE_API_KEY,
				// value
				value: {
					company: null,
					email: null,
					pwd: null,
					subscription: null,
          stripeToken: null,
          abandonedSub: null
				},
        // urlx
        populateSubscriptionURL: '/api/subscription',
        abandonedSubURL: '/api/abandoned-subs',
        createUserURL: '/api/user',
        emailAvaibilityURL: '/api/user/is-available/email/'
			},

			init: function(config) {
				$.extend(this.config, config);

				this.testCtrl();
				this.submit();
				this.populateData({ block: ['subscription'] });
				this.stripeconfig(this.config.stripeApiKey);
        this.goBack();

			}, // init

			testCtrl: function() {
				var self = this;

				// company
				$('#form--signup__input-company').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'company' });
				});

				// email
				$('#form--signup__input-email').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'email' });
				});

				// pwd
				$('#form--signup__input-pwd').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'pwd' });
				});

        // subscription
        $('#form--signup__input-subscription').on('change', function(e) {
          self.HandleError({ value: e.target.value, event: e.type, type: 'subscription' });
        });

			}, // testCtrl

			HandleError: function(req) {

				var $companyTrgt = $('.form--signup__input.-company').find('.err-list'),
						$emailTrgt = $('.form--signup__input.-email').find('.err-list'),
						$pwdTrgt = $('.form--signup__input.-pwd').find('.err-list'),
            $subscriptionTrgt = $('.form--signup__input.-subscription').find('.err-list');

				if( req.type === 'company' ) {
					this.companyHandleError(req.value, req.event, $companyTrgt);
				}
				if( req.type === 'email' ) {
					this.emailHandleError(req.value, req.event, $emailTrgt);
				}
				if( req.type === 'pwd' ) {
					this.pwdHandleError(req.value, req.event, $pwdTrgt);
				}
        if( req.type === 'subscription' ) {
          this.subscriptionHandleError(req.value, req.event, $subscriptionTrgt);
        }

			}, // HandleError

			companyHandleError: function(value, event, $trgt) {
				var required = false;
				// test require
				required = value ? true : false;

				if( required ) {
					$trgt.find('[class*="--required"]').slideUp(300);
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
						}
				}

				this.config.companyTest = required ? true : false;

			}, // companyHandleError

			emailHandleError: function(value, event, $trgt) {
				var patternTest, required;
				patternTest = required = false;

				// test email pattern
				patternTest = emailRegx ? emailRegx.test(value) : false;
				// test require
				required = value ? true : false;

        // hide email avaibility on keyup
        if( event === 'keyup' ) $trgt.find('[class*="--available"]').slideUp(300);

				if( required ) {
					$trgt.find('[class*="--required"]').slideUp(300);

					// patter test
					if( patternTest ) {
						$trgt.find('[class*="--pattern"]').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('[class*="--pattern"]').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
						}
				}

				this.config.emailTest = ( patternTest && required ) ? true : false;

			}, // emailHandleError

			pwdHandleError: function(value, event, $trgt) {
				var patternTest, required;
				minlength = required = false;

				// test minlength
				minlength = value.length >= this.config.pwdMinLength ? true : false;
				// test require
				required = value ? true : false;

				if( required ) {
					$trgt.find('[class*="--required"]').slideUp(300);

					// patter test
					if( minlength ) {
						$trgt.find('[class*="--minlength"]').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('[class*="--minlength"]').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
						}
				}

				this.config.pwdTest = ( minlength && required ) ? true : false;

			}, // pwdHandleError

      subscriptionHandleError: function(value, event, $trgt) {
        var self = this;
        var required = false;
        // test require
        required = value ? true : false;

        if( required ) {
          $trgt.find('[class*="--required"]').slideUp(300);
        } else {
          $trgt.find('[class*="--required"]').slideDown(300);
        }

        // repopulate subscription options
        $refresh = $('.form--signup__input.-subscription').find('.__refresh__');
        $refresh.off('click');
        $refresh.on('click', function(e) {
          e.preventDefault();
          self.populateSubscription({ block: ['subscription'] });
        });

        this.config.companyTest = required ? true : false;

      }, // subscriptionHandleError

			submit: function() {
				var self = this;

				$('#form--signup__submit-step1-btn').on('click', function(e) {
          e.preventDefault();

          // err check
          $('#form--signup__input-company, #form--signup__input-email, #form--signup__input-pwd').trigger('focusout');

          self.submitFn();
				});

			}, // submit

      submitFn: function() {

        var self = this,
            $btnStep1 = $('#form--signup__submit-step1-btn'),
            $company = $('#form--signup__input-company'),
            $email = $('#form--signup__input-email'),
            $pwd = $('#form--signup__input-pwd');

        if( this.config.companyTest && this.config.emailTest && this.config.pwdTest) {
          $btnStep1.attr({ 'data-state': 'busy', disabled: true });

          // disable controls
          $company.prop('disabled', true);
          $email.prop('disabled', true);
          $pwd.prop('disabled', true);

          var $inputParent = $('.form--signup__input.-email').find('.__lazy-check__'),
              $errList = $('.form--signup__input.-email').find('.err-list');
          
          // show email check animation
          $inputParent.addClass('__lazy-check-active__');

          $.ajax({
            method: 'GET',
            dataType: 'json',
            url: self.config.emailAvaibilityURL + $email.val(),
            timeout: self.config.timeout,
            success: function(data, message, xhr) {
              $inputParent.removeClass('__lazy-check-active__');

              if( data.isAvailable === false ) {
                $errList.find('[class*="--available"]').slideDown(300);

                // disable controls
                $company.attr('disabled', false);
                $email.attr('disabled', false);
                $pwd.attr('disabled', false);

                $btnStep1.attr({ 'data-state': 'idle', disabled: false });
              } else {
                $errList.find('[class*="--available"]').slideUp(300);

                // add value
                self.config.value.company = $company.val();
                self.config.value.email = $email.val();
                self.config.value.pwd = $pwd.val();

                // saving data s abandoned subscription
                // will be removed after successful signup
                $.ajax({
                  method: 'POST',
                  dataType: 'json',
                  url: self.config.abandonedSubURL,
                  timeout: self.config.timeout,
                  data: { company: self.config.value.company, email: self.config.value.email },
                  success: function(data, status, xhr) {
                    if( xhr.status === 200 && data.clientId ) {
                      self.config.value.abandonedSub = data.clientId;

                      // open payment fieldset and hide current fieldset
                      $('.form--signup__step1').removeClass('__active__');
                      $('.form--signup__step2').addClass('__active__');
                    } else {
                      serverErrDisplay.init(xhr);
                    }
                  },
                  error: function(jqXhr, textStatus, errorMessage) {
                    serverErrDisplay.init(jqXhr);
                  }
                });

              }

            }, // success
            error: function(jqXhr) {
              $errList.find('[class*="--available"]').slideDown(300);
              serverErrDisplay.init(jqXhr);
            }
          }); // end ajax call

        } // endif

      }, // submitFn

      goBack: function() {

        $('#form--signup__submit-goback-btn').on('click', function(e) {
          e.preventDefault();

          $('#form--signup__submit-step1-btn').attr({ 'data-state': 'idle', disabled: false });

          // open primary fieldset and hide current fieldset
          $('.form--signup__step1').addClass('__active__');
          $('.form--signup__step2').removeClass('__active__');

          // enable controld
          $('#form--signup__input-company').attr('disabled', false);
          $('#form--signup__input-email').attr('disabled', false);
          $('#form--signup__input-pwd').attr('disabled', false);

        });

      }, // goBack

			populateData: function(req) {
				var getReq = req.block;

				// subscription
				var subscription = getReq.indexOf('subscription');
				if( subscription >= 0 ) {
					this.populateSubscription();
				}

			}, // populateData

			populateSubscription: function() {
				var self = this;

				$.ajax({
					method: 'GET',
					dataType: 'json',
					url: self.config.populateSubscriptionURL,
          timeout: self.config.timeout,
					success: function(data, status, xhr) {
						if( xhr.status === 200 && data.res.length ) {
							$.each( data.res, function( index, option ) {

								// currency
								var getcurrency = option.currency.toLowerCase() || self.config.defaultCurrency,
										currency = self.config.defaultSymbol;

								if(getcurrency === 'euro') currency = '€';
								if(getcurrency === 'pound') currency = '£';

								// duration
								var getDuration = option.duration || self.config.defaultDuration,
										duration = getDuration + ' months';

								if(getDuration === 12) duration = 'year';
								if(getDuration === 1) duration = 'month';

								// populate data
                
								$('<option value="' + option._id + '">' + option.name.charAt(0).toUpperCase() + option.name.slice(1) + ' - ' + currency + option.price + '/' + duration + '</option>').appendTo('#form--signup__input-subscription');

							});
		
							// trigger plugin
              if( data.res.length ) {
  							$('#form--signup__input-subscription').prettyDropdown({
  								classic: false,
  								width: '100%'
  							});
              }

						} else {

              serverErrDisplay.init(xhr);

            }// endif

					},
					error: function(jqXhr, textStatus, errorMessage) {console.log(errorMessage);
						serverErrDisplay.init(jqXhr);
					}
				});

			}, // populateSubscription

			stripeconfig: function(stripeApiKey) {
				var self = this;
				// Create a Stripe client.
				var stripe = Stripe(stripeApiKey);

				// Create an instance of Elements.
				var elements = stripe.elements();

				// Custom styling can be passed to options when creating an Element.
				// (Note that this demo uses a wider set of styles than the guide below.)
				var style = {
				  base: {
				    fontFamily: '"Lato", sans-serif',
				    fontSize: '16px',
				    lineHeight: '18px',
				    fontWeight: 400,
				    color: '#fff',
				    fontSmoothing: 'antialiased',
				    iconColor: '#a1a1a1',
				    '::placeholder': {
				      color: '#a1a1a1'
				    }
				  },
				  invalid: {
				    color: '#f00',
				    iconColor: '#f00'
				  }
				};

				// Create an instance of the card Element.
				var card = elements.create('card', {style: style});

				// Add an instance of the card Element into the `card-element` <div>.
				card.mount('#card-element');

				// Handle real-time validation errors from the card Element.
				card.addEventListener('change', function(event) {
				  var displayError = document.getElementById('card-errors');
				  if (event.error) {
				    displayError.textContent = event.error.message;
				  } else {
				    displayError.textContent = '';
				  }
				});

				// Handle form submission.
				var form = document.getElementById('form--signup');
				form.addEventListener('submit', function(event) {
				  event.preventDefault();

				  stripe.createToken(card).then(function(result) {
				    if (result.error) {
				      // Inform the user if there was an error.
				      var errorElement = document.getElementById('card-errors');
				      errorElement.textContent = result.error.message;
				    } else {
				      // Send the token to your server.
				      self.stripeTokenHandler(result.token);
				    }
				  });
				});

			}, // end::stripeconfig

			stripeTokenHandler: function(data) {
				
				this.config.value.subscription = $('#form--signup__input-subscription').val();
        this.config.value.stripeToken = data.id;

        var $submit = $('#form--signup__submit-btn'),
            $goBack = $('#form--signup__submit-goback-btn');

        if( !this.config.value.subscription ) {
          $('#form--signup__input-subscription').trigger('change');
          this.enablePaymentSet();
        } else {
          this.disablePaymentSet();
          this.createUser();
        }

			}, // stripeTokenHandler

      enablePaymentSet: function() {
        $('#form--signup__submit-btn').attr({ 'data-state': 'idle', disabled: false });
        $('#form--signup__submit-goback-btn').fadeIn(240);
        $('#card-element').removeClass('__disabled__');
        $('.form--signup__input.-subscription').removeClass('__disabled__');
      }, // enablePaymentSet

      disablePaymentSet: function() {
        $('#form--signup__submit-btn').attr({ 'data-state': 'busy', disabled: true });
        $('#form--signup__submit-goback-btn').fadeOut(240);
        $('#card-element').addClass('__disabled__');
        $('.form--signup__input.-subscription').addClass('__disabled__');
      }, // enablePaymentSet

      createUser: function() {
        var self = this;

        $.ajax({
          method: 'POST',
          dataType: 'json',
          url: self.config.createUserURL,
          data: self.config.value,
          timeout: self.config.timeout,
          success: function(data, status, xhr) {
            if( xhr.status === 200 ) {
              window.location.replace('/email-confirmation');
            } else {
              self.enablePaymentSet();
              serverErrDisplay.init(xhr);
            }
          },
          error: function(jqXhr, textStatus, errorMessage) {
            self.enablePaymentSet();
            serverErrDisplay.init(jqXhr);
          }
        });

      }

		};

    // run on signup page
    if( $('body').hasClass('page-signup') ) signup.init();

		var login = {

			config: {
				emailRegx: emailRegx,
        timeout: CLIENT_TIMEOUT,
        pwdMinLength: PWD_MIN_LENGTH,
				emailTest: false,
				pwdTest: false,
				pwdMinLength: 8,
        loginURL: '/api/user/login'
			},

			init: function(config) {
				$.extend(this.config, config);

				this.testCtrl();
				this.submit();
			},

			testCtrl: function() {
				var self = this;

				// email
				$('#form--login__input-email').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'email' });
				});

				// pwd
				$('#form--login__input-pwd').on('focusout keyup', function(e) {
					self.HandleError({ value: e.target.value, event: e.type, type: 'pwd' });
				});

			},

			HandleError: function(req) {
				var $emailTrgt = $('.form--login__input.-email').find('.err-list');
				var $pwdTrgt = $('.form--login__input.-pwd').find('.err-list');

				if( req.type === 'email' ) {
					this.emailHandleError(req.value, req.event, $emailTrgt);
				}
				if( req.type === 'pwd' ) {
					this.pwdHandleError(req.value, req.event, $pwdTrgt);
				}
			},

			emailHandleError: function(value, event, $trgt) {
				var patternTest, required;
				patternTest = required = false;

				// test email pattern
				patternTest = emailRegx ? emailRegx.test(value) : false;
				// test require
				required = value ? true : false;

				if( required ) {
					$trgt.find('[class*="--required"]').slideUp(300);

					// patter test
					if( patternTest ) {
						$trgt.find('[class*="--pattern"]').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('[class*="--pattern"]').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
						}
				}

				this.config.emailTest = ( patternTest && required ) ? true : false;

			}, // emailHandleError

			pwdHandleError: function(value, event, $trgt) {
				var patternTest, required;
				minlength = required = false;

				// test minlength
				minlength = value.length >= this.config.pwdMinLength ? true : false;
				// test require
				required = value ? true : false;

				if( required ) {
					$trgt.find('[class*="--required"]').slideUp(300);

					// patter test
					if( minlength ) {
						$trgt.find('[class*="--minlength"]').slideUp(300);
					} else {
						// do not show error in type mode
						if( event === 'focusout' ) {
							$trgt.find('[class*="--minlength"]').slideDown(300);
						}
					}
				} else {
						if( event === 'focusout' ) {
							// do not show error in type mode
							$trgt.find('[class*="--required"]').slideDown(300);
						}
				}

				this.config.pwdTest = ( minlength && required ) ? true : false;

			}, // pwdHandleError

			submit: function() {
				var self = this,
            $email = $('#form--login__input-email'),
            $pwd = $('#form--login__input-pwd');

				$('#form--login__submit-btn').on('click', function(e) {
					e.preventDefault();

          // start input check process
					$('#form--login__input-email, #form--login__input-pwd').trigger('focusout');

          // check if input is valid
					if( self.config.emailTest && self.config.pwdTest ) {
            // disable controls
            self.disableControls();

            $.ajax({
              method: 'POST',
              dataType: 'json',
              url: self.config.loginURL,
              data: { email: $email.val(), pwd: $pwd.val() },
              success: function(data, status, xhr) {
                var token = xhr.getResponseHeader('x-auth');
                if( token ) {

                	localforage.clear()
                		.then(() => {
		                  localforage.setItem('dataSet', { token: token })
		                  	.then(() => {console.log(token);
		                  		window.location.replace('/dashboard');
		                  	})
		                		.catch( err => {
		                			self.enableControls();
		                      customErrMsg.trigger('Something went wrong! Please try again.');
		                		});

                		})
                		.catch( err => {
                			self.enableControls();
                      customErrMsg.trigger('Something went wrong! Please try again.');
                		});
                  // localforage.setItem('dataSet', { token: token }, function(err) {
                  //   if( err === null ) {
                  //     window.location.replace('/dashboard');
                  //   } else {
                  //     self.enableControls();
                  //     customErrMsg.trigger('Something went wrong! Please try again.');
                  //   }
                  // });

                } else {
                  self.enableControls();
                  customErrMsg.trigger('Something went wrong! Please try again.');
                }
              },
              error: function(jqXhr) {
                serverErrDisplay.init(jqXhr);
                // enable controls
                self.enableControls();
              }
            });

					}

				});
			}, // end submit

      enableControls: function() {
        $('#form--login__submit-btn').attr({ 'data-state': 'idle', disabled: false });
        $('#form--login__input-email').attr('disabled', false);
        $('#form--login__input-pwd').attr('disabled', false);
      }, // end submit

      disableControls: function() {
        $('#form--login__submit-btn').attr({ 'data-state': 'busy', disabled: true });
        $('#form--login__input-email').attr('disabled', true);
        $('#form--login__input-pwd').attr('disabled', true);
      }

		};

		// run on login page
    if( $('body').hasClass('page-login') ) login.init();

	});
}(jQuery));