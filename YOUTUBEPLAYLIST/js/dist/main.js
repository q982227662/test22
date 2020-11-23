// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../node_modules/fetch-jsonp/build/fetch-jsonp.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.fetchJsonp = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var defaultOptions = {
    timeout: 5000,
    jsonpCallback: 'callback',
    jsonpCallbackFunction: null
  };

  function generateCallbackFunction() {
    return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
  }

  function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
      delete window[functionName];
    } catch (e) {
      window[functionName] = undefined;
    }
  }

  function removeScript(scriptId) {
    var script = document.getElementById(scriptId);
    if (script) {
      document.getElementsByTagName('head')[0].removeChild(script);
    }
  }

  function fetchJsonp(_url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // to avoid param reassign
    var url = _url;
    var timeout = options.timeout || defaultOptions.timeout;
    var jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

    var timeoutId = undefined;

    return new Promise(function (resolve, reject) {
      var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
      var scriptId = jsonpCallback + '_' + callbackFunction;

      window[callbackFunction] = function (response) {
        resolve({
          ok: true,
          // keep consistent with fetch API
          json: function json() {
            return Promise.resolve(response);
          }
        });

        if (timeoutId) clearTimeout(timeoutId);

        removeScript(scriptId);

        clearFunction(callbackFunction);
      };

      // Check if the user set their own params, and if not add a ? to start a list of params
      url += url.indexOf('?') === -1 ? '?' : '&';

      var jsonpScript = document.createElement('script');
      jsonpScript.setAttribute('src', '' + url + jsonpCallback + '=' + callbackFunction);
      if (options.charset) {
        jsonpScript.setAttribute('charset', options.charset);
      }
      jsonpScript.id = scriptId;
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);

      timeoutId = setTimeout(function () {
        reject(new Error('JSONP request to ' + _url + ' timed out'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        window[callbackFunction] = function () {
          clearFunction(callbackFunction);
        };
      }, timeout);

      // Caught if got 404/500
      jsonpScript.onerror = function () {
        reject(new Error('JSONP request to ' + _url + ' failed'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    });
  }

  // export as global function
  /*
  let local;
  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }
  local.fetchJsonp = fetchJsonp;
  */

  module.exports = fetchJsonp;
});
},{}],"validation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEmpty = isEmpty;
exports.showAlert = showAlert;

//export const isEmpty = value =>value.trim().length === 0 ;
function isEmpty(value) {
  var test = value.trim().length === 0;
  return test;
}

function showAlert(message, className) {
  //Create a div
  var div = document.createElement("div"); //Add classes

  div.className = "alert alert-".concat(className); //Add text

  div.appendChild(document.createTextNode(message)); //Get jumbotron

  var jumbotron = document.querySelector("#jumbotron"); //Get form div 

  var form = document.querySelector("#form-div"); //Insert Alert

  jumbotron.insertBefore(div, form);
  setTimeout(function () {
    return document.querySelector('.alert').remove();
  }, 3000);
}
},{}],"main.js":[function(require,module,exports) {
"use strict";

var _validation = require("./validation");

var fetchJsonp = require("fetch-jsonp"); //import validtion and showAlert


// Get searchform element 
var searchForm = document.querySelector("#search-form"); //Submit search form

searchForm.addEventListener("submit", fetchMusic); //Fetch music data from Apple music APi

function fetchMusic(e) {
  e.preventDefault();
  var searchText = document.querySelector("#search-text").value;

  if ((0, _validation.isEmpty)(searchText)) {
    (0, _validation.showAlert)("Please search something.", "warning");
    return;
  }

  var fetchUrl = "https://itunes.apple.com/search?term=".concat(searchText);
  fetchJsonp(fetchUrl).then(function (res) {
    return res.json();
  }).then(function (data) {
    return showMusic(data.results);
  }).catch(function (err) {
    return console.log(err);
  });
} //show each music in a format of card


function showMusic(musics) {
  console.log(musics);
  var results = document.querySelector("#results");

  if (musics.length === 0) {
    (0, _validation.showAlert)('Nothing Found!', 'danger');
    return;
  } //clear results


  results.innerHTML = ''; // loop through every music in the element by checking the song

  for (var i = 0; i < musics.length; i++) {
    var music = musics[i];

    if (music.kind !== "song") {
      continue;
    }

    var div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = "<img class=\"card-img-top\" src=".concat(music.artworkUrl100, " alt=\"Album Artwork\">\n        <div class=\"card-body\">\n          <h5 class=\"card-title\">").concat(music.trackName, "</h5>\n          <p class=\"card-text\">").concat(music.artistName, "</p>\n        </div>\n        <ul class=\"list-group list-group-flush\">\n          <li class=\"list-group-item\">").concat(music.collectionName, "</li>\n          <li class=\"list-group-item\">").concat(music.primaryGenreName, " . ").concat(music.releaseDate.split('-', 1), "</li>\n\n          <li class=\"list-group-item\">sample: <br>\n                <audio src =").concat(music.previewUrl, " controls='controls'>\n                </audio></li>\n        </ul>\n        <div class=\"card-body\">\n          <a href=").concat(music.trackViewUrl, " class=\"card-link\">Show in itunes</a>\n\n        </div>");
    results.appendChild(div);
  }
}
},{"fetch-jsonp":"../../../node_modules/fetch-jsonp/build/fetch-jsonp.js","./validation":"validation.js"}]