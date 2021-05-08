import Utils from './../../services/Utils.js'
import * as DB from './../../services/DB.js'

let Home = {
    render: async() => {
        let view =`
        <nav class="navigation-container">
        <div class="navigation">
            <a class="navigation-link" href="#playlists-title">Playlists</a>
            <a class="navigation-link" href="#genres-title">Genres</a>
            <a class="navigation-link" href="#artists-title">Artists</a>
            <a class="navigation-link" href="#albums-title">Albums</a>
            <a id="upload-ref" class="navigation-link" href="#/upload">Upload</a>
        </div>
    </nav>
        <section id="playlist-section" class="section-container">
            <h1 id="playlists-title">Create your playlists</h1>
            <ul id="playlist-list" class="playlist-items">
                <li class="playlist-item">
                    <div>
                        <a href="#/createPlaylist">
                            <img src="src/img/add-playlist.png" class="playlist-img" alt="playlist img">
                        </a>
                        <a href="#/createPlaylist" class="playlist-name-link">Create playlist</a>
                    </div>
                </li>

            </ul>
        </section>
        <section class="section-container">
            <h2 id="genres-title">Genres</h2>
            <ul id="genres-list" class="playlist-items">
                
            </ul>
        </section>
        <section class="section-container">
            <h2 id="artists-title" >Artists</h2>
            <h3 class="description-text">Most popular artists</h3>
            <ul id="artists-list" class="artists-items">
            
            </ul>
        </section>
        <section class="section-container">
            <h2 id="albums-title" >Albums</h2>
            <ul id="albums-list" class="playlist-items">

            </ul>
        </section>

        `
        return view
    },

    after_render: async() => {
        const genres = document.getElementById('genres-list');
        const artists = document.getElementById('artists-list');
        const albums = document.getElementById('albums-list');
        const playlists = document.getElementById('playlist-list');
        const uploadRef = document.getElementById('upload-ref');
        const playlistSection = document.getElementById('playlist-section');

        let genresList = await DB.getItems('genres');
        let artistsList = await DB.getItems('artists');
        let albumsList = await DB.getItems('albums');
        let playlistList = await DB.getItems('playlists');
        
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
                uploadRef.hidden = false;
                playlistSection.style.display = 'flex';
            }else{
                uploadRef.hidden = true;
                playlistSection.style.display = 'none';
            }
        })
        

        if(playlistList)
        {
            playlistList.forEach(async function(playlist){

                if(playlist.author == firebase.auth().currentUser.email)
                {
                    let picUrl = await DB.getPlaylistPic(playlist.playlist_pic);
                    let playlistLi = document.createElement('li');
                    playlistLi.className = 'playlist-item';
                    playlistLi.innerHTML =
                    `
                    <div>
                        <a href="#/playlist/${playlist.id}">
                            <img src=${picUrl} class="playlist-img" alt="playlist img">
                        </a>
                        <a href="#/playlist/${playlist.id}" class="playlist-name-link">${playlist.name}</a>
                    </div>
                    `;
                    playlists.appendChild(playlistLi);
                }

            }
        )}

        if(genresList)
        {
            genresList.forEach(async function(genre){
                let picUrl = await DB.getGenrePic(genre.genre_id);
                let genreLi = document.createElement('li');
                genreLi.className = 'playlist-item';
                genreLi.innerHTML = 
                `
                    <div>
                        <a href="#/genre/${genre.genre_id}">
                            <img src=${picUrl} class="playlist-img" alt="playlist img">
                        </a>
                        <a href="#/genre/${genre.genre_id}" class="playlist-name-link">${genre.name}</a>
                    </div>
                `
                genres.appendChild(genreLi);
            });
        }

        if(artistsList)
        {
            artistsList.forEach(async function(artist, index){
                let picUrl = await DB.getArtistPic(artist.art_pic_id);
                let artistLi = document.createElement('li');
                artistLi.className = 'artist-item';
                artistLi.innerHTML = 
                `
                <div>
                    <a href="#/artist/${artist.name}">
                        <img src=${picUrl} class="artist-img" alt="artist-img">
                    </a>
                </div>
                <a href="#/artist/${artist.name}" class="artist-name-link">${artist.name}</a>
                `;
                artists.appendChild(artistLi);
            });
        }

        if(albumsList)
        {
            albumsList.forEach(async function(album, index){
                let picUrl = await DB.getAlbumPic(album.album_pic_id);
                let albumLi = document.createElement('li');
                albumLi.className = 'playlist-item';
                albumLi.innerHTML = 
                `
                <div>
                    <a href="#/album/${index}">
                        <img src="${picUrl}" class="playlist-img" alt="playlist img">
                    </a>
                    <a href="#/album/${index}" class="playlist-name-link">${album.name}</a>
                </div>
                `;
                albums.appendChild(albumLi);
            });
        }
    }
}

export default Home;