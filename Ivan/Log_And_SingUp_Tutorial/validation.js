const form = document.querySelector('form')
const firstname_input = document.querySelector('firstname-input')
const email_input = document.querySelector('email-input')
const password_input = document.querySelector('password-input')
const confirmpassword_input = document.querySelector('confirm-password-input')

form.addEventListener('submit', (e) => {
    //e.preventDefault()
    let errors = []
    if(firstname) {
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, confirmpassword_input.value)
    }
    else {
        errors = getLoginFormErrors(email_input.value, password_input.value)
    }

    if(errors.length > 0) {
        e.preventDefault();
    }
})

function getSignupFormErrors(firstname, email, password, confirmpassword) {
    let errors = []
    if(firstname === '' || firstname == null) {
        errors.push("First Name required")
        firstname_input.parentElement.classList.add('incorrect')
    }
    if(email === '' || email == null) {
        errors.push("Email required")
        email_input.parentElement.classList.add('incorrect')
    }
    if(password === '' || password == null) {
        errors.push("Password required")
        password_input.parentElement.classList.add('incorrect')
    }
    if(confirmpassword === '' || confirmpassword == null) {
        errors.push("You need to repeat your password")
        confirmpassword_input.parentElement.classList.add('incorrect')
    }

    return errors
}