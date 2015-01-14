claz
=======

### Another OOP implementation for javascript

#### claz.claz:

```javascript
var Person = claz.claz(
    function init(name, age){
        /** one would normally validate {@link name} and {@link age} here ... */
        this._name = name;
        this._age = age;
        this._summary = this._createSummary(name, age);
    },
    {
        _alias: 'that guy',
        _createSummary: function(name, age){
            /** one would normally validate {@link name} and {@link age} here ... */
            return name + ' ('+ age +')'
        },
        getSummary: function() {
            return this._summary
        },
        getName: function() {
            return this._name
        },
        getAge: function() {
            return this._age
        },
        getAlias: function() {
            return this._alias
        }
    }
);

var albert = Person("Albert", 30);

/** {@link albert} object gets all the public methods */
// typeof albert.getSummary === "function"
// typeof albert.getName === "function"
// typeof albert.getAge === "function"
// typeof albert.getAlias === "function"

/** all the private members are not visible */
// albert._summary == null
// albert._createSummary == null
// albert._alias == null

/** all the public methods are callable */
// albert.getName() === "Albert"
// albert.getAge() === 30
// albert.getSummary() === "Albert (30)"
// albert.getAlias() === "that guy"
```

#### claz.wiz:

```javascript

var IntSupplier = claz.claz(
    function(int){
        this._int = int
    },
    {
        getInt: function() {
            return this._int
        }
    }
);
var GteZero = claz.claz({
    getInt: function(){
        var _int = this.super();
        if (_int <= 0) {
            return 0
        }
        return _int
    }
});
var Doubling = claz.claz({
    getInt: function(){
        return this.super() * 2
    }
});
var DoublingGteZeroIntSupplier = claz.wiz(claz.claz(function(int){ this._int = int }{}), IntSupplier, GteZero, Doubling);

var int1 = DoublingGteZeroIntSupplier(1);
int1.getInt(); // 2 = (1) * 2 = ((1 <= 0)? 1 : 0) * 2

var int2 = DoublingGteZeroIntSupplier(-1);
int2.getInt(); // 0 = ((-1 <= 0)? -1 : 0) * 2
```