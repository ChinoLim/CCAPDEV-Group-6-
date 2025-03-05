function loginCallback(){
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
        username.css("border-color", "#5f5f5f");
        errUsername.hide();
    }

    if(!validPassword) {
        password.css("border-color", "#FF4050AA");
        errPassword.show();
    } else {
        password.css("border-color", "#5f5f5f");
        errPassword.hide();
    }

    if(!validUsername || !validPassword) {
        console.log("Login callback (Invalid inputs)");
        return;
    }
    
    // Log input form status
    console.log(`Login callback: ${username.val()}:${password.val()}`);
}

function forgotPasswordCallback() {
    console.log("Forgot password callback");
}

function contactSupportCallback() {
    console.log("Contact Support callback");
}

function changePageCallback() {
    let logIn = $("#login-forms");
    let signUp = $("#signup-forms");

    if (logIn.is(":visible")) {
        logIn.fadeOut(300, function() {
            signUp.fadeIn(300);
        });
    } else {
        signUp.fadeOut(300, function() {
            logIn.fadeIn(300);
        });
    }

    console.log("Toggled between Sign In and Sign Up forms.");
}

