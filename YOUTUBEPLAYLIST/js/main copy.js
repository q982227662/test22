const fetchJsonp = require("fetch-jsonp");

//import validtion and showAlert
import { showAlert, isEmpty } from "./validation";
// Get searchform element 
const searchForm = document.querySelector("#search-form"); 
//Submit search form
searchForm.addEventListener("submit", fetchMusic)

//Fetch music data from Apple music APi
function fetchMusic(e){
    e.preventDefault();
    const searchText = document.querySelector("#search-text").value;

    if(isEmpty(searchText)){
        showAlert("Please search something.","warning");
        return;
    }
    const fetchUrl = `https://itunes.apple.com/search?term=${searchText}`;
    
    fetchJsonp(fetchUrl)
    .then(res  => res.json())
    .then(data => showMusic(data.results))
    .catch(err => console.log(err));
}


//show each music in a format of card
function showMusic(musics){
    console.log(musics);
    const results = document.querySelector("#results");
    if(musics.length ===0){
        showAlert('Nothing Found!','danger');
        return;

    }
    
    //clear results
    results.innerHTML = '';
    // loop through every music in the element by checking the song
    for(let i=0; i<musics.length; i++){
        const music = musics[i];
        if(music.kind !== "song"){
            continue;
        }

        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = 
        `<img class="card-img-top" src=${music.artworkUrl100} alt="Album Artwork">
        <div class="card-body">
          <h5 class="card-title">${music.trackName}</h5>
          <p class="card-text">${music.artistName}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${music.collectionName}</li>
          <li class="list-group-item">${music.primaryGenreName} . ${music.releaseDate.split('-',1)}</li>

          <li class="list-group-item">sample: <br>
                <audio src =${music.previewUrl} controls='controls'>
                </audio></li>
        </ul>
        <div class="card-body">
          <a href=${music.trackViewUrl} class="card-link">Show in itunes</a>

        </div>`;
        results.appendChild(div);
    }
}