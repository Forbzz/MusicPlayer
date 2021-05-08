import * as DB from '../../services/DB.js'

let Player = {
    render: async() => {
        let view = `
        <section id="player-section">
                <div class="player-slider">
                    <input id="range" type="range" min="0" max="500" value="0" >
                </div>
                <div class="player">
                    <div class="player-song-info">
                        <img id="song-image" class="player-song-img" src="src/img/empty_image.png">
                        <p id="player-name" class="player-song-name">Name</p>
                        <p id="player-author" class="player-song-author">Author</p>
                    </div>
                    <div class="player-buttons">
                        <button id="player-next" class="player-img-button">
                            <img id="player-next-img" class="player-img" src="src/img/next.png">
                        </button>
                        <button id="player-play" class="player-img-button">
                            <img id="player-play-img" class="player-img" src="src/img/Play.png">
                        </button>
                        <button id="player-prev" class="player-img-button">
                            <img id="player-prev-img" class="player-img" src="src/img/prev.png">
                        </button>
                    </div>
                    <div class="player-duration">
                        <p id="current-time" class="player-duration-time">0:00</p>
                    </div>
                </div>

                <audio id="player">
                </audio>
        </section>
        `
        return view
    },
    after_render: async() => {


        const playButton = document.getElementById('player-play');
        const prevButton = document.getElementById('player-prev');
        const nextButton = document.getElementById('player-next');

        const player = document.getElementById('player');
        const currTime = document.getElementById('current-time');

        const pic = document.getElementById('song-image');
        const playPic = document.getElementById('player-play-img');
        const songName = document.getElementById('player-name');
        const songAuthor = document.getElementById('player-author');
        const section = document.getElementById('player-section');

        let goPlay = false;
        let isPlay = false;
        let currentSong = 0;
        let currentUser;
        let songsQueue = [];
        

        async function playerSongs(){
            let snapshot = await firebase.database().ref('/user');

            snapshot.on('value', async function(snapshot){
                let userList = snapshot.val();
                for(const [index, user] of userList.entries()){

                    if(user.email == currentUser){
                        const queueSongSnapshot = await firebase.database().ref('/user/' + index + '/songs').once('value');
                        let songs = queueSongSnapshot.val();
                        songsQueue = [];
                        if(songs == null)
                        {   
                            section.style.display = "none"
                            //goPlay = true;
                            break;
                        }

                        section.style.display = "block"

                        songs.forEach(async function(song){
                            songsQueue.push(song.id);
                        })

                        currentSong = 0;
                        await getCurrentSong();
                    }
                }

                if (goPlay){
                    play();
                }
                goPlay = true;
            });
        }

        async function getCurrentSong(){
            player.src = await DB.getSongMP3(songsQueue[currentSong]);
            let songId = songsQueue[currentSong];
            let songSnapshot = await firebase.database().ref('/songs/' + songId).once('value');
            let song = songSnapshot.val();
            pic.src = await DB.getSongPic(song.picture);
            songName.innerHTML = song.name;
            songAuthor.innerHTML = song.author;
        }


        function play(){
            playPic.src = "src/img/pause.png"
            isPlay = true;
            player.play();
        }

        function pause(){
            playPic.src = "src/img/play.png";
            isPlay = false;
            player.pause();
        }

        async function next(){
            currentSong = currentSong + 1;
            if(currentSong == songsQueue.length){
                currentSong = 0;
            }
            await getCurrentSong();
            play()
        }

        async function prev(){
            currentSong = currentSong - 1;
            if (currentSong == -1){
                currentSong = songsQueue.length - 1;
            }
            await getCurrentSong();
            play();
        }

        playButton.addEventListener('click', async function(e){
            if(isPlay){
                pause();
            }
            else{
                play();
            }
        });

        nextButton.addEventListener("click", async function(e){
            await next();
        });

        prevButton.addEventListener("click", async function(e){
            await prev();
        });

        player.addEventListener("ended", async function() {
            next();
        });
        
        player.addEventListener('timeupdate', async function(){
            if(player.currentTime % 60 < 10){
                currTime.innerHTML = Math.floor(player.currentTime / 60) + ":0" + Math.floor(player.currentTime % 60);
            }
            else{
                currTime.innerHTML = Math.floor(player.currentTime / 60) + ":" + Math.floor(player.currentTime % 60);
            }
            range.value = (player.currentTime / player.duration) * 500 | 0;
        });

        range.addEventListener('input', function () {
            player.currentTime = range.value / 500 * player.duration;
            console.log("touch")
        });

        firebase.auth().onAuthStateChanged(async firebaseUser => {
            if (firebaseUser){
                goPlay = false;
                currentUser = firebase.auth().currentUser.email;
                await playerSongs();   
                section.style.display = "block"
            }else{
                pause();
                section.style.display = "none"
            }
        });


    }
}

export default Player;