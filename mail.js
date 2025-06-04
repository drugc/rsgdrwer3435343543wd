document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    const mailto = `mailto:mirouout@gmail.com?subject=Contact&body=${encodeURIComponent(`From: ${email}\n\n${message}`)}`;
    window.location.href = mailto;
    this.reset();
});
