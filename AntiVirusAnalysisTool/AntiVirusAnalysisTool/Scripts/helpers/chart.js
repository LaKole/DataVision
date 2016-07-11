$('.dropdown-toggle').dropdown();
var quant;
var det;
var vers;
var grol;

$(".dropdown-menu li a").click(function () {
    var selText = $(this).text();
    console.log(selText);
    $(this).parents('.dropdown').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
    var inpu = $(this).parents('.dropdown').find('.dropdown-toggle').attr('data-inputID');
    switch (inpu) {
        case "quantInput":
            quant = selText;
            break;
        case "detectionInput":
            det = selText;
            break;
        case "versionInput":
            vers = selText;
            break;
        case "groupInput":
            grol = selText;
            break;
    }
});

function qs(type) {
    var qsd = { q: quant, d: det, v: vers, g: grol };
    console.log(qsd);
    var typex;
    if (type == "default") { typex = "combo"; } else { typex = type;}
    gd2(typex, qsd);

}



function gd2(type, querySet) {

    $.ajax({
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(querySet),
        contentType: "application/json",
        url: '/Analysis/getData',
        success: function (result) {
            console.log(type);
            drawChart(result, type);
        },
        error: function () {
            console.log('unable to get data');
        }
    });

}

var dataSet //different data sets for diff charts, different getData methods in chart
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(gd());
//load chart data
//$(gd);

function gd(type) {

    $.ajax({
        type: 'GET',
        dataType: "json",
        contentType: "application/json",
        url: '/Analysis/getData',
        success: function (result) {
            console.log(type);
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
        case "combo":
            drawComboChart(result);
            break;
        default:
            console.log('please select a chart you mug');
    }
}

function drawComboChart(result) {

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
        title: 'Detection Failure Comparison',
        vAxis: { title: 'Detection Faulures' },
        hAxis: { title: 'AntiVirus' },
        seriesType: 'bars',
        series: { 5: { type: 'line' } }
    };

    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawWaterFallChart(result) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Antivirus');
    //data.addColumn('number', 'Total');
    data.addColumn('number', 'Full Version');
    data.addColumn('number', 'Full Version');
    data.addColumn('number', 'Free Version');
    data.addColumn('number', 'Free Version');
    var dataArray = [];
    $.each(result, function (i, av) {
        dataArray.push([av.anv, av.cdfavr, av.cdfavr, av.cdfmw, av.cdfmw]);
    });

    data.addRows(dataArray);

    var options = {
        legend: 'none',
        bar: { groupWidth: '100%' }, // Remove space between bars.
        candlestick: {
            fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
            risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
        }
    };

    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

