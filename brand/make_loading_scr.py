#!/usr/bin/env python3
"""Usage: python3 brand/make_loading_scr.py brand/loading_scr_panels.json
Build a real 6912-byte ZX Spectrum SCREEN$ for the 3BL_Indie loading screen.
Top and bottom: eight of the studio's games, converted to Spectrum colour (two colours per
8x8 cell, ordered dither). Middle band: the three wee men and 3BL_INDIE."""
import numpy as np, itertools, sys
from PIL import Image
import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S=ROOT+"/screenshots/"
TOP=[("pp_broadside",0.5),("bb_castle",0.5)]
BOT=[("jt_sunset_huey",0.5),("kc_rampage",0.5)]
if len(sys.argv)>1:
    import json; cfg=json.loads(open(sys.argv[1]).read()); TOP=cfg["top"]; BOT=cfg["bot"]
N=np.array([[0,0,0],[0,0,215],[215,0,0],[215,0,215],[0,215,0],[0,215,215],[215,215,0],[215,215,215]],float)
B=np.array([[0,0,0],[0,0,255],[255,0,0],[255,0,255],[0,255,0],[0,255,255],[255,255,0],[255,255,255]],float)
BAYER=np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]],float)/16+1/32
BAY8=np.tile(BAYER,(2,2))

canvas=np.zeros((192,256,3),float)
def panel(name,fx,x,y,w,h):
    im=Image.open(ROOT+"/"+name if name.endswith(".jpg") else S+name+"_thumb.jpg").convert("RGB")
    s=h/im.height; im=im.resize((max(w,int(im.width*s)),h),Image.LANCZOS)
    x0=int((im.width-w)*fx); a=np.asarray(im.crop((x0,0,x0+w,h)),float)
    # punchier: Spectrum art is high contrast
    # Spectrum art is bold: more contrast and colour, and dark outlines on edges
    from PIL import ImageFilter, ImageEnhance
    pim=Image.fromarray(a.astype(np.uint8))
    pim=ImageEnhance.Color(pim).enhance(1.7); pim=ImageEnhance.Contrast(pim).enhance(1.35)
    a=np.asarray(pim,float)
    lum=np.asarray(Image.fromarray(a.astype(np.uint8)).convert("L").filter(ImageFilter.FIND_EDGES),float)
    a=a*(1-np.clip((lum-40)/90,0,1)[...,None]*0.85)
    canvas[y:y+h,x:x+w]=a
for i,(n,f) in enumerate(TOP): panel(n,f,i*128,0,128,72)
for i,(n,f) in enumerate(BOT): panel(n,f,i*128,120,128,72)

bitmap=np.zeros((192,256),np.uint8); attr=np.zeros((24,32),np.uint8)
def convert_cell(r,c):
    blk=canvas[r*8:r*8+8,c*8:c*8+8]
    best=None
    for pal,bright in ((N,0),(B,1)):
        for i,j in itertools.combinations(range(8),2):
            a,b=pal[i],pal[j]; d=b-a; dd=(d*d).sum()
            t=((blk-a)*d).sum(2)/dd
            mix=a+np.clip(t,0,1)[...,None]*d
            base=((mix-blk)**2).sum()
            for bits,pen in (((t>0.5).astype(np.uint8),1.0),((t>BAY8).astype(np.uint8),1.25)):
                out=np.where(bits[...,None]==1,b,a)
                err=(((out-blk)**2).sum()*0.6+base)*pen
                if best is None or err<best[0]: best=(err,bits,j,i,bright)  # ink=j paper=i
    _,bits,ink,paper,bright=best
    bitmap[r*8:r*8+8,c*8:c*8+8]=bits; attr[r,c]=(bright<<6)|(paper<<3)|ink
for r in list(range(0,9))+list(range(15,24)):
    for c in range(32): convert_cell(r,c)
# black separators between panels (whole cells keep their colours; just clear pixel lines)
for x in (127,128): bitmap[0:72,x]=0; bitmap[120:192,x]=0
# ---- middle band rows 9-14 (y 72-119): black paper
for r in range(9,15):
    for c in range(32): attr[r,c]=(1<<6)|(0<<3)|7
MEN=[[1,2,3,2],[0,4,5,2],[1,6,3,2],[1,8,1,2],[3,8,1,2],[0,10,2,1],[3,10,2,1],[9,0,3,2],[7,2,7,4],[8,6,5,1],[8,7,2,3],[11,7,2,3],[7,10,3,1],[11,10,3,1],[17,2,3,2],[16,4,5,2],[17,6,3,2],[17,8,1,2],[19,8,1,2],[16,10,2,1],[19,10,2,1]]
def rect(x,y,w,h): bitmap[y:y+h,x:x+w]=1
# men at 2 px per unit: 42x22, cells 1-6, rows 10-12 -> x 8..50, y 85..107
for m in MEN: rect(8+m[0]*2,85+m[1]*2,m[2]*2,m[3]*2)
for r in range(10,14):
    for c in range(1,7): attr[r,c]=(1<<6)|6           # bright yellow (orange stand-in)
# a cut-corner frame round the men, red
fx0,fy0,fx1,fy1=2,76,56,115
for y in range(fy0,fy1+1):
    for x in range(fx0,fx1+1):
        dx,dy,ex,ey=x-fx0,y-fy0,fx1-x,fy1-y
        if dx+dy<6 or ex+ey<6: continue
        if dx<2 or dy<2 or ex<2 or ey<2 or dx+dy<8 or ex+ey<8: bitmap[y,x]=1
for r in range(9,15):
    for c in range(0,8):
        if not (1<=c<=6 and 10<=r<=13): attr[r,c]=(1<<6)|2
# wordmark 3BL_INDIE at 3 px per unit: 56x7 -> 168x21 at x 72, y 88
import re
svg=open(ROOT+"/brand/3BL_Indie_wordmark.svg").read()
groups=re.findall(r'<g fill="(#[0-9A-Fa-f]+)"[^>]*>(.*?)</g>',svg,re.S)
WX,WY,U=73,88,3
for col,body in groups:
    for x,y,w,h in re.findall(r'x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"',body):
        rect(WX+int(float(x))*U,WY+int(float(y))*U,int(float(w))*U,int(float(h))*U)
# 3BL spans units 0-19 -> x 72..129 ; '_' starts at unit 21 -> x 135. Cell edge 128/136: put 3BL cols 9-16 yellow? 129 spills into col 16 (128-135)
# shift: choose split at x=136 (col 17): yellow cols 9-16, cyan 17-30
for r in range(10,14):
    for c in range(9,17): attr[r,c]=(1<<6)|6
    for c in range(17,31): attr[r,c]=(1<<6)|5
# ---- write SCREEN$ in Spectrum memory order
scr=bytearray(6912)
for y in range(192):
    for xb in range(32):
        addr=((y&0xC0)<<5)|((y&7)<<8)|((y&0x38)<<2)|xb
        v=0
        for k in range(8): v=(v<<1)|int(bitmap[y,xb*8+k])
        scr[addr]=v
for r in range(24):
    for c in range(32): scr[6144+r*32+c]=attr[r,c]
open(ROOT+"/brand/3bl_loading.scr","wb").write(scr)
# preview
pal=np.vstack([N,B])
img=np.zeros((192,256,3),np.uint8)
for y in range(192):
    for x in range(256):
        a=attr[y>>3,x>>3]; br=(a>>6)&1; ink=a&7; paper=(a>>3)&7
        img[y,x]=pal[(ink if bitmap[y,x] else paper)+8*br]
Image.fromarray(img).resize((768,576),Image.NEAREST).save(ROOT+"/brand/3bl_loading_preview.png")
print("ok")
