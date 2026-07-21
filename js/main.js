(function () {
    "use strict";

    const EMAIL = "imsabbirahmed.info@gmail.com";
    const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
    const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
    const categoryOrder = ["talking-head", "documentary", "entertainment"];
    const portfolioSections = document.getElementById("portfolioSections");
    const modal = document.getElementById("videoModal");
    const modalDialog = modal.querySelector("[role='dialog']");
    const modalVideo = document.getElementById("modalVideo");
    const modalEmbed = document.getElementById("modalEmbed");
    const modalCaptions = document.getElementById("modalCaptions");
    const privatePreview = document.getElementById("privatePreview");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalCategory = document.getElementById("modalCategory");
    const projectFacts = document.getElementById("projectFacts");
    const requestSample = document.getElementById("requestSample");
    const closeModalButton = document.getElementById("closeModal");
    const backgroundRegions = [document.querySelector(".site-header"), document.querySelector("main"), document.querySelector(".site-footer")].filter(Boolean);
    let activeProject = null;
    let previousFocus = null;

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (typeof text === "string") node.textContent = text;
        return node;
    }

    function createCard(project, clone) {
        const card = element("button", "project-card");
        card.type = "button";
        card.dataset.project = project.slug;
        card.setAttribute("aria-label", `${project.title}. Open project preview.`);

        if (clone) {
            card.dataset.clone = "true";
            card.tabIndex = -1;
            card.setAttribute("aria-hidden", "true");
            card.inert = true;
        }

        const image = document.createElement("img");
        image.src = project.image;
        image.alt = clone ? "" : project.alt;
        image.width = 560;
        image.height = 996;
        image.loading = "lazy";
        image.decoding = "async";
        image.referrerPolicy = "no-referrer";

        const topLine = element("span", "card-topline");
        topLine.appendChild(element("span", "card-badge", project.video ? "Watch" : "Private sample"));

        const play = element("span", "play-icon", project.video ? "▶" : "+");
        play.setAttribute("aria-hidden", "true");

        const content = element("span", "card-content");
        content.appendChild(element("small", "", project.tag));
        content.appendChild(element("strong", "", project.title));
        content.appendChild(element("span", "", project.description));

        card.append(image, topLine, play, content);
        return card;
    }

    function renderPortfolio() {
        if (!portfolioSections || projects.length === 0) return;
        const fragment = document.createDocumentFragment();

        categoryOrder.forEach((category) => {
            const categoryProjects = projects.filter((project) => project.category === category);
            if (!categoryProjects.length) return;

            const first = categoryProjects[0];
            const section = element("section", "carousel-module");
            section.dataset.category = category;
            section.setAttribute("aria-labelledby", `heading-${category}`);

            const header = element("div", "carousel-header");
            const headingWrap = element("div");
            const heading = element("h3", "", `${first.groupTitle} — ${first.groupAccent}`);
            heading.id = `heading-${category}`;
            headingWrap.append(heading, element("p", "", first.groupSubtitle));

            const controls = element("div", "carousel-controls");
            const previous = element("button", "", "←");
            previous.type = "button";
            previous.setAttribute("aria-label", `Show previous ${first.groupTitle} project`);
            previous.dataset.direction = "previous";
            const next = element("button", "", "→");
            next.type = "button";
            next.setAttribute("aria-label", `Show next ${first.groupTitle} project`);
            next.dataset.direction = "next";
            controls.append(previous, next);
            header.append(headingWrap, controls);

            const container = element("div", "carousel-container");
            container.tabIndex = 0;
            container.setAttribute("aria-label", `${first.groupTitle} project carousel`);
            const track = element("div", "carousel-track");
            categoryProjects.forEach((project) => track.appendChild(createCard(project, false)));
            categoryProjects.forEach((project) => track.appendChild(createCard(project, true)));
            container.appendChild(track);
            section.append(header, container);
            fragment.appendChild(section);
        });

        portfolioSections.replaceChildren(fragment);
    }

    function setMotionPaused(paused) {
        const toggle = document.getElementById("motionToggle");
        const label = document.getElementById("motionLabel");
        document.documentElement.dataset.motion = paused ? "paused" : "playing";
        toggle.setAttribute("aria-pressed", String(paused));
        label.textContent = paused ? "Resume motion" : "Pause motion";
        try {
            localStorage.setItem("portfolio-motion", paused ? "paused" : "playing");
        } catch (_) {
            // The preference is optional when storage is unavailable.
        }
    }

    function initializeMotionPreference() {
        let saved = null;
        try {
            saved = localStorage.getItem("portfolio-motion");
        } catch (_) {
            saved = null;
        }
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setMotionPaused(saved ? saved === "paused" : reduced);
    }

    function setBackgroundInert(inert) {
        backgroundRegions.forEach((region) => {
            region.inert = inert;
            if (inert) region.setAttribute("aria-hidden", "true");
            else region.removeAttribute("aria-hidden");
        });
    }

    function clearMedia() {
        modalVideo.pause();
        modalVideo.removeAttribute("src");
        modalVideo.removeAttribute("poster");
        modalVideo.hidden = true;
        modalCaptions.removeAttribute("src");
        modalEmbed.src = "about:blank";
        modalEmbed.hidden = true;
        privatePreview.hidden = false;
        modalVideo.load();
    }

    function configureMedia(project) {
        clearMedia();
        if (!project.video || !project.video.type) return;

        if (project.video.type === "file") {
            const source = String(project.video.src || "");
            const safeSource = /^https:\/\//.test(source) || /^\.?\//.test(source);
            if (safeSource) {
                modalVideo.src = source;
                if (project.video.poster) modalVideo.poster = project.video.poster;
                if (project.video.captions) modalCaptions.src = project.video.captions;
                modalVideo.hidden = false;
                privatePreview.hidden = true;
            }
            return;
        }

        const safeId = String(project.video.id || "");
        if (project.video.type === "youtube" && /^[A-Za-z0-9_-]{6,20}$/.test(safeId)) {
            modalEmbed.src = `https://www.youtube-nocookie.com/embed/${safeId}?rel=0`;
            modalEmbed.hidden = false;
            privatePreview.hidden = true;
        } else if (project.video.type === "vimeo" && /^\d{6,12}$/.test(safeId)) {
            modalEmbed.src = `https://player.vimeo.com/video/${safeId}?dnt=1`;
            modalEmbed.hidden = false;
            privatePreview.hidden = true;
        }
    }

    function updateProjectUrl(slug, replace) {
        const url = new URL(window.location.href);
        if (slug) url.searchParams.set("project", slug);
        else url.searchParams.delete("project");
        const method = replace ? "replaceState" : "pushState";
        history[method]({}, "", `${url.pathname}${url.search}${url.hash}`);
    }

    function openProject(project, options) {
        if (!project) return;
        activeProject = project;
        previousFocus = document.activeElement;
        modalCategory.textContent = project.categoryLabel;
        modalTitle.textContent = project.title;
        modalDescription.textContent = project.description;
        modalEmbed.title = `${project.title} video`;
        document.getElementById("modalStatus").textContent = "";
        projectFacts.replaceChildren();

        Object.entries(project.facts || {}).forEach(([label, value]) => {
            const wrapper = element("div");
            wrapper.append(element("dt", "", label), element("dd", "", value));
            projectFacts.appendChild(wrapper);
        });

        const subject = encodeURIComponent(`Private portfolio sample request: ${project.title}`);
        requestSample.href = `mailto:${EMAIL}?subject=${subject}`;
        configureMedia(project);
        modal.hidden = false;
        document.body.classList.add("modal-open");
        setBackgroundInert(true);
        if (!options || !options.fromUrl) updateProjectUrl(project.slug, false);
        closeModalButton.focus();
        window.dispatchEvent(new CustomEvent("portfolio:project-open", { detail: { slug: project.slug, category: project.category } }));
    }

    function closeProject(options) {
        if (modal.hidden) return;
        clearMedia();
        modal.hidden = true;
        document.body.classList.remove("modal-open");
        setBackgroundInert(false);
        if (!options || !options.keepUrl) updateProjectUrl(null, true);
        activeProject = null;
        if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    }

    function trapModalFocus(event) {
        if (event.key === "Escape") {
            event.preventDefault();
            closeProject();
            return;
        }
        if (event.key !== "Tab") return;

        const focusable = Array.from(modalDialog.querySelectorAll("a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex='-1'])"))
            .filter((node) => !node.hidden && node.getAttribute("aria-hidden") !== "true");
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    async function copyText(text, successMessage, statusElement) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (_) {
            const field = document.createElement("textarea");
            field.value = text;
            field.setAttribute("readonly", "");
            field.style.position = "fixed";
            field.style.opacity = "0";
            document.body.appendChild(field);
            field.select();
            document.execCommand("copy");
            field.remove();
        }
        const status = statusElement || document.getElementById("formStatus");
        status.textContent = successMessage;
        status.className = "form-status success";
    }

    function initializeFilters() {
        const buttons = Array.from(document.querySelectorAll(".filter-button"));
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter;
                buttons.forEach((candidate) => {
                    const active = candidate === button;
                    candidate.classList.toggle("active", active);
                    candidate.setAttribute("aria-pressed", String(active));
                });
                document.querySelectorAll(".carousel-module").forEach((section) => {
                    section.hidden = filter !== "all" && section.dataset.category !== filter;
                });
            });
        });
    }

    function initializeCarouselControls() {
        document.querySelectorAll(".carousel-controls button").forEach((button) => {
            button.addEventListener("click", () => {
                setMotionPaused(true);
                const section = button.closest(".carousel-module");
                const container = section.querySelector(".carousel-container");
                const direction = button.dataset.direction === "previous" ? -1 : 1;
                container.scrollBy({ left: direction * 310, behavior: "smooth" });
            });
        });
    }

    function initializeContactForm() {
        const form = document.getElementById("contactForm");
        const status = document.getElementById("formStatus");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const fields = Array.from(form.querySelectorAll("input, select, textarea"));
            fields.forEach((field) => field.setAttribute("aria-invalid", String(!field.checkValidity())));
            if (!form.checkValidity()) {
                const invalid = fields.find((field) => !field.checkValidity());
                status.textContent = "Please complete the highlighted fields before preparing your email.";
                status.className = "form-status error";
                if (invalid) invalid.focus();
                return;
            }

            const data = new FormData(form);
            const subject = encodeURIComponent(`Portfolio enquiry — ${data.get("projectType")}`);
            const body = encodeURIComponent([
                `Name: ${data.get("name")}`,
                `Email: ${data.get("email")}`,
                `Project type: ${data.get("projectType")}`,
                `Timeline: ${data.get("timeline")}`,
                "",
                String(data.get("message"))
            ].join("\n"));
            status.textContent = "Your project brief is ready. Opening your email app…";
            status.className = "form-status success";
            window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
            window.dispatchEvent(new CustomEvent("portfolio:contact-start", { detail: { projectType: data.get("projectType") } }));
        });

        form.addEventListener("input", (event) => {
            if (event.target.matches("input, select, textarea")) event.target.removeAttribute("aria-invalid");
        });
    }

    renderPortfolio();
    initializeMotionPreference();
    initializeFilters();
    initializeCarouselControls();
    initializeContactForm();

    document.getElementById("motionToggle").addEventListener("click", (event) => {
        setMotionPaused(event.currentTarget.getAttribute("aria-pressed") !== "true");
    });

    portfolioSections.addEventListener("click", (event) => {
        const card = event.target.closest(".project-card:not([data-clone='true'])");
        if (card) openProject(projectBySlug.get(card.dataset.project));
    });

    closeModalButton.addEventListener("click", () => closeProject());
    document.getElementById("modalOverlay").addEventListener("click", () => closeProject());
    modal.addEventListener("keydown", trapModalFocus);

    document.getElementById("copyProjectLink").addEventListener("click", () => {
        if (!activeProject) return;
        const url = new URL(window.location.href);
        url.searchParams.set("project", activeProject.slug);
        copyText(url.href, "Project link copied.", document.getElementById("modalStatus"));
    });

    document.getElementById("copyEmail").addEventListener("click", () => copyText(EMAIL, "Email address copied."));
    document.getElementById("currentYear").textContent = String(new Date().getFullYear());

    window.addEventListener("popstate", () => {
        const slug = new URL(window.location.href).searchParams.get("project");
        if (slug && projectBySlug.has(slug)) openProject(projectBySlug.get(slug), { fromUrl: true });
        else closeProject({ keepUrl: true });
    });

    const deepLinkSlug = new URL(window.location.href).searchParams.get("project");
    if (deepLinkSlug && projectBySlug.has(deepLinkSlug)) openProject(projectBySlug.get(deepLinkSlug), { fromUrl: true });
}());
