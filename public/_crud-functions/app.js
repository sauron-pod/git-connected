//         (verbose) ? console.log("") : "";
"use strict";

// Verify the page loaded
console.log("app.js is loaded");

// Verbose Console logs.
let verbose = true;

// Declare variables for DOM elements
const showDB = document.getElementById("showDB");

// Add users to db
const name = document.getElementById("name");
const locationDOM = document.getElementById("loc");
const color = document.getElementById("color");
const add = document.getElementById("addBtn");

let addUser = (nam = name.value, loca = locationDOM.value, colo = color.value) => {
  (verbose) ? console.log("Adding User"): "";
  if (nam == undefined || loca == undefined || colo == undefined) {
    alert("Please check inputs for adding user");
    return;
  } else if (nam == "" || loca == "" || colo == "") {
    alert("Please check inputs for adding user");
    return;
  } else {
    const data = {name: nam, location: loca, favoriteColor: colo};
    const url = 'http://localhost:3000/users'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }
    fetch(url, options)
      .then(() => renderHTML())
      .catch(() => (verbose) ? console.log("There was an error adding user"): "")
      .then(() => (verbose) ? console.log("New User was added : " + nam + " " + loca + " " + colo): "");
  }
}

// EventListener for ADD button
add.addEventListener("click", () => addUser(name.value, locationDOM.value, color.value));

// DOM variables for edit fields
const editName = document.getElementById("editName");
const editLocation = document.getElementById("editLoc");
const editColor = document.getElementById("editColor");
const saveBtn = document.getElementById("saveBtn");

// Save Data
const saveUser = (idNum) => {
  (verbose) ? console.log("Saving user Data") : "";
  const data = {name: editName.value, location: editLocation.value, favoriteColor: editColor.value};
  const url = `http://localhost:3000/users/${idNum}`
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }
    fetch(url, options)
      .then(() => renderHTML())
      .catch(() => (verbose) ? console.log("There was an error editing user"): "")
      .then(() => (verbose) ? console.log("User with ID of " + idNum + " was edited. " + editName.value + " " + editLocation.value + " " + editColor.value): "");
}

// Edit user
const editUser = (num) => {
  (verbose) ? console.log("EditUser function was ran") : "";
  let selectedIndex = 0;

  if (num == undefined || num == typeof Number) {
    (verbose) ? console.log("Please enter a ID number") : "";
    return;
  } else {
    // find index of selected user in payload array
    payload.map((e,i) => (e.id == num) ? selectedIndex = i : "");
    console.log("Selected Index is " + selectedIndex);

    // Put data in the fields
    editName.value = payload[selectedIndex].name;
    editLocation.value = payload[selectedIndex].location;
    editColor.value = payload[selectedIndex].favoriteColor;
    saveBtn.addEventListener("click", () => saveUser(num));
  }
};

// Delete user
const deleteUser = (num) => {
  if (num == undefined || num == typeof Number) {
    (verbose) ? console.log("Enter a ID number to delete") : "";
  } else {
    const url = `http://localhost:3000/users/${num}`
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    fetch(url, options)
      .then(() => renderHTML())
      .catch(() => (verbose) ? console.log("There was an error deleting user"): "")
      .then(() => (verbose) ? console.log("User with ID of " + num + " was deleted."): "");
  }
}

// Renders content to print to page
let payload = "";

const renderHTML = () => {
  (verbose) ? console.log("Rendering content to page") : "";

  // Fetch data from local json db store to variable
  let html = "";

  showDB.innerHTML = "";
  showDB.innerHTML = html;

  fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(json => {
      (verbose) ? console.log(json): "";
      payload = json;
    })
    // display db info to page.
    .then(() => {
      payload.map((e,i) => {
        html += `<p>`;
        html += `Name : ${payload[i].name}<br>`;
        html += `Location : ${payload[i].location}<br>`;
        html += `Favorite Color : ${payload[i].favoriteColor}<br>`;
        html += `<button onClick="editUser(${payload[i].id})" id="editUsr">Edit</button> <button onClick="deleteUser(${payload[i].id})" id="deleteUsr">Delete</button>`;
        html += `</p>`;
      })
      showDB.innerHTML = html;
    });
}

// Initial render of page.
renderHTML();
