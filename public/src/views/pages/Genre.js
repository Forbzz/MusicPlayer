import Utils from './../../services/Utils.js'
import * as DB from './../../services/DB.js'


let Genre = {
    render: async() => {
        
        let view =`
        <section class="playlist-container">
            <div class="playlist-header">
                <div class="playlist-header-img">
                    <button id="play-all" class="playlist-play-button">
                        <img id="artist-img" class="playlist-image" src="src/img/empty_image.png">
                        <img class="playlist-play" src="src/img/play.png">
                    </button>
                </div>
                <div class="playlist-info">
                    <h1 id="artist-name" class="playlist-name">Genre</h1>
                </div>
            </div>
            <div>
                <ul id="artist-songs" class="playlist-songs"> 
                </ul>
            </div>

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

        return view
    },

    after_render: async() => {

        let request = Utils.parseRequestURL()
        const header =  document.getElementById('artist-name');
        const genrePic = document.getElementById('artist-img');
        const lyrics = document.getElementById('song-lyrics');
        const genreSongs = document.getElementById('artist-songs');
        const modal = document.getElementById('myModal');
        const span = document.getElementById("close");
        const playGenre = document.getElementById('play-all')

        let genreName = request.id;
        let genresList = await DB.getItems('genres');
        genresList.forEach(async function(genre){

            if(genre.genre_id.toString() === request.id){
                header.innerHTML = genre.name;
                genreName = genre.name;
                let picUrl = await DB.getGenrePic(genre.genre_id);
                genrePic.src = picUrl;
            }
        });

        let songsList = await DB.getItems('songs'); 
        songsList.forEach(async function(song, index){
            if(song.genre.toLowerCase().includes(genreName.toLowerCase())){
                let picUrl = await DB.getSongPic(song.picture);
                let songLi = document.createElement('li');
                songLi.className = 'playlist-songs-item';
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
                genreSongs.appendChild(songLi);
            }
        });

        genreSongs.addEventListener("click", async function(e)
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

        playGenre.addEventListener('click', async function(e){
            if(firebase.auth().currentUser){
                let list = await DB.getGenreList(genreName);
                console.log("list", list);
                DB.pushPlaylist(firebase.auth().currentUser.email, list);
            }else{
                alert('Login first');
            }
        });
    }

    
}


export default Genre;