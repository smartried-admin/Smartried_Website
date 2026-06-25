(function () {
  'use strict';

  const SITE_URL = 'https://www.smartried.com';
  const BUSINESS = {
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    '@id': SITE_URL + '/#organization',
    name: 'Smartried Software Technologies Pvt Ltd',
    url: SITE_URL + '/',
    logo: SITE_URL + '/img/smartried_logo.png',
    image: SITE_URL + '/img/smartried_logo.png',
    email: 'info@smartried.com',
    telephone: '+91-91876-95853',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1st Floor, Beta Block, Sigma Tech Park, Varthur Kodi, Whitefield Main Road',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560066',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://in.linkedin.com/company/smartried-software-technologies-pvt-ltd',
      'https://www.facebook.com/smartriedtechnologies/',
      'https://www.instagram.com/smartriedtechnologies/',
    ],
  };

  const COURSES = {
    '/course-java': {
      name: 'Java Full Stack Development',
      description: 'Java Full Stack training covering Core Java, Spring Boot, Hibernate, React, MySQL, REST APIs, projects, and placement assistance.',
    },
    '/course-python': {
      name: 'Python Full Stack Development',
      description: 'Python Full Stack training covering Python, Django, Flask, SQL, front-end basics, real-time projects, and placement assistance.',
    },
    '/course-data-engineering': {
      name: 'Data Engineering (Azure)',
      description: 'Azure Data Engineering training covering Azure Data Factory, Databricks, Synapse, PySpark, SQL, cloud data pipelines, and projects.',
    },
    '/course-devops': {
      name: 'DevOps Engineering',
      description: 'DevOps training covering Docker, Kubernetes, Jenkins, AWS, Terraform, CI/CD pipelines, hands-on labs, and projects.',
    },
    '/course-automation': {
      name: 'Automation Testing',
      description: 'Automation Testing training covering Selenium, TestNG, Cucumber, API testing, Postman, Java, and real-time projects.',
    },
  };

  const FAQS = {
    '/contact': [
      ['How do I enroll?', 'Fill out the contact form, call Smartried, or email the team. A counselor will guide you through the enrollment process.'],
      ['Are programs available online?', 'Yes. Programs are available in online and offline classroom modes.'],
      ['Is placement support available?', 'Yes. Placement assistance includes resume building, mock interviews, career counseling, and job referrals.'],
    ],
  };

  function cleanPath() {
    let path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (path === '/index.html') path = '/';
    return path.replace(/\.html$/, '');
  }

  function addJsonLd(data) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function breadcrumb(path) {
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL + '/',
      },
    ];

    if (path !== '/') {
      const label = document.title.split('|')[0].replace(' - Smartried', '').trim() || 'Page';
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: label,
        item: SITE_URL + path,
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
  }

  function courseSchema(path) {
    const course = COURSES[path];
    if (!course) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.name,
      description: course.description,
      url: SITE_URL + path,
      provider: {
        '@type': 'Organization',
        '@id': SITE_URL + '/#organization',
        name: BUSINESS.name,
        sameAs: SITE_URL + '/',
      },
      offers: {
        '@type': 'Offer',
        category: 'Education',
        availability: 'https://schema.org/InStock',
        url: SITE_URL + '/contact',
      },
      courseMode: ['Online', 'Onsite'],
      educationalCredentialAwarded: 'Certificate of Completion',
    };
  }

  function faqSchema(path) {
    const faqs = FAQS[path];
    if (!faqs) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(function (faq) {
        return {
          '@type': 'Question',
          name: faq[0],
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq[1],
          },
        };
      }),
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    const path = cleanPath();
    addJsonLd({ '@context': 'https://schema.org', ...BUSINESS });
    addJsonLd(breadcrumb(path));

    const course = courseSchema(path);
    if (course) addJsonLd(course);

    const faq = faqSchema(path);
    if (faq) addJsonLd(faq);
  });
})();
