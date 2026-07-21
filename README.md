# Mubbashirul Islam — video editor portfolio

A fast, accessible static portfolio designed for GitHub Pages. The visual system preserves the original CRT screen, graph-paper background, cyan accent and moving vertical-work rails while adding production-grade navigation, keyboard support, motion controls, deep-linked project previews, SEO metadata, privacy documentation and a deploy workflow.

## Important launch note

The repository does not currently contain Mubbashirul's real video files or public video URLs. Existing cards are honest capability previews and are marked as private samples. Replace them with approved work before presenting them as client case studies.

## Editing portfolio projects

Projects live in `js/projects.js`. Each object supports:

```js
{
  slug: "unique-project-name",
  category: "talking-head",
  title: "Project title",
  image: "assets/posters/project.webp",
  alt: "Useful thumbnail description",
  description: "What was solved and how",
  facts: {
    Role: "Editing, motion, sound design",
    Format: "9:16 vertical",
    Result: "Use a verified result only",
    Access: "Public"
  },
  video: {
    type: "file",
    src: "assets/videos/project.mp4",
    poster: "assets/posters/project.webp",
    captions: "assets/captions/project.vtt"
  }
}
```

For a privacy-enhanced YouTube embed, use `video: { type: "youtube", id: "VIDEO_ID" }`. For Vimeo, use `video: { type: "vimeo", id: "NUMERIC_ID" }`. Leave `video: null` for private/on-request samples.

## Media standards

- Export web copies rather than editing masters.
- Use a stable poster image with a 9:16 crop.
- Keep a compressed MP4 or use a professional video host for heavier reels.
- Add English WebVTT captions for every spoken video.
- Keep raw footage, Premiere/After Effects projects, client downloads and private review links outside this repository.
- Confirm client permission, music rights and performer consent before publishing work.

## Local preview

Node.js 20 or newer is required. No dependency installation is necessary.

```bash
npm run validate
npm run serve
```

Open `http://127.0.0.1:4177/` after starting the preview. Run validation before every commit; it checks JavaScript syntax, required production files, project media and static HTTP responses.

## Development workflow

1. Start from a clean, synchronized `main` branch.
2. Make the requested content or functionality changes.
3. Run `npm run validate` and review the diff.
4. Commit intentionally and push to `main`.
5. Confirm the Pages workflow succeeds and verify the live site.

GitHub Actions dependencies are pinned to full commit SHAs. Dependabot checks those pins weekly and proposes grouped maintenance updates.

## Deployment

The workflow in `.github/workflows/pages.yml` packages only the public website files and deploys them to GitHub Pages after every push to `main`. The intended repository is `mubbashirulislam/mubbashirulislam.github.io`, which publishes at `https://mubbashirulislam.github.io/`.

In GitHub repository settings, Pages must use **GitHub Actions** as its source. Enforce HTTPS after the first deployment.

## Pre-publish checklist

- Replace capability imagery with owned or licensed project posters.
- Add public videos or keep the cards explicitly marked private.
- Verify the 100M+ views and 90% retention claims and retain supporting evidence.
- Send a real test enquiry from desktop and mobile.
- Test keyboard-only navigation, Escape-to-close and reduced-motion mode.
- Check the social preview and every external link.
- Never place API keys, passwords or private client media in frontend files.

## Code visibility

Web browsers must download HTML, CSS, JavaScript and public media to render a static site, so visitors can inspect those delivered files. Minification can make code less convenient to read but does not create security. This project protects sensitive information by keeping it out of the browser entirely.
