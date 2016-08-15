var opt, chartType, column, row, dr, al, dfc, dvt, d, f, chartTitle, xlab, ylab;
//when a chart button is clicked
$('.chartButton').on('click', function () {
    $btn = $(this);

    //change colour
    $btn.siblings().removeClass('btn-success').addClass('btn-info');
    $btn.addClass('btn-success').removeClass('btn-info');


    //get selected chart value
    chartType = $btn.val();
    getOptions()

});



function getOptions() {


    column = $('#column').find(":selected").val();
    row = $('#row').find(":selected").val();
    al = $('#antivirusList').val().join(', ');
    dfc = $('#vtd').find(":selected").val();
    dvt = $('#fcd').find(":selected").val();
    d = $('#detection').find(":selected").val();
    f = $('#format').find(":selected").val();
    getDateRange();

    if (u === 'p') {
        var vers = $('#version').find(":selected").val();
        opt = { row: row, version: vers, dateRange: dr, avList: al, detection: d, format: f };
    }
    else {
        if (column === 'version') {
            u = 'v';
            opt = { row: row, dateRange: dr, avList: al, detection: d, format: f };
        }
        else {
            u = 'm';
            opt = { column: column, row: row, dateRange: dr, avList: al, dfc: dfc, dvt: dvt };
        }

    }

    chartTitle = $('#chartName').val();
    xlab = $('#column').find(":selected").text();
    ylab = $('#row').find(":selected").text();

    chart(opt, chartType);
}


function getDateRange() {

    var start = $('#startDate').val();
    var end = $('#endDate').val();

    dr = "'" + start + "' and '" + end + "'";
}

//reset button and chart options
changeTab()

function changeTab(v) {
    chartType = 'table';
    u = 'm';
    $('.chartButton').removeClass('btn-success').addClass('btn-info');


    if (v === 'pie') {
        u = 'p';
        //remove md5 from row options
        $('#row option[value=md5]').prop('disabled', true);
        $('#row option[value=scandate]').prop('disabled', true);

        //enable disabled siblings
        $('#row option[value=md5]').siblings().prop('disabled', false);

        //select next available option
        $('#row').children('option:enabled').eq(0).prop('selected', true);

        //hide matrix detection options and show version detection options
        $('#vd').show();

        $('.np').hide();

    }
    else {
        u = '';
        //enable md5 from row options
        $('#row option[value=md5]').prop('disabled', false);
        $('#row option[value=scandate]').prop('disabled', false);

        //hide matrix detection options and show version detection options
        $('.np').show();

        fieldOptions()

    }

    getOptions();

}

