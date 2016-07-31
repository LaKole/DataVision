var opt, type, chartTitle, xlab, ylab, version;


$('.btn').on('click', (function () {
    $('.btn').removeClass('btn-success').addClass('btn-info');
    $(this).addClass('btn-success').removeClass('btn-info');
    type = $(this).val();
    updateOptions();
    $('.panel-collapse').collapse("hide");
    //console.log('btn.on.click - web.js');

}));


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

    $('#groupby').val(z);

    return z;
}

function updateOptions() {
    $('[data-chartOp]').attr('id', 'inactiveOp');
    switch (type) {
        case "table":
            //console.log(type + ' - web.js updateOptions');
            $('[data-chartOp="matrixOp"]').attr('id', 'chartOptions');
            updateTableOptions();
            break;
        case "pie":
        case "3dPie":
        case "donutPie":
            //console.log(type + ' - web.js updateOptions');
            $('[data-chartOp="pieOp"]').attr('id', 'chartOptions');
            updatePieOptions();
            break;

        case "other":
            //console.log(type + ' - web.js updateOptions');
            $('[data-chartOp="quantOp"]').attr('id', 'chartOptions');
            updateOtherOptions();
            break;
        case "bar":
        case "area":
        case "line":
        default:
            //console.log(type + ' - web.js updateOptions');
            $('[data-chartOp="quantOp"]').attr('id', 'chartOptions');
            updateBarOptions();
            break;
    }

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
    
    opt = { key: x, xaxis: y, measure: z, d: d, v: v };

    //console.log('options: ' + opt + ' - web.js updateBarOptions');
    getData(type, opt);

}

function updatePieOptions() {

    var x = $('#keyOp').find(":selected").val();

    var y = $('#sliceOp').find(":selected").val();

    var d = $('#detectionOp').find(":selected").val();

    var v = $('#versionOp').find(":selected").val();

    chartTitle = $('#chartName').val();

    opt = { key: x, slice: y, d: d, v: v };

    //console.log('options: ' + opt + ' - web.js updatePieOptions');
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

    //console.log('options: ' + opt + ' - web.js updateOtherOptions');
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

    //console.log('options: ' + opt + ' - web.js updateTableOptions');
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