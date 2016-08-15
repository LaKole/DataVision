//global
var opt, column, row, dr, al, dfc, dvt, d, f, chartTitle, currentTab, selectedChart, isPie,
    filterPanel = $('#panelOptions'),
    chartButtons = $('#cb-list li');

//----------------DATE PICKERS----------------//
$('.date').datepicker({
    beforeShow: customRange,
    dateFormat: "yy/mm/dd"
});

//set default date entries
$('#startDate').datepicker('setDate', new Date("11/11/2013"));
$('#endDate').datepicker('setDate', new Date("12/11/2013"));

//hide datapicker on mouse leave
$('.ui-datepicker').on('mouseleave', function () { $('.date').datepicker('hide').blur(); })

//set custom date picker range
function customRange(input) {

    if (input.id == 'endDate') {
        var minDate = new Date($('#startDate').val());
        minDate.setDate(minDate.getDate() + 1);
        return { minDate: minDate, maxDate: new Date("12/11/2013") };
    }
    else {
        return { minDate: new Date("11/11/2013"), maxDate: new Date("12/11/2013") };
    }
}

//get valid range
function validRange() {
    var start = new Date($('#startDate').val());
    var end = new Date($('#endDate').val());

    if (start > end) {
        end = new Date(Date.parse(start));
        $('#endDate').datepicker('setDate', end);
    }
}


//--------------------MULTISELECT----------------------//
filterPanel.find('#antivirusList').multiselect();

//at least one av must be selected
filterPanel.find('#antivirusList').multiselect({
    beforeclose: function (e) {
        if ($(this).multiselect("widget").find("input:checked").length < 1) {
            console.log("You must choose at least ONE antivirus!");
            alert("You must choose at least ONE antivirus!");
            return false;
        }
    }
});

//---------------------PROGRESS TIMER SETUP------------------//
function startProgressTimer(x) {

    $('#progressTimer').show()
    $('#progressTimer').progressTimer({
        timeLimit: x,
        warningThreshold: 50,
        baseStyle: 'progress-bar-warning',
        warningStyle: 'progress-bar-warning',
        completeStyle: 'progress-bar-success',
        onFinish: function () {
        }
    });

}

filterHandler();

//-----------------------------------TAB SELECTION----------------------------//
//tab changing
$('#selectionTab li').on('click', showTabCharts);

function showTabCharts() {

    currentTab = this.id;
    chartClass = '.' + currentTab;
    chartButtons.show();
    chartButtons.not(chartClass).hide();

}
//start at all
currentTab = 'all';

//----------------------------------CHART SELECTION---------------------------//
chartButtons.on('click', function () {
    selectedChart = this.id;
    //console.log(selectedChart);

    if (selectedChart.toLowerCase().indexOf("pie") >= 0) {
        isPie = true;
    } else {
        isPie = false;
    }

    filterHandler();
    //console.log(currentTab);
});


//----------------------------------FILTER OPTIONS-------------------------------//

filterPanel.find('#column').on('change', filterHandler);

function filterHandler() {

    var column = filterPanel.find('#column').find(":selected").val();
    if (currentTab != '2d' && isPie === false) {
        filterPanel.find('#avVersion').hide();
        filterPanel.find('#dataMeasure').show();

        if (column === 'version') {
            //remove md5 from row options
            md5Option = filterPanel.find('#row option[value=md5]');
            md5Option.prop('disabled', true);
            md5Option.siblings().prop('disabled', false);
            //hide matrix detection options and show version detection options
            filterPanel.find('#matrixDetection').hide();
            filterPanel.find('#versionDetection').show();


        } else {

            var rowOption = filterPanel.find('#row option[value=' + column + ']')
            rowOption.prop('disabled', true);
            rowOption.siblings().prop('disabled', false);
            //hide version detection options and show matrix detection options
            filterPanel.find('#matrixDetection').show();
            filterPanel.find('#versionDetection').hide();
        }
        //select next available option
        filterPanel.find('#row').children('option:enabled').eq(0).prop('selected', true);
    }
    else {

        filterPanel.find('#column option[value=scandate]').prop('disabled', true);

        //hide matrix detection options and show version detection options
        filterPanel.find('#matrixDetection').hide();
        filterPanel.find('#dataMeasure').hide();
        filterPanel.find('#versionDetection').show();

        if (column === 'version') {
            filterPanel.find('#avVersion').hide();
        } else {
            filterPanel.find('#avVersion').show();
        }

    }

}

function getOptions() {

    column = filterPanel.find('#column').find(":selected").val();
    row = filterPanel.find('#row').find(":selected").val();
    al = filterPanel.find('#antivirusList').val().join(', ');
    dfc = filterPanel.find('#vtd').find(":selected").val();
    dvt = filterPanel.find('#fcd').find(":selected").val();
    d = filterPanel.find('#detection').find(":selected").val();
    f = filterPanel.find('#format').find(":selected").val();
    getDateRange();
    var method;
    //may be unnecessary

    if (currentTab === '2d' || isPie === true) {

        var vers = $('#version').find(":selected").val();
        opt = { key: column, version: vers, dateRange: dr, avList: al, detection: d, format: f };
        method = 0;
    }

    else {
        if (column === 'version') {
            opt = { row: row, dateRange: dr, avList: al, detection: d, format: f };
            method = 1;
        }
        else {
            opt = { column: column, row: row, dateRange: dr, avList: al, dfc: dfc, dvt: dvt };
            method = 2;
        }

    }

    chart(opt, method, selectedChart);
    chartTitle = filterPanel.find('#chartName').val();
}


function getDateRange() {

    var start = filterPanel.find('#startDate').val();
    var end = filterPanel.find('#endDate').val();

    dr = "'" + start + "' and '" + end + "'";
}

