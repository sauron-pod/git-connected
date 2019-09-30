"use strict";

$("#login-button").click(function () {
    //This grabs the information from the input fields
    let usernameInput = $("#username").val();
    $("#username").val("");
    let passwordInput = $("#password").val();
    $("#password").val("");

    //This fetches from our database and checks if the username matches the password
    fetch("../../db.json").then(data => {
        return data.json();
    }).then(data => {
        let users = data.users;

        users.forEach(user => {
            if(user.username === usernameInput && user.password === passwordInput){
                //if password is correct, this saves the username so it can be accessed on the profile page.
                sessionStorage.setItem("username", user.username);
                //This is brand new code for me. It takes you to the profile page.
                document.location.href = "../profile/profile.html";
            }
        })

        })
    });
