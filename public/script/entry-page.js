import * as cookies from "./cookies.js";
import * as defaults from "./defaults.js";
import * as protocol from "./protocol.js";
import * as screenNotif from "./screen-notif.js";

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

$(document).ready(init);

function init() {
    initDOMTags();
    initCallbacks();
    screenNotif.init();

    setForm(FORM_SIGN_IN, true);

    initCookies();
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
            tag.find(".input-display-name"),
            tag.find(".input-password"),
            tag.find(".input-password-confirm")
        ],
        [
            tag.find(".label-email-msg"),
            tag.find(".label-username-msg"),
            tag.find(".label-display-name-msg"),
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

    $(document.querySelectorAll(".button-password-reveal")).each((obj, button) => {
        $(button).on("mousedown touchstart", function() {
            $(this).parent().find(".input-password, .input-password-confirm").attr("type", "text");
        });
    
        $(button).on("mouseup touchend mouseleave touchcancel", function() {
            $(this).parent().find(".input-password, .input-password-confirm").attr("type", "password");
        });
    });
}

function initCookies() {
    let formIndex = FORM_SIGN_IN;

    let username = cookies.getCookie("username");
    let password = cookies.getCookie("password");

    if(username && password) {
        entryForms[formIndex].inputFields[0].val(username);
        entryForms[formIndex].inputFields[1].val(password);
    }

    /* Debug Credentials
    entryForms[FORM_SIGN_UP].inputFields[0].val("test@gmail.com");
    entryForms[FORM_SIGN_UP].inputFields[1].val("test");
    entryForms[FORM_SIGN_UP].inputFields[2].val("Test");
    entryForms[FORM_SIGN_UP].inputFields[3].val("1239012390");
    entryForms[FORM_SIGN_UP].inputFields[4].val("1239012390");

    entryForms[FORM_SIGN_IN].inputFields[0].val("test");
    entryForms[FORM_SIGN_IN].inputFields[1].val("1239012390");
    */
}

async function signUpCallback() {
    const formIndex = FORM_SIGN_UP;
    let invalid = false;

    const inputEmail = entryForms[formIndex].inputFields[0];
    const inputUsername = entryForms[formIndex].inputFields[1];
    const inputDisplayName = entryForms[formIndex].inputFields[2];
    const inputPassword = entryForms[formIndex].inputFields[3];
    const inputPasswordConfirm = entryForms[formIndex].inputFields[4];

    const labelEmailMsg = entryForms[formIndex].msgLabels[0];
    const labelUsernameMsg = entryForms[formIndex].msgLabels[1];
    const labelDisplayNameMsg = entryForms[formIndex].msgLabels[2];
    const labelPasswordMsg = entryForms[formIndex].msgLabels[3];
    const labelPasswordConfirmMsg = entryForms[formIndex].msgLabels[4];

    const email = validateEmail(inputEmail, labelEmailMsg);

    if(email && await protocol.emailExists(email)) {
        inputEmail.css("border-color", defaults.msgColor);
        labelEmailMsg.text("Email is already registered");
        labelEmailMsg.show();
        invalid |= true;
    }

    const username = validateUsername(inputUsername, labelUsernameMsg);

    if(username && await protocol.usernameExists(username)) {
        inputUsername.css("border-color", defaults.msgColor);
        labelUsernameMsg.text("Username is already taken");
        labelUsernameMsg.show();
        invalid |= true;
    }

    const displayName = validateDisplayName(inputDisplayName, labelDisplayNameMsg);

    invalid |= !displayName;
    
    const password = validatePassword(inputPassword, labelPasswordMsg, inputPassword.val());
    const passwordConfirm = validatePassword(inputPasswordConfirm, labelPasswordConfirmMsg, inputPasswordConfirm.val());

    if((password && passwordConfirm) && (password != passwordConfirm)) {
        labelPasswordMsg.text("Password mismatch");
        labelPasswordConfirmMsg.text("Password mismatch");

        inputPassword.css("border-color", defaults.msgColor);
        inputPasswordConfirm.css("border-color", defaults.msgColor);

        labelPasswordMsg.show();
        labelPasswordConfirmMsg.show();
        return;
    }

    if(invalid || !email || !username || !displayName || !password || !passwordConfirm)
        return;

    labelEmailMsg.hide();
    labelUsernameMsg.hide();
    labelDisplayNameMsg.hide();

    if(!(await protocol.signUp(email, username, displayName, password))) {
        screenNotif.showScreenNotification("Sign Up Failed", "Failed to sign up. Try again later.", "OKAY");
        return;
    }

    const signInResponse = await protocol.signIn(username, password, true);

    if(!signInResponse) {
        screenNotif.showScreenNotification("Sign In Failed", "Account created but failed to sign in. Try again later.", "OKAY");
        return;
    }

    cookies.setCookie("sessionToken", signInResponse, 999999);

    window.location.href = `/`;
    resetForm(formIndex);
}

async function signInCallback() {
    const formIndex = FORM_SIGN_IN;

    let username, password, invalid = false;

    const inputUsername = entryForms[formIndex].inputFields[0];
    const inputPassword = entryForms[formIndex].inputFields[1];

    const labelUsernameMsg = entryForms[formIndex].msgLabels[0];
    const labelPasswordMsg = entryForms[formIndex].msgLabels[1];

    const isUsername = !inputUsername.val().trim().includes("@");

    if(isUsername) {
        username = validateUsername(inputUsername, labelUsernameMsg);

        if(username && !(await protocol.usernameExists(username))) {
            inputUsername.css("border-color", defaults.msgColor);
            labelUsernameMsg.text("Username does not exist");
            labelUsernameMsg.show();
            invalid |= true;
        }
    } else {
        username = validateEmail(inputUsername, labelUsernameMsg);

        if(username && !(await protocol.emailExists(username))) {
            inputUsername.css("border-color", defaults.msgColor);
            labelUsernameMsg.text("Email is not registered");
            labelUsernameMsg.show();
            invalid |= true;
        }
    }

    password = validatePassword(inputPassword, labelPasswordMsg, inputPassword.val());

    let signInResponse;

    if(password) {
        signInResponse = await protocol.signIn(username, password, isUsername);
        
        if(!signInResponse) {
            inputPassword.css("border-color", defaults.msgColor);
            labelPasswordMsg.text("Password is incorrect").show();
            invalid |= true;
        }
    }

    if(invalid || !username || !password)
        return;

    labelUsernameMsg.hide();
    labelPasswordMsg.hide();

    const rememberMe = $("#box-remember").prop("checked");

    if(rememberMe) {
        cookies.setCookie("username", username, 999999);
        cookies.setCookie("password", password, 999999);
    }

    cookies.setCookie("sessionToken", signInResponse, 999999);

    window.location.href = `/`;
    resetForm(formIndex);
}

async function proceedToRecoveryCodeCallback() {
    const formIndex = FORM_PASSWORD_RECOVERY_EMAIL;

    const inputEmail = entryForms[formIndex].inputFields[0];
    const labelEmailMsg = entryForms[formIndex].msgLabels[0];

    const email = validateEmail(inputEmail, labelEmailMsg);

    if(!email)
        return;

    if(email && !(await protocol.emailExists(email))) {
        inputEmail.css("border-color", defaults.msgColor);
        labelEmailMsg.text("Email is not registered");
        labelEmailMsg.show();
        return;
    }

    recoveryEmail = email;
    labelEmailMsg.hide();

    await protocol.startRecoveryProcess(email);

    setForm(FORM_PASSWORD_RECOVERY_CODE, true);
}

async function proceedToNewPasswordCallback() {
    const formIndex = FORM_PASSWORD_RECOVERY_CODE;

    const inputCode = entryForms[formIndex].inputFields[0];
    const labelCodeMsg = entryForms[formIndex].msgLabels[0];

    const code = validateRecoveryCode(inputCode, labelCodeMsg);

    if(!code)
        return;

    if(code && !(await protocol.validRecoveryCode(recoveryEmail, code))) {
        inputCode.css("border-color", defaults.msgColor);
        labelCodeMsg.text("Recovery code is incorrect");
        labelCodeMsg.show();
        return;
    }

    labelCodeMsg.hide();

    setForm(FORM_PASSWORD_RECOVERY_NEW, true);
}

async function changePasswordCallback() {
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

        inputPassword.css("border-color", defaults.msgColor);
        inputPasswordConfirm.css("border-color", defaults.msgColor);

        labelPasswordMsg.show();
        labelPasswordConfirmMsg.show();
        return;
    }

    if(!password || !passwordConfirm)
        return;

    if(!(await protocol.changePassword(recoveryEmail, password))) {
        screenNotif.showScreenNotification("Password Change Failed", "Failed to change password. Try again later.", "OKAY");
        return;
    }

    setForm(FORM_PASSWORD_RECOVERY_SUCCESS, true);
}

function validateEmail(inputField, msgLabel) {
    const input = inputField.val().trim().toLowerCase();

    if(!input) {
        msgLabel.text("Email is required");
        inputField.css("border-color", defaults.msgColor);
        msgLabel.show();
        return "";
    }

    if(!input.match(defaults.emailRegex)) {
        msgLabel.text("Invalid email address format");
        inputField.css("border-color", defaults.msgColor);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", defaults.validColor);
    msgLabel.hide();
    return input;
}

function validateUsername(inputField, msgLabel) {
    const input = inputField.val().trim();

    if(!input) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text("Username is required");
        msgLabel.show();
        return "";
    }

    if(input.length < defaults.minUsernameLength) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text(`Username must have a minimum of ${defaults.minUsernameLength} characters`);
        msgLabel.show();
        return "";
    }

    if(input.length > defaults.maxUsernameLength) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text(`Username cannot exceed ${defaults.maxUsernameLength} characters`);
        msgLabel.show();
        return "";
    }

    if(!input.match(defaults.usernameRegex)) {
        msgLabel.text("Invalid username format");
        inputField.css("border-color", defaults.msgColor);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", defaults.validColor);
    msgLabel.hide();
    return input;
}

function validateDisplayName(inputField, msgLabel) {
    const input = inputField.val().trim();

    if(!input) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text("Display name is required");
        msgLabel.show();
        return "";
    }

    if(input.length < defaults.minUsernameLength) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text(`Display name must have a minimum of ${defaults.minDisplayNameLength} characters`);
        msgLabel.show();
        return "";
    }

    if(input.length > defaults.maxUsernameLength) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text(`Display name cannot exceed ${defaults.maxDisplayNameLength} characters`);
        msgLabel.show();
        return "";
    }

    if(!input.match(defaults.displayNameRegex)) {
        msgLabel.text("Invalid display name format");
        inputField.css("border-color", defaults.msgColor);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", defaults.validColor);
    msgLabel.hide();
    return input;
}

function validatePassword(inputField, msgLabel, input) {
    if(!input) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text("Password is required");
        msgLabel.show();
        return "";
    }
    
    if(input.length < defaults.minPasswordLength) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text(`Password must have a minimum of ${defaults.minPasswordLength} characters`);
        msgLabel.show();
        return "";
    }

    if(input.length > defaults.maxPasswordLength) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text(`Password cannot exceed ${defaults.maxPasswordLength} characters`);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", defaults.validColor);
    msgLabel.hide();
    return input;
}

function validateRecoveryCode(inputField, msgLabel) {
    const input = inputField.val().trim();

    if(!input) {
        inputField.css("border-color", defaults.msgColor);
        msgLabel.text("Recovery code is required");
        msgLabel.show();
        return "";
    }

    if(!input.match(/^\d{6}$/)) {
        msgLabel.text("Invalid code format");
        inputField.css("border-color", defaults.msgColor);
        msgLabel.show();
        return "";
    }

    inputField.css("border-color", defaults.validColor);
    msgLabel.hide();
    return input;
}

function setForm(formIndex, resetProceedingForm) {
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
        element.css("border-color", defaults.defaultColor);
    });
}