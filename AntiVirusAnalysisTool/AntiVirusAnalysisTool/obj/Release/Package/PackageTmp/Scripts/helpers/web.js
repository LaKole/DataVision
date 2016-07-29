var opt, type, chartTitle, xlab, ylab, version;


$('.btn').click(function () {
    $('.btn').removeClass('btn-success').addClass('btn-info');
    $(this).addClass('btn-success').removeClass('btn-info');
    type = $(this).val();
    updateOptions()
});


$('#startDate, #endDate').datepicker({
    defaultDate: new Date("11/11/2013"),
    beforeShow: customRange,
    dateFormat: "dd/mm/yy",
});


function customRange(input) {

    if (input.id == 'endDate') {
        var minDate = new Date($('#startDate').val());
        if (minDate > new Date("11/11/2013")) {
            minDate.setDate(minDate.getDate() + 1);
        } else { minDate = new Date("11/11/2013"); }

        return { minDate: minDate, maxDate: new Date("12/11/2013") };
    }
    return { minDate: new Date("11/11/2013"), maxDate: new Date("12/11/2013") };
}

$('.tab-panels .tabs li').on('click', showPanel());

function showPanel() {

    var $panel = $(this).closest('.tab-panels');

    $panel.find('.tabs li.active').removeClass('active');
    $(this).addClass('active');

    //figure out which panel to show
    var panelToShow = $(this).attr('data-panelID');

    //hide current panel
    $panel.find('.panel.active').slideUp(300, showNextPanel(panelToShow));

}

//show next panel
function showNextPanel(panelToShow) {

    $(this).removeClass('active');
    $('#' + panelToShow).slideDown(300, function () {
        $(this).addClass('active');
    });


}


function chartOptions(x) {
    var yValue = $('#row');
    if (x === $(yValue).val()) {
        //look for  y axis with same value as x
        var y = $('#row option[value=' + x + ']');
        //make it disabled
        $(y).attr('disabled', 'disabled');
        $(y).siblings().removeAttr('disabled');
        //$('#row').prop('selectedIndex', 1);
        $('#row option:selected').next().prop('selected', true);
    }


}

function getGroupBy(x, y) {
    var z;

    if ((x === "Antivirus" && y === "Scandate") || (x === "Scandate" && y === "Antivirus")) {
        z = "MD5";
    }
    else if ((x === ("Antivirus")) && (y === ("MD5"))) {
        z = "Scandate";
    }
    else if ((x === ("Scandate")) && (y === ("MD5"))) {
        z = "Antivirus";
    }
    console.log(x);
    $('#groupby').val(z);

    return z;
}

function updateOptions() {
    $('[data-chartOp]').attr('id', 'inactiveOp');
    switch (type) {
        case "table":
            console.log(type);
            $('[data-chartOp="matrixOp"]').attr('id', 'chartOptions');
            updateTableOptions();
            break;
        case "other":
            console.log(type);
            $('[data-chartOp="quantOp"]').attr('id', 'chartOptions');
            updateOtherOptions();
            break;
        case "bar":
        case "area":
        case "line":
        default:
            console.log(type);
            $('[data-chartOp="quantOp"]').attr('id', 'chartOptions');
            updateBarOptions();
            break;
    }

    showPanel();
}

function updateBarOptions() {

    var x = $('#keyOp').find(":selected").val();

    var y = $('#xaxisOp').find(":selected").val();

    var z = getGroupBy(x, y);

    var d = $('#detectionOp').find(":selected").val();

    var v = $('#versionOp').find(":selected").val();

    xlab = $('#xaxisOp').find(":selected").text();
    ylab = $('#detectionOp').find(":selected").text();

    chartTitle = $('#chartName').val();


    $('#chart_div').attr('style', 'height:500px');
    $('#pie_div').attr('style', 'display:none');

    opt = { key: x, xaxis: y, measure: z, d: d, v: v };

    console.log('made it');
    getData(type, opt);

}

function updateOtherOptions() {
    var x = $('#column').find(":selected").val();
    chartOptions(x);

    var y = $('#row').find(":selected").val();

    var z = getGroupBy(x, y);

    var d = $('#detection').find(":selected").val();

    var v = $('#version').find(":selected").val();

    xlab = $('#column').find(":selected").text();
    ylab = $('#row').find(":selected").text();


    chartTitle = $('#chartName').val();


    $('#chart_div').attr('style', 'height:500px');
    $('#pie_div').attr('style', 'display:none');

    opt = { column: x, row: y, groupby: z, d: d, v: v };

    console.log(opt);
    getData(type, opt);

}

function updateTableOptions() {
    var x = $('#column').find(":selected").val();
    chartOptions(x);

    var y = $('#row').find(":selected").val();

    var z = getGroupBy(x, y);

    var d = $('#detection').find(":selected").val();

    var v = $('#version').find(":selected").val();


    xlab = $('#column').find(":selected").text();
    ylab = $('#row').find(":selected").text();


    chartTitle = $('#chartName').val();


    $('#chart_div').attr('style', 'height:500px');
    $('#pie_div').attr('style', 'display:none');

    opt = { column: x, row: y, groupby: z, d: d, v: v };

    console.log(opt);
    getData(type, opt);

}







//$(document).ready(function () {
//    $('#filterForm')
//        .formValidation({
//            framework: 'bootstrap',
//            icon: {
//                valid: 'glyphicon glyphicon-ok',
//                invalid: 'glyphicon glyphicon-remove',
//                validating: 'glyphicon glyphicon-refresh'
//            },
//            excluded: ':disabled',
//            fields: {

//                column: {
//                    validators: {
//                        notEmpty: {
//                            message: 'Please select an x-axis'
//                        }
//                    }
//                },
//                row: {
//                    validators: {
//                        notEmpty: {
//                            message: 'Please select a y-axis'
//                        }
//                    }
//                },
//                zaxis: {
//                    validators: {
//                        notEmpty: {
//                            message: 'Please select a z-axis'
//                        }
//                    }
//                },
//                color: {
//                    validators: {
//                        notEmpty: {
//                            message: 'The color is required'
//                        }
//                    }
//                }
//            }
//        })
//        /* Using Combobox for color and size select elements */
//        .find('[name="color"], [name="size"]')
//            .combobox()
//            .end()
//});