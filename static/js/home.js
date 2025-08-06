function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.classList.toggle('show');
}


window.onclick = function (event) {
    if (!event.target.matches('.browse-button')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}


const slides = document.querySelectorAll('.swiper-slide');
let dots = document.querySelectorAll('.dot');
let currentIndex = 0;

function showSlide(index) {
    // Remove 'active' class from all slides and dots
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    swiperWrapper.style.transform = `translateX(${-index * 100}%)`;

    // Add 'active' class to the current slide and dot
    slides[index].classList.add('active2');
    dots.forEach(dot => dot.classList.remove('active1'));
    dots[index].classList.add('active1');
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
    });
});

showSlide(currentIndex);


function to_slide1() {
    updateSlide("HP - Pavilion Wave", "DESKTOP INTEL CORE i3", "Get 5% Bonus Coupon with No Min. Purchase Now", 0);
}

function to_slide2() {
    updateSlide("Dell Inspiron", "DESKTOP INTEL CORE i5", "Save more with exclusive offers on Dell products", 1);
}

function to_slide3() {
    updateSlide("Lenovo ThinkCentre", "DESKTOP INTEL CORE i7", "Special discounts for high-performance desktops", 2);
}

function updateSlide(subTitle, title, desc, dotIndex) {
    const sliderContent = document.querySelector(".slider__content");

    // Fade out current content
    sliderContent.classList.remove("active2");

    setTimeout(() => {
        // Update the text content
        document.querySelector('.sub_title').innerText = subTitle;
        document.querySelector('.title').innerText = title;
        document.querySelector('.desc').innerText = desc;
        

        // Fade in new content
        sliderContent.classList.add("active2");
    }, 300); // Small delay to allow fade out before content change

    setActiveDot(dotIndex);
}

function setActiveDot(index) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active1'));
    dots[index].classList.add('active1');
}

// Run to_slide1 on page load
window.onload = to_slide1;



// Carousel Code

let currentProductIndex = 0;
let totalProducts = document.querySelectorAll(".product_item").length;

const productContainer = document.querySelector(".products_wrapper");

const productCardWidth = 344 + 38; // Adjusted width of each product card with padding

const products = document.querySelectorAll(".product_item");

if (totalProducts <= 4) {
    document.querySelector('.cat_prev').style.display = 'none';
    document.querySelector('.cat_next').style.display = 'none';
}

const slideToNextProduct = () => {
    if (currentProductIndex == totalProducts - 3) {
        currentProductIndex = 0;
    }
    productContainer.style.transform = `translateX(-${currentProductIndex * productCardWidth}px)`;
    currentProductIndex = (currentProductIndex + 1) % totalProducts;
};

const slideToPreviousProduct = () => {
    if (currentProductIndex == 0) {
        currentProductIndex = totalProducts - 3;
    }
    currentProductIndex = (currentProductIndex - 1 + totalProducts) % totalProducts;
    productContainer.style.transform = `translateX(-${currentProductIndex * productCardWidth}px)`;
};

if (totalProducts > 4) {
    document.querySelector('.next').addEventListener("click", slideToNextProduct);
    document.querySelector('.prev').addEventListener("click", slideToPreviousProduct);
}



const buttons = document.querySelectorAll('.underline-btn');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'active' class from all buttons
        buttons.forEach(btn => btn.classList.remove('active_btn'));

        // Add 'active' class to the clicked button
        button.classList.add('active_btn');
    });
});

// Scroll Left and Right

const catCont = document.querySelector('.cat_wrapper');
let CatIndex = 0;
const catItemWidth = 270 + 33;
const catItems = document.querySelectorAll('.cat_item');
const totalCatItems = document.querySelectorAll('.cat_item').length;
if (totalCatItems <= 3) {
    document.querySelector('.cat_prev').style.display = 'none';
    document.querySelector('.cat_next').style.display = 'none';
}

function slideToNextCat() {
    if (CatIndex == totalCatItems - 2) {
        CatIndex = 0;
    }
    catCont.style.transform = `translateX(-${CatIndex * catItemWidth}px)`;
    CatIndex = (CatIndex + 1) % totalCatItems;
}

function slideToPreviousCat() {
    if (CatIndex == 0) {
        CatIndex = totalCatItems - 2;
    }
    CatIndex = (CatIndex - 1 + totalCatItems) % totalCatItems;
    catCont.style.transform = `translateX(-${CatIndex * catItemWidth}px)`;
}

if (totalCatItems > 3) {
    document.querySelector('.cat_next').addEventListener("click", slideToNextCat);
    document.querySelector('.cat_prev').addEventListener("click", slideToPreviousCat);
}

let a = {
    "product": {
        "name": "iPhone 8 Pro",
        "description": "The ultimate iPhone.",
        "image_url": "url_to_image_here",
        "rating": 5,
        "price": 999,
        "currency": "$",
        "add_to_cart_text": "ADD TO CART",
        "wishlist_icon": "url_to_wishlist_icon_here"
    }
}


const selectElements = document.getElementsByTagName('select');

for (let i = 0; i < selectElements.length; i++) {
    selectElements[i].addEventListener('change', function () {
        const selectedCategory = this.value;
        if (selectedCategory) {
            const baseURL = 'http://127.0.0.1:8000/';
            window.location.href = `${baseURL}${selectedCategory}`;
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.dataset.productId;

            fetch('/cart/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({ product_id: productId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message); // Show success message
                    } else {
                        alert(data.message); // Show error message
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });
});



