
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filterbt');
    const items = document.querySelectorAll('.item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('new-account-active'));
            button.classList.add('new-account-active');
            const filter = button.getAttribute('data-filter');
            items.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                } else {
                    if (item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
    document.querySelector('[data-filter="all"]').click();
});






