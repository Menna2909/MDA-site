document.addEventListener('DOMContentLoaded', ()=> {
  // Form Submission Code (keep your existing functionality)
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwEuit1iBA14Fdk7IbGLJzh8hu0Y2tuTFm4Yi0iewHRy0PZvRw3LKnPuDryaLZUrA6zYA/exec';
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
      body: data
    })
    .then(() => {
      console.log("Your application has been submitted successfully!");
      form.reset();
      document.querySelector('#counter1').textContent = "0";
    })
    .catch(error => alert("Error submitting form: " + error.message));
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }


});