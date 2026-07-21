import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const errors = [];
const requiredFiles = [
    "index.html",
    "404.html",
    "privacy.html",
    "css/style.css",
    "js/projects.js",
    "js/main.js",
    "assets/og-portfolio.png",
    "robots.txt",
    "sitemap.xml",
    "site.webmanifest",
    ".github/workflows/pages.yml"
];

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

for (const file of requiredFiles) {
    if (!exists(file)) errors.push(`Missing required file: ${file}`);
}

for (const page of ["index.html", "404.html", "privacy.html"]) {
    if (!exists(page)) continue;
    const html = read(page);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length) errors.push(`${page} has duplicate IDs: ${[...new Set(duplicateIds)].join(", ")}`);
    if (/hello@example\.com|href="#"|javascript:/i.test(html)) errors.push(`${page} contains a placeholder or unsafe link.`);
    if (!/<meta[^>]+Content-Security-Policy/i.test(html)) errors.push(`${page} is missing its CSP meta policy.`);

    const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
    for (const reference of references) {
        if (/^(?:https?:|mailto:|#|data:|about:)/i.test(reference)) continue;
        const localPath = reference.split(/[?#]/, 1)[0].replace(/^\//, "");
        if (localPath && !exists(localPath)) errors.push(`${page} references missing local file: ${localPath}`);
    }
}

if (exists("index.html")) {
    const index = read("index.html");
    const requiredSignals = [
        "prefers-reduced-motion",
        "aria-modal=\"true\"",
        "rel=\"canonical\"",
        "application/ld+json",
        "og:image",
        "id=\"contactForm\""
    ];
    for (const signal of requiredSignals) {
        if (!index.includes(signal) && !read("css/style.css").includes(signal)) errors.push(`Missing production signal: ${signal}`);
    }
}

if (exists("js/projects.js")) {
    const context = { window: {} };
    vm.runInNewContext(read("js/projects.js"), context, { filename: "js/projects.js" });
    const projects = context.window.PORTFOLIO_PROJECTS;
    if (!Array.isArray(projects) || projects.length < 3) {
        errors.push("Project data must contain at least three entries.");
    } else {
        const slugs = new Set();
        for (const project of projects) {
            for (const field of ["slug", "category", "title", "image", "alt", "description"]) {
                if (!project[field]) errors.push(`Project ${project.slug || "(unknown)"} is missing ${field}.`);
            }
            if (slugs.has(project.slug)) errors.push(`Duplicate project slug: ${project.slug}`);
            slugs.add(project.slug);
            if (/^javascript:/i.test(project.image)) errors.push(`Unsafe project image URL: ${project.slug}`);
        }
    }
}

if (exists("site.webmanifest")) {
    try {
        JSON.parse(read("site.webmanifest"));
    } catch (error) {
        errors.push(`Invalid site.webmanifest JSON: ${error.message}`);
    }
}

if (exists(".github/workflows/pages.yml")) {
    const workflow = read(".github/workflows/pages.yml");
    for (const action of ["actions/checkout@v4", "actions/configure-pages@v5", "actions/upload-pages-artifact@v3", "actions/deploy-pages@v4"]) {
        if (!workflow.includes(action)) errors.push(`Pages workflow is missing ${action}.`);
    }
}

if (errors.length) {
    console.error("Portfolio validation failed:\n");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
}

console.log("Portfolio validation passed.");
console.log(`Checked ${requiredFiles.length} required files and ${["index.html", "404.html", "privacy.html"].length} HTML pages.`);
