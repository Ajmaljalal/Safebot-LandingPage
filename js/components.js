/**
 * SafeBot Components
 * Reusable header and footer components for SafeBot website
 */

// Load header and footer when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Add mobile menu functionality
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Add scroll event listener for header
  const header = document.querySelector('header');

  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}); 