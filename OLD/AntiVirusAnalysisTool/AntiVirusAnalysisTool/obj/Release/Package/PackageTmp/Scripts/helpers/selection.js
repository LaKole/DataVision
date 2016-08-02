var opt, type, chartTitle, xlab, ylab;

$('.btn').on('click', (function () {
    $('.btn').removeClass('btn-success').addClass('btn-info');
    $(this).addClass('btn-success').removeClass('btn-info');

    type = $(this).val();

    uo()


})
);

function uo() {
switch (type) {
        case "pie":
        case "3dPie":
        case "donutPie":
            $('#attribute2').prop('disabled', true);
            pieOptions();
            break;

        default:

            $('#attribute2').prop('disabled', false);
            updateOptions();
            break;
    }
}

function pieOptions() {

    var meas = $('#measure').find(":selected").val();

    var attr1 = $('#attribute1').find(":selected").val();

    var d = $('#detection').find(":selected").val();

    var v = $('#version').find(":selected").val();

    var avl = $('#antivirusList').val().join(', ');

    //xlab = $('#attribute2').find(":selected").text();
    //ylab = $('#measure').find(":selected").text();

    chartTitle = $('#chartName').val();

    opt = { measure: meas, attribute1: attr1, attribute2: "", d: d, v: v, avl: avl };

    console.log(opt);
    chart(type, opt);

}

function updateOptions() {

    var meas = $('#measure').find(":selected").val();

    var attr1 = $('#attribute1').find(":selected").val();

    var attr2 = $('#attribute2').find(":selected").val();

    var d = $('#detection').find(":selected").val();

    var v = $('#version').find(":selected").val();

    var avl = $('#antivirusList').val().join(', ');

    xlab = $('#attribute2').find(":selected").text();
    ylab = $('#measure').find(":selected").text();

    chartTitle = $('#chartName').val();

    opt = { measure: meas, attribute1: attr1, attribute2: attr2, d: d, v: v, avl: avl };

    console.log(opt);
    chart(type, opt);

}