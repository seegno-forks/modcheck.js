'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var weightTable = require('./valacdos').table;

var Modcheck = (function () {
  function Modcheck(accountNumber, sortCode) {
    _classCallCheck(this, Modcheck);

    this.accountNumber = accountNumber;
    this.sortCode = sortCode;
    this.weightTable = weightTable;
    this.currentCheck = null;

    if (typeof this.sortCode === 'string' || this.sortCode instanceof String) {
      this.sortCode = this.sortCode.replace(/-/g, '');
    }
  }

  _createClass(Modcheck, [{
    key: 'check',
    value: function check() {
      var _this = this;

      if (parseInt(this.accountNumber) === 0 || isNaN(parseInt(this.accountNumber))) {
        return false;
      }

      var checks = this.getSortCodeChecks();

      var results = [];

      checks.forEach(function (check) {
        _this.currentCheck = check;

        _this.weight = Object.keys(check.weight).reduce(function (prev, cur) {
          return prev + check.weight[cur].toString();
        }, '');

        switch (check.algorithm) {
          case 'DBLAL':
            if (check.exception == 3 && _this.accountNumber[2] != 6 && _this.accountNumber[2] != 9) {
              results.push(_this.dblAlCheck());
            }
            break;
          case 'MOD10':
            results.push(_this.mod10Check());
            break;
          case 'MOD11':
            results.push(_this.mod11Check());
            break;
        }
      });

      // One fail causes entire check to fail
      var passed = results.reduce(function (prev, cur) {
        return cur !== true ? false : prev;
      }, true);

      return passed;
    }
  }, {
    key: 'getSortCodeChecks',
    value: function getSortCodeChecks() {
      var sortCode = parseInt(this.sortCode);

      if (sortCode === 0 || isNaN(sortCode)) {
        return false;
      }

      var checks = weightTable.filter(function (check) {
        var start = parseInt(check.sortCodeRange.start);
        var end = parseInt(check.sortCodeRange.end);

        return sortCode >= start && sortCode <= end;
      });

      return checks;
    }
  }, {
    key: 'dblAlCheck',
    value: function dblAlCheck() {
      var account = this.sortCode + this.accountNumber;
      var weightedAccount = [];

      for (var i = 0; i < 14; i++) {
        weightedAccount[i] = parseInt(account[i]) * parseInt(this.weight[i]);
      }

      weightedAccount = weightedAccount.join('').split('');

      var sum = weightedAccount.reduce(function (a, b) {
        return parseInt(a) + parseInt(b);
      });

      if (this.currentCheck.exception == 1) {
        sum += 27;
      }

      return sum % 10 === 0;
    }
  }, {
    key: 'mod10Check',
    value: function mod10Check() {
      var account = this.sortCode + this.accountNumber;
      var weightedAccount = [];

      for (var i = 0; i < 14; i++) {
        weightedAccount[i] = parseInt(account[i]) * parseInt(this.weight[i]);
      }

      var sum = weightedAccount.reduce(function (prev, curr) {
        return parseInt(prev) + parseInt(curr);
      });

      return sum % 10 === 0;
    }
  }, {
    key: 'mod11Check',
    value: function mod11Check() {
      var account = this.sortCode + this.accountNumber;
      var weightedAccount = [];

      for (var i = 0; i < 14; i++) {
        weightedAccount[i] = parseInt(account[i]) * parseInt(this.weight[i]);
      }

      var sum = weightedAccount.reduce(function (prev, curr) {
        return parseInt(prev) + parseInt(curr);
      });

      return sum % 11 === 0;
    }
  }]);

  return Modcheck;
})();

exports['default'] = Modcheck;
module.exports = exports['default'];