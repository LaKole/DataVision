//set custom date picker range

$(function () {
    $('li a[data-toggle="tab"]').click(function () {
        var tab = this.id;

        $.ajax({
            type: 'POST',
            url: '/Home/GetPartialView',
            data: { 'tab': tab },
            dataType: "html",
            success: function (data) {
                $('#tabContent').html(data);
            }

        });
    });
});



function customRange(input) {

    if (input.id == 'endDate') {
        var minDate = new Date($('#startDate').val());
        if (minDate > new Date("11/11/2013")) {
            minDate.setDate(minDate.getDate() + 1);
        } else { minDate = new Date("11/11/2013"); }

        return { minDate: minDate, maxDate: new Date("12/11/2013") };
    }
    return { minDate: new Date("11/11/2013"), maxDate: new Date("12/11/2013") };
}

//init datepickers
$('#startDate, #endDate').datepicker({
    defaultDate: new Date("11/11/2013"),
    beforeShow: customRange,
    dateFormat: "dd/mm/yy",
});

//init multiselect
$('#antivirusList').multiselect();
$('#antivirusList').multiselect({
    beforeclose: function (e) {
        if ($(this).multiselect("widget").find("input:checked").length < 1) {
            alert("You must choose at least ONE antivirus!");
            return false;
        }
    }
});


//remove selected measures/attributes from dimesion lists
function chartOptions() {
    var att1 = $('#attribute1').val();


    $('#measure').prop('disabled', false);
    $('#version').prop('disabled', false);

    if (att1 === "version") {
        //measure == MD5 - box disabled
        var det = $('#detection option:selected').text();


        $('#measure').prop('disabled', true);
        $('#attribute2 option[value=md5]').prop('disabled', true);
        $('#version').prop('disabled', true);
    }
    else {
        //remove it from #measure and #attr2

        //look for att1, att2 with same value 
        var y = $('#measure option[value=' + att1 + ']');
        var z = $('#attribute2 option[value=' + att1 + ']');

        console.log('siblings');

        //enable siblings
        $(y).siblings().prop('disabled', false);
        $(z).siblings().prop('disabled', false);

        //select next row option
        //$('#attribute1 option:selected')
        //    .prop("selected", false)
        //    .next()
        //    .prop("selected", true);

        //var next = $('#attribute1 option:selected');
        //disable it
        $(y).prop('disabled', true);
        $(z).prop('disabled', true);
    }

    //console.log(next.val());
    uo();


}

//validate select options
