$(document).ready(function(){
    var databaseurl = "http://178.128.180.197:5000/song/add"
    var video = ''
    var tempURL= "https://google.com"
    var tempArtist = "asd"
    var tempId= "asd"
    var tempName = "tests"

    $("#search-form").submit(function (event){

        event.preventDefault()
        var search = $("#search-text").val()

        videoSearch(search)
    })

 //   $("#button").on('click',function(){

    //})

    function videoSearch(search){

        $.ajax({
            url:  "https://itunes.apple.com/search?term="+search,
            dataType: "jsonp",
            success: function( response ) {
                console.log( response );
                //clear results
            results.innerHTML = '';
            // loop through every music in the element by checking the song
            if(results.count ===0){
                showAlert('Nothing Found!','danger');
                return;
        
            }    
            var integer=0;
            const outputs = document.querySelector("#results");
            outputs.innerHTML = '';
            response.results.forEach(results => {    
                    //clear results
                    // loop through every music in the element by checking the song

                        var temp = {
                            name:results.trackName,
                            artist:results.artistName,
                            url:results.previewUrl
                        }
   
                        const div = document.createElement("div");
                        div.classList.add("card");
                        div.innerHTML = 
                        `           
                        <img class="card-img-top" src=${results.artworkUrl100} alt="Album Artwork">
                        <div class="card-body" >
                          <h5 class="card-title">${results.trackName}</h5>
                          <p class="card-text">${results.artistName}</p>
                        </div>
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item">${results.collectionName}</li>
                          <li class="list-group-item">${results.primaryGenreName} . ${results.releaseDate.split('-',1)}</li>
                
                          <li class="list-group-item">sample: <br>
                                <audio src =${results.previewUrl} controls='controls'>
                                </audio></li>
                        </ul>
                        <div class="card-body">
                          <a href=${results.trackViewUrl} class="card-link">Show in itunes</a>
                          <button id =${integer} type="button" class="btn btn-primary btn-sm">Add</button>                
                          </script>
                        </div>`;

                        $(document).on('click',integer,function(){
                            console.log(integer);
                            $.ajax({
                                type: "POST",
                                contentType:"application/json",
                                url: "http://178.128.180.197:5000/song/add",
                                data: JSON.stringify(temp),
                                dataType: "JSON",
                                success: function(data) {
                                    alert(integer);
                                },
                                error: function(data){
                                    alert("fail");
                                }
                            });
                        })
                        integer = integer + 1; 
                        outputs.appendChild(div);
                });
            }
        });
    }
})

