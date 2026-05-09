(function () {
  'use strict';

  const headerHost = document.getElementById('siteHeader');
  if (!headerHost) return;

  headerHost.innerHTML = `
<header class="site-header">
  <nav class="nav-container">
    <a href="/home" class="nav-logo"><img src="/img/smartried_logo.png" alt="Smartried Logo" /></a>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <ul class="nav-menu" id="navMenu">
      <li class="nav-item"><a href="/home" class="nav-link">Home</a></li>
      <li class="nav-item has-dropdown"><button type="button" class="nav-link nav-dropdown-toggle" aria-expanded="false">Programs <svg class="nav-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><ul class="dropdown"><li><a href="/programs">All Programs</a></li><li><a href="/course-java">Java Full Stack</a></li><li><a href="/course-python">Python Full Stack</a></li><li><a href="/course-data-engineering">Data Engineering (Azure)</a></li><li><a href="/course-devops">DevOps</a></li><li><a href="/course-automation">Automation Testing</a></li></ul></li>
      <li class="nav-item has-dropdown"><button type="button" class="nav-link nav-dropdown-toggle" aria-expanded="false">Services <svg class="nav-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><ul class="dropdown"><li><a href="/service-training">Training</a></li><li><a href="/service-placement">Placement</a></li><li><a href="/service-outsourcing">IT Outsourcing</a></li></ul></li>
      <li class="nav-item"><a href="/about" class="nav-link">About Us</a></li>
      <li class="nav-item"><a href="/contact" class="nav-link">Contact Us</a></li>
      <li class="nav-item nav-cta"><a href="/contact" class="btn btn-primary btn-sm">Enroll Now</a></li>
    </ul>
  </nav>
</header>`;
})();


