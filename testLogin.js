"use strict";

var userUID, userName, userRole, volunteerTable,
    firebase = new Firebase('https://scorching-fire-2466.firebaseIO.com/');

window.onload = function () {
    document.getElementById('loginButton').onclick = login;
    document.getElementById('volunteersAdminButton').onclick = volunteers;
    document.getElementById('projectAdminButton').onclick = projects;
}
function showInWorkArea(html) {
    document.getElementById('workArea').innerHTML = html;
}
function showWorkAreaLoading() {
    showInWorkArea('<h4>loading...</h4>');
}

function volunteers() {
    showWorkAreaLoading();
    // get list of volunteers
    var volunteersRef = firebase.child('volunteers');
    volunteersRef.on("value", function (snapshot) {
        if (snapshot.hasChildren()) {
            volunteerTable = '<table><thead><tr><th>Name</th><th>Email</th><th>Skills</th></tr></thead><tbody>';
            snapshot.forEach(generateVolunteerHTML);
            volunteerTable += '</tbody></table>';
            showInWorkArea(volunteerTable);
        } else {
            showInWorkArea('<h4>No volunteers available</h4>');
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}
function generateVolunteerHTML(volunteer) {
    var volunteerObj = volunteer.val();
    volunteerTable += '<tr><td>' + volunteerObj.name + '</td><td>' + volunteerObj.email + '</td><td>' + volunteerObj.skills + '</td></tr>';
}

function projects() {
    console.log('projects');
    showWorkAreaLoading();
    // get list of projects
}

function login() {
    console.log('login');
    firebase.authWithOAuthPopup("google", function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            document.getElementById('loginButton').style.display = 'none';
            userUID = authData.auth.uid;
            userName = authData.google.cachedUserProfile.given_name;
            document.getElementById('welcomeName').innerHTML = userName;
            // update users table
            var usersRef = firebase.child('users');
            usersRef.child(userUID).update({
                provider: authData.auth.provider,
                name: authData[authData.auth.provider].displayName,
                lastLogin: new Date()
            }, function (error) {
                if (error) {
                    console.log("New user data could not be saved: " + error);
                } else {
                    // read the user list and display it. Security rules mean this should only show the logged in user.
                    usersRef.once("value", function (data) {
                        userRole = data.val()[userUID].role;
                        document.getElementById('role').innerHTML = userRole || 'Unknown';
                        document.getElementById('lastLogin').innerHTML = data.val()[userUID].lastLogin;
                        document.getElementById('loginInfo').style.display = 'block';
                        document.getElementById('volunteersAdminButton').style.visibility = userRole === 'admin' ? 'visible' : 'hidden';
                        document.getElementById('projectAdminButton').style.visibility = userRole === 'admin' ? 'visible' : 'hidden';
                    });
                }
            });
        }
    });
};

