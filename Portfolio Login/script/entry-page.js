$(document).ready(init);

const minUsernameLength = 3, maxUsernameLength = 30;
const minPasswordLength = 8, maxPasswordLength = 100;

const msgColor = "#FA4454";
const defaultColor = "#555555";
const validColor = "#39CE86";

const dynamicPathname = false;

const FORM_SIGN_UP = 0;
const FORM_SIGN_IN = 1;
const FORM_PASSWORD_RECOVERY_EMAIL = 2;
const FORM_PASSWORD_RECOVERY_CODE = 3;
const FORM_PASSWORD_RECOVERY_NEW = 4;
const FORM_PASSWORD_RECOVERY_SUCCESS = 5;

const entryForms = [];

let recoveryEmail;

class EntryForm {

    constructor(formHTML, pathname, inputFields, msgLabels) {
        this.formHTML = formHTML;
        this.pathname = pathname;
        this.inputFields = inputFields;
        this.msgLabels = msgLabels;
    }

}

function init() {
    connectToDB();

    initDOMTags();
    initCallbacks();

    setForm(FORM_SIGN_IN, true);
}

function initDOMTags() {
    let index, tag;

    index = FORM_SIGN_UP;
    tag = $("#sign-up-form");
    entryForms[index] = new EntryForm(
        tag,
        "/sign-up.html",
        [
            tag.find(".input-email"),
            tag.find(".input-username"),
            tag.find(".input-password"),
            tag.find(".input-password-confirm")
        ],
        [
            tag.find(".label-email-msg"),
            tag.find(".label-username-msg"),
            tag.find(".label-password-msg"),
            tag.find(".label-password-confirm-msg")
        ]
    );

    index = FORM_SIGN_IN;
    tag = $("#sign-in-form");
    entryForms[index] = new EntryForm(
        tag,
        "/sign-in.html",
        [
            tag.find(".input-username"),
            tag.find(".input-password")
        ],
        [
            tag.find(".label-username-msg"),
            tag.find(".label-password-msg")
        ]
    );

    index = FORM_PASSWORD_RECOVERY_EMAIL;
    tag = $("#password-recovery-email-form");
    entryForms[index] = new EntryForm(
        tag,
        "/password-recovery.html",
        [
            tag.find(".input-email")
        ],
        [
            tag.find(".label-email-msg")
        ]
    );

    index = FORM_PASSWORD_RECOVERY_CODE;
    tag = $("#password-recovery-code-form");
    entryForms[index] = new EntryForm(
        tag,
        null,
        [
            tag.find(".input-recovery-code")
        ],
        [
            tag.find(".label-recovery-code-msg")
        ]
    );

    index = FORM_PASSWORD_RECOVERY_NEW;
    tag = $("#pasword-recovery-new-form");
    entryForms[index] = new EntryForm(
        tag,
        null,
        [
            tag.find(".input-password"),
            tag.find(".input-password-confirm")
        ],
        [
            tag.find(".label-password-msg"),
            tag.find(".label-password-confirm-msg")
        ]
    );

    index = FORM_PASSWORD_RECOVERY_SUCCESS;
    tag = $("#password-recovery-success-form");
    entryForms[index] = new EntryForm(
        tag,
        null,
        null,
        null,
    );
}

function initCallbacks() {
    entryForms[FORM_SIGN_UP].formHTML.on("click", ".button-proceed", signUpCallback);
    entryForms[FORM_SIGN_UP].formHTML.on("click", ".action-sign-in", () => setForm(FORM_SIGN_IN, true));

    entryForms[FORM_SIGN_IN].formHTML.on("click", ".button-proceed", signInCallback);
    entryForms[FORM_SIGN_IN].formHTML.on("click", "#action-forgot-password", () => setForm(FORM_PASSWORD_RECOVERY_EMAIL, true));
    entryForms[FORM_SIGN_IN].formHTML.on("click", ".action-sign-up", () => setForm(FORM_SIGN_UP, true));

    entryForms[FORM_PASSWORD_RECOVERY_EMAIL].formHTML.on("click", ".button-proceed", proceedToRecoveryCodeCallback);
    entryForms[FORM_PASSWORD_RECOVERY_EMAIL].formHTML.on("click", ".action-sign-in", () => setForm(FORM_SIGN_IN, true));

    entryForms[FORM_PASSWORD_RECOVERY_CODE].formHTML.on("click", ".button-proceed", proceedToNewPasswordCallback);
    entryForms[FORM_PASSWORD_RECOVERY_CODE].formHTML.on("click", ".action-sign-in", () => setForm(FORM_SIGN_IN, true));

    entryForms[FORM_PASSWORD_RECOVERY_NEW].formHTML.on("click", ".button-proceed", changePasswordCallback);
    entryForms[FORM_PASSWORD_RECOVERY_NEW].formHTML.on("click", ".action-sign-in", () => setForm(FORM_SIGN_IN, true));

    entryForms[FORM_PASSWORD_RECOVERY_SUCCESS].formHTML.on("click", ".button-proceed", () => setForm(FORM_SIGN_IN, true));

    const passwordRevealButtons = document.querySelectorAll(".button-password-reveal");

    $(passwordRevealButtons).each((obj, button) => {
        $(button).on("mousedown touchstart", function() {
            $(this).parent().find(".input-password, .input-password-confirm").attr("type", "text");
        });
    
        $(button).on("mouseup touchend mouseleave touchcancel", function() {
            $(this).parent().find(".input-password, .input-password-confirm").attr("type", "password");
        });
    });

    $(document).on("click", ".button-screen-notif-affirm", () => $(".screen-notif").removeClass("show"));
}

function signUpCallback() {
    const formIndex = FORM_SIGN_UP;
    let valid = true;

    const inputEmail = entryForms[formIndex].inputFields[0];
    const inputUsername = entryForms[formIndex].inputFields[1];
    const inputPassword = entryForms[formIndex].inputFields[2];
    const inputPasswordConfirm = entryForms[formIndex].inputFields[3];

    const labelEmailMsg = entryForms[formIndex].msgLabels[0];
    const labelUsernameMsg = entryForms[formIndex].msgLabels[1];
    const labelPasswordMsg = entryForms[formIndex].msgLabels[2];
    const labelPasswordConfirmMsg = entryForms[formIndex].msgLabels[3];

    const email = validateEmail(inputEmail, labelEmailMsg);

    /* DB check
    if(email && emailExists(email)) {
        inputEmail.css("border-color", msgColor);
        labelEmailMsg.text("Email is already registered");
        labelEmailMsg.show();
        valid = false;
    }
    */

    const username = validateUsername(inputUsername, labelUsernameMsg);

    /* DB check
    if(username && usernameExists(username)) {
        inputUsername.css("border-color", msgColor);
        labelUsernameMsg.text("Username is already taken");
        labelUsernameMsg.show();
        valid = false;
    }
    */
    
    const password = validatePassword(inputPassword, labelPasswordMsg, inputPassword.val());
    const passwordConfirm = validatePassword(inputPasswordConfirm, labelPasswordConfirmMsg, inputPasswordConfirm.val());

    if((password && passwordConfirm) && (password != passwordConfirm)) {
        labelPasswordMsg.text("Password mismatch");
        labelPasswordConfirmMsg.text("Password mismatch");

        inputPassword.css("border-color", msgColor);
        inputPasswordConfirm.css("border-color", msgColor);

        labelPasswordMsg.show();
        labelPasswordConfirmMsg.show();
        return;
    }

    if(!valid || !email || !username || !password || !passwordConfirm)
        return;

    labelEmailMsg.hide();
    labelUsernameMsg.hide();

    console.log(`Email: ${email}\nUsername: ${username}\nPassword: ${password}`);
    showScreenNotification("Debug - Sign Up Success", `Email: ${email}\nUsername: ${username}\nPassword: ${password}`);
}

function signInCallback() {
    const formIndex = FORM_SIGN_IN;
    let valid = true;

    const inputUsername = entryForms[formIndex].inputFields[0];
    const inputPassword = entryForms[formIndex].inputFields[1];

    const labelUsernameMsg = entryForms[formIndex].msgLabels[0];
    const labelPasswordMsg = entryForms[formIndex].msgLabels[1];

    const isUsername = !inputUsername.val().trim().includes("@");

    let username;

    if(isUsername) {
        username = validateUsername(inputUsername, labelUsernameMsg);
    
        if(username && !usernameExists(username)) {
            inputUsername.css("border-color", msgColor);
            labelUsernameMsg.text("Username does not exist");
            labelUsernameMsg.show();
            valid = false;
        }
    } else {
        username = validateEmail(inputUsername, labelUsernameMsg);

        if(username && !emailExists(username)) {
            inputUsername.css("border-color", msgColor);
            labelUsernameMsg.text("Email is not registered");
            labelUsernameMsg.show();
            valid = false;
        }
    }

    const password = validatePassword(inputPassword, labelPasswordMsg, inputPassword.val());

    if(password && !validSignInCredentials(username, password, isUsername)) {
        inputPassword.css("border-color", msgColor);
        labelPasswordMsg.text("Password is incorrect");
        labelPasswordMsg.show();
        valid = false;
    }

    if(!valid || !username || !password)
        return;

    labelUsernameMsg.hide();
    labelPasswordMsg.hide();

    const rememberMe = $("#box-remember").prop("checked");

    console.log(`Username: ${username}\nPassword: ${password}\nRemembered: ${rememberMe}\nIsUsername: ${isUsername}`);
    showScreenNotification("Debug - Sign In Success", `Username: ${username}\nPassword: ${password}\nRemembered: ${rememberMe}\nIsUsername: ${isUsername}`);
}

function proceedToRecoveryCodeCallback() {
    const formIndex = FORM_PASSWORD_RECOVERY_EMAIL;

    const inputEmail = entryForms[formIndex].inputFields[0];
    const labelEmailMsg = entryForms[formIndex].msgLabels[0];

    const email = validateEmail(inputEmail, labelEmailMsg);

    if(!email)
        return;

    if(email && !emailExists(email)) {
        inputEmail.css("border-color", msgColor);
        labelEmailMsg.text("Email is not registered");
        labelEmailMsg.show();
        return;
    }

    recoveryEmail = email;
    labelEmailMsg.hide();

    console.log(`Email: ${email}`);
    setForm(FORM_PASSWORD_RECOVERY_CODE, true);
}

function proceedToNewPasswordCallback() {
    const formIndex = FORM_PASSWORD_RECOVERY_CODE;

    const inputCode = entryForms[formIndex].inputFields[0];
    const labelCodeMsg = entryForms[formIndex].msgLabels[0];

    const code = validateRecoveryCode(inputCode, labelCodeMsg);

    if(!code)
        return;

    if(code && !validRecoveryCode(code, recoveryEmail)) {
        inputCode.css("border-color", msgColor);
        labelCodeMsg.text("Recovery code is incorrect");
        labelCodeMsg.show();
        return;
    }

    labelCodeMsg.hide();

    console.log(`Code: ${code}`);
    setForm(FORM_PASSWORD_RECOVERY_NEW, true);
}

function changePasswordCallback() {
    const formIndex = FORM_PASSWORD_RECOVERY_NEW;

    const inputPassword = entryForms[formIndex].inputFields[0];
    const inputPasswordConfirm = entryForms[formIndex].inputFields[1];

    const labelPasswordMsg = entryForms[formIndex].msgLabels[0];
    const labelPasswordConfirmMsg = entryForms[formIndex].msgLabels[1];

    const password = validatePassword(inputPassword, labelPasswordMsg, inputPassword.val());
    const passwordConfirm = validatePassword(inputPasswordConfirm, labelPasswordConfirmMsg, inputPasswordConfirm.val());

    if((password && passwordConfirm) && (password != passwordConfirm)) {
        labelPasswordMsg.text("Password mismatch");
        labelPasswordConfirmMsg.text("Password mismatch");

        inputPassword.css("border-color", msgColor);
        inputPasswordConfirm.css("border-color", msgColor);

        labelPasswordMsg.show();
        labelPasswordConfirmMsg.show();
        return;
    }

    if(!password || !passwordConfirm)
        return;

    console.log(`New Password: ${password}`);
    setForm(FORM_PASSWORD_RECOVERY_SUCCESS, true);
}

function validateEmail(inputField, msgLabel) {
    const input = inputField.val().trim().toLowerCase();

    if(!input) {
        msgLabel.text("Email is required");
        inputField.css("border-color", msgColor);
        msgLabel.show();
        return "";
    }

    if(!input.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        msgLabel.text("Invalid email address format");
        inputField.css("border-color", msgColor);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", validColor);
    msgLabel.hide();

    return input;
}

function validateUsername(inputField, msgLabel) {
    const input = inputField.val().trim();

    if(!input) {
        inputField.css("border-color", msgColor);
        msgLabel.text("Username is required");
        msgLabel.show();
        return "";
    }

    if(input.length < minUsernameLength) {
        inputField.css("border-color", msgColor);
        msgLabel.text(`Username must have a minimum of ${minUsernameLength} characters`);
        msgLabel.show();
        return "";
    }

    if(input.length > maxUsernameLength) {
        inputField.css("border-color", msgColor);
        msgLabel.text(`Username cannot exceed ${maxUsernameLength} characters`);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", validColor);
    msgLabel.hide();
    return input;
}

function validatePassword(inputField, msgLabel, input) {
    if(!input) {
        inputField.css("border-color", msgColor);
        msgLabel.text("Password is required");
        msgLabel.show();
        return "";
    }
    
    if(input.length < minPasswordLength) {
        inputField.css("border-color", msgColor);
        msgLabel.text(`Password must have a minimum of ${minPasswordLength} characters`);
        msgLabel.show();
        return "";
    }

    if(input.length > maxPasswordLength) {
        inputField.css("border-color", msgColor);
        msgLabel.text(`Password cannot exceed ${maxPasswordLength} characters`);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", validColor);
    msgLabel.hide();
    return input;
}

function validateRecoveryCode(inputField, msgLabel) {
    const input = inputField.val().trim();

    if(!input) {
        inputField.css("border-color", msgColor);
        msgLabel.text("Recovery code is required");
        msgLabel.show();
        return "";
    }

    if(!input.match(/^\d{6}$/)) {
        msgLabel.text("Invalid code format");
        inputField.css("border-color", msgColor);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", validColor);
    msgLabel.hide();
    return input;
}

function setForm(formIndex, resetProceedingForm) {
    if(dynamicPathname && entryForms[formIndex].pathname)
        window.history.replaceState(null, "", entryForms[formIndex].pathname);

    if(resetProceedingForm)
        resetForm(formIndex);
    
    if(entryForms[formIndex].msgLabels)
        entryForms[formIndex].msgLabels.forEach(element => element.hide());

    entryForms.forEach(form => form.formHTML.hide());
    entryForms[formIndex].formHTML.show();

    switch(formIndex) {
        case FORM_SIGN_IN:
            $("#box-remember").prop("checked", false);
            break;
    }
}

function resetForm(formIndex) {
    if(!entryForms[formIndex].inputFields)
        return;

    entryForms[formIndex].inputFields.forEach(element => {
        element.val("");
        element.css("border-color", defaultColor);
    });
}

function showScreenNotification(header, message) {
    $(".screen-notif-header").text(header);
    $(".screen-notif-msg").html(message.replace(/\n/g, "<br>"));
    $(".screen-notif").addClass("show");
}

function connectToDB() {

}

function emailExists(email) {
    return true;
}

function usernameExists(username) {
    return true;
}

function validSignInCredentials(username, password, isUsername) {
    return true;
}

function validRecoveryCode(code, email) {
    return true;
}
