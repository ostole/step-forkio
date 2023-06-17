const menuBtn = document.querySelector(".burger");
const menuBurger = document.querySelector(".header__menu-burger");
const body = document.body;
let menuOpen = false;

menuBtn.addEventListener("click", () => {
    if (!menuOpen) {
        menuBtn.classList.add("open");
        menuBurger.classList.add("open-menu");

        menuOpen = true;
    } else {
        menuBtn.classList.remove("open");
        menuBurger.classList.remove("open-menu");
        menuOpen = false;
    }
});

document.addEventListener("click", (e) => {
    const target = e.target;
    if (
        !target.closest(".burger") &&
        !target.closest(".header__menu-burger")
    ) {
        menuBurger.classList.remove("open-menu");
        menuBtn.classList.remove("open");
        menuOpen = false;
    }
});

body.onresize = (e) => {
    if (e.target.innerWidth >= 480) {
        menuBtn.classList.remove("open");
        menuBurger.classList.remove("open-menu");
        menuOpen = false;
    }
};
