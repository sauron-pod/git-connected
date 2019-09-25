"use strict";

$("#login-button").click(function () {
    let usernameInput = $("#username").val();
    $("#username").val("");
    let passwordInput = $("#password").val();
    $("#password").val("");

    fetch("../../db.json").then(data => {
        return data.json();
    }).then(data => {
        let users = data.users;

        users.forEach(user => {
            if(user.username === usernameInput && user.password === passwordInput){
                document.location.href = "../profile/profile.html";
            }
        })

        })
    });
