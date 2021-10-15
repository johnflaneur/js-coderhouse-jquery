const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document. getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        domCarrito();
    }
})
cards.addEventListener('click',  e =>{
    addCarrito(e);

})

items.addEventListener('click', e => {
    btnAccion(e);
})

const fetchData = async () => {
    try{
        const res = await fetch('api.json');
        const data = await res.json();
        cardsDom(data);
    } catch (error) {
        console.log(error);
    }
}


const cardsDom = data => {
    data.forEach(productoC => {
    templateCard.querySelector('h5').textContent = productoC.title;
    templateCard.querySelector('p').textContent = productoC.precio;
    templateCard.querySelector('img').setAttribute("src", productoC.picture);
    templateCard.querySelector('.btn-dark').dataset.id = productoC.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
    })
    cards.appendChild(fragment);
}

const addCarrito = e =>{
    if (e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement); 
    }
    e.stopPropagation();

}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    domCarrito()
}

const domCarrito = () => {
    items.innerHTML = '';
   Object.values(carrito).forEach(producto => {
       templateCarrito.querySelector('th').textContent = producto.id;
       templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
       templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
       templateCarrito.querySelector('.btn-secondary').dataset.id = producto.id
       templateCarrito.querySelector('.btn-warning').dataset.id = producto.id
       templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;

       const clone = templateCarrito.cloneNode(true);
       fragment.appendChild(clone);
    })
    items.appendChild(fragment);

    domFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const domFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    };

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0);
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const vaciarCarrito = document.getElementById('vaciar-carrito');
    vaciarCarrito.addEventListener('click', () => {
        carrito = {}
        domCarrito();
    })
}

const btnAccion = e => {
    if(e.target.classList.contains('btn-secondary')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        domCarrito();
    }

    if (e.target.classList.contains('btn-warning')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id];
        }
        domCarrito()
    }

    e.stopPropagation();
}


// USO DEL JQUERY PARA EL SUBMIT

$('body').prepend(`
   
    <form id="formAlertJQ">
    <h2>DÍA DE SUERTE</h2>
    <label><b>¿Cuál es tu shampoo favorito?</b></label>
    <input id="formText" type="text">
    <label><b>¿Cuántos shampoos Crisálida usas al mes?</b></label>
    <input id="formNumber" type="number">
    <input id="submitJQ" type="submit"></input>
    </form>
`);


$('#formAlertJQ').submit(function (e){
    e.preventDefault();
    alert('Te dejaremos gratis esa cantidad para tu próxima compra. Gracias por ser parte del consumo consciente.');
})

$('#formText').css({"background-color": "beige"});
$('#formNumber').css({"background-color": "beige"});