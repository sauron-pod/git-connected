let newUser = {};

// Data from github api
let ghData; 
let githubName;

// Toggle verbose console messages for development
let verbose = true;

$("#submit-signup").click(function () {

    githubName = $("#github-name-input").val();
    (verbose) ? console.log(githubName) : "";

    fetch(`https://api.github.com/users/${githubName}`, {headers: {'Authorization': `token ${gitHubKey}`}}).then(function (response) {
        return response.json().then(response => {
            if (response.id !== undefined) {
                ghData = response; // Add data to var ghData
                if ($("#password-input-one").val() === $("#password-input-two").val()) {
                    newUser.password = $("#password-input-one").val();
                    $("#password-input-one").val("");
                    $("#password-input-two").val("");
                    newUser.username = $("#username-input").val();
                    $("#username-input").val("");
                    newUser.githubName = $("#github-name-input").val();
                    $("#github-name-input").val("");
                    (verbose) ? console.log(newUser) : "";
                } else {
                    $("#password-input-one").val("");
                    $("#password-input-two").val("");
                    $("#username-input").val("");
                    $("#github-name-input").val("");
                    alert("Passwords do not match");
                }
            } else if (response.id === undefined){
                alert("Please enter your Github username");
            }
        })
    })
});


// Needs a way to post object to local db.