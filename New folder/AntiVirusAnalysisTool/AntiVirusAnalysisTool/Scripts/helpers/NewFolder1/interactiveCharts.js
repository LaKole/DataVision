//load necessary google packages
//google.charts.load('current', { 'packages': ['corechart', 'line', 'treemap', 'table', 'bar', 'controls'] });
google.charts.load('current', {'packages' : ['corechart']});

//ajax request balancing
ajaxPendingRequests = new Array();
function abortPendingRequests() {
    if (ajaxPendingRequests.length > 0) {
        ajaxPendingRequests.forEach(function (req) {
            req.abort();
            ajaxPendingRequests.pop(req);
        });
    }
}

//global var to hold chart data
var chartData; 

function populateData(opt) {

    var ajReq = $.ajax({
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(opt),
        contentType: 'application/json',
        url: '/GoogleCharts/getData2',
        beforeSend:
            function () {
                //clear ajax request queue
                console.log(ajaxPendingRequests);
                abortPendingRequests();
                //add to queue
                ajaxPendingRequests.push(this);
                console.log(ajaxPendingRequests);
                //loading gif
                $('#loadingGif').css('display', 'block');
            },
        complete: function () {
            //remove from pending requests list
            ajaxPendingRequests.pop(this);
            console.log(ajaxPendingRequests);

            //hide loading gif
            $('#loadingGif').css('display', 'none');
        },
        success: function (result) {
            chartData = result;
            
        },
        error: function () {
            console.log('unable to get data  - chart.js getData');
        }
    });

    ajReq.done(function () {
        //once data successfully loaded
        google.charts.setOnLoadCallback(drawChart);
        drawChart();
    });

}


function drawChart() {

    var data = new google.visualization.DataTable(chartData);

    var options = {
        title: "test",
        pointSize: 2
    };

    var barChart = new google.visualization.BarChart(document.getElementById('chart_div'));
    barChart.draw(data, options);
}







function createTable() {

    // A. Create new instance of DataTable to add our data to
    var myData = new google.visualization.DataTable();

    // B. Create three columns with DataTable.addColumn(type, label)
    myData.addColumn('date', 'Date');
    myData.addColumn('number', 'Hours Worked');

    // C. Add rows to column [column-1, column-2]
    // Make sure values match column types
    myData.addRows([
      [new Date(2014, 6, 12), 9],
      [new Date(2014, 6, 13), 8],
      [new Date(2014, 6, 14), 10],
      [new Date(2014, 6, 15), 8],
      [new Date(2014, 6, 16), 0]
    ]);

    // Create a dashboard.
    var dash_container = document.getElementById('dashboard_div'),
      myDashboard = new google.visualization.Dashboard(dash_container);

    //IMPORTANT

    // Create a date range slider
    var myDateSlider = new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': 'control_div',
        'options': {
            'filterColumnLabel': 'Date'  //scandate where exists
        }
    });

    // Display all our data as text for reference
    var myTable = new google.visualization.ChartWrapper({
        'chartType': 'Table',
        'containerId': 'table_div'
    });

    // Bind myTable to the dashboard, and to the controls
    // this will make sure our table is update when our date changes
    myDashboard.bind(myDateSlider, myTable);



    myDashboard.draw(myData);

    //IMPORTANT


}
