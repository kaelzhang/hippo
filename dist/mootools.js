'use strict';


_hip.push(['_setDomReadyMethod', function (callback) {
    function ready () {
        callback();
        window.removeEvent('domready', ready);
        ready = null;
    }

    window.addEvent && window.addEvent('domready', ready);
}]);

_hip.push(['_setOnLoadMethod', function (callback) {
    function load () {
        callback();
        window.removeEvent('load', load);
        load = null;
    }

    window.addEvent && window.addEvent('load', ready);
}])