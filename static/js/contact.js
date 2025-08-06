// Define the array of testimonials with their details
const testimonials = [
  {
    name: "Eva Sawyer",
    job: "CEO, Fashworks",
    image: "../static/images/Veronica.png",
    testimonial:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, tempore!",
  },
  {
    name: "Katey Topaz",
    job: "Developer, TechCrew",
    image: "../static/images/person2.png",
    testimonial:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, tempore!",
  },
  {
    name: "Jae Robin",
    job: "UI Designer, Affinity Agency",
    image: "../static/images/selena.png",
    testimonial:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, tempore!",
  },
  {
    name: "Nicola Blakely",
    job: "CEO, Zeal Wheels",
    image: "../static/images/person1.png",
    testimonial:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, tempore!",
  },
];

// Initialize the current index to 0 and set up the event listeners for the next and previous buttons
let currentIndex = 0;
const testimonialContainer = document.getElementById("testimonial-container");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

// Function to create the HTML structure for a testimonial
const createTestimonialHTML = (testimonial) => `
  <div class="testimonial">
    <p>${testimonial.testimonial}</p>
    <img src=${testimonial.image} alt="${testimonial.name}">
    <h3>${testimonial.name}</h3>
    <h6>${testimonial.job}</h6>
  </div>
`;

// Function to update the testimonials displayed
const updateTestimonials = () => {
  const nextIndex = (currentIndex + 1) % testimonials.length;
  const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;

  testimonialContainer.innerHTML = `
    ${createTestimonialHTML(testimonials[prevIndex])}
    ${createTestimonialHTML(testimonials[currentIndex])}
    ${createTestimonialHTML(testimonials[nextIndex])}
  `;

  testimonialContainer.style.transform = "translateX(-100%)";
};

// Function to slide to the next testimonial
const slideNext = () => {
  testimonialContainer.style.transition = "transform 0.5s ease-in-out";
  testimonialContainer.style.transform = "translateX(-200%)";

  testimonialContainer.addEventListener(
    "transitionend",
    () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateTestimonials();
      testimonialContainer.style.transition = "none";
      testimonialContainer.style.transform = "translateX(-100%)";
    },
    { once: true }
  );
};

// Function to slide to the previous testimonial
const slidePrev = () => {
  testimonialContainer.style.transition = "transform 0.5s ease-in-out";
  testimonialContainer.style.transform = "translateX(0)";

  testimonialContainer.addEventListener(
    "transitionend",
    () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateTestimonials();
      testimonialContainer.style.transition = "none";
      testimonialContainer.style.transform = "translateX(-100%)";
    },
    { once: true }
  );
};

// Add event listeners for next and previous buttons
nextBtn.addEventListener("click", slideNext);
prevBtn.addEventListener("click", slidePrev);

// Initial call to update testimonials
updateTestimonials();

// Intersection Observer for animations
const observerContact = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

const hiddenElementsContact = document.querySelectorAll(".hidden");
hiddenElementsContact.forEach((el) => observerContact.observe(el));

// Show toast notifications
const showToast = (message, type) => {
  const toastNotification = document.querySelector("#toast_notification");
  if (!toastNotification) {
    console.error("Toast notification container not found!");
    return;
  }

  toastNotification.classList.add("toastanimate");
  toastNotification.querySelector(".toast__message h4").innerText = type;
  toastNotification.querySelector(".toast__message p").innerText = message;

  const icon = toastNotification.querySelector(".toast__link i");
  if (type === "Success") {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-check");
  } else {
    icon.classList.remove("fa-check");
    icon.classList.add("fa-xmark");
  }

  toastNotification.classList.add("show");

  setTimeout(() => {
    toastNotification.classList.remove("toastanimate");
    toastNotification.classList.add("toastanimateout");
    setTimeout(() => {
      toastNotification.classList.remove("toastanimateout");
      toastNotification.classList.remove("show");
    }, 300);
  }, 2300);
};

function sendMail() {
  const checkButton = document.querySelector("#btn");

  checkButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent the default button behavior

    // Collect input values
    let name = document.querySelector(".user_name").value.trim();
    let email = document.querySelector(".user_email").value.trim();
    let number = document.querySelector(".ph_no").value.trim();
    let message = document.querySelector(".message").value.trim();

    // Validation: Ensure all fields are filled
    if (!name || !email || !number || !message) {
      alert("Please fill out all the fields.");
      return;
    }

    // Validation: Check if email is valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Validation: Check if the phone number is exactly 11 digits and numeric
    if (number.length !== 11 || !/^\d+$/.test(number)) {
      alert("Phone number must be 11 numeric digits.");
      return;
    }

    // Prepare parameters for EmailJS
    const params = {
      user_name: name,
      ph_no: number,
      user_email: email,
      message: message,
    };

    console.log("Sending the following parameters:", params);

    // Send Email using EmailJS
    emailjs
      .send("service_keqncfa", "template_4f02w0v", params) // Replace with your actual service and template IDs
      .then((res) => {
        alert("Email sent successfully!");
        console.log("EmailJS response:", res);

        // Clear the input fields after success
        document.querySelector(".user_name").value = "";
        document.querySelector(".user_email").value = "";
        document.querySelector(".ph_no").value = "";
        document.querySelector(".message").value = "";
      })
      .catch((err) => {
        console.error("Error sending email:", err);
        alert("Something went wrong! Please try again.");
      });
  });
}
