let Login = {
    render: async() => {
        let view = `
        <section class="auth-section">
            <form class="auth-form">
                <h2 class="auth-title">Login</h2>
                <input id="email" class="auth-input" placeholder="email">
                <input id="password" class="auth-input" placeholder="password">
                <button id="login" class="auth-button">Login</button>
            </form>
        </section>
        `
        return view
    },

    after_render: async() => {
        document.querySelector('#login').onclick = function(event)
        {
            event.preventDefault();
            let email = document.querySelector('#email').value;
            let password = document.querySelector('#password').value;
            console.log(email);

            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(userCredential){
                window.location.href = '#/';
            })
            .catch(error => alert(error.message));
        }
    }
}

export default Login