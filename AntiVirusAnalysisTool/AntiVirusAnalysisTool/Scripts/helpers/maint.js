/// <reference path="C:\Users\Olamide\Desktop\DataVision\AntiVirusAnalysisTool\AntiVirusAnalysisTool\Views/Home/About.cshtml" />
$(function () {

    var $orders = $('#orders');
    var $antivirus = $('#antivirus');
    var $quantity = $('#quantity');

    $.ajax({
        type: 'GET',
        url: '/ScanResult/Data',
        success: function (orders) {
            console.log(orders);

            $.each(orders, function (i, order) {
                $orders.append('<li>antivirus: ' + order.Antivirus + ', quantity: ' + order.Quantity + '</li>');
            });
        },
        error: function () {
            alert();
        }
    });

    $('#add-order').on('click', function () {

        var order = {
            Antivirus: $antivirus.val(),
            MD5: "dummy",
            Quantity: $quantity.val(),
        };

        $.ajax({
            type: 'POST',
            url: '/ScanResult/Data',
            data: order,
            success: function (newOrder) {
                console.log(newOrder);
                $orders.append('<li>antivirus: ' + newOrder[0].Antivirus + ', quantity: ' + newOrder.Quantity + '</li>');
            },
            error: function () {
                alert('save fail');
            }
        });

    });
});