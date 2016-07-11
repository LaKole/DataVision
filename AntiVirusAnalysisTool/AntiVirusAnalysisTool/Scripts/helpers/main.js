$(document).ready(start);

function start() {
    $.ajax({
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        url: '/ScanResult/Data',
        success: begin
    });
    console.log("start entered");
}

function begin(result) {

    // Load the Visualization API and the corechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(function () {
        drawChart(result);
    });
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(result) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Antivirus');
    data.addColumn('number', 'Quantity');
    var dataArray = [];
    $.each(result, function (i, obj) {
        dataArray.push([obj.Antivirus, obj.Quantity]);
    });

    data.addRows(dataArray);

    // Set chart options
    var piechart_options = {
        title: 'Pie Chart: How Many Antivirus Detected Today',
        width: 400,
        height: 300
    };

    // Instantiate and draw our chart, passing in some options.
    var piechart = new google.visualization.PieChart(document.getElementById('piechart_div'));


    piechart.draw(data, piechart_options);

    var barchart_options = {
        title: 'Barchart: How Many Antivirus Detected Today',
        width: 400,
        height: 300,
        legend: 'none'
    };

    var barchart = new google.visualization.BarChart(document
        .getElementById('barchart_div'));
    barchart.draw(data, barchart_options);
}


function selectHandler() {
    var selectedItem = piechart.getSelection()[0];
    if (selectedItem) {
        var av = data.getValue(selectedItem.row, 0);
        console.log('The user selected ' + av);
    }
}

//jQuery DataTables initialisation
$('#myTable').DataTable({
    "processing": true, //show processing bar
    "serverSide": true, //process on server side
    "orderMulti": false, //db multi column order
    "dom": '<"top"i>rt<"bottom"lp><"clear">', //hide default global search box
    "ajax": {
        "url": "/chart/LoadData",
        "type": "POST",
        "datatype": "json"
    },
    "columns": [
        { "data": "Antivirus", "name": "Antivirus", "autowidth": true },
        { "data": "MD5", "name": "MD5", "autowidth": true },
        { "data": "ScanDate", "name": "ScanDate", "autowidth": true },
        { "data": "DetectionFailureAVR", "name": "DetectionFailureAVR", "autowidth": true }
    ]

});
//Apply custom search on jQuery DataTable here
oTable = $('#myTable').DataTable();
$('#btnSearch').click(search);

function search() {
    //search
    oTable.columns(0).search($('#ddAntiVirus').val().trim());
    oTable.columns(2).search($('#txtScanDate').val().trim());
    oTable.columns(3).search($('#ddDF').val().trim());
    //hit search on server
    oTable.draw();
}

$('#execute').click(loadTable)

function loadTable() {
    var data = { dr: $('#query').val().trim() }

    $(this).val('Please wait...');

    $.ajax({
        url: "/chart/LoadData",
        data: JSON.stringify(data),
        dataType: "JSON",
        contentType: "application/json",
        type: "POST",
        success: function (d) {
            oTable.draw();
            alert('Done');
        }
    })
    $(this).val('Execute');
}

google.visualization.events.addListener(piechart, 'select', selectHandler);









//var numOne = document.getElementById("num-one");
//var numTwo = document.getElementById("num-two");
//var addSum = document.getElementById("add-sum");

//numOne.addEventListener("input", add);
//numTwo.addEventListener("input", add);

//function add() {
//    var one = parseFloat(numOne.value) || 0;
//    var two = parseFloat(numTwo.value) || 0;
//    addSum.innerHTML = "Your sum is: " + (one + two);
//}

//var checklist = document.getElementById("checkList");

//var items = checklist.querySelectorAll("li");
//var inputs = checklist.querySelectorAll("input");

//for (var i = 0; i < items.length; i++) {
//    items[i].addEventListener("click", editItem);
//    inputs[i].addEventListener("blur", updateItem);
//    inputs[i].addEventListener("keypress", itemKeyPress);
//}

//function editItem() {
//    this.className = "edit";
//    var input = this.querySelector("input");
//    input.focus();
//    console.log("my current value is ", input.value);
//    input.setSelectionRange(0, input.value.length);
//}

//function updateItem() {
//    this.previousElementSibling.innerHTML = this.value;
//    this.parentNode.className = "";
//}

//function itemKeyPress(event) {
//    if (event.which === 13) {
//        updateItem.call(this);
//    }
//}