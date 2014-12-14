//noinspection JSUnresolvedVariable
(function(){
    //noinspection JSUnresolvedVariable,JSUnresolvedFunction
    Qunit.require('claz.js');

    /*global window*/
    /** QUnit function aliases */
    var module      = QUnit.module,
        test        = QUnit.test,
        ok          = QUnit.ok;

    module('claz loaded');
    test('claz loaded', function() {
        ok(window.claz, 'window.claz should be defined');
    });
})();