'use strict';

// Hippo: DianPing Analysis

;(function (HIPPO_HOST_KEY, UNDEF) {

var

win = window,
doc = win.document,
loc = doc.location,
ref = doc.referrer,
screen = win.screen,

// default params
_pageId     = 0,
_shopType   = 0,
_cityId     = 0,
_domain     = 'www.dianping.com',

data_attached = {},

// @const
NOOP = function(){},

URL_BASE = 'http://hls.' + ( /51ping/.test(doc.domain) ? '51ping' : 'dianping' ) + '.com/hippo.gif?',

NET_SPEED_SAMPLE_RATE   = 1,

SCREEN_SIZE_KEY         = '__hsr',
SCREEN_COLOR_DEPTH_KEY  = '__hsc',
LOCATION_HREF_KEY       = '__hlh',
LOCATION_REFERRER_KEY   = '__hlr',
PAGE_TRACK_KEY          = '__pv',
MODULE_TRACK_KEY        = '__mv';


////////////////////////////////////////////////////////////////////////////
// lang
////////////////////////////////////////////////////////////////////////////

var


// method to stringify an object
// optimized for v8
// @param {Object} obj the object to be stringified
// @returns {string}
stringify = (function () {
    return win.JSON && JSON.stringify || function (obj) {
        var ret = [],
            key,
            value;

        for (key in obj) {
            value = obj[key];
        
            if(Object(value) !== value){
                ret.push( '"' + key + '":"' + ("" + value).replace(/"/g, '\\"') + '"' );
            }
        }

        return '{' + ret.join(',') + '}';
    };
})(),

AP = Array.prototype;


if(!AP.forEach){
    AP.forEach = function(fn, this_object){
        for (var i = 0, len = this.length; i < len; i++){
            if (i in this){
            
                // if fn is not callable, it will throw
                fn.call(this_object, this[i], i, this);
            }
        }
    };
}


function toQueryString(obj){
    var encode = encodeURIComponent,
        key,
        value,
        ret = [];
        
    for(key in obj){
        value = obj[key];
    
        if(Object(value) !== value){
        
            // {
            //    key1: undefined,
            //    key2: "a"
            // }
            // -> key1=&key2=a
            ret.push( key + '=' + encode(value || '') );
        }
    }
    
    return ret.join('&');
};

function mix(r, s){
    var key;

    for(key in s){
        r[key] = s[key];
    }
    
    return r;
};

function chk(key, value) {
    return typeof key === 'string' && Object(value) !== value;
};


////////////////////////////////////////////////////////////////////////////
// Hippo methods
////////////////////////////////////////////////////////////////////////////

// send a hippo request
// @param {string} key
// @param {Array.<string>} value
// @param {object} data
function send(key, value, data) {
    var query = generateQuery(key, value, data);
    
    new Image(1, 1).src = URL_BASE + query;
};


var


// 生成hippo专用的query string
// @private
generateQuery = (function () {

    // 有些内容是单次会话保持不变的，先计算出来
    var h, w, s, c, f,
        presets = {};
    
    if(loc && loc.href){
        presets[LOCATION_HREF_KEY] = loc.href;
    }
    
    if(ref){
        presets[LOCATION_REFERRER_KEY] = ref;
    }

    if (s = screen) {
        h = s.height;
        w = s.width;
        
        if (h && w) {
            presets[SCREEN_SIZE_KEY] = w + 'x' + h;
        }
        
        if (c = s.colorDepth) {
            presets[SCREEN_COLOR_DEPTH_KEY] = c + 'bit';
        }
    }

    // @param {string} key
    // @param {Array.<mixed>} value
    // @param {Object=} data
    return function(key, value, data){
        var 
        
        current = {
            '__hlt': _domain,
            '__ppp': _pageId,
            '__had': stringify(data || {}),
            'force': + new Date
        };
        
        value.push(_cityId + '|' + _shopType);

        current[key] = value.join('|');
        
        return toQueryString(mix(current, presets));
    };
    
})();


////////////////////////////////////////////////////////////////////////////
// old Hippo for legacy
////////////////////////////////////////////////////////////////////////////

// @param {number} page id of current page
// @param {string=} z base url of site
function document_hippo(pageId, domain){
    HIPPO_METHODS._setPageId(pageId);
    // HIPPO_METHODS._setDomain(domain);
    
    return document_hippo;
};


mix(document_hippo, {

    // extensive parameters for next hippo request
    // @param {string||Object} name
    // @param {mixed=} value
    ext: function (name, value) {
        var key;
    
        if (Object(name) === name) {
            for (key in name) {
                document_hippo.ext(key, name[key]);
            }

        }else if(chk(name, value)) {
            data_attached[name] = value;
        }
        
        return document_hippo;
    },
    
    // remove data that be setted by ext method
    // @param {string=} name if no name passed in, hippo will remove all relative data
    rxt: function (name) {
        if (typeof name === 'string') {
            delete data_attached[name];
            
        } else if (!arguments.length) {
            data_attached = {};
        }
        
        return document_hippo;
    },
    
    
    // send a page-view request
    // @param {number} cityId
    // @param {number=} shopType
    pv: function (cityId, shopType) {
        HIPPO_METHODS._setCityId(cityId);
        HIPPO_METHODS._setShopType(shopType);
        HIPPO_METHODS._setPVInitData(data_attached);
        data_attached = {};
        
        return document_hippo;
    },
    
    // send a module-view request
    // @param moduleId{Number}
    // @param value{*}
    mv: function (moduleId, value) {
    
        if (chk(moduleId, value)) {
            data_attached[moduleId] = value;
            
            HIPPO_METHODS.mv(data_attached);
            data_attached = {};
        }
        
        return document_hippo;
    }
});

// for backward compatibility
document.hippo = document_hippo;


////////////////////////////////////////////////////////////////////////////
// new Hippo
////////////////////////////////////////////////////////////////////////////

var

Hippo = win[HIPPO_HOST_KEY];

if(Hippo){

    // if new hippo(`_hip`) exists, push `'_setPVInitData'` to make sure there is a pv request
    Hippo.push(['_setPVInitData']);
    
}else{
    Hippo = win[HIPPO_HOST_KEY] = [];
}


var

HIPPO_METHODS = {
    _setPageId: function(pageId){
        _pageId = pageId >>> 0;
    },
    
    _setCityId: function(cityId){
        _cityId = cityId >>> 0;
    },

    _setShopType: function (shopType){
        _shopType = shopType >>> 0;
    },
    
    _setPVInitData: function(data){
        send(PAGE_TRACK_KEY, [], data);
    },
    
    mv: function(data){
        send(
            MODULE_TRACK_KEY,
            ['', ''],
            data
        );
    }
};

Hippo.push = function(command){
    var action, data, method;

    if(command){
        action = command[0];
        data = command[1];
        method = HIPPO_METHODS[action];
        
        method && method(data);
    }
};


['_setPageId', '_setCityId', '_setShopType', /* '_setDomain',  */'_setPVInitData'].forEach(function(name){
    var method = HIPPO_METHODS[name];
    
    HIPPO_METHODS[name] = function(){
        method.apply(this, arguments);
        HIPPO_METHODS[name] = NOOP;
    };
});


// apply 
Hippo.forEach(function(command){
    Hippo.push(command);
});


Hippo.length = 0;

if(Math.random() > NET_SPEED_SAMPLE_RATE){
    return;
}

// pagetiming

var render_start = win.G_rtop, domready_time;

function make_sense(origin, fallback){
    return origin > 0 ? origin : fallback;
};

function onDomReady(){
    domready_time = + new Date; 
};

function onLoad(){
    var
    
    version,
    perf = win.performance,
    t = perf && perf.timing,
    
    r_ready = domready_time - render_start,
    r_load = + new Date - render_start,
    
    data = {
        r_pagetiming: 1,
        r_ready: r_ready,
        r_load: r_load
    };
    
    if(t){
        mix(data, {
            r_conn     : t.connectEnd - t.connectStart,
            r_recev    : t.responseEnd - t.responseStart,
            r_ready    : make_sense(t.domInteractive - t.domLoading, r_ready),
            r_wait     : t.responseStart - t.requestStart,
            r_load     : make_sense(t.loadEventStart - t.domLoading, r_load)
        });
    }
    
    if(version = win.DP && DP.data && DP.data('hippo_perf_version')){
        data['test'] = version;
    }
    
    HIPPO_METHODS.mv(data);
    
    removeEvent(win, 'load', onLoad);
};


function bind_domready(fn){

    // Catch cases where ready() is called after the
    // browser event has already occurred.
    if(doc.readyState === 'complete'){
        return fn();
    }

    var doScroll = doc.documentElement.doScroll;
    var eventType = doScroll ? 'readystatechange' : 'DOMContentLoaded';

    var ready = function (){
        removeEvent(doc, eventType, ready);
        removeEvent(win, 'load', ready);
        fn();
    };

    addEvent(doc, eventType, ready);

    // A fallback to load
    // and make sure that domready event fires before load event registered by user
    addEvent(win, 'load', ready);
    
    if(doScroll){
        var poll_scroll = function (){
            try {
                // doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
                doScroll('left');
                ready();
            } catch(ex) {
                setTimeout(poll_scroll, 10);
            }
        };

        var not_framed = false;
        
        try {
            not_framed = win.frameElement == null;
        } catch(e) {}
        
        if(not_framed){
            poll_scroll();
        }
    }
};


var element_test = doc.createElement('div');
var ADD_EVENT_LISTENER = 'addEventListener';
var REMOVE_EVENT_LISTENER = 'removeEventListener';

var addEvent = element_test[ADD_EVENT_LISTENER] ?
        function(el, type, fn, useCapture){
            el[ADD_EVENT_LISTENER](type, fn, !!useCapture);
        } :

        function(el, type, fn){
            el.attachEvent('on' + type, fn);
        };
        
var removeEvent = element_test[REMOVE_EVENT_LISTENER] ?
        function(el, type, fn, useCapture){
            el[REMOVE_EVENT_LISTENER](type, fn, !!useCapture);
        } :

        function(el, type, fn){
            el.detachEvent('on' + type, fn);
        };


bind_domready(onDomReady);
addEvent(win, 'load', onLoad);

})('_hip');