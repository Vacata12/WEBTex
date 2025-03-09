const form = document.querySelector('form');
const firstname_input = document.querySelector('#firstname-input');
const email_input = document.querySelector('#email-input');
const password_input = document.querySelector('#password-input');
const confirmpassword_input = document.querySelector('#confirm-password-input');

form.addEventListener('submit', (e) => {
    let errors = [];
    
    if (firstname_input) {
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, confirmpassword_input.value);
    }
    else {
        errors = getLoginFormErrors(email_input.value, password_input.value);
    }
    if(errors.length > 0) {
        e.preventDefault();
        console.log(errors); // Debugging: logs errors to the console
    }
    else {
        console.log('no errors');
    }
});

function getSignupFormErrors(firstname, email, password, confirmpassword) {
    let errors = [];

    if (!firstname) {
        errors.push("First Name required");
        firstname_input.parentElement.classList.add('incorrect');
    }
    if (!email) {
        errors.push("Email required");
        email_input.parentElement.classList.add('incorrect');
    }
    if (!password) {
        errors.push("Password required");
        password_input.parentElement.classList.add('incorrect');
    }
    if (!confirmpassword) {
        errors.push("You need to repeat your password");
        confirmpassword_input.parentElement.classList.add('incorrect');
    }

    return errors;
}

function getSignupFormErrors(firstname, email, password, confirmpassword) {
    let errors = [];

    if (!email) {
        errors.push("Email required");
        email_input.parentElement.classList.add('incorrect');
    }
    if (!password) {
        errors.push("Password required");
        password_input.parentElement.classList.add('incorrect');
    }

    return errors;
}