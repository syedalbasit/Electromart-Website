const user_signout = document.querySelector("#user-signout");
user_signout.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("/logout", {
        method: "GET",    
    })
    .then(response => response.json())
    .then(data => {
        if (data.status){
            sessionStorage.setItem("logout", "true")
            window.location.href = "/";
        }
    })
});