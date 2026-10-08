/* =========================================================
   TCOSC — Tanzania Computing Open Source Community
   Global Website Behaviour
   ========================================================= */

(() => {
    "use strict";

    /* ---------------------------------------------------------
       01. Current Page Navigation
       --------------------------------------------------------- */

    const currentPath = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const currentPage = currentPath || "index.html";

    const navigationLinks = document.querySelectorAll(
        ".primary-navigation a[href]"
    );

    navigationLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("#")) {
            return;
        }

        if (
            href.startsWith("http://") ||
            href.startsWith("https://")
        ) {
            return;
        }

        const linkPage = href
            .split("/")
            .pop()
            .toLowerCase();

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });


    /* ---------------------------------------------------------
       02. Header Scroll State
       --------------------------------------------------------- */

    const header = document.querySelector(".site-header");

    const updateHeaderState = () => {
        if (!header) {
            return;
        }

        if (window.scrollY > 12) {
            header.classList.add("site-header--scrolled");
        } else {
            header.classList.remove("site-header--scrolled");
        }
    };

    updateHeaderState();

    window.addEventListener(
        "scroll",
        updateHeaderState,
        { passive: true }
    );


    /* ---------------------------------------------------------
       03. External Link Protection
       --------------------------------------------------------- */

    const links = document.querySelectorAll("a[href]");

    links.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        if (
            href.startsWith("https://") ||
            href.startsWith("http://")
        ) {
            const url = new URL(
                href,
                window.location.href
            );

            if (url.origin !== window.location.origin) {
                link.setAttribute("rel", "noopener noreferrer");
            }
        }
    });


    /* ---------------------------------------------------------
       04. Keyboard-Friendly External Link Indication
       --------------------------------------------------------- */

    links.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href) {
            return;
        }

        if (
            href.startsWith("https://github.com/") ||
            href.startsWith("http://github.com/")
        ) {
            link.setAttribute(
                "data-external",
                "github"
            );
        }
    });


    /* ---------------------------------------------------------
       05. Prevent Broken Empty Links
       --------------------------------------------------------- */

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        const href = link.getAttribute("href");

        if (!href || href === "#") {
            event.preventDefault();
        }
    });


    /* ---------------------------------------------------------
       06. Reduced Motion Awareness
       --------------------------------------------------------- */

    const reducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const updateMotionState = () => {
        document.documentElement.classList.toggle(
            "reduced-motion",
            reducedMotionQuery.matches
        );
    };

    updateMotionState();

    if (typeof reducedMotionQuery.addEventListener === "function") {
        reducedMotionQuery.addEventListener(
            "change",
            updateMotionState
        );
    }


    /* ---------------------------------------------------------
       07. Page Ready State
       --------------------------------------------------------- */

    document.documentElement.classList.add("js-enabled");

})();
