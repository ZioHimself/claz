/**!
 * @fileOverview claz.js - no prototype OOP for js
 * @author <a href="mailto:ziohimself@gmail.com">Serhiy "seruji" Onyshchenko</a>
 * @requires <a href="http://underscorejs.org/">underscorejs</a>
 * Licensed under
 * <a href="http://www.opensource.org/licenses/mit-license">MIT License</a>
 * */
(function(root, factory){
    function _defineNodeExports() {
        //noinspection JSUnresolvedVariable,JSUnresolvedFunction
        module.exports = factory(require('underscore'));
    }
    function _defineViaAmd() {
        define(['underscore'], factory);
    }
    function _commonjsDefine() {
        var _prev = root['claz'],
            _current = factory(root['_']);
        root['claz'] = _current;
        root['claz'].noConflict = function() {
            root['claz'] = _prev;
            return _current
        }
    }

    /** @see <a href="https://github.com/umdjs/umd/blob/master/returnExports.js">exports doc</a> */
    //noinspection JSUnresolvedVariable
    if (typeof exports === 'object') {
        // Node
        return _defineNodeExports()
    }
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        return _defineViaAmd()
    }
    // Browser globals (root is window)
    return _commonjsDefine()
})(this, function(_){
    /**
     * (one may read as `class`)
     * @param {function} [initFn] (optional parameter) - function, called on an object construction
     * @param {object} members (obligatory parameter) - A plain object, containing member definitions - member name as property key and member as property value
     * @returns {function} - the resulting class factory function
     * */
    function claz(initFn, members) {
        if (arguments.length === 1) {
            members = arguments[0];
        }
        if (!_isPlainObject(members)) {
            throw new TypeError('unsupported members type!')
        }

        var _initFnOrNull = _getInitFnOrNull(initFn, members),
            _publicMethods = _getPublicMethods(members);
        var Ctor = function (){
            var _members = Ctor[_memberzPropName],
                _publicMethods = _getPublicMethods(_members),
                self = _.extend({}, _members);
            if (_.isFunction(_initFnOrNull)) {
                _initFnOrNull.apply(self, arguments)
            }
            //noinspection UnnecessaryLocalVariableJS
            var that = _.reduce(
                    _publicMethods,
                    function(publicThis, member, memberName){
                        publicThis[memberName] = _.bind(member, self);
                        return publicThis
                    },
                    {}
                );
            return that
        };

        _.extend(Ctor.prototype, _publicMethods);
        Ctor[_memberzPropName] = members;
        return Ctor
    }
    function _isPlainObject(obj) {
        return _toString.call(obj) === '[object Object]'
    }
    /**
     * @param {object} members - a plain object, containing member definitions - member name as property key and member as property value
     * @returns {object} - a plain object, containing only the keys, which do not start with `_` (underscore character) and the values for those keys are functions
     * */
    function _getPublicMethods(members) {
        return _.reduce(
            members,
            function(publicMethods, member, memberName) {
                if(!_.isString(memberName) || /^_/g.test(memberName)) {
                    return publicMethods
                }
                if (!_.isFunction(member)) {
                    return publicMethods
                }
                publicMethods[memberName] = member;
                return publicMethods
            },
            {}
        )
    }
    function _getInitFnOrNull(initFnOrNone, members) {
        if (_.isFunction(initFnOrNone)) {
            return initFnOrNone
        }
        return _getInitFnFromMembersOrNull(members)
    }
    function _getInitFnFromMembersOrNull(members) {
        var initFn = members.init;
        if(!_.isFunction(initFn)) {
            return null
        }
        return initFn
    }

    /**
     * (one may read as `with`)
     * @param {function} baseClas - the class factory function to be augumented
     * @param {...function} clas - class(es) to be mixed in
     * */
    function wiz(baseClas, clas){
        if (!_.isFunction(baseClas)) {
            throw new TypeError("#wiz: baseClas=`"+ baseClas +"` is not a class factory function!")
        }
        if (!_isPlainObject(baseClas[_memberzPropName])) {
            throw new TypeError("#wiz: baseClas=`"+ baseClas +"` baseClas."+ _memberzPropName +"=`"+ baseClas[_memberzPropName] +"` is not the members object!")
        }
        //noinspection UnnecessaryLocalVariableJS
        var _clases = _slice.call(arguments).reverse(),
            _methods4Mix = _.chain(_clases)
                .reduce(
                    _wizMixinMethodsForClaz,
                    {}
                )
                .reduce(
                    _wizComposeMethods,
                    {}
                )
                .value(),
            _members4Mix = _.reduce(
                _clases,
                _wizMixinMembersForClaz,
                {}
            ),
            _mixinz = _slice.call(arguments, 1),
            _memberz = _.extend({}, _members4Mix, _methods4Mix),
            _publicMethods4Mix = _getPublicMethods(_methods4Mix),
            _proto = _.extend(baseClas.prototype, _publicMethods4Mix, baseClas.prototype);
        baseClas[_memberzPropName] = _memberz;
        baseClas[_wizPropName] = _mixinz;
        baseClas.prototype = _proto;
        return baseClas
    }
    function _wizMixinMethodsForClaz(methods, clas) {
        if (!_.isFunction(clas)) {
            throw new TypeError("#_wizMixinMethodsForClaz clas=`"+ clas +"` is not a class factory function!")
        }
        if (!_isPlainObject(clas[_memberzPropName])) {
            throw new TypeError("#_wizMixinMethodsForClaz clas=`"+ clas +"` clas."+ _memberzPropName +"=`"+ claz[_memberzPropName] +"` is not the members object!")
        }
        methods = _.reduce(
            clas[_memberzPropName],
            _wizMixinMethod,
            methods
        );
        return methods
    }
    function _wizMixinMethod(methods, member, memberName) {
        if (!_.isArray(methods)) {
            throw new TypeError("#_wizMixinMethod: methods=`"+ methods +"` is not an array!")
        }
        if (!_.isString(memberName)) {
            throw new TypeError("#_wizMixinMethod: memberName=`"+ memberName +"` is not a string!")
        }
        if (!_.isFunction(member)) {
            return methods
        }
        var _stackableMethods = methods[memberName];
        if (!_.isArray(_stackableMethods)) {
            _stackableMethods = []
        }
        _stackableMethods.push(member);
        methods[memberName] = _stackableMethods;
        return methods
    }
    function _wizComposeMethods(composed, methods, methodName){
        if (!_.isArray(methods)) {
            throw new TypeError("#_wizComposeMethods: methods=`"+ methods +"` is not an array!")
        }
        if (!_.isString(methodName)) {
            throw new TypeError("#_wizComposeMethods: methodName=`"+ methodName +"` is not a string!")
        }
        if (_.size(methods) === 1) {
            composed[methodName] = _.first(methods);
            return composed
        }
        return _wizComposeMultiMethods(composed, methods, methodName)
    }
    function _wizComposeMultiMethods(composed, methods, methodName) {
        if (!_isPlainObject(composed)) {
            throw new TypeError("#_wizComposeMultiMethods: composed=`"+ composed +"` is not a plain object!")
        }
        if (!_.isArray(methods)) {
            throw new TypeError("#_wizComposeMultiMethods: methods=`"+ methods +"` is not an array!")
        }
        if (!_.isString(methodName)) {
            throw new TypeError("#_wizComposeMethods: methodName=`"+ methodName +"` is not a string!")
        }
        composed[methodName] = _composeToSingleFunction(methods);
        return composed
    }
    function _composeToSingleFunction(fns) {
        if (!_.isArray(fns)) {
            throw new TypeError("#_composeToSingleFunction: fns=`"+ fns +"` is not an array!")
        }
        var _fns = _.reduce(
                fns,
                function(memo, fn){
                    if (!_.isFunction(fn)) {
                        throw new TypeError("#_composeToSingleFunction: fn=`"+ fn +"` is not a function!")
                    }
                    var _fn = _overridePropOnCall(fn, 'super', memo.prevFn);
                    memo.fns.push(fn);
                    memo.prevFn = _fn;
                    return memo
                },
                {
                    prevFn: _.noop,
                    fns:[]
                }
            ).fns;
        //noinspection UnnecessaryLocalVariableJS
        var result = _.first(_fns);
        return result
    }
    function _overridePropOnCall(fn, propName, overrideProp) {
        if (!_.isFunction(fn)) {
            throw new TypeError("#_overridePropOnCall: fn=`"+ fn +"` is not a function!")
        }
        if (!_.isString(propName)) {
            throw new TypeError("#_overridePropOnCall: propName=`"+ propName +"` is not a string!")
        }
        return function(){
            var _args = _.toArray(arguments),
                _self = this,
                _continueInvocation = function(context){
                    return fn.apply(context, _args)
                };
            if (!_.has(_self, propName)) {
                return _overridePropDeleteAfterwards(_self, propName, overrideProp, _continueInvocation)
            }
            return _overridePropPutBackAfterwards(_self, propName, overrideProp, _continueInvocation);
        }
    }
    function _overridePropDeleteAfterwards(obj, propName, overrideProp, continueInvocation) {
        return _overridePropWithCleanUpCallback(obj, propName, overrideProp, continueInvocation, function (obj) {
            delete obj[propName];
            return obj
        });
    }
    function _overridePropPutBackAfterwards(_self, propName, overrideProp, _continueInvocation) {
        var _prop = _self[propName];
        return _overridePropWithCleanUpCallback(_self, propName, overrideProp, _continueInvocation, function (obj) {
            obj[propName] = _prop;
            return obj
        })
    }
    function _overridePropWithCleanUpCallback(obj, propName, overrideProp, continueInvocation, cleanUpCallback) {
        obj[propName] = overrideProp;
        var _wasNaN = _.isNaN(overrideProp),
            _wasSame = overrideProp === obj[propName],
            result = continueInvocation(obj),
            _isNaN = _.isNaN(obj),
            _isSame = overrideProp === obj[propName];
        if (_wasNaN !== _isNaN ||
            _wasSame !== _isSame) {
            // means, that the property has been overridden within the continueInvocation => no cleanup needed
            return result;
        }
        cleanUpCallback(obj);
        return result
    }
    function _wizMixinMembersForClaz(members, clas) {
        if (!_.isFunction(clas)) {
            throw new TypeError("#_wizMixinMembersForClaz: clas=`"+ clas +"` is not a class factory function!")
        }
        if (!_isPlainObject(clas[_memberzPropName])) {
            throw new TypeError("#_wizMixinMembersForClaz: clas=`"+ clas +"` clas."+ _memberzPropName +"=`"+ claz[_memberzPropName] +"` is not the members object!")
        }
        members = _.reduce(
            clas[_memberzPropName],
            _wizMixinMember,
            members
        );
        return members
    }
    function _wizMixinMember(memberz, member, memberName){
        if (_.has(memberz, memberName)) {
            return memberz
        }
        if(_.isFunction(member)) {
            return memberz
        }
        if (_.isNull(member) || _.isUndefined(member) || _.isNaN(member)) {
            return memberz
        }
        memberz[memberName] = member;
        return memberz
    }

    var _ObjProto = Object.prototype,
        _toString = _ObjProto.toString,
        _ArrProto = Array.prototype,
        _slice = _ArrProto.slice,
        _memberzPropName = "memberz",
        _wizPropName = "wiz";

    return {
        claz: claz,
        wiz: wiz,

        /** exposing internals for testing purpose */
        _isPlainObject: _isPlainObject,
        _getPublicMembers: _getPublicMethods,
        _getInitFnOrNull: _getInitFnOrNull,
        _getInitFnFromMembersOrNull: _getInitFnFromMembersOrNull,
        _wizMixinMethodsForClaz: _wizMixinMethodsForClaz,
        _wizMixinMethod: _wizMixinMethod,
        _wizComposeMethods: _wizComposeMethods,
        _wizComposeMultiMethods: _wizComposeMultiMethods,
        _wizMixinMembersForClaz: _wizMixinMembersForClaz,
        _wizMixinMember: _wizMixinMember,
        _overridePropOnCall: _overridePropOnCall,
        _overridePropDeleteAfterwards: _overridePropDeleteAfterwards,
        _overridePropPutBackAfterwards: _overridePropPutBackAfterwards,
        _overridePropWithCleanUpCallback: _overridePropWithCleanUpCallback
    }
});