"use strict";

{
    // Hard-coded variables for usernames
    const username = "AaronBoehle";
    const friend1 = "yaelBrown";
    const friend2 = "BranceA";

    const displayProfile = someUsername => {
        return fetch(`https://api.github.com/users/${someUsername}/events/public`, {headers: {'Authorization': `token ${gitHubKey}`}})
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data[0] === undefined) {
                    // $("#profile-pic").html(`<img class="profile-pic" style="background:#4A7526">`);
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
                }
            })
            .catch(error => {
                alert('Oh no! Something went wrong.\nCheck the console for details.');
                console.log(error);
            });
    };

    // Commented-out code is for testing non-functioning Promise.all
    const displayFriends = () => {
        const fetchURL1 = `https://api.github.com/users/${friend1}/events/public`;
        const fetchURL2 = `https://api.github.com/users/${friend2}/events/public`;
        const promise1 = fetch(fetchURL1, {headers: {'Authorization': `token ${gitHubKey}`}});
        const promise2 = fetch(fetchURL2, {headers: {'Authorization': `token ${gitHubKey}`}});
        return promise1
        // return Promise.all([promise1, promise2])
        //     .then(data => data.map(friend => {
        //         console.log(friend);
        //     }))
            // .then(result => console.log(result))
            // .then(response => response.json())
            // .then(data => {
            //     // if (data[0] === undefined) {
            //     //
            //     // } else {
            //         //Display Friend in Friends Bar
            //         const friendUsername = data[0].actor.display_login;
            //         const friendProfileImage = data[0].actor.avatar_url;
            //         $("#friend-pic").html(`<img class="friend-pic my-2" src='${friendProfileImage}'>`);
            //         $("#friend-name").html(`<h4>${friendUsername}</h4>`);
            //     // }
            // })
            .catch(error => {
                alert('Oh no! Something went wrong.\nCheck the console for details.');
                console.log(error);
            });

};

    displayProfile(username);
    displayFriends();


}