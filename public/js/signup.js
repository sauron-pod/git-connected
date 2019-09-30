let newUser = {};

// Data from github api
let ghData; 
let githubName;

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
        console.log("We did it boys");
    });
}

// Eventlistener for signup button
$("#submit-signup").click(function () {

    let githubName = $("#github-name-input").val();
    console.log(githubName);

    fetch(`https://api.github.com/users/${githubName}`, {headers: {'Authorization': `token ${gitHubKey}`}}).then(function (response) {
        return response.json().then(response => {
            response.forEach(person => {

                //this is broke
                if (person.username === $("#username-input").val("")){
                    nameIsNew = false;
                };
            });
            if (response.id !== undefined && nameIsNew) {
                if ($("#password-input-one").val() === $("#password-input-two").val()) {
                    newUser.username = $("#username-input").val();
                    $("#username-input").val("");
                    newUser.firstName = $("#first-name").val();
                    $("#first-name").val("");
                    newUser.lastName = $("#last-name").val();
                    $("#last-name").val("");
                    newUser.githubName = $("#github-name-input").val();
                    $("#github-name-input").val("");
                    newUser.password = $("#password-input-one").val();
                    $("#password-input-one").val("");
                    $("#password-input-two").val("");

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
            } else if (response.id === undefined){
                alert("Please enter your Github username");
            }
        }).then(newUser => {
            signOnUp(newUser);
        })
    })
});



// Needs a way to post object to local db.