import Utils from './../../services/Utils.js'
import * as DB from './../../services/DB.js'

let CreatePlaylist = {
    render: async() => {
        let view =`
            <section class="playlist-container">
                <h1 class="edit-header">Creating playlist</h1>
                <div>
                    <div class="playlist-edit-header">
                        <div class="playlist-header-img">
                            <div>
                                <img id="img-playlist-on-page" class="playlist-image" src="src/img/empty_image.png">
                            </div>
                        </div>
                        <div class="playlist-info">
                            <div class="playlist-info">
                                <input id="playlist-name-input-id" class="playlist-edit-name" value="Name"></input>
                                <input id="playlist-desc-input-id" class="playlist-edit-desc" value="Description"></input>
                            </div>
                        </div>
                    </div>
                    <div class="buttons">
                        <div class="playlist-button-div">
                            <label class="playlist-button">
                                Select picture
                                <input id="upload-file-button" type="file">
                            </label>
                        </div>
                        <div class="playlist-button-div">
                            <button id="playlist-save-button" class="playlist-button">Save</button>
                        </div>
                        <div class="playlist-button-div">
                            <button id="playlist-delete-button" class="playlist-button">Delete</button>
                        </div>
                    </div>
                </div>
                <div>
                    <ul id="playlist-songs-list" class="playlist-songs"></ul>
                </div>
            </section>
            <section class="search-results-section">
                <h2 id="section-search-h2" class="sections-text">Song search</h2>
                <input id="playlist-search-input" class="playlist-search" placeholder="Search">
                <ul id="search-results-ol" class="playlist-songs"></ul> 
            </section>
        `

        return view
    },

    after_render: async() => {

        const header =  document.getElementById('playlist-name-input-id');
        const desc = document.getElementById('playlist-desc-input-id');
        const pic = document.getElementById('img-playlist-on-page');
        const searchSongs = document.getElementById('search-results-ol');
        const searchInput = document.getElementById('playlist-search-input');
        const saveButton = document.getElementById('playlist-save-button');
        const deleteButton = document.getElementById('playlist-delete-button');
        const uploadPic = document.getElementById('upload-file-button');
        const songsContainer = document.getElementById('playlist-songs-list');
        let playlistPic;
        let playlistTest = await DB.getItems('playlists');
        let id = playlistTest.length;

        firebase.database().ref('/playlists/' + id).set({
            id : id,
            name : "Name",
            description : "Description",
            playlist_pic : "null",
            songs : [],
        })

        let songSnapshot1 = await firebase.database().ref('/playlists/' + id + '/songs/').once('value');
        let songsArray = songSnapshot1.val() || [];


        async function updatePlaylistSongs()
        {
            songsContainer.innerHTML = "";
            
            if(songsArray)
                {
                    songsArray.forEach(async function(item)
                    {
                        let songId = item;
                        let songSnapshot = await firebase.database().ref('/songs/' + songId).once('value');
                        let song = songSnapshot.val();

                        let picUrl2 = await DB.getSongPic(song.picture);

                        let playlistLi = document.createElement('li');
                        playlistLi.className = 'playlist-songs-item';
                        playlistLi.innerHTML = 
                        `
                        <div class="playlist-song">
                            <div class="playlist-song-image">
                                <button class="song-play-button">
                                    <img class="song-image" src=${picUrl2}>
                                    <img id=${songId} class="song-play-image" src="src/img/Play.png">
                                </button>
                            </div>
                            <p class="song-name">${song.name}</p>
                            <a href="#/artist/${song.author}" class="song-author">${song.author}</a>
                        </div>
                        <div class="playlist-song-duration">
                            <p class="duration">2:33</p>
                            <button id=${songId} class="song-text-button">
                                <img id="text-${songId}" class="song-delete" src="src/img/delete.png">
                            </button>
                        </div>
                        `;
                        songsContainer.appendChild(playlistLi);
                    })
                }
        }
        
        songsContainer.addEventListener("click", async function(e) {
            console.log(e.target.nodeName);

            if(e.target.id.includes("text"))
            {
                console.log(e.target.id.split('-')[1]);
                songsArray.splice(songsArray.indexOf(e.target.id.split('-')[1]),1);
                console.log(songsArray);
                await updatePlaylistSongs()
            }
            if(e.target.className == "song-play-image")
            {
                console.log("Кнопка воспроизведения");
            }
        });

        searchSongs.addEventListener('click', async function(event)
        {
            if(event.target && event.target.nodeName == "LI") {
                console.log(event.target.id + " was clicked");
                songsArray.push(event.target.id);
                console.log(songsArray);
                await updatePlaylistSongs();
            }
        })

        await updatePlaylistSongs();

        searchInput.addEventListener('keyup', async function(event)
        {
            let query = searchInput.value.toLowerCase();
            let songList = await DB.getItems('songs');
            searchSongs.innerHTML = "";
            songList.forEach(async function(song, index)
            {
                if(song.name.toLowerCase().includes(query) || song.author.toLowerCase().includes(query))
                {
                    let picUrl = await DB.getSongPic(song.picture);
                    let songLi = document.createElement('li');
                    songLi.className = 'playlist-songs-item';
                    songLi.id = index;
                    songLi.innerHTML = 
                    `
                    <div class="playlist-song">
                        <div class="playlist-song-image">
                            <button class="song-play-button">
                                <img class="song-image" src=${picUrl}>
                                <img id=${index} class="song-play-image" src="src/img/Play.png">
                            </button>
                        </div>
                        <p class="song-name">${song.name}</p>
                        <a href="#/artist/${song.author}" class="song-author">${song.author}</a>
                    </div>

                    `;
                    searchSongs.appendChild(songLi);
                };
                
            });
        });


        saveButton.addEventListener('click', async function(e)
        {
            songsContainer.innerHTML = "";
            console.log(playlistPic);
            if(playlistPic)
            {
                playlistPic = id;
            }
            else
            {
                playlistPic = "null";
            }
            firebase.database().ref('playlists/' + id).set({
                id : id,
                name : header.value,
                description : desc.value,
                songs : songsArray,
                playlist_pic : playlistPic,
                author : firebase.auth().currentUser.email
            },function(e)
            {
            if(e)
            {
                console.log(e.code);
            }
            else{
                document.location.href ="#/";
                alert("Playlist has been created!");
            }
            })
        });

        deleteButton.addEventListener("click", async function(e)
        {
            firebase.database().ref('playlists/' + id).remove();
            document.location.href ="#/";
            
        });

        uploadPic.addEventListener('change', async function(e)
        {
            let file = e.target.files[0];
            let storageRef = firebase.storage().ref('playlist_pic/id' + id + '.png');
            playlistPic = id;
            await storageRef.put(file);

            let picUrl = await DB.getPlaylistPic(id);
            pic.src = picUrl;
        });
        
    }
  
}

export default CreatePlaylist;