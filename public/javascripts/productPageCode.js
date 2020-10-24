if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

var tempLocalCart = localStorage.getItem("localCart"); 
var tempLocalQuantityCart = localStorage.getItem("localQuantityCart"); 
var currentGamePK;

/*global $*/
function ready() {
    const params = new URLSearchParams(window.location.search)
    console.log(params.get('id'));
    currentGamePK = params.get('id');

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
        data: JSON.stringify({
            productPK: currentGamePK,
        }),
        success: function (data, status) {
            console.log(data);
            console.log(data.success);
            if (data.response) {
                console.log(data);
            } else {
                console.log(data.message);
            }
                console.log(data.retrievedGame[0].name);
                console.log(data.retrievedGame[0].gamePK);

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
    if(tempLocalCart == ""){
        addToLocalStorageCart();
        alert('Added To Shopping Cart!');
        return;
    }
    //holds primary keys of games in cart
    let localCartArray = tempLocalCart.split(",");

    for(let i=0; i<localCartArray.length; i++){
        if(localCartArray[i] == currentGamePK){
            alert('Item already in cart!');
            return;
        }
    }

    addToLocalStorageCart();
    alert('Added To Shopping Cart!');
}
 
function addToLocalStorageCart(){
    tempLocalCart += currentGamePK + ',';
    tempLocalQuantityCart += $('.cart-quantity-input').val()+ ',';
    localStorage.setItem("localCart", tempLocalCart);
    localStorage.setItem("localQuantityCart", tempLocalQuantityCart);
    console.log(localStorage.getItem("localCart"));
    console.log(localStorage.getItem("localQuantityCart"));
}

//switch to home page
function switchToHome() {
    window.location.href = "/homepage";
}

//switch to cart page
function switchToCart() {
    window.location.href = "/cart";
}
