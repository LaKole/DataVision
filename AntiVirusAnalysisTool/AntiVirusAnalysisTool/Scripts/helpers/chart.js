$(function () {

    $('.tab-panels .tabs li').on('click', function () {

        var $panel = $(this).closest('.tab-panels');

        $panel.find('.tabs li.active').removeClass('active');
        $(this).addClass('active');

        //figure out which panel to show
        var panelToShow = $(this).attr('data-panelID');
        console.log(panelToShow);

        //hide current panel
        $panel.find('.panel.active').slideUp(300, showNextPanel);

        //show next panel
        function showNextPanel() {
            $(this).removeClass('active');
            $('#' + panelToShow).slideDown(300, function () {
                $(this).addClass('active');
                console.log(this);
            });
        }
    });


});








$('.dropdown-toggle').dropdown();
var quant;
var det;
var vers;
var grol;

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
google.charts.load('current', { 'packages': ['corechart', 'line'] });

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
        case "area":
            drawAreaChart(result);
            break;
        case "series":
            drawSeriesChart(result);
            break;
        case "pie":
            drawPieChart(result, 'donut');
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
        title: 'Detection Comparisons'
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
        title: 'Correlation between life expectancy, fertility rate ' +
               'and population of some world countries (2010)',
        hAxis: { title: 'Full' },
        vAxis: { title: 'Free' },
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
                title: 'My Daily Activities',
                is3D: true,
            };
            break;
        case "donut":
            options = {
                title: 'My Daily Activities',
                pieHole: 0.4,
            };
            break;
        default:
            options = {
                title: 'My Daily Activities'
            };
    }


    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
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