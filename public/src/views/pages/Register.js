import * as DB from './../../services/DB.js'

let Register = {
    render: async() => {
        let view =`
        <section class="auth-section">
            <form class="auth-form">
                <h2 class="auth-title">Registration</h2>
                <input id="email" class="auth-input" placeholder="email">
                <input id="password" class="auth-input" placeholder="password">
                <input id="rpassword" class="auth-input" placeholder="repeat password">
                <button id="register" class="auth-button">Register</button>
            </form>
        </section>
        `

        return view
    },

    after_render: async() => {
        document.querySelector('#register').onclick = function(event){
            event.preventDefault();
            let email = document.getElementById("email");
            let password = document.getElementById("password");
            let rpassword = document.getElementById("rpassword");

            if (email.value == '' | password.value == '' | rpassword.value == '') {
                alert ('The fields cannot be empty');
            }
            else if (password.value != rpassword.value) {
                alert('The passwords dont match');
            } 
            else{
                firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
                .then(async function(userCredential){
                console.log("reg")
                let user = userCredential.user;

                let count = await DB.getItems('user');
                let id = count.length;
                console.log("Кол-во пользователей:", count.length);
                await firebase.database().ref('user/' + id).set({
                    id : user.uid,
                    email : user.email
                })
                
                window.location.href="#/";
                })
                .catch(error => alert(error.message));
            }
        }
    }

}

export default Register;