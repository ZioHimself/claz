//noinspection JSUnresolvedVariable
(function(){
    Qunit.require('lib/underscore-min.js');
    Qunit.require('claz.js');

    /*global window*/
    /** QUnit function aliases */
    var module      = QUnit.module,
        test        = QUnit.test;

    /** TODO: remove, when migrated to QUnit 2.0 */
    QUnit.assert.expect = QUnit.expect;

    module('claz loaded');
    test('claz loaded', function(assert) {
        assert.ok(window.claz, 'window.claz should be defined');
    });

    var claz = window.claz;
    module('claz.claz');
    test('claz.claz loaded', function(assert) {
        assert.ok(_.isFunction(claz.claz), 'claz.claz should be a function');
    });
    test('claz.claz should return a class constructor function', function(assert) {
        var _Result = claz.claz({});
        assert.ok(_.isFunction(_Result), '_Result should be a function, _Result=`'+ _Result +'`');
    });
    var _toString = Object.prototype.toString,
        _fnToString = Function.prototype.toString;
    test('claz.claz returned constructor should have all the public members in the prototype', function(assert) {
        var _members = {
                foo: function(){}
            },
            _Result = claz.claz(_members);

        var _actualFoo = _Result.prototype.foo;
        assert.ok(_actualFoo != null, 'actualMember should be defined, _actualFoo=`'+ _actualFoo +'`');
        var _actualFooStrType = _toString.call(_actualFoo);
        var _expectedFooStrType = _toString.call(_members.foo);
        var fooTypesAreEqual = _actualFooStrType === _expectedFooStrType;
        assert.ok(
            fooTypesAreEqual,
            'member types should be equal, ' +
            '_actualFooStrType=`'+ _actualFooStrType +'`, ' +
            '_expectedFooStrType=`'+ _expectedFooStrType +'`'
        );
        var _actualFooSource = _fnToString.call(_actualFoo);
        var _expectedFooSource = _fnToString.call(_members.foo);
        assert.strictEqual(
            _actualFooSource,
            _expectedFooSource,
            'foo source should be the same for members.foo and _Result.prototype.foo'
        );
    });
    test('claz.claz returned constructor should create objects with all the public variables visible', function(assert) {
        //noinspection JSUnusedGlobalSymbols
        var _members = {
                foo: function(){}
            },
            _Result = claz.claz(_members),
            _result1 = _Result();

        var _actualFoo = _result1.foo;
        assert.ok(_actualFoo != null, 'actualMember should be defined, _actualFoo=`'+ _actualFoo +'`');
        var _actualFooStrType = _toString.call(_actualFoo);
        var _expectedFooStrType = _toString.call(_members.foo);
        var fooTypesAreEqual = _actualFooStrType === _expectedFooStrType;
        assert.ok(
            fooTypesAreEqual,
            'member types should be equal, ' +
            '_actualFooStrType=`'+ _actualFooStrType +'`, ' +
            '_expectedFooStrType=`'+ _expectedFooStrType +'`'
        );
    });
    test('claz.claz returned constructor should have all the private variables invisible', function(assert) {
        //noinspection JSUnusedGlobalSymbols
        var _members = {
                _foo: 1,
                _bar: function(){},
                baz: 2
            },
            _Result = claz.claz(_members);

        var _actualFoo = _Result.prototype._foo;
        assert.ok(_.isUndefined(_actualFoo), 'actualMember should be undefined, _actualFoo=`'+ _actualFoo +'`');

        var _actualBar = _Result.prototype._bar;
        assert.ok(_.isUndefined(_actualBar), 'actualMember should be undefined, _actualBar=`'+ _actualBar +'`');

        var _actualBaz = _Result.prototype.baz;
        assert.ok(_.isUndefined(_actualBaz), 'actualMember should be undefined, _actualBar=`'+ _actualBaz +'`');
    });
    test('claz.claz returned constructor should create objects with all the private variables invisible', function(assert) {
        //noinspection JSUnusedGlobalSymbols
        var _members = {
                _foo: 1,
                _bar: function(){}
            },
            _Result = claz.claz(_members),
            _result1 = _Result();

        var _actualFoo = _result1._foo;
        assert.ok(_.isUndefined(_actualFoo), 'actualMember should be undefined, _actualFoo=`'+ _actualFoo +'`');

        var _actualBar = _result1._bar;
        assert.ok(_.isUndefined(_actualBar), 'actualMember should be undefined, _actualBar=`'+ _actualBar +'`');

        var _actualBaz = _result1.baz;
        assert.ok(_.isUndefined(_actualBaz), 'actualMember should be undefined, _actualBar=`'+ _actualBaz +'`');
    });
    test('claz.claz returned constructor should call passed in initFn', function(assert) {
        assert.expect( 1 );
        var _members = {
            },
            _Result = claz.claz(
                function(){
                    assert.ok(true, "initFn called")
                },
                _members
            );
        new _Result()
    });
    test('claz.claz returned constructor should call passed in init member if no initFn', function(assert) {
        assert.expect( 1 );
        var _members = {
                init:function(){
                    assert.ok(true, "init member called")
                }
            },
            _Result = claz.claz(_members);
        _Result()
    });
    test('claz.claz returned constructor should call passed in initFn rather than init member', function(assert) {
        assert.expect( 1 );
        var _members = {
                init:function(){
                    assert.ok(false, "init member should not be called")
                }
            },
            _Result = claz.claz(
                function(){
                    assert.ok(true, "initFn called")
                },
                _members
            );
        _Result()
    });
    test('claz.claz returned constructor should have all members visible in the initFn', function(assert) {
        assert.expect( 6 );
        var _members = {
                _foo: 1,
                _bar: function(){},
                baz: 2,
                qux: function(){}
            },
            _Result = claz.claz(
                function(){
                    assert.strictEqual(this._foo, 1, "this._foo=`"+ this._foo +"` should be defined");
                    assert.ok(_.isFunction(this._bar), "this._bar=`"+ this._bar +"` should be a function");
                    var _actualBarSource = _fnToString.call(this._bar);
                    var _expectedBarSource = _fnToString.call(_members._bar);
                    assert.strictEqual(_actualBarSource, _expectedBarSource, "this._bar=`"+ this._bar +"`'s source should be the same as member's `"+ _members._bar +"`");

                    assert.strictEqual(this.baz, 2, "this.baz=`"+ this.baz +"` should be defined");
                    assert.ok(_.isFunction(this.qux), "this.qux=`"+ this.qux +"` should be a function");
                    var _actualQuxSource = _fnToString.call(this.qux);
                    var _expectedQuxSource = _fnToString.call(_members.qux);
                    assert.strictEqual(_actualQuxSource, _expectedQuxSource, "this.qux=`"+ this.qux +"` source should be the same as member's `"+ _members.qux +"`");
                },
                _members
            );
        _Result()
    });
    test('claz.claz returned constructor should create objects, which can access private members in their private methods through their public methods', function(assert) {
        assert.expect( 10 );
        var _members = {
                _foo: 1,
                _bar: function(){
                    assert.ok(true, "called _bar");
                },
                _baz: function(){
                    assert.strictEqual(this._foo, 1, "this._foo=`"+ this._foo +"` should be defined");
                    assert.ok(_.isFunction(this._bar), "this._bar=`"+ this._bar +"` should be a function");
                    var _actualBarSource = _fnToString.call(this._bar);
                    var _expectedBarSource = _fnToString.call(_members._bar);
                    assert.strictEqual(_actualBarSource, _expectedBarSource, "this._bar=`"+ this._bar +"`'s source should be the same as member's `"+ _members._bar +"`");
                    this._bar()
                },
                qux: function(){
                    assert.strictEqual(this._foo, 1, "this._foo=`"+ this._foo +"` should be defined");
                    assert.ok(_.isFunction(this._bar), "this._bar=`"+ this._bar +"` should be a function");
                    var _actualBarSource = _fnToString.call(this._bar);
                    var _expectedBarSource = _fnToString.call(_members._bar);
                    assert.strictEqual(_actualBarSource, _expectedBarSource, "this._bar=`"+ this._bar +"`'s source should be the same as member's `"+ _members._bar +"`");
                    assert.ok(_.isFunction(this._baz), "this._baz=`"+ this._baz +"` should be a function");
                    var _actualBazSource = _fnToString.call(this._baz);
                    var _expectedBazSource = _fnToString.call(_members._baz);
                    assert.strictEqual(_actualBazSource, _expectedBazSource, "this._baz=`"+ this._baz +"`'s source should be the same as member's `"+ _members._baz +"`");
                    this._bar();
                    this._baz()
                }
            },
            _Result = claz.claz(_members),
            _result = _Result();
        _result.qux()
    });
    test('claz.claz returned constructor should create objects, with separate state', function(assert) {
        var _Result = claz.claz(
            function(foo){
                this._foo = foo
            },
            {
                bar: function(){
                    return this._foo
                }
            }
        );
        var _result1 = _Result(1);
        assert.strictEqual(_result1.bar(), 1, "this.bar() for _result1 should return `1`");
        var _result2 = _Result(2);
        assert.strictEqual(_result2.bar(), 2, "this.bar() for _result2 should return `2`");
    });

    module('claz.wiz');
    test('claz._overridePropDeleteAfterwards should call the passed invocation function with overridden property, delete it afterwards, and return the results of the invocation', function(assert) {
        assert.expect( 7 );
        var _unexpectedPropertyUser = {
                getUnexpectedValue: function(){
                    return this.getValue()
                }
            },
            _keysBeforeInvocation = _.keys(_unexpectedPropertyUser),
            _valuesBeforeInvocation = _.values(_unexpectedPropertyUser),
            _overridePropFn = function(){ return "unexpected value!" },
            actualValue = claz._overridePropDeleteAfterwards(
                _unexpectedPropertyUser, 'getValue',
                _overridePropFn,
                function(obj){
                    assert.ok(_.has(obj, 'getValue'), "The object, passed in during invocation, should have a property by the override property name");
                    assert.strictEqual(obj['getValue'], _overridePropFn, "The object, passed in during invocation, should have the override property the same, as passed to _overridePropDeleteAfterwards");
                    var invocationResult = _unexpectedPropertyUser.getUnexpectedValue.apply(obj, []);
                    assert.strictEqual(invocationResult, "unexpected value!", "The invocation should return `unexpected value!` string");
                    return invocationResult
                }
            ),
            _keysAfterInvocation = _.keys(_unexpectedPropertyUser),
            _valuesAfterInvocation = _.values(_unexpectedPropertyUser);
        assert.strictEqual(actualValue, "unexpected value!", "_overridePropDeleteAfterwards should return `unexpected value!` string");
        assert.ok(!_.has(_unexpectedPropertyUser, 'getValue'), "_unexpectedPropertyUser should not have a property by the override property name, after the invocation");
        assert.deepEqual(_keysAfterInvocation, _keysBeforeInvocation, "_overridePropDeleteAfterwards should not change keys of an object");
        assert.deepEqual(_valuesAfterInvocation, _valuesBeforeInvocation, "_overridePropDeleteAfterwards should not change values of an object");
    });
    test('claz._overridePropPutBackAfterwards should call the passed invocation function with overridden property, put the initial property afterwards, and return the results of the invocation', function(assert) {
        assert.expect( 7 );
        var _unexpectedPropertyUser = {
                getValue: function() {
                    return "expected value"
                },
                getUnexpectedValue: function(){
                    return this.getValue()
                }
            },
            _initialPropFn = _unexpectedPropertyUser.getValue,
            _keysBeforeInvocation = _.keys(_unexpectedPropertyUser),
            _valuesBeforeInvocation = _.values(_unexpectedPropertyUser),
            _overridePropFn = function(){ return "unexpected value!" },
            actualValue = claz._overridePropPutBackAfterwards(
                _unexpectedPropertyUser, 'getValue',
                _overridePropFn,
                false,
                function(obj){
                    assert.strictEqual(obj['getValue'], _overridePropFn, "the object, passed in during the invocation, should have the property getValue overridden by the _overridePropFn");
                    assert.strictEqual(obj['getValue'], _overridePropFn, "The object, passed in during invocation, should have the override property the same, as passed to _overridePropDeleteAfterwards");
                    var invocationResult = _unexpectedPropertyUser.getUnexpectedValue.apply(obj, []);
                    assert.strictEqual(invocationResult, "unexpected value!", "The invocation should return `unexpected value!` string");
                    return invocationResult
                }
            ),
            _keysAfterInvocation = _.keys(_unexpectedPropertyUser),
            _valuesAfterInvocation = _.values(_unexpectedPropertyUser);
        assert.strictEqual(actualValue, "unexpected value!", "_overridePropDeleteAfterwards should return `unexpected value!` string");
        assert.strictEqual(_unexpectedPropertyUser.getValue, _initialPropFn, "after the invocation, _unexpectedPropertyUser should have the overridden property the same as it was");
        assert.deepEqual(_keysAfterInvocation, _keysBeforeInvocation, "_overridePropDeleteAfterwards should not change keys of an object");
        assert.deepEqual(_valuesAfterInvocation, _valuesBeforeInvocation, "_overridePropDeleteAfterwards should not change values of an object");
    });
    test('claz._overridePropOnCall should return a function', function(assert) {
        var _unexpectedPropertyUser = {
                getValue: function() {
                    return "expected value"
                },
                getUnexpectedValue: function(){
                    return this.getValue()
                }
            },
            fn = claz._overridePropOnCall(
                _unexpectedPropertyUser.getUnexpectedValue, 'getValue',
                function() { return "unexpected value!" }
            );
        assert.ok(_.isFunction(fn), "fn should be a function!")
    });
    /**
     * uncomment when refactored according to this experiment:
     *
     * ```js
         var foo = {
              x: 1,
              getX: function () {
                return this.x
              }
            };

         sinon.stub(foo, 'getX', function(){ return 0 });
         console.log("stubbed foo.getX()=`"+ foo.getX() +"`");      // stubbed foo.getX()=`0`
         foo.getX.restore();
         console.log("unstubbed foo.getX()=`"+ foo.getX() +"`");    // unstubbed foo.getX()=`1`
     * ```
     * */
    //test('claz._overridePropOnCall should route to _overridePropDeleteAfterwards if the override property key is not defined for the context object', function(assert) {
    //    assert.expect( 1 );
    //    sinon.stub(claz, '_overridePropDeleteAfterwards', function(){
    //        assert.ok(true, "_overridePropDeleteAfterwards should be invoked!")
    //    });
    //    var _unexpectedPropertyUser = {
    //            getUnexpectedValue: function(){
    //                return this.getValue()
    //            }
    //        },
    //        fn = claz._overridePropOnCall(
    //            _unexpectedPropertyUser.getUnexpectedValue, 'getValue',
    //            function() { return "unexpected value!" }
    //        );
    //    fn.call(_unexpectedPropertyUser);
    //    claz.restore();
    //});
    //test('claz._overridePropOnCall should route to _overridePropPutBackAfterwards if the override property key is defined for the context object', function(assert) {
    //    assert.expect( 1 );
    //    sinon.stub(claz, '_overridePropPutBackAfterwards', function(){
    //        assert.ok(true, "_overridePropPutBackAfterwards should be invoked!")
    //    });
    //    var _unexpectedPropertyUser = {
    //            getValue: function() {
    //                return "expected value"
    //            },
    //            getUnexpectedValue: function(){
    //                return this.getValue()
    //            }
    //        },
    //        fn = claz._overridePropOnCall(
    //            _unexpectedPropertyUser.getUnexpectedValue, 'getValue',
    //            function() { return "unexpected value!" }
    //        );
    //    fn.call(_unexpectedPropertyUser);
    //    claz.restore();
    //});
    test('claz._composeToSingleFunction should return a function', function(assert) {
        var _getOne = function(){ return 1 },
            _plusOne = function() { return this.super() + 1 },
            _double = function() { return this.super() * 2 },
            fn = claz._composeToSingleFunction(
                [_double, _plusOne, _getOne]
            );
        assert.ok(_.isFunction(fn), "fn should be a function!")
    });
    test('claz._composeToSingleFunction should route to previous function on result functions .super() call', function(assert) {
        assert.expect( 17 );
        var _getX = function(){
                assert.ok(_.isUndefined(this['super']), "this.super should not be defined for _getX, as it is the first composed function");
                assert.strictEqual(this.x, 0, "this.x for _getX call should be `0`");
                assert.ok(!_getXCalled, "_getX should be invoked only once due to fn() call");
                assert.ok(_plusOneCalled, "_plusOne should be invoked before _getX is called");
                assert.ok(_doubleCalled, "_double should be invoked before _getX is called");
                _getXCalled = true;
                return this.x
            },
            _plusOne = function() {
                assert.ok(!_getXCalled, "_getX should be invoked only once due to fn() call");
                assert.ok(!_plusOneCalled, "_plusOne should be invoked only after _double is called");
                assert.ok(_doubleCalled, "_double should be already invoked when _plusOne is called");
                _plusOneCalled = true;
                var _superResult = this.super();
                assert.strictEqual(_superResult, 0, "this.super() for _plusOne should return `0` (as _getX does)");
                assert.ok(_getXCalled, "_getX should be already invoked after this.super() for _plusOne call");
                return _superResult + 1
            },
            _double = function() {
                assert.ok(!_getXCalled, "_getX should be invoked only once due to fn() call");
                assert.ok(!_plusOneCalled, "_plusOne should be invoked only after _double is called");
                assert.ok(!_doubleCalled, "_double should be invoked only once due to fn() call");
                _doubleCalled = true;
                var _superResult = this.super();
                assert.strictEqual(_superResult, 1, "this.super() for _double should return `1` (as _plusOne(_getX()) does)");
                assert.ok(_getXCalled, "_getX should be already invoked after this.super() for _double call");
                assert.ok(_plusOneCalled, "_plusOne should be already invoked after this.super() for _double call");
                return _superResult * 2
            },
            fn = claz._composeToSingleFunction(
                [_getX, _plusOne, _double]
            ),
            _getXCalled = false,
            _plusOneCalled = false,
            _doubleCalled = false,

            result = fn.call({
                x:0
            });
        assert.strictEqual(result, 2, "fn call for an object with x=0 should result in `2`=`((0)+1)*2`=`this.double(this.plusOne(this.getX()))`")
    });
})();