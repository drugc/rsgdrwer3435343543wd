document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(hover: hover)').matches) {
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-dot-outline');
        
        document.body.classList.add('custom-cursor');
        
        let mouseX = -100;
        let mouseY = -100;
        let outlineX = -100;
        let outlineY = -100;
        let cursorVisible = false;

        const smoothing = 0.15;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!cursorVisible) {
                cursorVisible = true;
                setTimeout(() => {
                    cursorDot.classList.add('cursor-active');
                    cursorOutline.classList.add('cursor-active');
                }, 100);
            }
            
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * smoothing;
            outlineY += (mouseY - outlineY) * smoothing;
            
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            
            requestAnimationFrame(animateCursor);
        }
        
        animateCursor();
        
        document.addEventListener('mouseout', (e) => {
            if (e.relatedTarget === null) {
                cursorDot.classList.remove('cursor-active');
                cursorOutline.classList.remove('cursor-active');
                cursorVisible = false;
            }
        });
        
        document.addEventListener('mousedown', () => {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(0.75)`;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%) scale(0.75)`;
        });
        
        document.addEventListener('mouseup', () => {
            cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(1)`;
            cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%) scale(1)`;
        });
        
        const interactiveElements = document.querySelectorAll('a, button, .button, input, .skill-card, .project-card, .service-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseover', () => {
                cursorDot.style.width = '12px';
                cursorDot.style.height = '12px';
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.borderColor = 'rgba(0, 112, 243, 0.8)';
            });
            
            el.addEventListener('mouseout', () => {
                cursorDot.style.width = '8px';
                cursorDot.style.height = '8px';
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.borderColor = 'rgba(0, 112, 243, 0.5)';
            });
        });
    }
});


// Click to Enter Functionality
document.getElementById('enter-button').addEventListener('click', function () {
    document.getElementById('enter-overlay').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('background-music').play(); // Start playing the music
});

// Mute/Unmute Functionality
const muteButton = document.getElementById('mute-button');
const backgroundMusic = document.getElementById('background-music');

muteButton.addEventListener('click', function () {
    if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        backgroundMusic.muted = true;
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});