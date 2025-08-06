document.addEventListener('DOMContentLoaded', () => {
    const updateForms = document.querySelectorAll('.update-form');

    updateForms.forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault(); // Prevent default form submission

            const url = form.action; // Get the form's action URL
            const quantityInput = form.querySelector('[name="quantity"]');
            const quantity = quantityInput.value; // Get the quantity value

            // Validate the quantity before sending the request
            if (!quantity || isNaN(quantity) || quantity <= 0) {
                alert("Please enter a valid quantity greater than 0.");
                return;
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: `quantity=${quantity}`
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    // Reload the page to reflect the updated cart
                    window.location.reload();
                } else {
                    alert(data.message); // Show error message if the server returned an error
                }
            } catch (error) {
                console.error('Error in Fetch or JSON Parsing:', error);
                alert("An error occurred while updating the cart. Please try again.");
            }
        });
    });
});
