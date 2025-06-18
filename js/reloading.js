

window.addEventListener('beforeunload', function (event) {
    event.preventDefault(); 
    event.returnValue = ''; 
    alert('The page is about to reload. The content of the page will be gone');
});

