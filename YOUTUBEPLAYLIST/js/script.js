$(document).ready(function(){
  
    var API_KEY= "AIzaSyC5ln_nE3PNS2MvmgAu4cB0YGDd49Rke8w"

    $("#search-form").submit(function (event){
        event.preventDefault()
        alert("submitted form")
        var search = $("#search-text").val()
        var video = ''

        videoSearch(API_KEY,search,10)
    })
    function videoSearch(key,search,maxResults){

        $("video").empty();
        $.get("https://www.googleapis.com/youtube/v3/search?key="+key+
        "&type=video&part=snippet&maxResults="+maxResults+"&q="+search,function(data){
            console.log(data)

            data.items.forEach(item =>{
                video = 
                `
                <div style= "text-align:center">
                <h5>${item.snippet.title}</h1>
                <h10>${item.snippet.description}</h3>
                <iframe width="650" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                

                </div>
                `
                
                $("#video").append(video)
            
                
            });
        })  
    }
})