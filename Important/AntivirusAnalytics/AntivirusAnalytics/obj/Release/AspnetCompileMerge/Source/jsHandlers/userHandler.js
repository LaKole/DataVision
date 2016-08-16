//-----------------------------------------------PAGE HANDLING---------------------------------------//
var opt, column, row, dr, al, dfc, dvt, d, f, chartTitle, currentTab, selectedChart, ctProper, isPie,
    filterPanel = $('#panelOptions'),
    chartButtons = $('#cb-list li');

//----------------DATE PICKERS----------------//
$('.date').datepicker({
    beforeShow: customRange,
    dateFormat: "yy/mm/dd"
});

//set default date entries
$('#startDate').datepicker('setDate', new Date("11/11/2013"));
$('#endDate').datepicker('setDate', new Date("12/11/2013"));

//hide datapicker on mouse leave
$('.ui-datepicker').on('mouseleave', function () { $('.date').datepicker('hide').blur(); })

//set custom date picker range
function customRange(input) {

    if (input.id == 'endDate') {
        var minDate = new Date($('#startDate').val());
        minDate.setDate(minDate.getDate() + 1);
        return { minDate: minDate, maxDate: new Date("12/11/2013") };
    }
    else {
        return { minDate: new Date("11/11/2013"), maxDate: new Date("12/11/2013") };
    }
}

//get valid range
function validRange() {
    var start = new Date($('#startDate').val());
    var end = new Date($('#endDate').val());

    if (start > end) {
        end = new Date(Date.parse(start));
        $('#endDate').datepicker('setDate', end);
    }
}


//--------------------MULTISELECT----------------------//
filterPanel.find('#antivirusList').multiselect();

//at least one av must be selected
filterPanel.find('#antivirusList').multiselect({
    beforeclose: function (e) {
        if ($(this).multiselect("widget").find("input:checked").length < 1) {
            console.log("You must choose at least ONE antivirus!");
            alert("You must choose at least ONE antivirus!");
            return false;
        }
    }
});

//---------------------PROGRESS TIMER SETUP------------------//
function startProgressTimer(x) {

    $('#progress-timer-container').show()
    $('#progressTimer').progressTimer({
        timeLimit: x,
        warningThreshold: 50,
        baseStyle: 'progress-bar-warning',
        warningStyle: 'progress-bar-warning',
        completeStyle: 'progress-bar-success',
        onFinish: function () {
        }
    });

}

//start at all
currentTab = 'all';
filterHandler();

//-----------------------------------TAB SELECTION----------------------------//
//tab changing
$('#selectionTab li').on('click', showTabCharts);

function showTabCharts() {

    currentTab = this.id;
    chartClass = '.' + currentTab;
    chartButtons.show();
    chartButtons.not(chartClass).hide();
    selectedChart = null;

}

//----------------------------------CHART SELECTION---------------------------//
//set selected chart to first available

chartButtons.on('click', function () {
    selectedChart = this.id;
    ctProper = $(this).find('a').html();

    //console.log(selectedChart);

    if (selectedChart.toLowerCase().indexOf("pie") >= 0) {
        isPie = true;
    } else {
        isPie = false;
    }

    filterHandler();
    //console.log(currentTab);
});


//----------------------------------FILTER OPTIONS-------------------------------//

filterPanel.find('#column').on('change', filterHandler);

function filterHandler() {

    var column = filterPanel.find('#column').find(':selected').val();
    if (currentTab != '2d' && isPie === false) {
        filterPanel.find('#avVersion').hide();
        filterPanel.find('#dataMeasure').show();

        if (column === 'version') {
            //remove md5 from row options
            md5Option = filterPanel.find('#row option[value=md5]');
            md5Option.prop('disabled', true);
            md5Option.siblings().prop('disabled', false);
            //hide matrix detection options and show version detection options
            filterPanel.find('#matrixDetection').hide();
            filterPanel.find('#versionDetection').show();


        } else {

            var rowOption = filterPanel.find('#row option[value=' + column + ']')
            rowOption.prop('disabled', true);
            rowOption.siblings().prop('disabled', false);
            //hide version detection options and show matrix detection options
            filterPanel.find('#matrixDetection').show();
            filterPanel.find('#versionDetection').hide();
        }
        //select next available option
        filterPanel.find('#row').children('option:enabled').eq(0).prop('selected', true);
    }
    else {

        filterPanel.find('#column option[value=scandate]').prop('disabled', true);

        //hide matrix detection options and show version detection options
        filterPanel.find('#matrixDetection').hide();
        filterPanel.find('#dataMeasure').hide();
        filterPanel.find('#versionDetection').show();

        if (column === 'version') {
            filterPanel.find('#avVersion').hide();
        } else {
            filterPanel.find('#avVersion').show();
        }

    }

}

function getOptions() {

    column = filterPanel.find('#column').find(':selected').val();
    row = filterPanel.find('#row').find(':selected').val();
    al = filterPanel.find('#antivirusList').val().join(', ');
    dfc = filterPanel.find('#vtd').find(':selected').val();
    dvt = filterPanel.find('#fcd').find(':selected').val();
    d = filterPanel.find('#detection').find(':selected').val();
    f = filterPanel.find('#format').find(':selected').val();
    getDateRange();
    var method;
    //may be unnecessary

    if (currentTab === '2d' || isPie === true) {

        var vers = $('#version').find(':selected').val();
        opt = { key: column, version: vers, dateRange: dr, avList: al, detection: d, format: f, chartType: selectedChart, ctProper: ctProper };
        method = 0;
    }

    else {
        if (column === 'version') {
            opt = { row: row, dateRange: dr, avList: al, detection: d, format: f, chartType: selectedChart, ctProper: ctProper };
            method = 1;
        }
        else {
            opt = { column: column, row: row, dateRange: dr, avList: al, dfc: dfc, dvt: dvt, chartType: selectedChart, ctProper: ctProper };
            method = 2;
        }

    }
    if (selectedChart != null) {

        chart(opt, method);
    } else {
        $('#no-chart-alert').show();
    }
    chartTitle = filterPanel.find('#chartName').val();
}

function resetAlert() {

    $('#no-chart-alert').hide();
}

function getDateRange() {

    var start = filterPanel.find('#startDate').val();
    var end = filterPanel.find('#endDate').val();

    dr = "'" + start + "' and '" + end + "'";
}

//-----------------------------------------------------CHART HANDLING--------------------------------------//
google.charts.load('current', { 'packages': ['corechart', 'line', 'treemap', 'table', 'bar'] });
google.charts.setOnLoadCallback();

var chart_div, uri;

ajaxPendingRequests = new Array();
function abortPendingRequests() {
    if (ajaxPendingRequests.length > 0) {
        ajaxPendingRequests.forEach(function (req) {
            req.abort();
            ajaxPendingRequests.pop(req);
        });
    }
}


function chart(querySet, method) {
    var url;

    switch (method) {
        case 0:
            url = '/Visual/GetPie';
            break;
        case 1:
            url = '/Visual/GetVersion';
            break;
        case 2:
            url = '/Visual/GetMatrix';
            break;
    }

    var ajReq = $.ajax({
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(querySet),
        contentType: "application/json",
        url: url,
        beforeSend:
            function () {
                abortPendingRequests();
                ajaxPendingRequests.push(this);
                startProgressTimer(16);
            },
        complete:
            function () {
                ajaxPendingRequests.pop(this);
                $('#progress-timer-container').hide();
            },
        success: function (result) {
            genericDraw(result, querySet.chartType, false);
        },
        error: function () {
            console.log('unable to get data  - chart.js getdata ');
            ajaxPendingRequests.pop(this);
            $('#progress-timer-container').hide();
        }
    });


}

function genericDraw(result, type, isRegenerated) {

    var data = new google.visualization.DataTable(result);
    var options = {
        title: chartTitle,
        chartArea: { left: 45, top: 30, width: "70%", height: "85%" },
        backgroundColor: { fill: 'none' }
    };

    if (isRegenerated) {
        chart_div = document.getElementById('reg_div')
    }
    else {
        chart_div = document.getElementById('chart_div');
    }

    switch (type) {
        case "area":
        case "stackedArea":

            if (type === "stackedArea")
            { options.isStacked = true; }

            var chart = new google.visualization.AreaChart(chart_div);

            break;
        case "bar":
        case "stackedBar":

            if (type === "stackedBar")
            { options.isStacked = true; }

            var chart = new google.visualization.BarChart(chart_div);

            break;
        case "column":
        case "stackedColumn":

            if (type === "stackedColumn")
            { options.isStacked = true; }

            var chart = new google.visualization.ColumnChart(chart_div);
            break;
        case "line":

            var chart = new google.visualization.LineChart(chart_div);

            break;
        case "pie":
        case "3dPie":
        case "donutPie":

            options.chartArea = { left: 100, top: 20, width: "100%", height: "100%" };
            switch (type) {
                case "3dPie":
                    options.is3D = true;
                    break;
                case "donutPie":
                    options.pieHole = 0.4;
                    break;
            }

            var chart = new google.visualization.PieChart(chart_div);

            break;
        case "table":
            drawTable(result);
            break;
        default:
            //console.log('no selection made - chart.js drawChart');
            type = 'none';
            break;
    }

    if (type != 'table' && type != 'none') {

        if (!isRegenerated) {
            //add printable image
            google.visualization.events.addListener(chart, 'ready', function () {
                $('#png').show().html('<a href="' + chart.getImageURI() + '">Printable Image</a>');
            });
        }

        chart.draw(data, options);
    }
}


function drawTable(result) {

    var data = new google.visualization.DataTable(result);

    var options = { width: '100%', height: '100%' };

    var table = new google.visualization.Table(chart_div);


    google.visualization.events.addListener(table, 'ready', function () {
        $('#png').hide();
    });

    table.draw(data, options);
}





//----------------------------------------TEST METHODS------------------------------//
function drawChart(result, type) {


    switch (type) {
        case "area":
        case "stackedArea":
            drawAreaChart(result, type);
            break;
        case "bar":
        case "stackedBar":
            drawBarChart(result, type);
            break;
        case "column":
        case "stackedColumn":
            drawColumnChart(result, type);
            break;
        case "line":
            drawLineChart(result);
            break;
        case "pie":
        case "3dPie":
        case "donutPie":
            drawPieChart(result, type);
            break;
        case "table":
            drawTable(result);
            break;
        default:
            console.log('no selection made - chart.js drawChart');
            break;
    }

}



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