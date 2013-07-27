'use strict';


_hip.push(['_setDomReadyMethod', function (callback) {
    if(window.Zepto){
        Zepto(callback);
    }
}]);

_hip.push(['_setOnLoadMethod', function (callback) {
    if(window.Zepto){
        var $win = Zepto(window);

        function load () {
            callback();
            $win.off('load', load);
            load = null;
        }

        $win.on('load', load);
    }
}]);