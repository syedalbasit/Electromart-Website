// Function to toggle view (grid only)
function toggleView(view) {
    const gridView = document.querySelector('.product-grid');
    const gridBtn = document.getElementById('grid-view-btn');

    if (view === 'grid') {
        gridView.style.display = 'grid'; // Keep grid view
        gridBtn.classList.add('active');
    }
}

// Dropdown menu toggle (optional)
function toggleDropdown() {
    const menu = document.getElementById("dropdown-menu");
    menu.classList.toggle("show");
}

// Initialize view on page load
document.addEventListener('DOMContentLoaded', () => {
    toggleView('grid'); // Default to grid view
});


document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;

            fetch('/add-to-cart/', {
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
                    alert(data.message);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
});
