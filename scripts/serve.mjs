import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = path.resolve(process.cwd());
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4177);
const contentTypes = new Map([
    [".html", "text/html; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".png", "image/png"],
    [".svg", "image/svg+xml"],
    [".webmanifest", "application/manifest+json; charset=utf-8"],
    [".txt", "text/plain; charset=utf-8"],
    [".xml", "application/xml; charset=utf-8"]
]);

const server = http.createServer((request, response) => {
    let requestedPath;

    try {
        requestedPath = decodeURIComponent(new URL(request.url, `http://${host}`).pathname);
    } catch {
        response.writeHead(400).end("Bad request");
        return;
    }

    const pagePath = requestedPath === "/" ? "/index.html" : requestedPath;
    const resolved = path.resolve(root, `.${pagePath}`);
    const isWithinRoot = resolved.startsWith(`${root}${path.sep}`);
    const isFile = isWithinRoot && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
    const target = isFile ? resolved : path.join(root, "404.html");

    response.statusCode = isFile ? 200 : 404;
    response.setHeader("Content-Type", contentTypes.get(path.extname(target)) || "application/octet-stream");
    response.setHeader("Cache-Control", "no-store");
    fs.createReadStream(target).pipe(response);
});

server.listen(port, host, () => {
    console.log(`Portfolio preview available at http://${host}:${port}`);
});
