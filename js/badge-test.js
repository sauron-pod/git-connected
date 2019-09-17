"use strict";

{

    const displayProfile = someUsername => {
        return fetch(`https://api.github.com/users/${someUsername}/events/public`, {headers: {'Authorization': `token ${gitHubKey}`}})
            .then(response => {
                return response.json();
            })
            .then(data => {
                // Check that inactive user doesn't break app.
                if (data[0] === undefined) {
                    $("#root").html("User has not pushed in last 90 days -- information currently unavailable.");
                } else {
                    const profileImage = data[0].actor.avatar_url;

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

                    // Apply badge
                    let badgeImage = "";
                    if (doesDateMatch && doesMonthMatch && doesYearMatch) {
                        badgeImage = "img/green-star.png";
                    } else if (doesMonthMatch && doesYearMatch) {
                        badgeImage = "img/blue-star.png";
                    } else if (doesYearMatch) {
                        badgeImage = "img/skyblue-star.png";
                    } else {
                        badgeImage = "";
                    }

                    let html = `<div>`;
                    html += `<h1>${someUsername}</h1>`;
                    html += `<img style='width:200px;height:200px' src='${profileImage}'>`;
                    html += `<p>Today is: ${todayMonth}-${todayDate}-${todayYear}</p>`;
                    html += `<p>Last push on: ${lastCommitMonth}-${lastCommitDate}-${lastCommitYear}</p>`;
                    if (badgeImage !== "") {
                        html += `<img style='width:100px;height:100px' src='${badgeImage}'>`;
                    }
                    html += `<ul>`;
                    html += `<li>Green star = pushed today`;
                    html += `<li>Dark blue star = pushed this month`;
                    html += `<li>Light blue star = pushed in the last 90 days`;
                    html += `</ul>`;
                    html += `</div>`;
                    $("#root").html(html);

                    console.log(data);
                    return data;
                }
            })
            .catch(error => {
                alert('Oh no! Something went wrong.\nCheck the console for details.');
                console.log(error);
            });
    };

    $("#username-submit").click(() => {
        const username = $("#username-input").val();
        displayProfile(username);
    });

}