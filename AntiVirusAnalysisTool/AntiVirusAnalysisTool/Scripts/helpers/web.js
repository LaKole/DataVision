$('.btn').click(function () {
    $('.btn').removeClass('btn-success').addClass('btn-info');
    $(this).addClass('btn-success').removeClass('btn-info');
});


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














//$(document).ready(function () {
//    $('#filterForm')
//        .formValidation({
//            framework: 'bootstrap',
//            icon: {
//                valid: 'glyphicon glyphicon-ok',
//                invalid: 'glyphicon glyphicon-remove',
//                validating: 'glyphicon glyphicon-refresh'
//            },
//            excluded: ':disabled',
//            fields: {

//                xaxis: {
//                    validators: {
//                        notEmpty: {
//                            message: 'Please select an x-axis'
//                        }
//                    }
//                },
//                yaxis: {
//                    validators: {
//                        notEmpty: {
//                            message: 'Please select a y-axis'
//                        }
//                    }
//                },
//                zaxis: {
//                    validators: {
//                        notEmpty: {
//                            message: 'Please select a z-axis'
//                        }
//                    }
//                },
//                color: {
//                    validators: {
//                        notEmpty: {
//                            message: 'The color is required'
//                        }
//                    }
//                }
//            }
//        })
//        /* Using Combobox for color and size select elements */
//        .find('[name="color"], [name="size"]')
//            .combobox()
//            .end()
//});