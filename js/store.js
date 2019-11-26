if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('product-remove')
    console.log(removeCartItemButtons)
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('quantity form-control input-number')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('btn btn-primary btn-outline-primary')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    console.log(title, price, imageSrc)
    addItemToCart(title, price, imageSrc)
}

function addRows() {
    var table = document.getElementByClassName( 'myTable' ),
        row = table.insertRow(0),
        cell1 = row.insertCell(0),
        cell2 = row.insertCell(1);
  
    cell1.innerHTML = 'Cell 1';
    cell2.innerHTML = 'Cell 2';
  }

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartRowContents =
        `        
        
							<tbody>
								<tr class="text-center">
									<td class="product-remove"><a href="#"><span class="icon-close"></span></a></td>

									<td class="image-prod">
										<div class="img" style="background-image:url(images/menu-2.jpg);"></div>
									</td>

									<td class="product-name">
										<h3>Creamy Latte Coffee</h3>
										<p>Far far away, behind the word mountains, far from the countries</p>
									</td>

									<td class="price">$4.90</td>

									<td class="quantity">
										<div class="input-group mb-3">
											<input type="text" name="quantity"
												class="quantity form-control input-number" value="1" min="1" max="100">
										</div>
									</td>
								</tr><!-- END TR-->
							</tbody>
						</table>
         `
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
}

function quantityChanged(event) { // critica de dados para a quantidade de items no carrinho. Não pode ser menor que 0
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.parentElement.remove()
    updateCartTotal()
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('ftco-section ftco-cart')[0]
    var cartRows = cartItemContainer.getElementsByClassName('row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('price')[0]
        var quantityElement = cartRow.getElementsByClassName('quantity form-control input-number')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100 // conversao
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}