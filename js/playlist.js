$(document).ready(function(){
    
    var API_KEY= "AIzaSyC5ln_nE3PNS2MvmgAu4cB0YGDd49Rke8w"
    //var redirect_uri = "http://localhost:1234/redirect.html";
    var redirect_uri = "http://playlounge-search.herokuapp.com/redirect.html";
  
    var client_id = "1064710241183-09tdvsnm4th6dokv8d84sr4ft2jhh904.apps.googleusercontent.com"
    var scope = "https://www.googleapis.com/auth/youtube";
    var url = "";
    $("#login").click(function(){
        signIn(client_id,redirect_uri,scope,url);
    });
    function signIn(client_id,redirect_uri,scope,url){
        url = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirect_uri
        +"&prompt=consent&response_type=code&client_id="+client_id+"&scope="+scope
        +"&access_type=offline";
        window.location = url;
    } 
});