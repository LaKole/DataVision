var opt, chartType, column, row, dr, al, dfc, dvt, d, f;
//when a chart button is clicked
$('.chartButton').on('click', function () {
    $btn = $(this);
    //change colour
    $btn.removeClass('btn-success').addClass('btn-info');
    $btn.addClass('btn-success').removeClass('btn-info');

    //get selected chart value
    chartType = $btn.val();
    getOptions()
});


function getOptions() {
    getDimensions()
    getFilters()
    console.log('chart = ' + chartType);
    
    if (column === 'version') {
        opt = { row: row, dateRange: dr, avList: al, detection: d, format: f };
    }
    else {
        opt = { column: column, row: row, dateRange: dr, avList: al, dfc: dfc, dvt: dvt };
    }

    console.log(opt);
}

function getDimensions() {
    //get dimension panel

    column = $('#column').find(":selected").val();
    row = $('#row').find(":selected").val();

    console.log('found dim');

}

function getFilters() {
    //get filter panel

    al = $('#antivirusList').val().join(', ');
    dfc = $('#vtd').find(":selected").val();
    dvt = $('#fcd').find(":selected").val();
    d = $('#detection').find(":selected").val();
    f = $('#format').find(":selected").val();

    console.log('found filters');
}

function getDateRange() {
    //
}