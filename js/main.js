/**
 * SafeBot Landing Page JavaScript
 * Handles interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile menu when a nav link is clicked
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current FAQ item
      item.classList.toggle('active');

      // Change icon
      const icon = item.querySelector('.faq-toggle i');
      if (item.classList.contains('active')) {
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
      } else {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.padding = '0.5rem 0';
      header.classList.add('scrolled');
    } else {
      header.style.padding = '1rem 0';
      header.classList.remove('scrolled');
    }
  });

  // Enhanced animations on scroll with Intersection Observer
  const animateOnIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Different animations based on element type
        if (entry.target.classList.contains('feature-card')) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        } else if (entry.target.classList.contains('pricing-plan')) {
          if (entry.target.classList.contains('recommended')) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'scale(1.05)';
          } else {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
          }
        } else if (entry.target.classList.contains('step')) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateX(0)';
        } else if (entry.target.classList.contains('value-item')) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        } else if (entry.target.classList.contains('testimonial')) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        } else {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }

        // Unobserve after animation is applied
        observer.unobserve(entry.target);
      }
    });
  };

  // Create observer
  const animationObserver = new IntersectionObserver(animateOnIntersect, {
    root: null,
    threshold: 0.2,
    rootMargin: '0px 0px -10% 0px'
  });

  // Set initial state for animated elements and observe them
  const setupAnimatedElement = (element, index, type) => {
    element.style.opacity = 0;
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    // Add delay based on index
    const delay = 0.15 * (index % 4);
    element.style.transitionDelay = `${delay}s`;

    // Different initial state based on element type
    if (type === 'feature-card') {
      element.style.transform = 'translateY(30px)';
    } else if (type === 'step') {
      element.style.transform = 'translateX(-30px)';
    } else if (type === 'testimonial') {
      element.style.transform = 'translateY(30px) scale(0.95)';
    } else if (type === 'value-item') {
      element.style.transform = 'translateY(40px)';
    } else {
      element.style.transform = 'translateY(30px)';
    }

    // Observe the element
    animationObserver.observe(element);
  };

  // Setup animations for different element types
  document.querySelectorAll('.feature-card').forEach((el, i) => setupAnimatedElement(el, i, 'feature-card'));
  document.querySelectorAll('.value-item').forEach((el, i) => setupAnimatedElement(el, i, 'value-item'));
  document.querySelectorAll('.step').forEach((el, i) => setupAnimatedElement(el, i, 'step'));
  document.querySelectorAll('.testimonial').forEach((el, i) => setupAnimatedElement(el, i, 'testimonial'));
  document.querySelectorAll('.pricing-plan').forEach((el, i) => setupAnimatedElement(el, i, 'pricing-plan'));
  document.querySelectorAll('.faq-item').forEach((el, i) => setupAnimatedElement(el, i, 'faq-item'));

  // Add animation to value-cta
  const valueCta = document.querySelector('.value-cta');
  if (valueCta) {
    setupAnimatedElement(valueCta, 0, 'cta');
  }
}); 