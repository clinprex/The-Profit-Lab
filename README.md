# THE PROFIT LAB V1

A free, static trading education website.

## Folder structure

- `index.html` — homepage
- `courses.html` — all courses + lesson player
- `assets/style.css` — design
- `assets/data.js` — courses, lessons, YouTube URLs and resources (the only file you need to edit for content)
- `assets/common.js` — shared helpers (progress, nav, video links)
- `assets/app.js` — homepage behavior
- `assets/courses.js` — courses page behavior
- `files/` — put PDFs/files here

## Add a YouTube lesson

Open `assets/data.js`.

Change:

`youtube:""`

to:

`youtube:"https://www.youtube.com/watch?v=YOUR_VIDEO_ID"`

The site automatically converts it to an embedded player. Upload as **Unlisted** on YouTube if you only want people to find it through the site.

Optional lesson notes (shown under the video):

`{title:"02 — RBS & SBR", youtube:"https://youtu.be/xyz", notes:"Key idea: broken resistance often becomes support."}`

## Lesson links

Every lesson has its own link you can share, e.g.

- `courses.html#course-1` — opens course 1 (first unfinished lesson)
- `courses.html#course-3/lesson-2` — opens course 3, lesson 2

## Add a PDF

Put the PDF inside `files/`, then add a resource in `RESOURCES`:

{
  type:"PDF",
  title:"My Guide",
  description:"Description",
  href:"files/my-guide.pdf"
}

## Free publishing

Recommended: GitHub Pages or Cloudflare Pages.

1. Create a free account.
2. Create a new repository/project.
3. Upload the contents of this folder.
4. Enable the provider's Pages/static hosting.
5. You get a free website URL.

No server or database is required for V1.

## Important limitation

A static free website cannot safely provide a private members-only course system by itself. For public/free education, this setup is ideal. If you later want login accounts, paid courses, private videos, progress tracking, comments, etc., we can upgrade the architecture.
