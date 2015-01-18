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
            _publicMembers = _getPublicMembers(members);
        var Ctor = function (){
            var _members = Ctor[_memberzPropName],
                _privateThis = _.extend({}, _members);
            if (_.isFunction(_initFnOrNull)) {
                _initFnOrNull.apply(_privateThis, arguments)
            }
            var _getPrivateThis = function(){ return _privateThis },
                _getPublicThis = function(){ return publicThis };
            _privateThis = _.reduce(
                _privateThis,
                _.partial(_delegateToCopyOfThis, _getPrivateThis, _getPublicThis),
                {}
            );
            //noinspection UnnecessaryLocalVariableJS
            var publicThis = _getPublicMembers(_privateThis);
            return publicThis
        };

        _.extend(Ctor.prototype, _publicMembers);
        Ctor[_memberzPropName] = members;
        return Ctor
    }
    function _delegateToCopyOfThis(getPrivateThis, getPublicThis, self, member, memberName){
        if (!_.isFunction(member)) {
            self[memberName] = member;
            return self
        }
        self[memberName] = _getDelegatedFn(getPrivateThis, getPublicThis, member);
        return self
    }
    function _getDelegatedFn(getPrivateThis, getPublicThis, member){
        return function(){
            var _privateThis = getPrivateThis(),
                _publicThis = getPublicThis(),
                _context = _.extend({}, _privateThis, _publicThis),
                _args = _.toArray(arguments);
            return member.apply(_context,_args);
        }
    }
    function _isPlainObject(obj) {
        return _toString.call(obj) === '[object Object]'
    }
    /**
     * @param {object} members - a plain object, containing member definitions - member name as property key and member as property value
     * @returns {object} - a plain object, containing only the keys, which do not start with `_` (underscore character) and the values for those keys are functions
     * */
    function _getPublicMembers(members) {
        return _.reduce(
            members,
            function(publicMembers, member, memberName) {
                if(!_.isString(memberName) || /^_/g.test(memberName)) {
                    return publicMembers
                }
                publicMembers[memberName] = member;
                return publicMembers
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
     * @param {function|object} topClasOrMembers - the class factory function to be augumented
     * @param {...function|...object} clasOrMembers - class(es) or members (multiple) to be mixed in
     * */
    function wiz(topClasOrMembers, clasOrMembers){
        if (arguments.length === 1) {
            return exports._getClasFromClasOrMembers(topClasOrMembers)
        }
        var _clases = _slice.call(arguments,1);
        _clases.push(topClasOrMembers);
        //noinspection UnnecessaryLocalVariableJS
        var _methods4Mix = exports._getWizMethods4Mix(_clases),
            _members4Mix = exports._getWizMembers4Mix(_clases),
            _mixinz = _slice.call(arguments, 1),
            _memberz = _.extend({}, _members4Mix, _methods4Mix),
            resultClas = exports._putMembersToClas(topClasOrMembers, _memberz);
        resultClas[_wizPropName] = _mixinz;
        return resultClas
    }
    function _getClasFromClasOrMembers(clasOrMembers){
        if(_.isFunction(clasOrMembers)){
            return clasOrMembers
        }
        return exports.claz(clasOrMembers)
    }
    function _getWizMethods4Mix(clases) {
        return _.chain(clases)
            .reduce(
                exports._wizMixinMethodsForClaz,
                {}
            )
            .reduce(
                exports._wizComposeMethods,
                {}
            )
            .value();
    }
    function _wizMixinMethodsForClaz(methods, clas) {
        var members = exports._getMembersFromClazOrMembers(clas);
        methods = _.reduce(
            members,
            exports._wizMixinMethod,
            methods
        );
        return methods
    }
    function _getMembersFromClazOrMembers(clasOrMembers) {
        if (_.isFunction(clasOrMembers)) {
            return exports._getMembersFromClaz(clasOrMembers)
        }
        if (!_isPlainObject(clasOrMembers)) {
            throw new TypeError("#_getMembersFromClazOrMembers: clasOrMembers=`" + clasOrMembers + "` is not the members object!")
        }
        return clasOrMembers;
    }
    function _getMembersFromClaz(clas) {
        var members = clas[_memberzPropName];
        if (!_isPlainObject(members)) {
            throw new TypeError("#_getMembersFromClaz: clas=`" + clas + "` clas." + _memberzPropName + "=`" + claz[_memberzPropName] + "` is not the members object!")
        }
        return members
    }
    function _wizMixinMethod(methods, member, memberName) {
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
        return exports._wizComposeMultiMethods(composed, methods, methodName)
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
        composed[methodName] = exports._composeToSingleFunction(methods);
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
                    var _fn;
                    if (!_.has(memo, 'prevFn')) {
                        _fn = exports._overridePropOnCall(fn, 'super')
                    } else {
                        _fn = exports._overridePropOnCall(fn, 'super', memo.prevFn)
                    }
                    memo.fns.push(_fn);
                    memo.prevFn = _fn;
                    return memo
                },
                {
                    fns:[]
                }
            ).fns;
        //noinspection UnnecessaryLocalVariableJS
        var result = _.last(_fns);
        return result
    }
    function _overridePropOnCall(fn, propName, overrideProp) {
        if (!_.isFunction(fn)) {
            throw new TypeError("#_overridePropOnCall: fn=`"+ fn +"` is not a function!")
        }
        if (!_.isString(propName)) {
            throw new TypeError("#_overridePropOnCall: propName=`"+ propName +"` is not a string!")
        }
        /**
         * if {@code overrideProp} is not passed, then it means, that
         * property by {@code propName} should be overridden via delete
         * (when the invocation happens, `_.has(this, propName) === false`)
         * */
        var _overrideViaDelete = arguments.length === 2;
        return function(){
            var _args = _.toArray(arguments),
                _self = this,
                _invokeWithContext = function(context){
                    return fn.apply(context, _args)
                };
            return exports._overrideAccountingPropExistence(_self, propName, overrideProp, _overrideViaDelete, _invokeWithContext)
        }
    }
    function _overrideAccountingPropExistence(obj, propName, overrideProp, overrideViaDelete, invokeWithContext){
        if (_.has(obj, propName)) {
            return exports._overrideWithContextSwitch(obj, propName, overrideProp, overrideViaDelete, invokeWithContext)
        }
        if (overrideViaDelete) {
            // no need to delete the property key, if it is to be overridden with a delete
            return invokeWithContext(obj)
        }
        return exports._overrideWithContextSwitch(obj, propName, overrideProp, overrideViaDelete, invokeWithContext)
    }
    function _overrideWithContextSwitch(obj, propName, overrideProp, overrideViaDelete, invokeWithContext){
        var _context = _.extend({}, obj);
        _context = exports._overrideProp(_context, propName, overrideViaDelete, overrideProp);
        return invokeWithContext(_context);
    }
    function _overrideProp(obj, propName, overrideViaDelete, overrideProp){
        if (overrideViaDelete) {
            return exports._overridePropViaDelete(obj, propName)
        }
        return exports._overridePropViaPut(obj, propName, overrideProp)
    }
    function _overridePropViaPut(obj, propName, overrideProp) {
        obj[propName] = overrideProp;
        return obj
    }
    function _overridePropViaDelete(obj, propName) {
        delete obj[propName];
        return obj
    }
    function _getWizMembers4Mix(clases) {
        return _.reduce(
            clases,
            exports._wizMixinMembersForClaz,
            {}
        );
    }
    function _wizMixinMembersForClaz(members, clasOrMembers) {
        var memberz = _getMembersFromClazOrMembers(clasOrMembers);
        members = _.reduce(
            memberz,
            exports._wizMixinMember,
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
    function _putMembersToClas(clas, members) {
        if (!_.isFunction(clas)) {
            return exports.claz(members)
        }
        var _publicMembers4Mix = exports._getPublicMembers(members);
        clas[_memberzPropName] = members;
        clas.prototype = _publicMembers4Mix;
        return clas
    }

    /**
     * (one may read `implements`)
     * @param {object} obj -
     * @param {object|function} clazOrMembers -
     * @returns {boolean} true, if the `obj` has all the members with the same types as specified by `clazOrMembers`
     * */
    function implementz(obj, clazOrMembers) {
        if (_.isFunction(clazOrMembers) && _.has(clazOrMembers, _memberzPropName)) {
            return _implementzClaz(obj, clazOrMembers)
        }
        return _implementzAbstractIface(obj, clazOrMembers)
    }
    function _implementzClaz(obj, claz){
        var _objMembers = _getAllMembers(obj),
            _clazMembers = claz[_memberzPropName],
            _publicMembers = _getPublicMembers(_clazMembers);
        return _.all(_publicMembers, _.partial(_implementzMemberz, _objMembers))
    }
    function _implementzMemberz(objMembers, member, memberName){
        return _.has(objMembers, memberName) &&
            typeof objMembers[memberName] === typeof member
    }
    function _getAllMembers(obj) {
        var members = {},
            _propName;
        for(_propName in obj) {
            //noinspection JSUnfilteredForInLoop
            members[_propName] = obj[_propName]
        }
        return members
    }
    function _implementzAbstractIface(obj, abstractIface) {
        if (_.isFunction(abstractIface)) {
            return _implementzAbstractIface(obj, abstractIface.prototype)
        }
        var _objMembers = _getAllMembers(obj),
            _ifaceMembers = _getAllMembers(abstractIface);
        return _.all(_ifaceMembers, _.partial(_implementzMemberz, _objMembers))
    }

    var _ObjProto = Object.prototype,
        _toString = _ObjProto.toString,
        _ArrProto = Array.prototype,
        _slice = _ArrProto.slice,
        _push = _ArrProto.push,

        _memberzPropName = "memberz",
        _wizPropName = "wiz",

        WizClazBuilder = claz(
            function(clazOrMembers){
                this.clazOrMembers = clazOrMembers;
                this.wizMixins = [];
            },
            {
                wiz: function(clazOrMembers){
                    var _clasesOrMembers = _.toArray(arguments);
                    _push.apply(this.wizMixins, _clasesOrMembers);
                    return this
                },
                build: function(){
                    var _args = [];
                    _args.push(this.clazOrMembers);
                    _push.apply(_args, this.wizMixins);
                    return exports.wiz.apply(_args)
                }
            }
        ),

        exports = {
            claz: claz,
            wiz: wiz,
            implementz: implementz,
            implz: implementz,
            WizClazBuilder: WizClazBuilder,

            /** exposing internals for testing purpose */
            _isPlainObject: _isPlainObject,
            _getPublicMembers: _getPublicMembers,
            _getInitFnOrNull: _getInitFnOrNull,
            _getInitFnFromMembersOrNull: _getInitFnFromMembersOrNull,
            _getClasFromClasOrMembers: _getClasFromClasOrMembers,
            _getWizMethods4Mix: _getWizMethods4Mix,
            _wizMixinMethodsForClaz: _wizMixinMethodsForClaz,
            _getMembersFromClazOrMembers: _getMembersFromClazOrMembers,
            _getMembersFromClaz: _getMembersFromClaz,
            _wizMixinMethod: _wizMixinMethod,
            _wizComposeMethods: _wizComposeMethods,
            _wizComposeMultiMethods: _wizComposeMultiMethods,
            _composeToSingleFunction: _composeToSingleFunction,
            _overridePropOnCall: _overridePropOnCall,
            _overrideAccountingPropExistence: _overrideAccountingPropExistence,
            _overrideWithContextSwitch: _overrideWithContextSwitch,
            _overrideProp: _overrideProp,
            _overridePropViaPut: _overridePropViaPut,
            _overridePropViaDelete: _overridePropViaDelete,
            _getWizMembers4Mix: _getWizMembers4Mix,
            _wizMixinMembersForClaz: _wizMixinMembersForClaz,
            _wizMixinMember: _wizMixinMember,
            _putMembersToClas: _putMembersToClas,
            _implementzClaz: _implementzClaz,
            _implementzMemberz: _implementzMemberz,
            _getAllMembers: _getAllMembers,
            _implementzAbstractIface: _implementzAbstractIface
        };
    return exports
});