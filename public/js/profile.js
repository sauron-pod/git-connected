// Verbose mode
let verbose = true;

//Assign username from session storage.
let loggedInUser = sessionStorage.getItem("username");
let githubUsername = "";
let ghDataLoggedInUser = [];

let allLangArrays = [];
let count = 0;
let countMax = 0;
let users = "";
let followerArray = [];
let loggedInUserObject;

//This fetch cycles through our database and gets the githubname for the logged in user. On fulfill it populates the page with users info.
fetch("/users").then(data => data.json()).then(data => {
    users = data;
    let currentUserIdx = 0;
    (verbose) ? console.log(users) : "";
    users.forEach((u, i) => {
        if (u.username == loggedInUser) {
            loggedInUserObject = u;
            console.log(loggedInUserObject);
            githubUsername = u.githubname;
            currentUserIdx = i;
            (verbose) ? console.log("ghusername is " + githubUsername) : "";
        }
    });

    // Function to print friends to page based off fetched data
    const printFriendsToPage = () => {
        let temp = users[currentUserIdx].friends;
        let html = "";
        temp.forEach(d => {
            users.forEach(e => {
                if (e.username == d) {
                    html += `<div id="friend-bar" class="content-bar">`;
                    html += `<div class="mx-2">`;
                    html += `<img class="content-pic my-2" src='${e.githubavatar}'>`;
                    html += `</div>`;
                    html += `<div class="mx-2">`;
                    html += `<h4>`;
                    html += `<a href="http://github.com/${e.githubname}">${e.username}</a>`;
                    html += `</h4>`;
                    html += `</div>`;
                    html += `</div>`;
                };
            });
        });
        // Print (friends) html to page
        $("#friend-display").append(html);
    }
    printFriendsToPage();
}).then(function () {
    // Display stuff after fetch is done
    displayProfile(githubUsername);

    // displayRepos(githubUsername);
    displayLanguages(githubUsername);
});

// Save profile image url to save to database

const displayProfile = someUsername => {
    fetch(`https://api.github.com/users/${someUsername}/events/public`, { 
        headers: { 'Authorization': `token ${gitHubKey}` }}).then(response => response.json()).then(data => {
            if (data[0] === undefined) {
                $("#profile-pic").css("display", "none");
                $("#username-banner").html("");
                $("main").html("User has not pushed in last 90 days -- information currently unavailable.");
            } else {
                //Display Profile Image
                const profileImage = data[0].actor.avatar_url;
                $("#profile-pic").html(`<img class="profile-pic" src='${profileImage}'>`);

                //Display Username in Heading
                $("#username-banner").html(`<h1 class="username-banner">${someUsername}</h1>`);

                // Define date of last push
                const lastCommit = data.filter(data => data.type === "PushEvent")[0].created_at;
                const lastCommitDate = new Date(lastCommit).getDate();
                const lastCommitMonth = new Date(lastCommit).getMonth();
                const lastCommitYear = new Date(lastCommit).getFullYear();

                // Define today's date
                const today = Date.now();
                const todayDate = new Date(today).getDate();
                const todayMonth = new Date(today).getMonth();
                const todayYear = new Date(today).getFullYear();

                // Compare today's date & last push
                const doesYearMatch = lastCommitYear === todayYear;
                const doesMonthMatch = lastCommitMonth === todayMonth;
                const doesDateMatch = lastCommitDate === todayDate;

                // Decide which badge to apply
                let badgeImage = "";
                let badgeAltText = "";
                if (doesDateMatch && doesMonthMatch && doesYearMatch) {
                    badgeImage = "img/green-star.png";
                    badgeAltText = "Latest push event: today"
                } else if (doesMonthMatch && doesYearMatch) {
                    badgeImage = "img/blue-star.png";
                    badgeAltText = "Latest push event: this month"
                } else if (doesYearMatch) {
                    badgeImage = "img/skyblue-star.png";
                    badgeAltText = "Latest push event: within 90 days"
                } else {
                    badgeImage = "";
                }

                // Display badge
                if (badgeImage !== "") {
                    $("#badge-bar").html(`<img style='width:50px;height:50px' src='${badgeImage}' alt="${badgeAltText}" title="${badgeAltText}">`);
                }
            };
        }).catch(error => {
            alert('Oh no! Something went wrong.\nCheck the console for details.');
            console.log(error);
        });
};

// Display languages to language section of page
const displayLanguages = someUsername => {
    return fetch(`https://api.github.com/users/${someUsername}/repos`, {headers: {'Authorization': `token ${gitHubKey}`}})
        .then(response => {
            return response.json();
        })
        .then(data => {
            data.forEach(repo => {
                $("#repo-links").append(`<div class="mx-2"><h4><a href="${repo.html_url}" target="_blank">${repo.name}</a></h4></div>`);
            });
            countMax = data.length;
            data.forEach(repo => {
                fetch(repo.languages_url)
                    .then(response => {
                    return response.json();
                }).then(data => {
                    let languages = Object.keys(data);
                        for(let i = 0; i < languages.length; i++) {
                            if (allLangArrays.indexOf(languages[i]) === -1) {
                                allLangArrays.push(languages[i]);
                                $("#lang-list").append(`<div class="mx-2"><h4>${languages[i]}</h4></div>`);
                                // displayLanguagesBadge(allLangArrays.length); // Displays badges for unique array lengths
                            }
                        }
                            if(count === (countMax - 1)){
                                displayLanguagesBadge(allLangArrays.length);
                            }
                    count ++;
                });
            })
        }).catch(error => {
            alert('Oh no! Something went wrong.\nCheck the console for details.');
            console.log(error);
        });
};

// not sure what this is

const displayLanguagesBadge = (numberOfLanguages) => {
    let badgeImage = "";
    let badgeAltText = "";
    if (numberOfLanguages >= 2 && numberOfLanguages < 4) {
        badgeImage = "langs1.png";
        badgeAltText = "Bilingual: Codes in at least 2 different languages";
    }
    if (numberOfLanguages >= 4 && numberOfLanguages < 8) {
        badgeImage = "langs2.png";
        badgeAltText = "Multilingual: Codes in at least 4 different languages";
    }
    if (numberOfLanguages >= 8) {
        badgeImage = "langs3.png";
        badgeAltText = "Polyglot: Codes in at least 8 different languages";
    }

    // Display badge
    if (badgeImage !== "") {
        $("#badge-bar").append(`<img style='width:50px;height:50px' src='img/${badgeImage}' alt="${badgeAltText}" title="${badgeAltText}">`);
    }
};

// Creates logged-in user display and signout at top-right corner inside green header bar
const displayLoggedInUser = () => {
    let html = `<div class="logged-in-user">`;
    html += `<i class="fas fa-user-circle mx-1"></i>`;
    html += `<div class="mx-1">${loggedInUser}</div>`;
    html += `<i class="fas fa-sign-out-alt mx-3" id="logout-icon"></i>`
    html += `</div>`;
    $("#logged-in-user").html(html);
};

displayLoggedInUser();

$("#logout-icon").on("click", function() {
    // When user logs out, username is cleared from storage so you can't click "Back" and return to a logged-in profile page
    sessionStorage.removeItem("username");
    document.location.href = "index.html";
});

// function getUserOnLoad() {
//     fetch("/users").then(data => data.json()).then(users => {
//         users.forEach(user => {
//             if (user.username === loggedInUser) {
//                 console.log(user);
//                 return user;
//             }
//         });
//     });
// }

$("#add-follower").click(function () {
    console.log(loggedInUserObject.friends);
    let isNewFollowerNew = true;
    let newFollower = $("#github-follower").val();
    $("#github-follower").val("");
    for(let i = 0; i < loggedInUserObject.friends.length; i++){
        if(loggedInUserObject.friends[i] === newFollower){
            isNewFollowerNew = false;
        }
    }
    if(isNewFollowerNew && loggedInUserObject.username !== newFollower) {
        fetch(`/users`).then(function (response) {
            return response.json().then(response => {
                response.forEach(user => {
                    if (user.username === newFollower) {
                        loggedInUserObject.friends.push(newFollower);
                        updateFriends(loggedInUserObject);
                    }
                })
            });
        }).then(() => {

        })
    }else {
        alert("You are already following that user.")
    }
});

function updateFriends(userToAdd) {
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToAdd),
    };
    fetch(`http://localhost:3000/users/${loggedInUserObject.id}`, options).then(() => {
        console.log("We did it boys");
        console.log(loggedInUserObject);
    });
}