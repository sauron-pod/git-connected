let newUser = {};

// Data from github api
let ghData; 
let githubName;
let nameIsNew = true;

// Toggle verbose console messages for development
let verbose = true;

// Function for signing users up
function signOnUp(userToAdd) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd),
    };
    fetch("http://localhost:3000/users", options).then(() => {
        document.location.href = "index.html";
        console.log("We did it boys");
    });
}

// Eventlistener for signup button
$("#submit-signup").click(function () {

    let githubName = $("#github-name-input").val();

    fetch("http://localhost:3000/users").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        data.forEach(user => {
            console.log(user.username);
            if (user.username === $("#username-input").val()){
                console.log("we made it here");
                nameIsNew = false;
                return Promise.reject("Username already taken.");
            };
        })
    }, (err) => {
        console.log(err);
    }).catch(err => {
        console.log(err);
        nameIsNew = false;
        return Promise.reject("Username already taken.");
    }).then(()=>{ fetch(`https://api.github.com/users/${githubName}`, {headers: {'Authorization': `token ${gitHubKey}`}}).then(function (response) {
        return response.json().then(response => {
            console.log(response);
            if (response.message !== "Not Found" && nameIsNew) {
                if ($("#password-input-one").val() === $("#password-input-two").val()) {
                    newUser.username = $("#username-input").val();
                    $("#username-input").val("");
                    newUser.firstName = $("#first-name").val();
                    $("#first-name").val("");
                    newUser.lastName = $("#last-name").val();
                    $("#last-name").val("");
                    newUser.githubname = $("#github-name-input").val();
                    $("#github-name-input").val("");
                    newUser.password = $("#password-input-one").val();
                    $("#password-input-one").val("");
                    $("#password-input-two").val("");
                    newUser.comments = [{
                            "content": "Welcome!",
                            "author": "GC Staff"
                        }];
                    newUser.friends = [];
                    signOnUp(newUser);

                    return newUser;
                } else {
                    $("#password-input-one").val("");
                    $("#password-input-two").val("");
                    $("#username-input").val("");
                    $("#github-name-input").val("");
                    $("#first-name").val("");
                    $("#last-name").val("");
                    alert("Passwords do not match");
                }
            } else if(nameIsNew === false){
                $("#password-input-one").val("");
                $("#password-input-two").val("");
                $("#username-input").val("");
                $("#github-name-input").val("");
                $("#first-name").val("");
                $("#last-name").val("");
                alert("Username already taken");
                nameIsNew = false;
            } else if (response.id === undefined){
                $("#password-input-one").val("");
                $("#password-input-two").val("");
                $("#username-input").val("");
                $("#github-name-input").val("");
                $("#first-name").val("");
                $("#last-name").val("");
                alert("Please enter your Github username");
            }
        })
    })
    })
});


// Needs a way to post object to local db.