import Utils from './../../services/Utils.js'
import * as DB from './../../services/DB.js'


let Artist = {
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
                <h1 id="artist-name" class="playlist-name">Artist</h1>
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

        const query = decodeURIComponent(request.id)
        const artistName =  document.getElementById('artist-name');
        const pic = document.getElementById('artist-img');
        const lyrics = document.getElementById('song-lyrics');
        const artistSongs = document.getElementById('artist-songs');
        const modal = document.getElementById('myModal');
        const span = document.getElementById("close");
        const playArtist = document.getElementById('play-all')
        

        let artistsList = await DB.getItems('artists');
            artistsList.forEach(async function(artist){
                if(artist.name.toLowerCase() === query.toLowerCase()){
                    artistName.innerHTML = artist.name;
                    let picUrl = await DB.getArtistPic(artist.art_pic_id);
                    pic.src = picUrl;
                }
            });

        let songsList = await DB.getItems('songs');
        songsList.forEach(async function(song, index){
            if(song.author.toLowerCase().includes(query.toLowerCase())){
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
                artistSongs.appendChild(songLi);
            }
        });
       
        artistSongs.addEventListener("click", async function(e)
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

        playArtist.addEventListener('click', async function(e){
            if(firebase.auth().currentUser){
                let list = await DB.getArtistList(query);
                DB.pushPlaylist(firebase.auth().currentUser.email, list);
            }else{
                alert('Login first');
            }
        });
    }

    
}


export default Artist;