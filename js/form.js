document.addEventListener('DOMContentLoaded', ()=> {
  // Form Submission Code (keep your existing functionality)
  const scriptURL = 'https://script.google.com/macros/s/AKfycbztzLlKM0Q8_xbPLVgE1FYQwlM2meF23DYdkMrBYYaVIQ7UsIQiR2Gam3UxnvUPIP4r7Q/exec';
  const form = document.getElementById('mdaForm');
  const motivationField = form.elements['motivation'];
  const schoolSelect = document.getElementById('school'); // normal option
  const schoolOtherGroup = document.getElementById('school-other-group');

  schoolSelect.addEventListener('change', function() {
    if (this.value === 'Other') {
      schoolOtherGroup.style.display = 'block';
      document.getElementById('school-other').required = true;
    } else {
      schoolOtherGroup.style.display = 'none';
      document.getElementById('school-other').required = false;
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Email checking
    const email = form.elements['email'].value;
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Word count validation
    const words = motivationField.value.trim().split(/\s+/).length;
    if (words > 150) {
      alert("Please keep your answer under 150 words.");
      return;
    }
      

    const data = new FormData(form);
    data.set('school', schoolSelect.value === 'Other' ? document.getElementById('school-other').value : schoolSelect.value)

    // add the data online
    fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(data)),
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'no-cors'
    })
    .then(() => {
      showNotification();
      form.reset();
      document.querySelector('#counter1').textContent = "0";
    })
    .catch(error =>
      showNotification("Error submitting form: " + error.message, true)
    );

    // Notification function
  function showNotification(message = "Your application has been submitted successfully!", isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
    notification.style.display = 'block';
    
    // Reset animation by briefly removing and re-adding the element
    notification.style.animation = 'none';
    notification.offsetHeight; /* trigger reflow */
    notification.style.animation = null;
    
    // Hide after animation completes
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }


})});