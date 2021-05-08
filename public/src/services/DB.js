export async function getSongs(){
    const snapshot = await firebase.database().ref('/songs');
    return snapshot;
}

export async function getPicId(){
    const snapshot = await firebase.database().ref('/song_pic_id/id').once('value');
    return snapshot.val();
}


export async function getSongPic(id){
    const snapshot = firebase.storage().ref();
    const img = snapshot.child("song_pic/id"+id+".png");
    const url = await img.getDownloadURL();
    return url;
}

export async function getArtistPic(id){
    const snapshot = firebase.storage().ref();
    const img = snapshot.child("artist_pic/id"+id+".png");
    const url = await img.getDownloadURL();
    return url;
}

export async function getGenrePic(id){
    const snapshot = firebase.storage().ref();
    const img = snapshot.child("genre_pic/id"+id+".png");
    const url = await img.getDownloadURL();
    return url;
}

export async function getAlbumPic(id){
    const snapshot = firebase.storage().ref();
    const img = snapshot.child("album_pic/id"+id+".png");
    const url = await img.getDownloadURL();
    return url;
}

export async function getPlaylistPic(id){
    const snapshot = firebase.storage().ref();
    const img = snapshot.child("playlist_pic/id"+id+".png");
    const url = await img.getDownloadURL();
    return url;
}

export async function getItems(value){
    const snapshot = await firebase.database().ref('/' + value).once('value');
    return snapshot.val();
}

export async function getSongMP3(id){
    let ref = firebase.storage().ref();
    let imgRef = ref.child('song_mp3/id' + id + '.mp3');
    let songURL = await imgRef.getDownloadURL();
    return songURL;
}

export async function pushPlaylist(user, list){
    let snapshot = await firebase.database().ref('/user').once('value');
    let users = snapshot.val();
    let userId = 0;
    console.log("LIST:", list);

    users.forEach(async function(item, index){
        if(item.email == user){
            userId = index;
        }
        
    })

    firebase.database().ref('user/' + userId + '/songs/').remove();

    let i = 0;
    for(let id of list){
        firebase.database().ref('/user/' + userId + '/songs/' + i + '/id').set(id);
        i++;
    }
}

export async function getPlaylistList(id){
    let songsList = [];

    let snapshot = await firebase.database().ref('/playlists/' + id + '/songs').once('value');
    
    let songList = snapshot.val();

    songList.forEach(async function(song){
       songsList.push(song);
    })

    console.log("songsList:", songsList);
    return songsList;
}

export async function getAlbumList(id){
    let songsList = [];

    let snapshot = await firebase.database().ref('/albums/' + id + '/songs').once('value');
    
    let songList = snapshot.val();
    console.log("AlbumSongsList", songList);
    songList.forEach(async function(song){
        songsList.push(song.id);
     })
    return songsList;
}

export async function getArtistList(name){
    let songsList = [];
    let snapshot = await firebase.database().ref('/songs/').once('value');
    let songs = snapshot.val();
    songs.forEach(async function(song, index)
    {
        if(song.author.toLowerCase() == name.toLowerCase())
        {
            songsList.push(index);
        }
    })
    console.log("ArtistSongsList", songsList);
    return songsList;
}

export async function getGenreList(name){
    let songsList = [];
    let snapshot = await firebase.database().ref('/songs/').once('value');

    let songs = snapshot.val();
    console.log(songs);
    songs.forEach(async function(song, index)
    {

        if(song.genre.toLowerCase() == name.toLowerCase())
        {
            songsList.push(index);
        }
    })
    console.log("GenreSongsList", songsList);
    return songsList;
}