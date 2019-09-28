"use strict";

let users = {};

// Toggle verbose console messages for development
let verbose = true;

$("#login-button").click(function () {
    //This grabs the information from the input fields
    let usernameInput = $("#username").val();
    $("#username").val("");
    let passwordInput = $("#password").val();
    $("#password").val("");

    //This fetches from our database and checks if the username matches the password
    fetch("http://localhost:3000/users", {
        mode: 'no-cors',
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(data => data.json()).then(data => {
        users = data.users;
        (verbose) ? console.log(users) : "";
        users.forEach(user => {
            if(user.username === usernameInput && user.password === passwordInput){
                //if password is correct, this saves the username so it can be accessed on the profile page.
                sessionStorage.setItem("username", user.username);

                //This is brand new code for me. It takes you to the profile page.
                document.location.href = "profile.html";
            }
        })
    }).catch((error) => (verbose) ? console.log("fetch failed " + error) : "")
});