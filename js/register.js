document.addEventListener('DOMContentLoaded', function() {
    // Word counter functionality
    const textareas = document.querySelectorAll('.writing');
    textareas.forEach(textarea => {
        const counterId = textarea.getAttribute('data-counter');
        const counter = document.getElementById(counterId);
        
        textarea.addEventListener('input', function() {
            const wordCount = countWords(this.value);
            counter.textContent = wordCount;
        });
    });

    // School selection toggle
    const schoolSelect = document.getElementById('school');
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

    // Form submission handler
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate word counts
        if (!validateWordCounts()) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Prepare form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            birthdate: document.getElementById('birthdate').value,
            school: schoolSelect.value === 'Other' ? 
                   document.getElementById('school-other').value : 
                   schoolSelect.value,
            photo: document.getElementById('photo').value,
            hours: document.getElementById('hours').value || '0',
            knowledge: document.getElementById('knowledge').value,
            willing: document.getElementById('willing').value,
            relation: document.getElementById('relation').value
        };
        
        // Send data to Google Sheets
        submitFormData(formData)
            .then(response => {
                if (response.result === 'success') {
                    alert('Application submitted successfully!');
                    form.reset();
                    // Reset word counters
                    document.querySelectorAll('.word-count span').forEach(span => {
                        span.textContent = '0';
                    });
                } else {
                    throw new Error(response.message || 'Submission failed');
                }
            })
            .catch(error => {
                alert('Error submitting application: ' + error.message);
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            });
    });
});

function countWords(text) {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
}

function validateWordCounts() {
    const knowledgeWords = countWords(document.getElementById('knowledge').value);
    const willingWords = countWords(document.getElementById('willing').value);
    const relationWords = countWords(document.getElementById('relation').value);
    
    if (knowledgeWords < 150 || knowledgeWords > 250) {
        alert('Please write between 150-250 words for "What do you know about being an ambassador?"');
        return false;
    }
    
    if (willingWords < 150 || willingWords > 250) {
        alert('Please write between 150-250 words for "Why do you want to be an ambassador?"');
        return false;
    }
    
    if (relationWords < 100 || relationWords > 150) {
        alert('Please write between 100-150 words for "Describe your relation with your school management"');
        return false;
    }
    
    return true;
}

async function submitFormData (formData) {
    // Replace with your Apps Script web app URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwCUDXa8zOUpYqaVT6-xwj5HARakoN_8fhQchGGLPRT5mAz-vFSC1yqIG_8gGOh50tK/exec';
    
    return await fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    });
}