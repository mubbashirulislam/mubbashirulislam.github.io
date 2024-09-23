// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const menuIcon = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  const header = document.querySelector("header");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("header nav a");

  // Toggle menu icon and navbar
  const toggleMenu = () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  };

  // Scroll sections active link and sticky navbar
  const handleScroll = () => {
    const top = window.scrollY;

    // Update active navigation link based on scroll position
    sections.forEach((sec) => {
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href").slice(1) === id) {
            link.classList.add("active");
          }
        });
      }
    });

    // Add sticky class to header when scrolled
    header.classList.toggle("sticky", top > 100);

    // Remove toggle icon and navbar when scrolling
    menuIcon.classList.remove("bx-x");
    navbar.classList.remove("active");
  };

  // Scroll reveal initialization
  const sr = ScrollReveal({
    // ScrollReveal options
    distance: "80px",
    duration: 2000,
    delay: 200,
  });

  // Scroll reveal animations
  // Reveal elements from top
  sr.reveal(".home-content, .heading", { origin: "top" });
  // Reveal elements from bottom
  sr.reveal(".home-img, .services-container, .portfolio-box, .contact form", {
    origin: "bottom",
  });
  // Reveal elements from left
  sr.reveal(".home-content h1, .about-img", { origin: "left" });
  // Reveal elements from right
  sr.reveal(".home-content p, .about-content", { origin: "right" });

  // Typed.js initialization
  const typed = new Typed(".multiple-text", {
    // Typed.js options
    strings: [
      "Security Researcher", 
      // "Tech Enthusiast", 
      "OSINT Analyst"],

    typeSpeed: 40,
    backSpeed: 50,
    backDelay: 1000,
    loop: true,
  });

  // Event Listeners
  menuIcon.addEventListener("click", toggleMenu);
  window.addEventListener("scroll", handleScroll);
});



// EmailJS script

  (function() {
    // TODO: Replace with your EmailJS user ID
    emailjs.init("0BYX4kqnwqAFQWw8Z");
  })();

  document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // TODO: Replace with your EmailJS service ID and template ID
    emailjs.sendForm("service_d14hyoh", "template_94gen0a", this).then(
      function () {
        console.log("SUCCESS!");
        alert("Message sent successfully!");
        document.getElementById("contact-form").reset();
      },
      function (error) {
        console.log("FAILED...", error);
        alert("Failed to send the message. Please try again.");
      }
    );
  });