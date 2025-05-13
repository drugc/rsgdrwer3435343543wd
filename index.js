window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('sticky', window.scrollY > 50);
    });


    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

 
    document.querySelectorAll('.nav-links li a').forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    
    const skillCards = document.querySelectorAll('.skill-card');
    
   
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    
                    
                    const progressBar = entry.target.querySelector('.progress-bar');
                    const width = progressBar.getAttribute('data-width');
                    progressBar.style.width = width + '%';
                }, index * 200);
                
              
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

  
    skillCards.forEach(card => {
        observer.observe(card);
    });

 
    const contactDetails = document.querySelectorAll('.contact-detail');
    

    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
                
                contactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });


    contactDetails.forEach(detail => {
        contactObserver.observe(detail);
    });

   
  //  const contactForm = document.getElementById('contactForm'); 
    //contactForm.addEventListener('submit', function(e) {
       // e.preventDefault();
        
       
      //  const name = document.getElementById('name').value;
      //  const email = document.getElementById('email').value;
     //   const subject = document.getElementById('subject').value;
     //   const message = document.getElementById('message').value;
        
       
      //  console.log({name, email, subject, message});
        
       
     //   alert('Thank you for your message! I will get back to you soon.');
        
      
     //   contactForm.reset();
   // });
