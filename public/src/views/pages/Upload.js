import * as DB from '../../services/DB.js'

let Upload = {
    render: async() => {

        let view =`
        <section class="upload-section">
            <h1>Upload song</h1>
            <label class="upload-label">Name</label>
            <input id="name" class="upload-input">
            <label class="upload-label">Author</label>
            <input id="author" class="upload-input">
            <label class="upload-label">Lyrics</label>
            <textarea id="lyrics" class="upload-input upload-lyrics"></textarea>
            <div class="upload-file">
                <label class="select-button">
                    Select cover
                    <input id="upload-img" type="file" value="upload" accept=".png">
                </label>
                <p id="file-img-name" class="file-name"></p>
            </div>
            <div class="upload-file">
                <label class="select-button">
                    Select song
                    <input id="upload-song" type="file" value="upload" accept=".mp3">
                </label>
                <p id="file-name" class="file-name"></p>
            </div>
            <label class="upload-label">Select genre</label>
            <ul id="1" class="genre-selection-list">
                <li class="genre-selection-item">
                    <input id="genre-selection1" value="Rap/Hip-hop" name="genre" class="genre-selection" type="radio">
                    <label class="genre-selection-label" for="genre-selection1">Rap/Hip-hop</label>
                </li>
                <li class="genre-selection-item">
                    <input id="genre-selection2" value="Rock" name="genre" class="genre-selection" type="radio">
                    <label class="genre-selection-label" for="genre-selection2">Rock</label>
                </li>
                <li class="genre-selection-item">
                    <input id="genre-selection3" value="Pop" name="genre" class="genre-selection" type="radio">
                    <label class="genre-selection-label" for="genre-selection3">Pop</label>
                </li>
                <li class="genre-selection-item">
                    <input id="genre-selection4" value="Metal" name="genre" class="genre-selection" type="radio">
                    <label class="genre-selection-label" for="genre-selection4">Metal</label>
                </li>
                <li class="genre-selection-item">
                    <input id="genre-selection5" value="Alternative" name="genre" class="genre-selection" type="radio">
                    <label class="genre-selection-label" for="genre-selection5">Alternative</label>
                </li>
            </ul>
            <button id="upload-button" class="upload-button">Upload</button>
        </section>
        `

        return view
    },

    after_render: async() => {
        
        const fileButton = document.getElementById('upload-song');
        const pictureButton = document.getElementById('upload-img');
        const uploadButton = document.getElementById('upload-button');
        const fileName = document.getElementById('file-name');
        const pictureName = document.getElementById('file-img-name');
        const nameInput = document.getElementById('name');
        const authorInput = document.getElementById('author');
        const lyricsInput = document.getElementById('lyrics');
        const songs = await DB.getItems('songs');

        let pic_id = 0;
        let song_id;
        let file = null;
        let picture = "null";
        let song_lyric = "Empty";

        fileButton.addEventListener('change', (event) => {
            file = event.target.files[0];
            fileName.innerHTML = file.name;

        });

        pictureButton.addEventListener('change', (event) => {
            picture = event.target.files[0];
            pictureName.innerHTML = picture.name;
            pic_id = songs.length;

        });

        if(songs == null)
        {
            song_id = 0;
        }
        else
        {
            song_id = songs.length;
        }

        uploadButton.addEventListener('click', async function(event) {
            if (!nameInput.value || !authorInput.value)
            {
                alert("Input name and author of song");
            }
            else if(file)
            {
                let storageRef = firebase.storage().ref('song_mp3/id'+song_id+'.mp3');
                storageRef.put(file);

                if(picture && picture != "null")
                {
                    let storageRef = firebase.storage().ref('song_pic/id'+pic_id+'.png');
                    storageRef.put(picture);
                }

                const genres = document.querySelectorAll('.genre-selection');
                let selectedValue = 'none';
                for (const genre of genres) {
                    if (genre.checked) {
                        selectedValue = genre.value;
                        break;
                    }
                }
                if(lyricsInput.value)
                {
                    song_lyric = lyricsInput.value;
                }

                firebase.database().ref('songs/' + song_id).set({
                    name: nameInput.value,
                    author: authorInput.value,
                    lyrics: song_lyric,
                    id_mp3: song_id,
                    picture: pic_id,
                    genre: selectedValue
                }, function(error) {
                    if (error) {
                        alert(error.message);
                    }
                });
                document.location.href = "#/";

            }
            else
            {
                alert("Select song!");
            }
        })
    }
}

export default Upload;