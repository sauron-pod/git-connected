const profilePage = () => {

    //This fetch cycles through our database and gets the githubname for the logged in user. On fulfill it populates the page with users info.
    fetch("/users").then(data => data.json()).then(data => {
        // Verbose mode
        let verbose = false;

        let loggedInUser = sessionStorage.getItem("username");
        let githubUsername = "";

        let allLangArrays = [];
        let count = 0;
        let countMax = 0;
        let users = data;
        let loggedInUserObject;
        let allUsers = data;
        let isUserHome = true;

        (verbose) ? console.log(users) : "";
        users.forEach((u, i) => {
            if (u.username == loggedInUser) {
                loggedInUserObject = u;
                githubUsername = u.githubname;
                (verbose) ? console.log("ghusername is " + githubUsername) : "";
            }
        });

    // Function to print friends to page based off fetched data
    const printFriendsToPage = (user) => {
        let temp = user.friends;

        let html = "";
        temp.forEach(d => {
            allUsers.forEach(e => {
                if (e.username == d) {
                    html += `<div id="friend-bar" class="content-bar">`;
                    html += `<div class="mx-2">`;
                    html += `<img class="content-pic my-2" src='${e.githubavatar}'>`;
                    html += `</div>`;
                    html += `<div class="mx-2">`;
                    html += `<h4>`;
                    html += `<a href="http://github.com/${e.githubname}" id="${e._id}" class="follower-link">${e.username}</a>`;
                    html += `</h4>`;
                    html += `</div>`;
                    html += `<p class="remove-friend" id="${e.username}">X</p>`;
                    html += `</div>`;
                };
            });
        });

        // Print (friends) html to page
        $("#friend-display").html(html);
        $(".remove-friend").click(function () {
            console.log("X was clicked");
            if(isUserHome) {
                let removeName = $(this).attr('id');
                let index = loggedInUserObject.friends.indexOf(removeName);
                loggedInUserObject.friends.splice(index, 1);
                updateFriends(loggedInUserObject);
                printFriendsToPage(loggedInUserObject);
            }
        });

        $(".follower-link").click(function (event) {
            event.preventDefault();
            let clickedId = $(this).attr('id');
            let clickedUser = {};
            allUsers.forEach(person => {
                // console.log(person._id);
                if(person._id == clickedId){
                    clickedUser = person;
                }
            })

            //This is manipulating the page when you click on a follower. If you need to change the DOM do it under these functions.
            console.log(clickedUser);
            printFriendsToPage(clickedUser);
            displayComments(clickedUser);
            displayLanguages(clickedUser.githubname);
            displayProfile(clickedUser.githubname);
            displayLoggedInUser(clickedUser);
            isUserHome = false;

            //Don't add anything else beyond this point.
        })

    };

    printFriendsToPage(loggedInUserObject);

    $(document).on('click', '.return-to-profile', function () {
        printFriendsToPage(loggedInUserObject);
        displayLanguages(loggedInUserObject.githubname);
        displayProfile(loggedInUserObject.githubname);
        displayLoggedInUser(loggedInUserObject);
        displayComments(loggedInUserObject);
        isUserHome = true;
    });

    // $(document).on('click', '.return-to-profile', function () {
    //     displayComments(loggedInUserObject);
    // })

    // Populates "Comments" section with the strings stored in the user's "Comments" property on the database
    const displayComments = (user) => {
        let html = "";
        $("#comments").html(html);
        let comments = user.comments;
        // Loop backwards through comments in order to display most recent comment at top
        for (let i = comments.length - 1; i >= 0; --i) {
            html += `<div class="content-areas mx-2 my-2 d-flex justify-content-between">`;
            html += `<div class="mx-2 my-2">`;
            html += comments[i].content;
            html += `</div>`;
            html += `<div class="mx-2 my-2 content-bar">`;
            html += `by ${comments[i].author}`;
            html += `</div>`;
            html += `</div>`;
        }
        // Print (comments) html to page
        $("#comments").html(html);
    };

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
                    //I moved where the banner is generated to displayLoggedInUserFunction

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
                // alert('Oh no! Something went wrong.\nCheck the console for details.');
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
                $("#repo-links").html(" ");
                $("#lang-list").html(" ");
                allLangArrays = [];
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
    const displayLoggedInUser = (user) => {
        let html = `<div class="logged-in-user">`;
        html += `<i class="fas fa-user-circle mx-1 return-to-profile"></i>`;
        html += `<div class="mx-1 return-to-profile">${loggedInUser}</div>`;
        html += `<i class="fas fa-sign-out-alt mx-3" id="logout-icon"></i>`;
        html += `</div>`;
        $("#logged-in-user").html(html);
        $("#username-banner").html(`<h1 class="username-banner">${user.username}</h1>`);
        $("#logout-icon").click(function() {
            // When user logs out, username is cleared from storage so you can't click "Back" and return to a logged-in profile page
            console.log("test");
            sessionStorage.removeItem("username");
            document.location.href = "index.html";
        });
    };

    //Moved displayLoggedInUser to call after the fetch on page load. Currently line 110.


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
                            loggedInUserObject.friends.push(user.username);
                            updateFriends(loggedInUserObject);
                        }
                    })
                });
            }).then(() => {
                printFriendsToPage(loggedInUserObject);
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
        fetch(`http://localhost:3000/users/${loggedInUserObject._id}`, options).then(() => {
            console.log("We did it boys");
            console.log(loggedInUserObject);
        });
    }

    // Event listener for "Post a comment" button
    $("#submit-comment").click(function() {
        let commentContent = $("#message-text").val();
        let newComment = {
            "content": commentContent,
            "author": loggedInUser
        };
        loggedInUserObject.comments.push(newComment);
        updateFriends(loggedInUserObject);
        displayComments(loggedInUserObject);
    });

    $("#find-btn").click(function () {
        let searchInput = $("#search-input").val().toLowerCase().trim();
        let confirmedUser = "";
        $("#search-input").val("");

        allUsers.forEach(person => {
            console.log(person.id);
            if(person.username.toLowerCase() === searchInput){
                confirmedUser = person;
            }
        });
        console.log("confirmed user is " + confirmedUser);
        printFriendsToPage(confirmedUser);
        displayComments(confirmedUser);
        displayLanguages(confirmedUser.githubname);
        displayProfile(confirmedUser.githubname);
        displayLoggedInUser(confirmedUser);
        isUserHome = false;
    });

    const searchInput = document.getElementById("search-input");
    const findBtn = document.getElementById("find-btn");

    searchInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            findBtn.click();
        }
    });

    printFriendsToPage(loggedInUserObject);

    displayComments(loggedInUserObject);

    displayLoggedInUser(loggedInUserObject);

    // Display stuff after fetch is done
    displayProfile(githubUsername);

    // displayRepos(githubUsername);
    displayLanguages(githubUsername);
    });
};

profilePage();