//noinspection JSUnresolvedVariable
(function(){
    Qunit.require('lib/underscore-min.js');
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

    var claz = window.claz;
    module('claz.claz');
    test('claz.claz loaded', function() {
        ok(_.isFunction(claz.claz), 'claz.claz should be a function');
    });
    test('claz.claz should return a class constructor function', function() {
        var _result = claz.claz({});
        ok(_.isFunction(_result), '_result should be a function, _result=`'+ _result +'`');
    });
    var toString = Object.prototype.toString;
    test('claz.claz returned constructor should have all the public members in the prototype', function() {
        //noinspection JSUnusedGlobalSymbols
        var _members = {
                foo: 1,
                bar: function(){}
            },
            _result = claz.claz(_members);
        _.all(_members, function(member, memberName) {
            var _actualMember = _result.prototype[memberName];
            ok(_actualMember, 'actualMember should be defined, _actualMember=`'+ _actualMember +'`');
            var _actualMemberStrType = toString.call(_actualMember);
            var _expectedMemberStrType = toString.call(member);
            var typesAreEqual = _actualMemberStrType === _expectedMemberStrType;
            ok(
                typesAreEqual,
                'member types should be equal, ' +
                '_actualMemberStrType=`'+ _actualMemberStrType +'`, ' +
                '_expectedMemberStrType=`'+ _expectedMemberStrType +'`'
            );
            return typesAreEqual
        })
    });
    test('claz.claz returned constructor should be possible to use as the right operand for instanceof', function() {
        //noinspection JSUnusedGlobalSymbols
        var _Result = claz.claz({}),
            _result1 = new _Result();
        ok(
            _result1 instanceof _Result,
            '_result1=`'+ _result1 +'` ' +
            'should be instance of ' +
            '_Result=`'+ _Result +'` class'
        )
    });
})();