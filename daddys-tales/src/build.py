import base64,json,sys
t=open('template.html').read()
for f in ['EBGaramond-Regular','EBGaramond-Italic','IMFellEnglish-Regular','IMFellEnglish-Italic','IMFellEnglishSC-Regular']:
    t=t.replace('{{%s}}'%f,base64.b64encode(open(f+'.woff2','rb').read()).decode())
t=t.replace('{{STORIES}}',open('stories.json').read().replace('</','<\\/'))
for k,f in [('ART','art.js'),('SCENES','scenes.js'),('BOOK','book.js')]:
    t=t.replace('{{%s}}'%k,open(f).read())
import sys
site=len(sys.argv)>1 and sys.argv[1]=='site'
extra='<link rel="apple-touch-icon" href="icon.png">\n<meta property="og:title" content="Daddy\'s Tales">\n<meta property="og:description" content="Twenty-four spooky and silly bedtime stories, as a pop-up book.">\n<meta property="og:image" content="https://gamesdevni.site/daddys-tales/share.jpg">' if site else ''
t=t.replace('{{HEADEXTRA}}',extra)
open('index.html','w').write(t); print(len(t))
