document.addEventListener('DOMContentLoaded', function () {
    const reviews = [
        {
            reviewer_name: "John Doe",
            rating: 4,
            image_url: "/static/images/john_doe.png" ,
            review_text: "Great service, cheap and affordable."
            
        },
        {
            reviewer_name: "Jane Smith",
            rating: 5,
            image_url: "/static/images/person4.png",
            review_text: "Perfect for my budget!"
        },
        {
            reviewer_name: "Tom Brown",
            rating: 3,
            review_text: "Decent, but had a few issues .",
            image_url: "/static/images/tom_brown.png"
        },
        {
            reviewer_name: "Emily Davis",
            rating: 5,
            review_text: "Absolutely loved the experience, will rent again!",
            image_url: "/static/images/emily_davis.png"
        }
    ];
    
    let currentReviewIndex = 0;

    const reviewContainer = document.querySelector(".review-container");
    const paginationContainer = document.querySelector(".pagination");

    const displayReview = (index) => {
        const review = reviews[index];
        reviewContainer.innerHTML = `
            <div class="review">
                <img src="${review.image_url}" alt="${review.reviewer_name}" class="review-image">
                <span class="reviewer-name">${review.reviewer_name}</span>
                <span class="rating_stars">${'★'.repeat(review.rating)}</span>
                <p class="review-text">${review.review_text}</p>
            </div>
        `;
        updateDots(index);
    };

    const createDots = () => {
        paginationContainer.innerHTML = '';
        reviews.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => currentSlide(i));
            paginationContainer.appendChild(dot);
        });
    };

    const updateDots = (index) => {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };


    const currentSlide = (index) => {
        currentReviewIndex = index;
        displayReview(currentReviewIndex);
    };

    createDots();
    displayReview(currentReviewIndex);

    setInterval(() => {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        displayReview(currentReviewIndex);
    }, 5000);

    const nextReview = () => {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        displayReview();
    };

    const prevReview = () => {
        currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
        displayReview();
    };

    setInterval(nextReview, 5000); 
    displayReview();

    document.getElementById("nextReview").addEventListener("click", nextReview);
    document.getElementById("prevReview").addEventListener("click", prevReview);

    window.toggleDropdown = function() {
        const dropdown = document.getElementById("dropdown-menu");
        dropdown.classList.toggle("show");
    };
});
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


function countUp(counter, targetNumber, duration) {
    let startNumber = 0;
    const increment = targetNumber / (duration / 10);

    function updateCounter() {
        startNumber += increment;
        if (startNumber < targetNumber) {
            counter.innerText = Math.ceil(startNumber);
            setTimeout(updateCounter, 10);
        } else {
            counter.innerText = targetNumber;
        }
    }

    updateCounter();
}

const counters = document.getElementsByClassName("counter");
for (let i = 0; i < counters.length; i++) {
    const targetNumber = counters[i].innerText;
    countUp(counters[i], targetNumber, 1500);
}

// document.querySelectorAll('.stat-item').forEach(item => {
//     item.addEventListener('click', () => {
//         const label = item.querySelector('.stat-label').innerText;
//         const number = item.querySelector('.stat-number').innerText;
//         alert(`Statistic: ${label}\nNumber: ${number}`);
//     });
// });