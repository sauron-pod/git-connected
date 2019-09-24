let newUser = {};

$("#submit-signup").click(function () {

    let githubName = $("#github-name-input").val();
    console.log(githubName);

    fetch(`https://api.github.com/users/${githubName}/repos`, {headers: {'Authorization': `token ${gitHubKey}`}}).then(function (response) {
        return response.json().then(response => {
            console.log(response);
            if (response.id !== undefined) {
                if ($("#password-input-one").val() === $("#password-input-two").val()) {
                    newUser.password = $("#password-input-one").val();
                    $("#password-input-one").val("");
                    $("#password-input-two").val("");
                    newUser.username = $("#username-input").val();
                    $("#username-input").val("");
                    newUser.githubName = $("#github-name-input").val();
                    $("#github-name-input").val("");
                    console.log(newUser);
                } else {
                    $("#password-input-one").val("");
                    $("#password-input-two").val("");
                    $("#username-input").val("");
                    $("#github-name-input").val("");
                    alert("Passwords do not match");
                }
            } else {
                alert("Please enter your Github username");
            }
        })
    })
});
