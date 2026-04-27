// Canon Wars — mobile nav toggle
(function() {
    var toggle = document.querySelector('.nav-toggle');
    var navList = document.querySelector('.nav-list');
    
    if (toggle && navList) {
        toggle.addEventListener('click', function() {
            var isActive = toggle.classList.toggle('is-active');
            navList.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });
        
        // Close nav when clicking a link
        navList.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                toggle.classList.remove('is-active');
                navList.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
})();
