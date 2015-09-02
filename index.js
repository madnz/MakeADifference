"use strict";


window.onload = function () {
	document.getElementById('applyForm').onsubmit = function (e) {
		var firebase = new Firebase('https://scorching-fire-2466.firebaseIO.com/'),
			applyForm = document.getElementById('applyForm'),
			applicantName = applyForm.elements['name'].value,
			applicantEmail = applyForm.elements['email'].value,
			applicantSkills = applyForm.elements['skills'].value,
			application = {
				"name": applicantName,
				"email": applicantEmail,
				"skills": applicantSkills
			},
			applicationRef,
			formInError = false;
		if (e.preventDefault) {
			e.preventDefault();
		}
		// validate inputs. Browser may do this for us, but it might not.
		if (application.name === null || application.name === undefined || application.length === 0) {
			formInError = setFormFieldError('name-error', 'Please enter your name');
		}
		if (application.skills === null || application.skills === undefined || application.skills === 0) {
			formInError = setFormFieldError('skills-error', 'Please enter your skills');
		}
		if (application.email === null || application.email === undefined || application.email === 0 || !validateEmail(application.email)) {
			formInError = setFormFieldError('email-error', 'Please enter a valid email');
		}
		if (!formInError) {
			// saves this volunteer application as a new unique entry in the volunteers list on Firebase
			applicationRef = firebase.child('volunteers').push(application);

			alert('Application saved with key: ' + applicationRef.key());

			//TODO redirect to thank-you.html
		}

		// prevent form default behaviour
		return false;
	}
}

function setFormFieldError(fieldId, error) {
	document.getElementById(fieldId).innerHTML = error;
	return true;
}

// see http://output.jsbin.com/ozeyag/19
function validateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}