import Utils from './../../services/Utils.js'
import * as DB from './../../services/DB.js'

let Playlist = {
    render: async() => {

        let view =`
        <section class="playlist-container">
        <div class="playlist-header">
            <div class="playlist-header-img">
                <button id="play-playlist" class="playlist-play-button">
                    <img id="album-img" class="playlist-image" src="src/img/empty_image.png">
                    <img class="playlist-play" src="src/img/play.png">
                </button>
            </div>
            <div class="playlist-info">
                <h1 id="album-name" class="playlist-name">Playlist</h1>
                <p id="album-description" class="playlist-desc">Description</p>
            </div>
            
        </div>
        <div class="buttons">
            <div class="playlist-button-div">
                <a id="playlist-edit-button" style="width: 110px;display: flex;justify-content: center;" class="playlist-button">Edit</a>
            </div>
        </div>
        <div>
            <ul id="album-songs" class="playlist-songs"> 
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

        const playlistName =  document.getElementById('album-name');
        const playlistPic = document.getElementById('album-img');
        const lyrics = document.getElementById('song-lyrics');
        const playlistSongs = document.getElementById('album-songs');
        const modal = document.getElementById('myModal');
        const span = document.getElementById("close");
        const editButton = document.getElementById('playlist-edit-button');
        const desc = document.getElementById('album-description');
        const playPlaylist = document.getElementById('play-playlist');

        let albumsList = await firebase.database().ref('/playlists/' + request.id).once('value');
        let album = albumsList.val();
        let playlistId = request.id;

        playlistName.innerHTML = album.name;
        desc.innerHTML = album.description;
        let picUrl = await DB.getPlaylistPic(album.playlist_pic);
        playlistPic.src = picUrl;
        editButton.href = "#/playlistedit/" + album.id;

        let arraySongs = album.songs;
        arraySongs.forEach(async function(item, index){
            
            let pesnya = await firebase.database().ref('/songs/' + item).once('value');
            let song = pesnya.val();
            let picUrl = await DB.getSongPic(song.picture);
            let songLi = document.createElement('li');
            songLi.className = 'playlist-songs-item';
            songLi.innerHTML = 
            `
                <div class="playlist-song">
                    <div class="playlist-song-image">
                        <button class="song-play-button">
                            <img class="song-image" src=${picUrl}>
                            <img id=${song.id_mp3} class="song-play-image" src="src/img/play.png">
                        </button>
                    </div>
                    <p class="song-name">${song.name}</p>
                    <a href="#/artist/${song.author}" class="song-author">${song.author}</a>
                </div>
                <div class="playlist-song-duration">
                    <button id=${song.id_mp3} class="song-text-button">
                        <img id="text-${song.id_mp3}" class="song-text" src="src/img/text.png">
                    </button>
                </div>
            `;
            playlistSongs.appendChild(songLi);
        
        });

        playlistSongs.addEventListener("click", async function(e)
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
                if (firebase.auth().currentUser){
                    DB.pushPlaylist(firebase.auth().currentUser.email, [e.target.id]);
                    
                }else{
                    alert("Login first.")
                }
            }
        })

        playPlaylist.addEventListener('click', async function(e){
            if(firebase.auth().currentUser){
                let list = await DB.getPlaylistList(playlistId);
                DB.pushPlaylist(firebase.auth().currentUser.email, list);
            }else{
                alert("login first");
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


export default Playlist;