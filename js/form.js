document.addEventListener('DOMContentLoaded', () => {
  // Form Submission Code (keep your existing functionality)
  const scriptURL = 'https://script.google.com/macros/s/AKfycbxyScWUonu2S_1kDgk_egURNbjwmFvwN1Az1_pPh7Vt-ARKEXcEvDo8cAbG7QaHm5ruJg/exec';
  const form = document.getElementById('mdaForm');
  const motivationField = form.elements['motivation'];
  const schoolSelect = document.getElementById('school'); // normal option
  const schoolOtherGroup = document.getElementById('school-other-group');

  schoolSelect.addEventListener('change', function () {
    if (this.value === 'Other') {
      schoolOtherGroup.style.display = 'block';
      document.getElementById('school-other').required = true;
    } else {
      schoolOtherGroup.style.display = 'none';
      document.getElementById('school-other').required = false;
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = document.querySelector('#submit-btn');
    submitBtn.textContent = '...processing';
    submitBtn.disabled = true; // Disable button during processing

    try {
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
      data.set('school', schoolSelect.value === 'Other' ? document.getElementById('school-other').value : schoolSelect.value);

      // // Check if email was submitted before 
      const submittedEmails = await fetch(scriptURL)
      .then(data => data.json())
      .then(data => {
        return data
      })
      .catch(err => console.log(`error occured : ${err}`));

      const doesSubmittedBefore = submittedEmails.emails.some(element => element === email);

      // Submit the form data
      if (doesSubmittedBefore) {
        showNotification('You have esubmitted an application before', true);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
        return;
      } 

      await fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(data)),
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors'
      });
      showNotification("Your application has been submitted successfully!", false);
      setTimeout(() => {
        window.location.href = 'sucess.html';
      }, 1500);
      // form.reset();
      // document.querySelector('#counter1').textContent = "0";

    } catch (error) {
      console.error('Submission error:', error);
      showNotification("Error submitting form: " + error.message, true);
    } finally {
      submitBtn.textContent = 'Submit Application';
      submitBtn.disabled = false;
    }
  });

  // Notification function
  function showNotification(message, isError) {
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

});