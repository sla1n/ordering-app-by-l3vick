import menuArray from '/data.js'

const menuContainer = document.getElementById('menu-container')
const orderContainer = document.getElementById('order-container')
const orderItemsContainer = document.getElementById('order-items-container')
const formContainer = document.getElementById('form-container')
const orderForm = document.getElementById('order-form')
const thankContainer = document.getElementById('thank-container')

let isOrderCompleted = false
let orderArray = []

document.addEventListener('click', e => {
    if (e.target.dataset.id && !isOrderCompleted) {
        handleAddClickBtn(parseInt(e.target.dataset.id))
    }
    else if(e.target.dataset.removeId){
        handleRemoveClickBtn(parseInt(e.target.dataset.removeId))
    }
    else if (e.target.id === 'complete-btn'){
        handleCompleteClickBtn()
    }
});

orderForm.addEventListener('submit', e =>{
    e.preventDefault()
    handlePayClickBtn()
})

function handleAddClickBtn(dishId) {
	orderContainer.classList.remove('hidden')
    const targetDishObj = orderArray.find(dish => dish.id === dishId)
    if (targetDishObj) {
        targetDishObj.quantity += 1
    } else {
        const dishToAdd = menuArray.find(dish => dish.id === dishId)
        orderArray.push({ ...dishToAdd, quantity: 1 })
    }
    renderOrder()
    renderTotalPrice()
}

function handleRemoveClickBtn(dishId){
    const index = orderArray.findIndex(dish => dish.id === dishId)
    if (index !== -1) {
        orderArray.splice(index, 1)
    }
    if(getTotalPrice() > 0){
        renderOrder()
        renderTotalPrice()
    } else{
        orderContainer.classList.toggle('hidden')
    }
    
}


function handleCompleteClickBtn(){
    formContainer.style.display = "flex"
    
}

function handlePayClickBtn(){
    formContainer.style.display = "none"
    isOrderCompleted = true
    const orderFormData = new FormData(orderForm)
    const name = orderFormData.get('name')
    thankContainer.classList.remove('hidden')
    orderContainer.classList.toggle('hidden')
    thankContainer.innerHTML = getThankText(name)

}

function renderOrder() {
    let orderHtml = ''
    orderArray.forEach(dish => {
        orderHtml += getOrder(dish)
    });
    orderItemsContainer.innerHTML = orderHtml
}

function renderTotalPrice(){
    document.getElementById('price-container').innerHTML = getTotalPriceText(getTotalPrice())

}

function renderMenu() {
    menuContainer.innerHTML = getMenu()
}


function getMenu() {
    return menuArray.map(dish => {
        return `
        <div class="dish-container">
            <div class="icon-container">
                <p class="dish-icon">${dish.emoji}</p>
            </div>
            <div class="dish-info-container">
                <p class="dish-name">${dish.name}</p>
                <p class="dish-content">${dish.ingredients.join(', ')}</p>
                <p class="dish-price">$${dish.price}</p>
            </div>
            <button class="add-dish-btn" data-id="${dish.id}">+</button>
        </div>
        `;
    }).join('')
}

function getThankText(name){
    return `
        <div class="thank-item-container">
            <p class="thank-text">Thanks, ${name}! Your order is on its way!</p>
        </div>
    `
}

function getTotalPrice(){
    let totalPrice = 0
    orderArray.forEach(dish => {
        totalPrice += dish.price * dish.quantity
    })
    return totalPrice
}


function getTotalPriceText(price){
    return `
            <p class="order-item-name">Total price: </p>
            <p class="order-item-price">$${price}</p>
    `
}

function getOrder(dish) {
    return `
    <div class="order-item">
        <p class="order-item-name">${dish.name} <span class="grey-text">x</span> ${dish.quantity}</p>
        <button class="remove-btn" data-remove-id="${dish.id}">remove</button>
        <p class="order-item-price">$${dish.price * dish.quantity}</p>
        
    </div>
    `
}



renderMenu()
