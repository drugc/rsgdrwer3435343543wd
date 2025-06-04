  
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    

    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        

        const button = this.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = '✅ Message Sent!';
        button.style.background = 'linear-gradient(145deg, #32CD32, #228B22)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(145deg, #FFD700, #FFA500)';
            this.reset();
        }, 2000);
    });
    
   
    function createFloatingBlock() {
        const block = document.createElement('div');
        block.className = 'floating-block';
        block.style.left = Math.random() * 100 + '%';
        block.style.top = Math.random() * 100 + '%';
        block.style.animationDelay = Math.random() * 5 + 's';
        
        const colors = ['#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887'];
        block.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        document.querySelector('.floating-blocks').appendChild(block);
        
     
        setTimeout(() => {
            if (block.parentNode) {
                block.parentNode.removeChild(block);
            }
        }, 6000);
    }
    
 
    setInterval(createFloatingBlock, 3000);
    
  
    document.querySelectorAll('.skill-block, .social-link, button').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform || '';
            this.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('click', function() {
            this.style.transform += ' scale(0.95)';
            setTimeout(() => {
                this.style.transform = this.style.transform.replace(' scale(0.95)', '');
            }, 100);
        });
    });
    

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const cube = document.querySelector('.cube-container');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        if (cube) {
            cube.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
