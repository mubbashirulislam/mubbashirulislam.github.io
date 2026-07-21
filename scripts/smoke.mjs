import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = process.cwd();
const expected = [
    ["/", "text/html"],
    ["/privacy.html", "text/html"],
    ["/404.html", "text/html"],
    ["/css/style.css", "text/css"],
    ["/js/projects.js", "text/javascript"],
    ["/js/main.js", "text/javascript"],
    ["/assets/og-portfolio.png", "image/png"],
    ["/robots.txt", "text/plain"],
    ["/sitemap.xml", "application/xml"]
];

const contentTypes = new Map([
    [".html", "text/html; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".png", "image/png"],
    [".txt", "text/plain; charset=utf-8"],
    [".xml", "application/xml; charset=utf-8"]
]);

const server = http.createServer((request, response) => {
    const requestedPath = request.url === "/" ? "/index.html" : new URL(request.url, "http://localhost").pathname;
    const resolved = path.resolve(root, `.${requestedPath}`);
    if (!resolved.startsWith(`${path.resolve(root)}${path.sep}`) || !fs.existsSync(resolved)) {
        response.writeHead(404).end("Not found");
        return;
    }
    response.setHeader("Content-Type", contentTypes.get(path.extname(resolved)) || "application/octet-stream");
    fs.createReadStream(resolved).pipe(response);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}`;
const failures = [];

try {
    for (const [url, contentType] of expected) {
        const response = await fetch(`${baseUrl}${url}`);
        if (!response.ok) failures.push(`${url} returned ${response.status}`);
        if (!String(response.headers.get("content-type")).startsWith(contentType)) failures.push(`${url} returned the wrong content type`);
        await response.arrayBuffer();
    }
} finally {
    await new Promise((resolve) => server.close(resolve));
}

if (failures.length) {
    console.error("Static serving smoke test failed:\n");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
}

console.log(`Static serving smoke test passed for ${expected.length} public resources.`);
