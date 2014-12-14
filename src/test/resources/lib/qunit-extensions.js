(function(window) {

    var Qunit = window.Qunit || {};
    var has = "hasOwnProperty";

    // Setup blank require function..
    Qunit.require = function (script) {};
    Qunit.requireCss = function (stylesheet) {};

    var QUnitCollector = (function() {

        var _tests = [], _passed = -1, _failed = -1, _total = -1;

        return {
            addTest : function(test) {
                _tests.push(test);
            },
            setPassed : function(passed) {
                _passed = passed;
            },
            setFailed : function(failed) {
                _failed = failed;
            },
            setTotal : function(total) {
                _total = total;
            },
            toJSON : function() {
                return {
                    tests : _tests,
                    passed : _passed,
                    failed : _failed,
                    total : _total
                };
            }
        };
    })();

    QUnit.completed = false;

    var currentTest;
    var currentLogs = [];

    // Represents a test
    QUnitCollector.Test = function(name, module) {

        var _logs = [], _passed = -1, _failed = -1, _total = -1;

        return {
            setLogs : function(logs) {
                _logs = logs.slice(0);
            },
            setPassed : function(passed) {
                _passed = passed;
            },
            setFailed : function(failed) {
                _failed = failed;
            },
            setTotal : function(total) {
                _total = total;
            },
            toJSON : function() {
                var obj = {
                    name   : name,
                    module : module ? module : null,
                    logs   : _logs,
                    passed : _passed,
                    failed : _failed,
                    total  : _total
                };
                return obj;
            }

        };
    };

    // Represents a pass/fail message
    QUnitCollector.LogMessage = function(result) {

        var _message = null, _actual = null, _expected = null, _source = null;

        return {
            setMessage : function(message) {
                _message = message;
            },
            setActual : function(actual) {
                _actual = actual
            },
            setExpected : function(expected) {
                _expected = expected;
            },
            setSource : function(source) {
                _source = source;
            },
            toJSON : function() {
                return {
                    result : result,
                    message : _message,
                    actual : _actual,
                    expected : _expected,
                    source : _source
                };
            }

        };
    };

    QUnit.testStart(function(context) {

        currentTest = QUnitCollector.Test(context.name, context.module);
        currentLogs = [];
    });

    QUnit.testDone(function(context) {

        currentTest.setPassed(context.passed);
        currentTest.setFailed(context.failed);
        currentTest.setTotal(context.total);
        currentTest.setLogs(currentLogs);

        QUnitCollector.addTest(currentTest);
    });

    function stringifyObject(obj) {

        // Handle special cases that JSON.stringify can't
        if (obj instanceof HTMLElement) {
            return obj.outerHTML;
        } else if (obj instanceof Function) {
            return obj.toString();
        }

        return typeof obj === 'object' ?
            JSON.stringify(obj) :
            obj;
    }

    QUnit.log(function(message) {

        var logMessage = QUnitCollector.LogMessage(message.result);

        if (message[has]('actual')) {
            logMessage.setActual(stringifyObject(message.actual)); // Gson parser can't handle this currently.
        }
        if (message[has]('expected')) {
            logMessage.setExpected(stringifyObject(message.expected)); // Gson parser can't handle this currently.
        }
        if (message[has]('source')) {
            logMessage.setSource(message.source);
        }
        if (message[has]('message')) {
            logMessage.setMessage(message.message);
        }
        currentLogs.push(logMessage);
    });

    QUnit.done(function(context) {
        QUnitCollector.setPassed(context.passed);
        QUnitCollector.setFailed(context.failed);
        QUnitCollector.setTotal(context.total);

        QUnit.completed = true;
    });

    window.QUnitCollector = QUnitCollector;
    window.Qunit = Qunit;

})(window);