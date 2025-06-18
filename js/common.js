// Mobile Menu Toggle - Add this new code
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }
    
    // Accurate word counting function
    function countWords(text) {
      return text.trim() === "" ? 0 : text.trim().split(/[\s\n]+/).filter(word => word.length > 0).length;
    }
    // Initialize all textareas with word counting
    document.querySelectorAll('.writing').forEach(textarea => {
      const counterId = textarea.dataset.counter;
      const counterElement = document.getElementById(counterId);
      const maxWords = 250; // Set your word limit here
    
      function updateCounter() {
        const words = countWords(textarea.value);
        counterElement.textContent = words;
        
        // Visual feedback when exceeding limit
        if (words > maxWords) {
          counterElement.style.color = 'red';
          counterElement.parentElement.classList.add('over-limit');
        } else {
          counterElement.style.color = 'inherit';
          counterElement.parentElement.classList.remove('over-limit');
        }
      }
    
      // Event listeners for all interaction types
      textarea.addEventListener('input', updateCounter);
      textarea.addEventListener('keydown', updateCounter);
      textarea.addEventListener('paste', function() {
        setTimeout(updateCounter, 10); // Small delay for paste to complete
      });
    
      // Initialize counter
      updateCounter();
    });
    
    
      
});
