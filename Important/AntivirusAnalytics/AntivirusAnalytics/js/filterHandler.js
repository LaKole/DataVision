
//maybe move to on script

var opt, column, row, dr, al, dfc, dvt, d, f, chartTitle,
    filterPanel = $('panelOptions');




function getOptions() {

    column = filterPanel.find('#column').find(":selected").val();
    row = filterPanel.find('#row').find(":selected").val();
    al = filterPanel.find('#antivirusList').val().join(', ');
    dfc = filterPanel.find('#vtd').find(":selected").val();
    dvt = filterPanel.find('#fcd').find(":selected").val();
    d = filterPanel.find('#detection').find(":selected").val();
    f = filterPanel.find('#format').find(":selected").val();
    getDateRange();

    //may be unnecessary

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
}


function getDateRange() {

    var start = $('#startDate').val();
    var end = $('#endDate').val();

    dr = "'" + start + "' and '" + end + "'";
}

//call another script
chart(opt, chartType);