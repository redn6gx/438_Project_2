if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

//class for game product to be added into local storage and loaded into cart
class gameCartProduct{
    constructor(gName, price, quantity, picture){
        this.gName = gName;
        this.price = price;
        this.quantity = quantity;
        this.picture = picture;
    }
}

var addedProduct;
var tempArray = JSON.parse(localStorage.getItem("cartArray"));
// let tempArray = localStorage.cartArray ? localStorage.getItem("cartArray").split(",") : [];

/*global $*/
function ready() {
    getProduct();
    $('.home_button').on('click', switchToHome);
    $('.cart_button').on('click', switchToCart);
    $('.shop-item-button').on('click', addToCart);
}

function getProduct(){
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

//Add to Cart Button
function addToCart() {
    let tempQuantity = $('.shop-item-quantity').html().split(":", 1);
    addedProduct = new gameCartProduct( $('.shop-item-title').html(), $('.shop-item-price').html(),
    tempQuantity[0], $('.shop-item-image').attr('src'));

    console.log(addedProduct.gName, addedProduct.price, addedProduct.quantity, addedProduct.picture);

    tempArray.push(addedProduct);
    localStorage.setItem("cartArray", JSON.stringify(tempArray));

    let testArray = JSON.parse(localStorage.getItem("cartArray"));
    console.log(testArray[0].gName);
}


//switch to home page
function switchToHome() {
    console.log("function working?")
    window.location.href = "/homepage";
}

//switch to cart page
function switchToCart() {
    console.log("function working?")
    window.location.href = "/cart";
}
