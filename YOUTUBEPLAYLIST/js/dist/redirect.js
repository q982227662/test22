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
})({"redirect.js":[function(require,module,exports) {
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
},{}]