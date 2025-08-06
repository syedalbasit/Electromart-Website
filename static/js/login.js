
// <------------------------------ Thoast Notification ------------------------------>

// showToast Function ( Display Different Thoast according to the input field )


const showToast = (message, type) => {
    let border = document.querySelector("#toast-border");
    border.classList.remove("toastBoderAnimation");
  
    toast_notification.classList.remove("toastanimate", "toastanimateout");
    void toast_notification.offsetWidth;
  
    border.classList.add("toastBoderAnimation");
  
    toast_notification.classList.add("toastanimate");
  
    // Update the toast message and icon
    toast_notification.querySelector('.toast__message h4').innerText = type;
    toast_notification.querySelector('.toast__message p').innerText = message;
  
    if (type === 'Success') {
      toast_notification.querySelector('.toast__link i').classList.remove('fa-xmark');
      toast_notification.querySelector('.toast__link i').classList.add('fa-check');
    } else {
      toast_notification.querySelector('.toast__link i').classList.remove('fa-check');
      toast_notification.querySelector('.toast__link i').classList.add('fa-xmark');
    }
    toast_notification.classList.add('show');
  
    setTimeout(() => {
      toast_notification.classList.remove("toastanimate");
      toast_notification.classList.add("toastanimateout");
      setTimeout(() => {
        toast_notification.classList.remove("toastanimateout");
        toast_notification.classList.remove('show');
      }, 300);
    }, 2300);
  };
  
  // Email Validate the inputs
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };
  
  const toast_notification = document.querySelector("#toast_notification");   //   thoastNotification Container
  const checkButton = document.querySelector(".btn1");
  
checkButton.addEventListener("click", (e) => {                              // Apply the click event to the button and the toast container 
    e.preventDefault();
  
    let pswd = document.querySelector("#pswd").value;
    let email = document.querySelector("#email").value;
    
    
    
    if (pswd === "" || email === "") {    // Check empty string 
      showToast("Fill out all the input fields", "Error");
    } else if (!isValidEmail(email)) {
      showToast("Please enter a valid Gmail address.", "Error");
    } else {
        
        const data = {
            email : email,
            password: pswd
        };

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          document.querySelector("#pswd").value = "";
          document.querySelector("#email").value = "";
          if (data.status === 'Success') {
            showToast('Login successfully', "Success");
            setTimeout(()=>{
              window.location.href = "/"
            }, 2000);
            }
          else if(data.status === 'Error'){
              showToast('User not found. Please error valid email and password', "Error");
            }
        })
        .catch((error) => {
          showToast("Form was not submitted.", "Error");
        });
    }      
});