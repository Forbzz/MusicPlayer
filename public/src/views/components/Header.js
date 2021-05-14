let Header = {
    render: async() => {
        let view =`
                <div class="header-left-part">
                    <a class="header-cite-name" href="#/">Vitafy</a>
                    <input id="header-search" class="header-search" placeholder="Search">
                </div>
                <div class="header-right-part">
                    <p id="user" class="header-button">check</p>
                    <button id="logout" class="header-button" style="border: 0;cursor: pointer;">Logout</button>

                    <a id="login_btn" class="header-button" href="#/login">Login</a>
                    <a id="register_btn" class="header-button" href="#/registration">Register</a>
                </div>
                `
        return view
    },
    after_render: async() => { 
        const login = document.getElementById("login_btn");
        const register = document.getElementById("register_btn");
        const user = document.getElementById("user");
        const logout = document.getElementById("logout");
        const searchInput = document.getElementById("header-search");
            
        logout.addEventListener('click', c => {
            firebase.auth().signOut();
            console.log("Logout");
        })

        firebase.auth().onAuthStateChanged(User => {
            if(User)
            {
                login.hidden = true;
                register.hidden = true;
                user.hidden = false;
                user.innerHTML = User.email;
                logout.hidden = false;
            }
            else
            {
                login.hidden = false;
                register.hidden = false;
                user.hidden = true;
                user.innerHTML = "";
                logout.hidden = true;
            }
        });

        searchInput.addEventListener("keyup", function(event)
        {
            if(event.which == 13)
            {
                event.preventDefault();
                document.location.href = "#/search/"+searchInput.value;
            }
            
        })

    }
}

export default Header;