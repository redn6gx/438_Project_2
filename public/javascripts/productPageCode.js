//send to cart.js

// $('.btn btn-primary shop-item-button').addEventListener("click", function () {
//     $.ajax({
//         type: "GET",
//         url: "cartCode/addToCart",
//         dataType: "json",
//         contentType: "application/json",
//         data: JSON.stringify({
//             productTitle: $(".shop-item-title")[0].innerText,
//             productPrice: $(".shop-item-price")[0].innerText,
//             // productQuantity: $(".productQuantity").val(),
//             productImage: $(".shop-item-image")[0].src
//         }),
//         success: function (data, status) {
//             console.log(data);
//             console.log(data.success);
//             if (data.response) {
//                 console.log(data);
//                 location.reload();
//             } else {
//                 console.log(data.message);
//             }
//         }
//     });
// });
