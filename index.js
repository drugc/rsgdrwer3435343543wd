document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });


    const reviews = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentReview = 0;

    function showReview(index) {
        reviews.forEach(review => review.classList.remove('active'));
        reviews[index].classList.add('active');
    }

    function nextReview() {
        currentReview = (currentReview + 1) % reviews.length;
        showReview(currentReview);
    }

    function prevReview() {
        currentReview = (currentReview - 1 + reviews.length) % reviews.length;
        showReview(currentReview);
    }


    showReview(currentReview);


    const autoAdvance = setInterval(nextReview, 5000);


    nextBtn.addEventListener('click', () => {
        clearInterval(autoAdvance);
        nextReview();
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(autoAdvance);
        prevReview();
    });


    document.querySelector('.reviews-container').addEventListener('mouseleave', () => {
        setInterval(nextReview, 5000);
    });
});
