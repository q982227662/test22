$(document).ready(function(){
    //var redirect_uri = "http://localhost:1234/redirect.html";
    var redirect_uri = "http://playlounge-search.herokuapp.com/redirect.html"
    var client_id = "1064710241183-09tdvsnm4th6dokv8d84sr4ft2jhh904.apps.googleusercontent.com"
    var scope = "https://www.googleapis.com/auth/youtube";
    var client_secret = "67sGneJMFickdSp5aH_LHA6y";

    var API_KEY= "AIzaSyC5ln_nE3PNS2MvmgAu4cB0YGDd49Rke8w"

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    var playlist;
    var channelId;
    var username;
    var search;
    var playlistId;

    $("#buttonid").click(function(){
        $("#myplaylist").show()
        empty();
        channelId = $("#channelId").val();
        getChannelPlaylist(channelId);
    });

    
    $("#searchbutton").click(function(){

        $("#myplaylist").show();

        empty();

        search = $("#search").val();

        getChannelPlaylistBySearch(search);

    });

    $("#usernamebutton").click(function(){

        $("#myplaylist").show();
        
        empty();

        username = $("#usernamefield").val();

        getChannelPlaylistByUserName(username);


    });

   

    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {code:code
            ,redirect_uri:redirect_uri,
            client_secret:client_secret,
        client_id:client_id,
        scope:scope,
        grant_type:"authorization_code"},
        dataType: "json",
        success: function(resultData) {
           console.log(resultData)
           console.log(resultData.access_token);
            
           localStorage.setItem("accessToken",resultData.access_token);
           localStorage.setItem("refreshToken",resultData.refreshToken);
           localStorage.setItem("expires_in",resultData.expires_in);
           //window.history.pushState({}, document.title, "/GitLoginApp/" + "upload.html");
            window.history.replaceState({}, document.title, redirect_uri);
        
        }
  });
      getMyPlaylists();


  function getMyPlaylists()
  {
  
      $.ajax({
          type: "GET",
          beforeSend: function(request) {
              request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
              
          },
          url:"https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=25&access_token=Bearer"+ " "+localStorage.getItem("accessToken"),

          success: function (data) {

              console.log(data);

              data.items.forEach(item => {
                 playlist = `
                 <div style="text-align:center;">     
                      <li>
                      <h5>${item.snippet.title}</h1>
                      <img src="${item.snippet.thumbnails.medium.url}" class="img-rounded">
                      <h10>${item.snippet.description}</h3>
                      <div>
                      <a href="https://www.youtube.com/playlist?list=${item.id}" target="_blank">Go To Playlist</a>
                      </div>
                      </li>
                 </div>     
                      `;
                 $("#results1").append(playlist); 
              });
          },
          error: function (error) {
              console.log(error);
          }, 
      });
    }

    function empty(){
        //empty all the div
        $("#results1").empty();
        $("#results2").empty();
        $("#results3").empty();
        $("#results4").empty();
    }

    function getChannelPlaylistByUserName(){
        $.ajax({
            type: "GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails"+"&maxResults=25&forUsername="+username+"&access_token=Bearer"+ " "+localStorage.getItem("accessToken"),

            success: function (data) {

                console.log(data);

                channelId = data.items[0].id;

                getChannelPlaylistIdUserName(channelId);
                //$("#results").append(data.items.snippet.channelTitle);
            },
            error: function (error) {
                console.log(error);
            },
            
        });
    
    }
    
    function getChannelPlaylist(channelId)
    {

        $.ajax({
            type: "GET",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
    
            },
            url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=25&channelId="+channelId+"&access_token=Bearer"+ " "+localStorage.getItem("accessToken"),

            success: function (data) {

                console.log(data);

                //$("#results").append(data.items.snippet.channelTitle);
               
                data.items.forEach(item => {
                   playlist = `
                   <div style="text-align:center;">     
                        <li>
                        <h5>${item.snippet.title}</h1>
                        <h10>${item.snippet.description}</h3>
                        <a href="https://www.youtube.com/playlist?list=${item.id}" target="_blank">Go To Playlist</a>
                        </li>
                   </div>     
                        `;
                   $("#results2").append(playlist); 
                });


            },
            error: function (error) {
                console.log(error);
            },
            
        });
    

    }

    function getChannelPlaylistBySearch(search)
    {

        $.ajax({
            type: "GET",

            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            
            url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q="+search+"&type=playlist",

            success: function (data) {

                console.log(data);

                data.items.forEach(item => {
                   
                    //playlistId = item.id.playlistId;

                    //                        <button id="copyText" class="btn btn-primary" onclick="textToClipboard('https://www.youtube.com/playlist?list=${item.id.playlistId}')">Copy playlist link</button>

                    playlist = `
                   <div style="text-align:center;">     
                        <li>
                        <h5>${item.snippet.title}</h1>
                        <h10>${item.snippet.description}</h3><div>
                        <a href="https://www.youtube.com/playlist?list=${item.id.playlistId}" target="_blank">Go To Playlist</a>
                        </div>
                        <iframe
                        width="560"
                        height="315"
                        src="http://www.youtube.com/embed?listType=playlist&list=${item.id.playlistId}&autoplay=1"
                        frameborder="0"
                        allowfullscreen
                        ></iframe>
                        
                        </li>
                   </div>     
                        `;

                   $("#results4").append(playlist);
                                    
                });

                //$("#results").append(data.items.snippet.channelTitle);

            },
            error: function (error) {
                console.log(error);
            },
            
        });


    }



    function textToClipboard (text) {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }

})

