if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

/*global $*/
function ready() {
    populateCart();

    $('.home_button').on('click', switchToHome);

    var removeCartItemButtons = $('.btn-danger');
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    var quantityInputs = $('.cart-quantity-input');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    var addToCartButtons = $('.shop-item-button');
    for (var i = 0; i < addToCartButtons.length; i++) {
        button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    $('.btn-purchase')[0].addEventListener('click', purchaseClicked);
}

function populateCart(){
    //holds primary keys of games in cart
    let localCartArray = localStorage.getItem("localCart").split(",");
    //holds chosen quantities of games in cart
    //index of item in tempLocalCart is the index of associated quantity
    let localQuantityCartArray = localStorage.getItem("localQuantityCart").split(",");

    for(let i=0; i<localCartArray.length; i++){
        getProduct(localCartArray[i], localQuantityCartArray[i]);
    }
}

function getProduct(currentGamePK, currentGameQuantity){
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
                //display game properties on productPage.hbs
                addItemToCart(data.retrievedGame[0].name, data.retrievedGame[0].price, data.retrievedGame[0].picture, data.retrievedGame[0].gamePK, currentGameQuantity);
                updateCartTotal();
            }
        });
};

function addItemToCart(title, price, imageSrc, gamePK, currentGameQuantity) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart');
            return;
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="${currentGameQuantity}">
            <button class="btn btn-danger" type="button">REMOVE</button>
            <input class="cart-item-PK" type="hidden" value="${gamePK}"></input>
        </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    updateCartState();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function purchaseClicked() {
    let container = document.getElementsByClassName('cart-items')[0];
    let rows = container.getElementsByClassName('cart-row');
    for (var k = 0; k < rows.length; k++) {
        updateQuantityDB(rows[k].getElementsByClassName('cart-item-title')[0].innerHTML, 
        rows[k].getElementsByClassName('cart-quantity-input')[0].value);
    }

    alert('Thank You For Your Purchase!');
    var cartItems = $('.cart-items')[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }

    window.localStorage.clear();
    updateCartTotal();

    window.location.href = "/homepage";
}

function updateQuantityDB(gName, aBought){
        $.ajax({
        type: "POST",
        url: "/cart/updateQuantity",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            // gameName: currentRow.getElementsByClassName('cart-item-title')[0].innerHTML,
            // amountBought: currentRow.getElementsByClassName('cart-quantity-input')[0].value
            gameName: gName,
            amountBought: aBought
        }),
        success: function(data, status) {
            if (data.response) {
                console.log(data);
            }
            else {
                console.log(data.message);
            }
        }
    });
}

function updateCartState(){
    //save new state of shopping cart if user doesn't checkout
    let localCartArray = localStorage.getItem("localCart").split(",");
    let localQuantityCartArray = localStorage.getItem("localQuantityCart").split(",");

    //for each item in localCartArray
        //check each item in shopping cart to find matching PK
            //if Pk's match then update quantity in localQuantityCartArray
            //else remove PK and associated quantity from both arrays
    //after loops create new comma seperated strings from both arrays
    //store back into local storage
    let match = false;
    for(let i=0; i<localCartArray.length; i++){
        let container = document.getElementsByClassName('cart-items')[0];
        let rows = container.getElementsByClassName('cart-row');
        for (var k = 0; k < rows.length; k++) {
            if(localCartArray[i] == rows[k].getElementsByClassName('cart-item-PK')[0].value){
                match = true;
                localQuantityCartArray[i] = rows[k].getElementsByClassName('cart-quantity-input')[0].value;
                break;
            }
        }
        //item was removed from cart
        if(!match){
            //remove item from arrays
            localCartArray.splice(i, 1);
            localQuantityCartArray.splice(i, 1);
        }
        //reset match flag
        match = false;
    }

    //save new cart state to local storage
    //if only one item in array then append comma manually
    if(localCartArray.length == 1){
        localStorage.setItem("localCart", localCartArray[0] + ",");
        localStorage.setItem("localQuantityCart", localQuantityCartArray[0] + ",");
    }else{
        localStorage.setItem("localCart", localCartArray.toString());
        localStorage.setItem("localQuantityCart", localQuantityCartArray.toString());
    }
}

//switch to home page
function switchToHome() {
    updateCartState();
    window.location.href = "/homepage";
}
