import Utils from './../../services/Utils.js'
import * as DB from './../../services/DB.js'

let Search = {
    render : async() => {

        return `
        <section class="search-results-section">
            <h1 id="section-search-h1" class="sections-text">Song search</h1>
            <ul id="search-results" class="playlist-songs"></ul> 
            <div id="myModal" class="modal">
                <div class="modal-header">
                    <span id="close" class="close">&times;</span>
                </div>
                <div class="modal-content">
                    <div class="modal-body">
                        <pre id="song-lyrics"></pre>
                    </div>
                </div>
            </div>
        </section>
        `
    },

    after_render: async() => {
        let request = Utils.parseRequestURL();
        
        const result = document.getElementById('section-search-h1');
        const lyrics = document.getElementById('song-lyrics');
        const searchContainer = document.getElementById("search-results");
        const modal = document.getElementById('myModal');
        const span = document.getElementById("close");

        result.innerHTML = "Results for " + request.id;
    
        const songList = await DB.getItems('songs');
        songList.forEach(async function(song, index)
            {
                if(song.name.toLowerCase().includes(request.id) || song.author.toLowerCase().includes(request.id))
                {
                    let picUrl = await DB.getSongPic(song.picture);
                    let songLi = document.createElement("li");
                    songLi.className = "playlist-songs-item"
                    songLi.innerHTML = 
                    `
                            <div class="playlist-song">
                                <div class="playlist-song-image">
                                    <button class="song-play-button">
                                        <img class="song-image" src=${picUrl}>
                                        <img id=${index} class="song-play-image" src="src/img/play.png">
                                    </button>
                                </div>
                                <p class="song-name">${song.name}</p>
                                <a href="#/artist/${song.author}" class="song-author">${song.author}</a>
                            </div>
                            <div class="playlist-song-duration">
                                <button id=${index} class="song-text-button">
                                    <img id="text-${index}" class="song-text" src="src/img/text.png">
                                </button>
                            </div>
                    `;
                    searchContainer.appendChild(songLi);
                }
            });


        searchContainer.addEventListener("click", async function(e)
        {
            if(e.target.id.includes("text"))
            {
                console.log("Кнопка текста");
                let id = e.target.id.split("-")[1];
                let song = await DB.getItems('songs/'+ id);
                lyrics.innerHTML = song.lyrics;           
                modal.style.display = "block";
            }
            if(e.target.className == "song-play-image")
            {
                console.log("Кнопка воспроизведения");
                if(firebase.auth().currentUser){
                    console.log("воспроизведение");
                    DB.pushPlaylist(firebase.auth().currentUser.email, [e.target.id]);
                }else{
                    alert("login first");
                }
            }
        })

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    }
    
}

export default Search;