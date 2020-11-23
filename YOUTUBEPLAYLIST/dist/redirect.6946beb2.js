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
})({"js/redirect.js":[function(require,module,exports) {
$(document).ready(function () {
  //var redirect_uri = "http://localhost:1234/redirect.html";
  var redirect_uri = "http://playlounge-search.herokuapp.com/redirect.html";
  var client_id = "1064710241183-09tdvsnm4th6dokv8d84sr4ft2jhh904.apps.googleusercontent.com";
  var scope = "https://www.googleapis.com/auth/youtube";
  var client_secret = "67sGneJMFickdSp5aH_LHA6y";
  var API_KEY = "AIzaSyC5ln_nE3PNS2MvmgAu4cB0YGDd49Rke8w";
  var urlParams = new URLSearchParams(window.location.search);
  var code = urlParams.get('code');
  var playlist;
  var channelId;
  var username;
  var search;
  var playlistId;
  $("#buttonid").click(function () {
    $("#myplaylist").show();
    empty();
    channelId = $("#channelId").val();
    getChannelPlaylist(channelId);
  });
  $("#searchbutton").click(function () {
    $("#myplaylist").show();
    empty();
    search = $("#search").val();
    getChannelPlaylistBySearch(search);
  });
  $("#usernamebutton").click(function () {
    $("#myplaylist").show();
    empty();
    username = $("#usernamefield").val();
    getChannelPlaylistByUserName(username);
  });
  $.ajax({
    type: 'POST',
    url: "https://www.googleapis.com/oauth2/v4/token",
    data: {
      code: code,
      redirect_uri: redirect_uri,
      client_secret: client_secret,
      client_id: client_id,
      scope: scope,
      grant_type: "authorization_code"
    },
    dataType: "json",
    success: function success(resultData) {
      console.log(resultData);
      console.log(resultData.access_token);
      localStorage.setItem("accessToken", resultData.access_token);
      localStorage.setItem("refreshToken", resultData.refreshToken);
      localStorage.setItem("expires_in", resultData.expires_in); //window.history.pushState({}, document.title, "/GitLoginApp/" + "upload.html");

      window.history.replaceState({}, document.title, redirect_uri);
    }
  });
  getMyPlaylists();

  function getMyPlaylists() {
    $.ajax({
      type: "GET",
      beforeSend: function beforeSend(request) {
        request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
      },
      url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=25&access_token=Bearer" + " " + localStorage.getItem("accessToken"),
      success: function success(data) {
        console.log(data);
        data.items.forEach(function (item) {
          playlist = "\n                 <div style=\"text-align:center;\">     \n                      <li>\n                      <h5>".concat(item.snippet.title, "</h1>\n                      <img src=\"").concat(item.snippet.thumbnails.medium.url, "\" class=\"img-rounded\">\n                      <h10>").concat(item.snippet.description, "</h3>\n                      <div>\n                      <a href=\"https://www.youtube.com/playlist?list=").concat(item.id, "\" target=\"_blank\">Go To Playlist</a>\n                      </div>\n                      </li>\n                 </div>     \n                      ");
          $("#results1").append(playlist);
        });
      },
      error: function error(_error) {
        console.log(_error);
      }
    });
  }

  function empty() {
    //empty all the div
    $("#results1").empty();
    $("#results2").empty();
    $("#results3").empty();
    $("#results4").empty();
  }

  function getChannelPlaylistByUserName() {
    $.ajax({
      type: "GET",
      beforeSend: function beforeSend(request) {
        request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
      },
      url: "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails" + "&maxResults=25&forUsername=" + username + "&access_token=Bearer" + " " + localStorage.getItem("accessToken"),
      success: function success(data) {
        console.log(data);
        channelId = data.items[0].id;
        getChannelPlaylistIdUserName(channelId); //$("#results").append(data.items.snippet.channelTitle);
      },
      error: function error(_error2) {
        console.log(_error2);
      }
    });
  }

  function getChannelPlaylist(channelId) {
    $.ajax({
      type: "GET",
      beforeSend: function beforeSend(request) {
        request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
      },
      url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=25&channelId=" + channelId + "&access_token=Bearer" + " " + localStorage.getItem("accessToken"),
      success: function success(data) {
        console.log(data); //$("#results").append(data.items.snippet.channelTitle);

        data.items.forEach(function (item) {
          playlist = "\n                   <div style=\"text-align:center;\">     \n                        <li>\n                        <h5>".concat(item.snippet.title, "</h1>\n                        <h10>").concat(item.snippet.description, "</h3>\n                        <a href=\"https://www.youtube.com/playlist?list=").concat(item.id, "\" target=\"_blank\">Go To Playlist</a>\n                        </li>\n                   </div>     \n                        ");
          $("#results2").append(playlist);
        });
      },
      error: function error(_error3) {
        console.log(_error3);
      }
    });
  }

  function getChannelPlaylistBySearch(search) {
    $.ajax({
      type: "GET",
      beforeSend: function beforeSend(request) {
        request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
      },
      url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=" + search + "&type=playlist",
      success: function success(data) {
        console.log(data);
        data.items.forEach(function (item) {
          //playlistId = item.id.playlistId;
          //                        <button id="copyText" class="btn btn-primary" onclick="textToClipboard('https://www.youtube.com/playlist?list=${item.id.playlistId}')">Copy playlist link</button>
          playlist = "\n                   <div style=\"text-align:center;\">     \n                        <li>\n                        <h5>".concat(item.snippet.title, "</h1>\n                        <h10>").concat(item.snippet.description, "</h3><div>\n                        <a href=\"https://www.youtube.com/playlist?list=").concat(item.id.playlistId, "\" target=\"_blank\">Go To Playlist</a>\n                        </div>\n                        <iframe\n                        width=\"560\"\n                        height=\"315\"\n                        src=\"http://www.youtube.com/embed?listType=playlist&list=").concat(item.id.playlistId, "&autoplay=1\"\n                        frameborder=\"0\"\n                        allowfullscreen\n                        ></iframe>\n                        \n                        </li>\n                   </div>     \n                        ");
          $("#results4").append(playlist);
        }); //$("#results").append(data.items.snippet.channelTitle);
      },
      error: function error(_error4) {
        console.log(_error4);
      }
    });
  }

  function textToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
});
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58980" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/redirect.js"], null)
//# sourceMappingURL=/redirect.6946beb2.js.map