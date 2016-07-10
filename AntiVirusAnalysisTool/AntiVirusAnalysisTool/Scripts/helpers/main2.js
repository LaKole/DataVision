var $chartMenu = document.getElementById("chart-menu");
$('.dropdown-toggle').dropdown();
var charts = $chartMenu.querySelectorAll("li");
var chart2draw;
for (var c = 0; c < charts.length; c++) {
    charts[c].addEventListener('click', function () {
        chart2draw = this.querySelector("id");
    });
}

console.log(chart2draw);
$(document).ready(function () {
    $.ajax({
        type: 'GET',
        dataType: "json",
        contentType: "application/json",
        url: '/Analysis/getData',
        success: function (result) {

            // Load the Visualization API and the corechart package.
            google.charts.load('current', { 'packages': ['corechart'] });

            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(function () {
                drawWaterFallChart(result);
            });
        },
        error: function () {
            console.log('unable to get data');
        }
    });


    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
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

});