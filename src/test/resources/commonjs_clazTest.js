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
})();