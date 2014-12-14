/**!
 * @fileOverview claz.js - OOP for js
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
     * @param {function} [initFn] (optional parameter) - function, called on an object construction
     * @param {object} members (obligatory parameter) - A plain object, containing member definitions - member name as property key and member as property value
     * @returns {function} - the resulting class constructor function
     * */
    function claz(initFn, members) {
        if (arguments.length === 1) {
            members = arguments[0];
        }
        if (!_isPlainObject(members)) {
            throw new TypeError('unsupported members type!')
        }

        var _initFnOrNull = _getInitFnOrNull(initFn, members);
        var _publicMembers = _getPublicMembers(members);
        function Conztructor(){
            var self = _.extend({}, members);
            if (_.isFunction(_initFnOrNull)) {
                _initFnOrNull.apply(self, arguments)
            }
            _.each(_publicMembers, function(member, memberName){
                if (_.isFunction(member)) {
                    this[memberName] = _.bind(member, self);
                    return
                }
                this[memberName] = self[memberName]
            })
        }

        _.extend(Conztructor.prototype, _publicMembers);
        return Conztructor
    }
    function _isPlainObject(obj) {
        return _toString.call(obj) === '[object Object]'
    }
    /**
     * @param {object} members - a plain object, containing member definitions - member name as property key and member as property value
     * @returns {object} - a plain object, containing only the keys, which do not start with `_` (underscore character)
     * */
    function _getPublicMembers(members) {
        return _.reduce(
            members,
            function(publicMembers, member, memberName) {
                if(!_.isString(memberName) || /^_/g.test(memberName)) {
                    return publicMembers;
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

    var _ObjProto = Object.prototype,
        _toString = _ObjProto.toString;

    return {
        claz: claz,

        /** exposing internals for testing purpose */
        _isPlainObject: _isPlainObject,
        _getPublicMembers: _getPublicMembers,
        _getInitFnOrNull: _getInitFnOrNull,
        _getInitFnFromMembersOrNull: _getInitFnFromMembersOrNull
    }
});