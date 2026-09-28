/* =========================================================
   ELEVPU - PCME WEBSITE
   Main JavaScript
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const html = document.documentElement;

const body = document.body;

const menuToggle =
    document.getElementById("menu-toggle");

const mobileNav =
    document.getElementById("mobile-nav");

const themeToggle =
    document.getElementById("theme-toggle");

const themeIcon =
    document.getElementById("theme-icon");

const header =
    document.getElementById("site-header");


/* =========================================================
   THEME SYSTEM
========================================================= */

function applyTheme(theme) {

    if (theme === "system") {

        html.removeAttribute("data-theme");

        themeIcon.textContent = "◐";

        return;
    }


    html.setAttribute(
        "data-theme",
        theme
    );


    themeIcon.textContent =
        theme === "dark"
            ? "☀"
            : "☾";

}


function loadTheme() {

    const savedTheme =
        localStorage.getItem("elevbpu-theme");


    if (
        savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system"
    ) {

        applyTheme(savedTheme);

    } else {

        applyTheme("system");

    }

}


function cycleTheme() {

    const current =
        localStorage.getItem("elevbpu-theme")
        || "system";


    let nextTheme;


    if (current === "system") {

        nextTheme = "light";

    } else if (current === "light") {

        nextTheme = "dark";

    } else {

        nextTheme = "system";

    }


    localStorage.setItem(
        "elevbpu-theme",
        nextTheme
    );


    applyTheme(nextTheme);

}


themeToggle.addEventListener(
    "click",
    cycleTheme
);


loadTheme();


/* =========================================================
   MOBILE MENU
========================================================= */

function closeMobileMenu() {

    mobileNav.classList.remove("open");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    body.classList.remove("menu-open");

}


function toggleMobileMenu() {

    const isOpen =
        mobileNav.classList.toggle("open");


    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );


    body.classList.toggle(
        "menu-open",
        isOpen
    );

}


menuToggle.addEventListener(
    "click",
    toggleMobileMenu
);


mobileNav.querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


/* =========================================================
   HEADER SCROLL
========================================================= */

function updateHeaderOnScroll() {

    if (window.scrollY > 20) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    updateHeaderOnScroll,
    { passive: true }
);


updateHeaderOnScroll();


/* =========================================================
   SMOOTH ANCHOR NAVIGATION
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(anchor => {

    anchor.addEventListener(
        "click",
        event => {

            const targetId =
                anchor.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {

                return;

            }


            const target =
                document.querySelector(targetId);


            if (!target) {

                return;

            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});


/* =========================================================
   MODAL SYSTEM
========================================================= */

const modalTriggers =
    document.querySelectorAll(
        ".modal-trigger"
    );


const modals =
    document.querySelectorAll(
        ".modal"
    );


let activeModal = null;

let lastFocusedElement = null;


/* Open modal */

function openModal(modalId) {

    const modal =
        document.getElementById(modalId);


    if (!modal) {

        return;

    }


    lastFocusedElement =
        document.activeElement;


    activeModal = modal;


    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    body.classList.add("modal-open");


    const closeButton =
        modal.querySelector(".modal-x");


    if (closeButton) {

        setTimeout(() => {

            closeButton.focus();

        }, 50);

    }

}


/* Close modal */

function closeModal(modal) {

    if (!modal) {

        return;

    }


    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    body.classList.remove(
        "modal-open"
    );


    if (
        lastFocusedElement &&
        typeof lastFocusedElement.focus === "function"
    ) {

        lastFocusedElement.focus();

    }


    activeModal = null;

}


/* Trigger buttons */

modalTriggers.forEach(trigger => {

    trigger.addEventListener(
        "click",
        () => {

            const modalId =
                trigger.dataset.modal;


            openModal(modalId);

        }
    );

});


/* Close buttons and overlay */

modals.forEach(modal => {

    modal.querySelectorAll(
        ".modal-close"
    ).forEach(closeElement => {

        closeElement.addEventListener(
            "click",
            () => {

                closeModal(modal);

            }
        );

    });

});


/* Escape key */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            activeModal
        ) {

            closeModal(activeModal);

        }

    }
);


/* =========================================================
   MODAL SCROLL LOCK
========================================================= */

const originalBodyPadding =
    window.innerWidth -
    document.documentElement.clientWidth;


body.style.setProperty(
    "--scrollbar-width",
    `${originalBodyPadding}px`
);


/* =========================================================
   SYSTEM THEME CHANGE
========================================================= */

const systemThemeQuery =
    window.matchMedia(
        "(prefers-color-scheme: dark)"
    );


systemThemeQuery.addEventListener(
    "change",
    () => {

        const savedTheme =
            localStorage.getItem("elevbpu-theme")
            || "system";


        if (savedTheme === "system") {

            applyTheme("system");

        }

    }
);


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Tab" ||
            !activeModal
        ) {

            return;

        }


        const focusable =
            activeModal.querySelectorAll(
                'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );


        if (!focusable.length) {

            return;

        }


        const first =
            focusable[0];

        const last =
            focusable[focusable.length - 1];


        if (
            event.shiftKey &&
            document.activeElement === first
        ) {

            event.preventDefault();

            last.focus();

        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {

            event.preventDefault();

            first.focus();

        }

    }
);


/* =========================================================
   PAGE READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.body.classList.add(
            "page-ready"
        );

    }
);