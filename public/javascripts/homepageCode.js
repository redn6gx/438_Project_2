getProductforHome();

function getProductforHome(){
    console.log("Test Button Was Clicked");
    $.ajax({
        type: "POST",
        url: "/productPage/getProduct",
        dataType: "json",
        contentType: "application/json",
        // data: JSON.stringify({
        //     productTitle: $(".shop-item-title")[0].innerText,
        // }),
        success: function (data, status) {
            console.log(data);
            console.log(data.success);
            if (data.response) {
                console.log(data);
                // location.reload();
            } else {
                console.log(data.message);
            }
                console.log(data.retrievedGame[0].name);
                //display game properties on productPage.hbs
                $('.shop-item-title').html(data.retrievedGame[0].name);
                $('.shop-item-price').html(data.retrievedGame[0].price);
                $('.shop-item-description').html(data.retrievedGame[0].description);
                $('.shop-item-image').attr("src", data.retrievedGame[0].picture);
                $('.shop-item-quantity').html(data.retrievedGame[0].quantity).append(': Available');
            }
        });
};