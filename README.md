# THE PROFIT LAB V1

A free, static trading education website.

## Folder structure

- `index.html` — website
- `assets/style.css` — design
- `assets/data.js` — courses, lessons, YouTube URLs and resources
- `assets/app.js` — website behavior
- `files/` — put PDFs/files here

## Add a YouTube lesson

Open `assets/data.js`.

Change:

`youtube:""`

to:

`youtube:"https://www.youtube.com/watch?v=YOUR_VIDEO_ID"`

The site automatically converts it to an embedded player.

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
