// trackalytics/static/js/main.js
document.addEventListener("DOMContentLoaded", function() {
    // Sidebar Toggle Functionality
    const sidebar = document.querySelector('aside');
    const closeBtn = document.getElementById('close-btn');
    
    // Toggle Sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
    }
    
    // Close Sidebar
    if(closeBtn) {
        closeBtn.addEventListener('click', function() {
            sidebar.style.display = 'none';
            localStorage.setItem('sidebarState', 'closed');
        });
    }

    // Responsive Sidebar Handling
    function handleResponsive() {
        if(window.innerWidth < 768) {
            sidebar.classList.add('mobile');
        } else {
            sidebar.classList.remove('mobile');
        }
    }

    // Initialize
    handleResponsive();
    window.addEventListener('resize', handleResponsive);

    // Restore Sidebar State
    const savedState = localStorage.getItem('sidebarState');
    if(savedState === 'closed') {
        sidebar.style.display = 'none';
    }
});