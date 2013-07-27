'use strict';


_hip.push(['_setDomReadyMethod', function (callback) {
    if(window.jQuery){
        jQuery(callback);
    }
}]);

_hip.push(['_setOnLoadMethod', function (callback) {
    if(window.jQuery){
        var $win = jQuery(window);

        function load () {
            callback();
            $win.off('load', load);
            load = null;
        }

        $win.on('load', load);
    }
}]);