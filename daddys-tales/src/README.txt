DADDY'S TALES - source for ../index.html

The book is one self-contained page (fonts, stories, pictures and sounds all
inside index.html). These are the pieces it is built from:

  stories.json   the 24 stories, one list of paragraphs each (edit text here)
  art.js         drawing helpers (watercolour SVG: trees, cottages, people...)
  scenes.js      one pop-up scene per story, plus its pull-tab surprise
  book.js        the book: page turning, pagination, sounds and ambience
  template.html  page layout and styles
  *.woff2        IM Fell English and EB Garamond (SIL Open Font Licence)

To rebuild after a change:  cd daddys-tales/src && python3 build.py site
then copy the new src/index.html up one folder (over daddys-tales/index.html).
("site" adds the iPhone home-screen icon and the link-preview image.)
