if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

/*global $*/
function ready() {
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

    //******************* TEMPORARILY HARD CODING PRODUCTS INTO CART *******************
    addItemToCart("Shaq Fu", "$199.99", "images/shaqNintendo.jpg");
    addItemToCart("Shaq Fu: The Legend Reborn", "$1.99", "images/shaq.jpg");
    updateCartTotal();
    //******************* TEMPORARILY HARD CODING PRODUCTS INTO CART *******************
}

function purchaseClicked() {
    var cartContainer = document.getElementsByClassName('cart-items')[0];
    var allRows = cartContainer.getElementsByClassName('cart-row');
    var currentRow = allRows[0];

    // debug
    // console.log(currentRow);
    // console.log(currentRow.getElementsByClassName('cart-item-title')[0].innerHTML);
    // console.log(currentRow.getElementsByClassName('cart-quantity-input')[0].value);

    $.ajax({
        type: "POST",
        url: "/cart/updateQuantity",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            gameName: currentRow.getElementsByClassName('cart-item-title')[0].innerHTML,
            amountBought: currentRow.getElementsByClassName('cart-quantity-input')[0].value
        }),
        success: function(data, status) {
            if (data.response) {
                console.log(data);
                // location.reload();
            }
            else {
                console.log(data.message);
            }
        }
    });

    alert('Thank you for your purchase');
    var cartItems = $('.cart-items')[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
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
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
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

//switch to home page
function switchToHome() {
    console.log("function working?")
    window.location.href = "/homepage";
}
