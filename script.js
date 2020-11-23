$(document).ready(function(){
  
    var API_KEY= "AIzaSyC5ln_nE3PNS2MvmgAu4cB0YGDd49Rke8w"

    $("#search-form").submit(function (event){
        event.preventDefault()
        alert("submitted form")
        var search = $("#search").val()
        videoSearch(API_KEY,search,10)
    })
    function videoSearch(key,search,maxResults){
        $.get("https://www.googleapis.com/youtube/v3/search?key="+key+
        +"&type=video&part=snippet&maxResults=10&q="+search,function(data){
            console.log(data)
        })
        
    }
})