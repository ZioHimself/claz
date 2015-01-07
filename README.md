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

// TBD

```