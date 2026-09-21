// Subtle two-speed parallax on the gallery columns, approximating the
// independent-speed scrolling feel of the original Framer site.
(function () {
  const colLeft = document.getElementById("colLeft");
  const colRight = document.getElementById("colRight");
  const goUp = document.getElementById("goUp");

  const LEFT_SPEED = 0.03;
  const RIGHT_SPEED = 0.07;

  let ticking = false;

  function applyParallax() {
    const y = window.scrollY;
    colLeft.style.transform = `translateY(${y * -LEFT_SPEED}px)`;
    colRight.style.transform = `translateY(${y * -RIGHT_SPEED}px)`;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  applyParallax();

  goUp.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
