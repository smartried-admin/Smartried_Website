(function () {
  'use strict';

  const footerHost = document.getElementById('siteFooter');
  if (!footerHost) return;

  footerHost.innerHTML = `
<footer class="site-footer">
  <div class="footer-main"><div class="container"><div class="footer-grid">
    <div class="footer-brand"><img src="/img/smartried_logo.png" alt="Smartried Logo" /><p class="footer-tagline">Build a Successful Software Career Through Practical Training and Placement Support</p><p>Smartried Software Technologies is a forward-thinking software training and placement organization dedicated to shaping the next generation of skilled software developers.</p><div class="footer-social"><a href="https://in.linkedin.com/company/smartried-software-technologies-pvt-ltd" class="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin-in"></i></a><a href="https://www.facebook.com/smartriedtechnologies/" class="social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook-f"></i></a><a href="https://api.whatsapp.com/send/?phone=8095044415&text&type=phone_number&app_absent=0" class="social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i></a><a href="https://www.instagram.com/smartriedtechnologies/" class="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i></a></div></div>
    <div class="footer-col"><h4>Programs</h4><ul class="footer-links"><li><a href="/course-java">Java Full Stack</a></li><li><a href="/course-python">Python Full Stack</a></li><li><a href="/course-data-engineering">Data Engineering (Azure)</a></li><li><a href="/course-devops">DevOps</a></li><li><a href="/course-automation">Automation Testing</a></li></ul></div>
    <div class="footer-col"><h4>Services</h4><ul class="footer-links"><li><a href="/service-training">Training</a></li><li><a href="/service-placement">Placement</a></li><li><a href="/service-outsourcing">IT Outsourcing</a></li><li><a href="/about">About Us</a></li><li><a href="/contact">Contact Us</a></li></ul></div>
    <div class="footer-col"><h4>Contact</h4><div class="footer-contact-list"><div class="footer-contact-item"><span class="f-icon"><i class="fa-solid fa-location-dot"></i></span><span>Bangalore, Karnataka, India - 560066</span></div><div class="footer-contact-item"><span class="f-icon"><i class="fa-solid fa-phone"></i></span><span><a href="tel:+918095044415">+91 80950 44415</a></span></div><div class="footer-contact-item"><span class="f-icon"><i class="fa-solid fa-phone"></i></span><span><a href="tel:+918095044416">+91 80950 44416</a></span></div><div class="footer-contact-item"><span class="f-icon"><i class="fa-solid fa-envelope"></i></span><a href="mailto:info@smartried.com" style="color:rgba(255,255,255,0.7);">info@smartried.com</a></div><div class="footer-contact-item"><span class="f-icon"><i class="fa-solid fa-clock"></i></span><span>Mon&ndash;Sat: 9:00 AM &ndash; 6:00 PM</span></div></div></div>
  </div></div></div>
  <div class="footer-bottom"><div class="container"><div class="footer-bottom-inner"><span>&copy; 2026 Smartried Training & Placement. All rights reserved.</span><div class="footer-bottom-links"><a id="privacyTrigger" href="/privacy-policy">Privacy Policy</a><a id="termsTrigger" href="/terms-of-use">Terms of Use</a></div></div></div></div>
</footer>

<!-- Privacy Policy Modal -->
<div id="privacyModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Privacy Policy</h2>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>
    <div class="modal-body">
      <h3>1. Information We Collect</h3>
      <p>Smartried Software Technologies Pvt Ltd collects personal information that you voluntarily provide to us, including: Name, email address, phone number, educational background, resume, enrollment details, and communication preferences.</p>
      <h3>2. How We Use Your Information</h3>
      <p>We use information for: Processing enrollments, providing training and placement assistance, communicating updates, responding to inquiries, improving services, complying with legal obligations, and marketing communications (with consent).</p>
      <h3>3. Data Security</h3>
      <p>We implement appropriate technical and organizational measures to safeguard your data against unauthorized access, alteration, disclosure, or destruction.</p>
      <h3>4. Sharing Your Information</h3>
      <p>We do not sell your information. We may share data with employers, partners, or when required by law.</p>
      <h3>5. Your Rights</h3>
      <p>You have rights to access, correct, or delete your information. Contact <a href="mailto:info@smartried.com">info@smartried.com</a> to exercise these rights.</p>
    </div>
  </div>
</div>

<!-- Terms of Use Modal -->
<div id="termsModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Terms of Use</h2>
      <button class="modal-close" aria-label="Close modal">&times;</button>
    </div>
    <div class="modal-body">
      <h3>1. Acceptance of Terms</h3>
      <p>By enrolling in any program, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.</p>
      <h3>2. Training Programs</h3>
      <p>Our programs are designed to provide quality education. By enrolling, you agree to attend classes regularly, adhere to schedule requirements, follow conduct guidelines, complete assignments, and use materials responsibly.</p>
      <h3>3. Placement Assistance Disclaimer</h3>
      <p><strong>We do not guarantee job placement.</strong> Outcomes depend on market trends, your performance, and employer decisions. Completing the program does not guarantee employment.</p>
      <h3>4. Student Responsibilities</h3>
      <p>Maintain academic integrity, respect intellectual property, and follow all protocols.</p>
      <h3>5. Code of Conduct</h3>
      <p>We reserve the right to terminate enrollment for disruptive behavior, academic dishonesty, or policy violations.</p>
      <h3>6. Liability Limitation</h3>
      <p>We are not liable for placement outcomes, salary levels, or market changes.</p>
    </div>
  </div>
</div>`;
})();


