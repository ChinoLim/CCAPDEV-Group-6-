$(document).ready(init);

function init() {
    $(".content").on("click", "#button-sign-in", signInCallback);
    $(".content").on("click", "#action-forgot-password", forgotPasswordCallback);
    $(".content").on("click", "#action-sign-up", signUpCallback);
}

function signInCallback() {
    const username = $("#input-username");
    const password = $("#input-password");

    const labelUsernameError = $("#label-username-error");
    const labelPasswordError = $("#label-password-error");

    const errColor = "#FA4454";
    const defColor = "#555555";

    const minUserLength = 3;
    const minPasswordLength = 8;

    const validUsernameLength = username.val().trim().length >= minUserLength;
    const validPasswordLength = password.val().length >= minPasswordLength;

    if(!validUsernameLength) {
        username.css("border-color", errColor);
        labelUsernameError.text(`Uesrname must have ${minUserLength} or more characters`);
        labelUsernameError.show();
    } else {
        username.css("border-color", defColor);
        labelUsernameError.hide();
    }

    if(!validPasswordLength) {
        password.css("border-color", errColor);
        labelPasswordError.text(`Password must have ${minPasswordLength} or more characters`);
        labelPasswordError.show();
    } else {
        password.css("border-color", defColor);
        labelPasswordError.hide();
    }

    if(!validUsernameLength || !validPasswordLength)
        return;

    const rememberMe = $("#box-remember").prop("checked");

    console.log(`Username: ${username.val()}\nPassword: ${password.val()}\nRemembered: ${rememberMe}`);
}

function forgotPasswordCallback() {
    console.log("forgot-password");
}

function signUpCallback() {
    console.log("sign-up");
}