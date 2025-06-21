document.addEventListener('DOMContentLoaded', () => {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwB8yaXxD_xfcIt9qy9Ysn1pYGoVACrqUwHSALB-2XYmJErNWh_n12bXZNJuXRFR1Zptg/exec';
  const form = document.getElementById('mdaForm');
  const motivationField = form.elements['motivation'];
  const schoolSelect = document.getElementById('school');
  const schoolOtherGroup = document.getElementById('school-other-group');
  const submitBtn = document.querySelector('#submit-btn');

  // Toggle other school field visibility
  schoolSelect.addEventListener('change', function() {
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
    
    // UI feedback while processing
    submitBtn.textContent = '...processing';
    submitBtn.disabled = true;

    try {
      // Email validation
      const email = form.elements['email'].value;
      if (!validateEmail(email)) {
        showNotification("Please enter a valid email address.", true);
        return;
      }

      // Word count validation
      const words = motivationField.value.trim().split(/\s+/).length;
      if (words > 150) {
        showNotification("Please keep your answer under 150 words.", true);
        return;
      }

      // Prepare form data
      const formData = new FormData(form);
      const submissionData = Object.fromEntries(formData);
      
      // Set correct school value
      submissionData.school = schoolSelect.value === 'Other' 
        ? document.getElementById('school-other').value 
        : schoolSelect.value;

      // First check for existing submission (including IP check)
      const checkResponse = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: submissionData.email,
          // The backend will automatically get the IP from headers
          // We don't need to send it from frontend
          checkOnly: true // Optional flag to indicate this is just a check
        })
      });

      const checkResult = await checkResponse.json();
      
      if (checkResult.error || checkResult.success === false) {
        const errorMsg = checkResult.error || "You have already submitted an application";
        showNotification(errorMsg, true);
        return;
      }

      // If no duplicate found, proceed with full submission
      const submitResponse = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const result = await submitResponse.json();
      
      if (result.error || result.success === false) {
        throw new Error(result.error || "Submission failed");
      }

      showNotification("Your application has been submitted successfully!", false);
      form.reset();
      document.querySelector('#counter1').textContent = "0";
      
    } catch (error) {
      console.error('Submission error:', error);
      showNotification("Error submitting form: " + error.message, true);
    } finally {
      submitBtn.textContent = 'Submit Application';
      submitBtn.disabled = false;
    }
  });

  function showNotification(message, isError) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
    notification.style.display = 'block';

    // Reset animation
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