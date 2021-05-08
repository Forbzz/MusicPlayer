import Utils from './../../services/Utils.js'
import * as DB from './../../services/DB.js'


let Album = {
    render: async() => {

        let view =`
        <section class="playlist-container">
        <div class="playlist-header">
            <div class="playlist-header-img">
                <button id="play-all" class="playlist-play-button">
                    <img id="album-img" class="playlist-image" src="src/img/empty_image.png">
                    <img class="playlist-play" src="src/img/play.png">
                </button>
            </div>
            <div class="playlist-info">
                <h1 id="album-name" class="playlist-name">Album</h1>
                <p id="album-description" class="playlist-desc">Description</p>
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
        
        const albumName =  document.getElementById('album-name');
        const albumPic = document.getElementById('album-img');
        const lyrics = document.getElementById('song-lyrics');
        const albumSongs = document.getElementById('album-songs');
        const modal = document.getElementById('myModal');
        const span = document.getElementById("close");
        const playAlbum = document.getElementById('play-all')
        const albumId = request.id;
        
        let albumsList = await DB.getItems('albums');
        albumsList.forEach(async function(album, index){
            if(index.toString() === request.id.toLowerCase()){
                albumName.innerHTML = album.name;
                let picUrl = await DB.getAlbumPic(album.album_pic_id);
                albumPic.src = picUrl;
            }
        });


        let snapshot = await firebase.database().ref('/albums/' + request.id).once('value');
        let sn = snapshot.val();
        let albumSong = sn.songs;
        albumSong.forEach(async function(item){
            let songRef = await firebase.database().ref('/songs/' + item.id).once('value');
            let song = songRef.val();
            let picUrl = await DB.getSongPic(song.picture);
            let songLi = document.createElement('li');
            songLi.className = 'playlist-songs-item';
            songLi.innerHTML = 
            `
                <div class="playlist-song">
                    <div class="playlist-song-image">
                        <button class="song-play-button">
                            <img class="song-image" src=${picUrl}>
                            <img id=${item.id} class="song-play-image" src="src/img/play.png">
                        </button>
                    </div>
                    <p class="song-name">${song.name}</p>
                    <a href="#/artist/${song.author}" class="song-author">${song.author}</a>
                </div>
                <div class="playlist-song-duration">
                    <button id=${item.id} class="song-text-button">
                        <img id="text-${item.id}" class="song-text" src="src/img/text.png">
                    </button>
                </div>
            `;
            albumSongs.appendChild(songLi);
        
        });

        albumSongs.addEventListener("click", async function(e)
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
                    console.log(e.target.id);
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

        
        playAlbum.addEventListener('click', async function(e){
            if(firebase.auth().currentUser){
                let list = await DB.getAlbumList(albumId);
                DB.pushPlaylist(firebase.auth().currentUser.email, list);
            }else{
                alert('Login first');
            }
        });
    }

    
}


export default Album;