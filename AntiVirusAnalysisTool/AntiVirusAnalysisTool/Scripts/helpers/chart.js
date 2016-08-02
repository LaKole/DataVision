//google.charts.load('current', { 'packages': ['corechart', 'line', 'treemap', 'table', 'bar'] });
//google.charts.setOnLoadCallback();

ajaxPendingRequests = new Array();
function abortPendingRequests() {
    if (ajaxPendingRequests.length > 0) {
        ajaxPendingRequests.forEach(function (req) {
            req.abort();
            ajaxPendingRequests.pop(req);
        });
    }
}


function chart(type, querySet) {
    var url = '/Analysis/buildQuery';


    var ajReq = $.ajax({
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(querySet),
        contentType: "application/json",
        url: url,
        beforeSend:
            function () {
                console.log(ajaxPendingRequests);
                abortPendingRequests();
                ajaxPendingRequests.push(this);
                console.log(ajaxPendingRequests);
                $('#loadingGif').css('display', 'block');
            },
        complete: function () {
            ajaxPendingRequests.pop(this);
            console.log(ajaxPendingRequests);
            $('#loadingGif').css('display', 'none');
        },
        success: function (result) {
            drawChart(result, type);
        },
        error: function () {
            console.log('unable to get data  - chart.js getData');
        }
    });


}


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

function drawAreaChart(result, type) {

    var data = new google.visualization.DataTable(result);
    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab }
    };

    if (type === "stackedArea")
    { options.isStacked = true; }

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);

}


function drawBarChart(result, type) {

    var data = new google.visualization.DataTable(result);

    var options = {
        title: chartTitle,
        vAxis: { title: xlab },
        hAxis: { title: ylab }
    };

    if (type === "stackedBar")
    { options.isStacked = true; }

    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(data, options);




}

function drawColumnChart(result, type) {

    var data = new google.visualization.DataTable(result);

    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab }
    };

    if (type === "stackedColumn")
    { options.isStacked = true; }

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawLineChart(result) {

    var data = new google.visualization.DataTable(result);

    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab }

    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawPieChart(result, type) { //alternate dataset needed

    var data = new google.visualization.DataTable(result);

    var options = {
        title: chartTitle
    };

    switch (type) {
        case "3dPie":
            options.is3D = true;
            break;
        case "donutPie":
            options.pieHole = 0.4;
            break;
    }

    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);

}

function drawScatterChart(result) {
    var data = new google.visualization.DataTable(result);

    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab }

    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawTable(result) {

    var data = new google.visualization.DataTable(result);

    var options = { width: '100%', height: '100%' };

    var table = new google.visualization.Table(document.getElementById('chart_div'));

    table.draw(data, options);
}


//unused
function drawSeriesChart(result) {

    var data = new google.visualization.DataTable(result);

    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab },
        //chartArea: { top: 60 },
        bubble: { textStyle: { fontSize: 11 } }
    };

    var chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawWaterFallChart(result) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Antivirus');
    //data.addColumn('number', 'Total');
    data.addColumn('number', 'Full Version');
    data.addColumn('number', 'Free Version');
    var dataArray = [];
    $.each(result, function (i, av) {
        dataArray.push([av.anv, av.cdfavr, av.cdfmw]);
    });

    data.addRows(dataArray);

    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab },
        legend: 'none',
        ////chartArea: { top: 60 },
        bar: { groupWidth: '100%' }, // Remove space between bars.
        candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
            risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
        }
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawTreeMapChart(result) {
    //['Free/Full', 'Antivirus', 'DF/DS', sample size]
    var data = new google.visualization.arrayToDataTable(result);

    var options = {
        title: chartTitle,
        minColor: '#e7711c',
        midColor: '#fff',
        maxColor: '#4374e0',
        showScale: true,
        chartArea: { top: 0 }
    };

    var chart = new google.visualization.TreeMap(document.getElementById('chart_div'));

    chart.draw(data, options);

}

//filter by chart selection
function eventFilter() {
    var columns = [];
    var series = {};
    for (var i = 0; i < data.getNumberOfColumns() ; i++) {
        columns.push(i);
        if (i > 0) {
            series[i - 1] = {};
        }
    }

    var options = {
        width: 600,
        height: 400,
        series: series
    }

    google.visualization.events.addListener(chart, 'select', filter);
}

function filter() {
    var sel = chart.getSelection();
    // if selection length is 0, we deselected an element
    if (sel.length > 0) {
        // if row is undefined, we clicked on the legend
        if (sel[0].row === null) {
            var col = sel[0].column;
            if (columns[col] == col) {
                // hide the data series
                columns[col] = {
                    label: data.getColumnLabel(col),
                    type: data.getColumnType(col),
                    calc: function () {
                        return null;
                    }
                };

                // grey out the legend entry
                series[col - 1].color = '#CCCCCC';
            }
            else {
                // show the data series
                columns[col] = col;
                series[col - 1].color = null;
            }
            var view = new google.visualization.DataView(data);
            view.setColumns(columns);
            chart.draw(view, options);
        }
    }
}