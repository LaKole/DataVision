var quant;
var det;
var vers;
var grol;

var opt, type, chartTitle, xlab, ylab;

//defaults
type = 'area';

function updateOptions() {
    var x = $('#xaxis').find(":selected").val();

    var y = $('#yaxis').find(":selected").val();

    var z = $('#zaxis').find(":selected").val();

    var v = $('#version').find(":selected").val();

    xlab = $('#xaxis').find(":selected").text();

    ylab = $('#yaxis').find(":selected").text();

    chartTitle = v = $('#chartName').val();

    opt = { xaxis: x, yaxis: y, zaxis: z, version: v };

    console.log(opt + ", " + chartTitle);
    getData(type, opt);

}

function getData(type, querySet) {

    $.ajax({
        type: 'POST',
        dataType: "json",
        data: JSON.stringify(querySet),
        contentType: "application/json",
        url: '/Analysis/getDataNew',
        success: function (result) {
            console.log(type);
            drawChart(result, type);
        },
        error: function () {
            console.log('unable to get data');
        }
    });

}

$(".dropdown-menu li a").click(function () {
    var selText = $(this).text();
    //console.log(selText);
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
    if (type == "default") { typex = "combo"; } else { typex = type; }
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
google.charts.load('current', { 'packages': ['corechart', 'line', 'treemap', 'table'] });

google.charts.setOnLoadCallback(gd2(type, opt));

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
        title: chartTitle,
        vAxis: { title: ylab},
        hAxis: { title: xlab },
        seriesType: 'bars',
        //chartArea: { top: 60 },
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

function drawAreaChart(result) {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Antivirus');
    data.addColumn('number', 'Full Cap');
    data.addColumn('number', 'Free Cap');

    var dataArray = [];
    $.each(result, function (i, av) {
        dataArray.push([av.anv, av.cdfavr, av.cdfmw]);
    });

    data.addRows(dataArray);

    var options = {
        title: chartTitle,
        vAxis: { title: ylab },
        hAxis: { title: xlab }
        ////chartArea: { top: 60 }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
    chart.draw(data, options);

}
function drawSeriesChart(result) {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Antivirus');
    data.addColumn('number', 'Full Cap');
    data.addColumn('number', 'Free Cap');
    data.addColumn('string', 'Det-Window');
    data.addColumn('number', 'Sample Size');

    var dataArray = [];
    $.each(result, function (i, av) {
        dataArray.push([av.anv, av.cdfavr, av.cdfmw, "placeholder", av.cm]);
    });

    data.addRows(dataArray);

    var options = {
        title: chartTitle,
        vAxis: { title: ylab},
        hAxis: { title: xlab },
        //chartArea: { top: 60 },
        bubble: { textStyle: { fontSize: 11 } }
    };

    var chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawPieChart(result, type) { //alternate dataset needed

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Antivirus');
    data.addColumn('number', 'Detection');

    var dataArray = [];
    $.each(result, function (i, av) {
        dataArray.push([av.anv, av.cdfavr]);
    });

    data.addRows(dataArray);

    var options;

    switch (type) {
        case "3d":
            options = {
                title: chartTitle,
                is3D: true,
                //chartArea: { top: 60 }
            };
            break;
        case "donut":
            options = {
                title: chartTitle,
                pieHole: 0.4,
                //chartArea: { top: 60 }
            };
            break;
        default:
            options = {
                title: chartTitle,
                chartArea: { top: 0 },
            };
    }


    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function drawTreeMapChart(result) {
    //['Free/Full', 'Antivirus', 'DF/DS', sample size]
    var data = new google.visualization.arrayToDataTable([
      ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
      ['Global', null, 0, 0],
      ['America', 'Global', 0, 0],
      ['Europe', 'Global', 0, 0],
      ['Asia', 'Global', 0, 0],
      ['Australia', 'Global', 0, 0],
      ['Africa', 'Global', 0, 0],
      ['Brazil', 'America', 11, 10],
      ['USA', 'America', 52, 31],
      ['Mexico', 'America', 24, 12],
      ['Canada', 'America', 16, -23],
      ['France', 'Europe', 42, -11],
      ['Germany', 'Europe', 31, -2],
      ['Sweden', 'Europe', 22, -13],
      ['Italy', 'Europe', 17, 4],
      ['UK', 'Europe', 21, -5],
      ['China', 'Asia', 36, 4],
      ['Japan', 'Asia', 20, -12],
      ['India', 'Asia', 40, 63],
      ['Laos', 'Asia', 4, 34],
      ['Mongolia', 'Asia', 1, -5],
      ['Israel', 'Asia', 12, 24],
      ['Iran', 'Asia', 18, 13],
      ['Pakistan', 'Asia', 11, -52],
      ['Egypt', 'Africa', 21, 0],
      ['S. Africa', 'Africa', 30, 43],
      ['Sudan', 'Africa', 12, 2],
      ['Congo', 'Africa', 10, 12],
      ['Zaire', 'Africa', 8, 10]
    ]);

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

function drawTable(result) {

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Antivirus');
    data.addColumn('number', 'Detection');

    var dataArray = [];
    $.each(result, function (i, av) {
        dataArray.push([av.anv, av.cdfavr]);
    });

    data.addRows(dataArray);

    var options;

    var table = new google.visualization.Table(document.getElementById('chart_div'));

    table.draw(data, options);
}



//function drawLineChart() { //requires formatting of result set

//    var data = new google.visualization.DataTable();
//    data.addColumn('date', 'Scan Date');
//    //Antivirus names
//    data.addColumn('number', 'Guardians of the Galaxy');
//    data.addColumn('number', 'The Avengers');
//    data.addColumn('number', 'Transformers: Age of Extinction');

//    var dataArray = [];
//    $.each(result, function (i, av) {
//        dataArray.push([av.scanDate, antivirus names]);
//    });

//    data.addRows(dataArray);

//    var options = {
//        chart: {
//            title: 'Box Office Earnings in First Two Weeks of Opening',
//            subtitle: 'in millions of dollars (USD)'
//        },
//        width: 900,
//        height: 500
//    };

//    var chart = new google.charts.Line(document.getElementById('linechart_material'));

//    chart.draw(data, options);
//}