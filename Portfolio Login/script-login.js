function loginCallback() {
    let username = $("#in-username");
    let password = $("#in-password");
    
    let errUsername = $("#err-username");
    let errPassword = $("#err-password");

    let validUsername = username.val().length >= 3;
    let validPassword = password.val().length >= 8;

    if(!validUsername) {
        username.css("border-color", "#FF4050AA");
        errUsername.show();
    } else {
        username.css("border-color", "#00000077");
        errUsername.hide();
    }

    if(!validPassword) {
        password.css("border-color", "#FF4050AA");
        errPassword.show();
    } else {
        password.css("border-color", "#00000077");
        errPassword.hide();
    }

    if(!validUsername || !validPassword) {
        console.log("Login callback (Invalid inputs)");
        return;
    }

    console.log(`Login callback: ${username.val()}:${password.val()}`);
    window.open("https://google.com", "_blank");
}

function forgotPasswordCallback() {
    console.log("Forgot password callback");
}

function contactSupportCallback() {
    console.log("Contact Support callback");
}

function signUpCallback() {
    console.log("SignUp callback");
}