(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"7nz7":function(e,r,n){"use strict";n.d(r,"a",function(){return t});var t=function(){function e(){}return e.prototype.safeString=function(e){if("string"==typeof e)return e.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g,function(e){switch(e){case"\0":return"\\0";case"\b":return"\\b";case"\t":return"\\t";case"\x1a":return"\\z";case"\n":return"\\n";case"\r":return"\\r";case'"':case"'":case"\\":case"%":return"\\"+e}})},e.prototype.whiteSpaceControl=function(e){var r=JSON.stringify(e).replace(/\s+/g," ").replace(/\s\"/g,'"').replace(/\"\s/g,'"');return JSON.parse(r)},e.prototype.AlphaNumericSpace=function(e){return e.value?e.value.match(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/)?null:{AlphaNumericSpaceErr:!0}:null},e}()}}]);