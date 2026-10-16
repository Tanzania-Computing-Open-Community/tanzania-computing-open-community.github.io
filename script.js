(() => {
    "use strict";


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


    document.documentElement.classList.add("js-enabled");


    const backgroundVideos = document.querySelectorAll(
        ".page-background__video, .github-panel__video"
    );

    const ensureBackgroundVideos = () => {
        let allPlaying = true;

        backgroundVideos.forEach((video) => {
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;
            video.setAttribute("playsinline", "");

            if (video.paused) {
                allPlaying = false;

                const playing = video.play();

                if (playing && typeof playing.catch === "function") {
                    playing.catch(() => {});
                }
            }
        });

        return allPlaying;
    };

    const startPlaybackRetries = () => {
        let retries = 0;

        if (ensureBackgroundVideos()) {
            return;
        }

        const timer = window.setInterval(() => {
            retries += 1;

            if (ensureBackgroundVideos() || retries > 20) {
                window.clearInterval(timer);
            }
        }, 1000);
    };

    if (reducedMotionQuery.matches) {
        backgroundVideos.forEach((video) => {
            video.removeAttribute("autoplay");
            video.pause();
        });
    } else {
        startPlaybackRetries();

        ["touchstart", "touchend", "click", "keydown"].forEach(
            (eventName) => {
                window.addEventListener(
                    eventName,
                    ensureBackgroundVideos,
                    { passive: true }
                );
            }
        );

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) {
                startPlaybackRetries();
            }
        });
    }

})();
