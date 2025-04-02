export function init() {
    $(document).on("click", "#button-screen-notif0", () => $(".screen-notif").removeClass("show"));
}

export function showScreenNotification(header, message, buttonText, callback) {
    $("#screen-notif-prompt .screen-notif-header").text(header);
    $("#screen-notif-prompt .screen-notif-msg").html(message.replace(/\n/g, "<br>"));
    $("#screen-notif-prompt #button-screen-notif0").text(buttonText);

    if(callback)
        $("#button-screen-notif0").off("click").click(() => callback());

    $("#screen-notif-prompt").addClass("show");
}