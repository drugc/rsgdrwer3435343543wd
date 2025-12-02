function updateAge() {
    const birthDate = new Date("2007-03-11T17:10:00Z");

    const age = (
        (Date.now() - birthDate.getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    ).toFixed(10);

   
    const ageSpan = document.getElementById("current-age");
    if (ageSpan) {
        ageSpan.innerText = age;
    }
}



setInterval(updateAge, 1);



