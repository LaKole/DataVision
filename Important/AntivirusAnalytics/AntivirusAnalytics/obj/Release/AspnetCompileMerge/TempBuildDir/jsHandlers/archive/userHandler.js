//------------------------------------------------------USER HANDLING-------------------------------------//
jQuery(document).ready(function ($) {
    var formModal = $('.cd-user-modal'),
		formLogin = formModal.find('#cd-login'),
		formSignup = formModal.find('#cd-signup'),
		formForgotPassword = formModal.find('#cd-reset-password'),
		formModalTab = $('.cd-switcher'),
		tabLogin = formModalTab.children('li').eq(0).children('a'),
		tabSignup = formModalTab.children('li').eq(1).children('a'),
		forgotPasswordLink = formLogin.find('.cd-form-bottom-message a'),
		backToLoginLink = formForgotPassword.find('.cd-form-bottom-message a'),
		mainNav = $('.main-nav'),
		    userObject;

    //open modal
    mainNav.on('click', function (event) {
        $(event.target).is(mainNav) && mainNav.children('ul').toggleClass('is-visible');
    });

    //open sign-up form
    mainNav.on('click', '.cd-signup', signup_selected);
    //open login-form form
    mainNav.on('click', '.cd-signin', login_selected);
    //close modal
    formModal.on('click', function (event) {
        if ($(event.target).is(formModal) || $(event.target).is('.cd-close-form')) {
            formModal.removeClass('is-visible');
        }
    });
    //close modal when clicking the esc keyboard button
    $(document).keyup(function (event) {
        if (event.which == '27') {
            formModal.removeClass('is-visible');
        }
    });
    //switch from a tab to another
    formModalTab.on('click', function (event) {
        event.preventDefault();
        ($(event.target).is(tabLogin)) ? login_selected() : signup_selected();
    });
    //hide or show password
    $('.show-password').on('click', function () {
        var togglePass = $(this),
			passwordField = togglePass.prev('input');

        ('password' == passwordField.attr('type')) ? passwordField.attr('type', 'text') : passwordField.attr('type', 'password');
        ('Show' == togglePass.text()) ? togglePass.text('Hide') : togglePass.text('Show');
        //focus and move cursor to the end of input field
        passwordField.putCursorAtEnd();
    });

    function login_selected() {
        mainNav.children('ul').removeClass('is-visible');
        formModal.addClass('is-visible');
        formLogin.addClass('is-selected');
        formSignup.removeClass('is-selected');
        formForgotPassword.removeClass('is-selected');
        tabLogin.addClass('selected');
        tabSignup.removeClass('selected');
    }

    function signup_selected() {
        mainNav.children('ul').removeClass('is-visible');
        formModal.addClass('is-visible');
        formLogin.removeClass('is-selected');
        formSignup.addClass('is-selected');
        formForgotPassword.removeClass('is-selected');
        tabLogin.removeClass('selected');
        tabSignup.addClass('selected');
    }




    //----------------------------------------MY CODE---------------------------------//
    //add functionality for signing out 
    mainNav.on('click', '.cd-signout', signout);

    //---------LOGIN FUNCTIONS--------//
    //VALIDATION
    formLogin.find('.cd-input').on('input', function () {
        //remove warning if it's there
        formLogin.find('.cd-input').removeClass('has-error')
                            .next('span').removeClass('is-visible');


        //check both have text
        if (formLogin.find('#signin-email').val() && formLogin.find('#signin-password').val()) {
            formLogin.find('#signin-button').show();

        } else {
            formLogin.find('#signin-button').hide();
        }
    });

    //ACTION
    formLogin.find('#signin-button').on('click', signin);
    function signin() {
        //console.log('login');

        userObject = {
            Email: formLogin.find('#signin-email').val(),
            Password: formLogin.find('#signin-password').val(),
            RememberMe: formLogin.find('#remember-me').is(':checked')
        };
        //console.log(userObject);

        $.ajax({
            url: '/User/SignIn',
            type: 'POST',
            data: userObject,
            datatype: "json",
            success: function (result) {
                //console.log(result);
                switch (result) {
                    case 'Logged in':
                        //loggedIn();
                        location.reload();
                        break;
                    default:
                        formLogin.find('.cd-input').addClass('has-error')
                            .next('span').addClass('is-visible');
                        //console.log(result);
                        break;
                }
            }
        });
    }


    //----------SIGNUP FUNCTIONS-----------//
    //VALIDATION
    formSignup.find('.cd-input').on('input', checkInput);
    function checkInput() {

        //remove warning if there
        formSignup.find('.cd-input').removeClass('has-error')
                            .next('span').removeClass('is-visible');

        confText = formSignup.find('#signup-passwordconfirm');
        passText = formSignup.find('#signup-password');
        signupButton = formSignup.find('#signup-button');


        if (passText.val() && confText.val() && formSignup.find('#signup-email').val()) {

            confText.removeClass('has-border');
            passText.removeClass('has-border');

            if (passText.val() === confText.val()) {
                confText.removeClass('has-error').addClass('has-success');
                passText.addClass('has-success');

                //allow register
                signupButton.show();
            }
            else {
                passText.addClass('has-border').removeClass('has-success');
                confText.addClass('has-error').removeClass('has-success');
                //hide register
                signupButton.hide();
            }
        } else { signupButton.hide(); }

    }

    //ACTION
    formSignup.find('#signup-button').on('click', register);
    function register() {
        //console.log('register');

        userObject = { Email: $('#signup-email').val(), Password: $('#signup-password').val() };
        //console.log(userObject);

        $.ajax({
            url: '/User/Register',
            type: 'POST',
            data: userObject,
            datatype: "json",
            success: function (result) {
                //console.log(result);
                switch (result) {
                    case 'Registered':
                        //loggedIn();
                        location.reload();
                        break;
                    default:
                        formSignup.find('#signup-email').addClass('has-error')
                            .next('span').addClass('is-visible');
                        //console.log(result);
                        break;
                }
            }
        });

    }


    //LOGGED IN LOGIC
    function loggedIn() {
        //hide form
        formModal.removeClass('is-visible')

        //greet
        mainNav.find('#greeting').text('Hi, ' + userObject.Email);

        //nav options
        mainNav.find('#u-signedin').show();
        mainNav.find('#u-signedout').hide();

        //show history tab
        $('#historyTab').show();
    }

    //SIGNOUT LOGIC
    function signout() {

        //logout method
        $.ajax({
            url: '/User/SignOut',
            type: 'POST',
            data: userObject,
            datatype: "json",
            success: function (result) {
                location.reload();
            }
        });
        //$('#u-signedin').hide();
        //$('#u-signedout').show();

        ////hide history tab
        //$('#historyTab').hide();
    }

    //----------------------USER HISTORY-------------------------//

    $('#selectionTab li').on('click', function () {
        if (this.id === "historyTab") {
            $('#creationArea').hide();
            $('#historyArea').show();

            loadHistory();
        } else {
            $('#historyArea').hide();
            $('#creationArea').show();
        }

    });

    

    //-----------------------------------------------------------------------------------//

    //IE9 placeholder fallback
    //credits http://www.hagenburger.net/BLOG/HTML5-Input-Placeholder-Fix-With-jQuery.html
    if (!Modernizr.input.placeholder) {
        $('[placeholder]').focus(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        }).blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.val(input.attr('placeholder'));
            }
        }).blur();
        $('[placeholder]').parents('form').submit(function () {
            $(this).find('[placeholder]').each(function () {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            })
        });
    }

});


//---------------------------------------------------USER HISTORY CONTINUED-----------------------------------//


function deleteImage($this) {
    var ci = $($this).closest('td').prev('td').text();
    //popup confirm

    //action
    $.ajax({
        url: '/Home/DeleteHistory',
        type: 'POST',
        data: { id: ci },
        success: function (result) {
            loadHistory();
        },
        error: function (result, error) {
            console.log(error);
        }
    });

}

function recreateImage($this) {

    var ci = $($this).closest('td').prev('td').text();
    var ct = $($this).closest('td').next('td').text();

    $.ajax({
        url: '/Visual/Regenerate',
        type: 'POST',
        data: { id: ci },
        beforeSend: function(){            
            startProgressTimer(16);
        },
        complete: function () {
            $('#progress-timer-container').hide();
        },
        success: function (result) {
            drawReg(result, ct)
        },
        error: function (result, error) {
            console.log(error);
        }
    });

}

function loadHistory() {
    $.ajax({
        url: '/Home/History',
        type: 'POST',
        success: function (result) {
            $("#historyArea").html(result);
            //location.reload();
        },
        error: function (result, error) {

        }
    });
}

var regenerateModal = $('.reg-modal');


regenerateModal.on('click', function (event) {

    if ($(event.target).is(regenerateModal) || $(event.target).is('.reg-modal-close')) {
        regenerateModal.removeClass('is-visible');
    }
});


function drawReg(result, ct) {

    genericDraw(result, ct, true);
    $('#hide-at-start').show();
    regenerateModal.addClass('is-visible');

}


//---------------------------------------------------USER HISTORY END-----------------------------------//


//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function () {
    return this.each(function () {
        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;
            this.focus();
            this.setSelectionRange(len, len);
        } else {
            // ... otherwise replace the contents with itself
            // (Doesn't work in Google Chrome)
            $(this).val($(this).val());
        }
    });
};