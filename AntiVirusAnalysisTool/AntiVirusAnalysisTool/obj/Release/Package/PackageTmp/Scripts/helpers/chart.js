google.charts.load('current', { 'packages': ['corechart', 'line', 'treemap', 'table', 'bar'] });
google.charts.setOnLoadCallback();


function getData(type, querySet) {
    var url;

    switch (type) {
        case "series":
            url = '/Analysis/getBubbleData';
            break;
        case "area":
        case "bar":
        case "line":
            url = '/Analysis/getData';
            break;
        case "table":
            url = '/Analysis/getTableData';
            break;
        default:
            url = '/Analysis/getData';
            break;
    }
    console.log(url);

    $.ajax({
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(querySet),
        contentType: "application/json",
        url: url,
        success: function (result) {
            //console.log(result);
            drawChart(result, type);
        },
        error: function () {
            console.log('unable to get data');
        }
    });

}

function drawChart(result, type) {

    switch (type) {
        case "waterfall":
            drawWaterFallChart(result);
            break;
        case "bar":
            drawBarChart(result);
            break;
        case "area":
            drawAreaChart(result);
            break;
        case "series":
            drawSeriesChart(result);
            break;
        case "pie":
            drawPieChart(result, 'donut');
            break;
        case "treemap":
            drawTreeMapChart(result);
            break;
        case "table":
            drawTable(result);
            break;
        case "line":
            drawLineChart(result);
            break;
    }
}

function drawBarChart(result) {

    var data = new google.visualization.DataTable(result);
    
    var options = {
        title: chartTitle,
        isStacked: true,
        vAxis: { title: ylab },
        hAxis: { title: xlab}
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawAreaChart(result) {
    console.log(result);
    var data = new google.visualization.DataTable(result);
    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab },
        isStacked: true
    };

    var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);

}

function drawPieChart(result, type) { //alternate dataset needed

    var data = new google.visualization.DataTable(result);

    var options;

    switch (type) {
        case "3d":
            options = {
                is3D: true,
                //chartArea: { top: 60 }
            };
            break;
        case "donut":
            options = {
                pieHole: 0.4,
                //chartArea: { top: 60 }
            };
            break;
        default:
            options = {
                chartArea: { top: 0 },
            };
    }
    options.title = chartTitle;

    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);

}


function drawTable(result) {

    var data = new google.visualization.DataTable(result);

    var options = { width: '100%', height: '100%' };

    var table = new google.visualization.Table(document.getElementById('chart_div'));

    table.draw(data, options);
}

function drawLineChart(result) { //requires formatting of result set

    var data = new google.visualization.DataTable(result);

    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab }

    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}



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

    tree = new google.visualization.TreeMap(document.getElementById('chart_div'));

    var options = {
        title: chartTitle,
        minColor: '#e7711c',
        midColor: '#fff',
        maxColor: '#4374e0',
        showScale: true,
        chartArea: { top: 0 },
        generateTooltip: showStaticTooltip
    };

    tree.draw(data, options);

    function showStaticTooltip(row, size, value) {
        return '<div style="background:#fd9; padding:10px; border-style:solid">' +
               'Read more about the <a href="http://en.wikipedia.org/wiki/Kingdom_(biology)">kingdoms of life</a>.</div>';
    }

}