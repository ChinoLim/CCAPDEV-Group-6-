import * as cookies from "./cookies.js";
import * as defaults from "./defaults.js";
import * as protocol from "./protocol.js";
import * as screenNotif from "./screen-notif.js";

const msgColor = "#FA4454";
const defaultColor = "#555555";
const validColor = "#39CE86";

let enterPressed = false;

$(document).ready(init);

function init() {
    initCallbacks();
    screenNotif.init();
}

function initCallbacks() {
    $(document).click(documentCallback);
    $("#icon-name").click(iconNameCallback);
    $("#button-profile").click(buttonProfileCallback);
    $("#dpm-sign-in").click(dropdownSignInCallback);
    $("#dpm-sign-out").click(dropdownSignOutCallback);
    $("#dpm-delete-account").click(dropdownDeleteAccountCallback);
    $("#dpm-view-portfolio").click(dropdownViewPortfolioCallback);
    $("#dpm-edit-portfolio").click(dropdownEditPortfolioCallback);

    $(document.querySelectorAll(".button-password-reveal")).each((obj, button) => {
        $(button).on("mousedown touchstart", function() {
            $(this).parent().find(".input-password, .input-password-confirm").attr("type", "text");
        });
    
        $(button).on("mouseup touchend mouseleave touchcancel", function() {
            $(this).parent().find(".input-password, .input-password-confirm").attr("type", "password");
        });
    });
}

function documentCallback() {
    const profileSearch = $("#profile-search");

    profileSearch.keydown(async function(event) {
        if((event.key === "Enter" || event.keyCode === 13) && !enterPressed) {
            event.preventDefault();
            enterPressed = true;
            const inputUsername = $(this).val();

            if(await protocol.usernameExists(inputUsername)) {
                $(this).css("border-color", validColor);
                window.location.href = `/${inputUsername}`;
            } else {
                $(this).css("border-color", msgColor);
            }
        }
    });
    
    profileSearch.keyup((event) => {
        enterPressed = event.key === "Enter" || event.keyCode === 13;
    });

    const button = $("#button-profile");
    const menu = $(".profile-menu");

    if(menu.is(":visible") && !menu.is(event.target) && menu.has(event.target).length === 0 &&
       !button.is(event.target) && button.has(event.target).length === 0) {
        menu.hide();
    }
}

function iconNameCallback() {
    window.location.href = `/`;
}

function buttonProfileCallback() {
    const button = $(this);
    const menu = $(cookies.cookieExists("sessionToken") ?
        ".profile-menu-onaccount" :
        ".profile-menu-noaccount"
    );

    const offset = button.offset();

    menu.css({
        top: offset.top + button.outerHeight() + 15,
        left: offset.left - menu.outerWidth() + button.outerWidth()
    });

    menu.toggle();
}

function dropdownSignInCallback() {
    window.location.href = `/account/entry`;
}

function dropdownSignOutCallback() {
    cookies.deleteCookie("username");
    cookies.deleteCookie("password");
    cookies.deleteCookie("sessionToken");

    window.location.href = `/account/entry`;
}

function dropdownDeleteAccountCallback() {
    $("#screen-notif-input-password .screen-notif-header").text("Delete Account");
    $("#screen-notif-input-password .screen-notif-msg").html("Are you sure you want to delete your account?<br>This action can not be reverted.");
    $("#button-screen-notif2").text("DELETE");
    $("#button-screen-notif2").css("background-color", "#FA4454");
    $(".label-password-msg").hide();
    
    const labelPasswordMsg = $(".label-password-msg");
    const inputPassword = $("#screen-input-field-password");

    inputPassword.css("border-color", defaults.defaultColor);
    inputPassword.val("");

    $("#button-screen-notif2").off().hover(
        function () {$(this).css("background-color", "#D33F4C");},
        function () {$(this).css("background-color", "#FA4454");}
    );

    $("#button-screen-notif1").off("click").click(() => {
        $("#screen-notif-input-password").removeClass("show");
    });

    $("#button-screen-notif2").off("click").click(async () => {
        const password = validatePassword(inputPassword, labelPasswordMsg, inputPassword.val());

        if(!password)
            return;

        try {
            const formalUsernames = await protocol.getFormalUsernames(cookies.getCookie("sessionToken"));

            if(!(await protocol.signIn(formalUsernames.username, password, true))) {
                inputPassword.css("border-color", defaults.msgColor);
                labelPasswordMsg.text("Password is incorrect").show();
                return;
            }
        } catch(error) {
            $(".label-password-msg").hide();
            $("#screen-notif-input-password").removeClass("show");
            screenNotif.showScreenNotification("Delete Account", "Failed to delete account. Try again later.", "OKAY");
            return;
        }

        if(!(await protocol.deleteAccount(password))) {
            $(".label-password-msg").hide();
            $("#screen-notif-input-password").removeClass("show");
            screenNotif.showScreenNotification("Delete Account", "Failed to delete account. Try again later.", "OKAY");
            return;
        }

        $(".label-password-msg").hide();
        $("#screen-notif-input-password").removeClass("show");

        screenNotif.showScreenNotification("Delete Account", "Account has successfully been deleted.", "OKAY", () => {
            window.location.href = `/account/entry`;
        });
    });

    $("#screen-notif-input-password").addClass("show");
}

async function dropdownViewPortfolioCallback() {
    const formalUsernames = await protocol.getFormalUsernames(cookies.getCookie("sessionToken"));
    
    if(!!formalUsernames) {
        window.location.href = `/${formalUsernames.username}`;
    }
}

async function dropdownEditPortfolioCallback() {
    const formalUsernames = await protocol.getFormalUsernames(cookies.getCookie("sessionToken"));
    
    if(!!formalUsernames) {
        window.location.href = `/${formalUsernames.username}/edit`;
    }
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