$(function () {

    $('#loginLink').click(function (e) {
        $("#login").delay(100).fadeIn(100);
        $("#register").fadeOut(100);
        $('#registerLink').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#registerLink').click(function (e) {
        $("#register").delay(100).fadeIn(100);
        $("#login").fadeOut(100);
        $('#loginLink').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

});
