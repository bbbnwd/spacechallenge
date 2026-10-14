"""Original-pixel asset extraction. Run from the project root with Python 3.

Requires Pillow, NumPy and SciPy. Does not generate artwork or modify sources.
"""
from pathlib import Path
import hashlib
import json
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/assets'
OUT = SOURCE / 'extracted'
OUT.mkdir(exist_ok=True)
records = []
source_hashes = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in SOURCE.glob('*.png')}

def source(number):
    return next(SOURCE.glob(f'*-{number}.png'))

def extract(number, name, roi, canvas=None, body=None, target_body=None, anchor=None):
    original = Image.open(source(number)).convert('RGBA')
    original_rgba = np.array(original)
    rgba = np.array(original.crop(roi))
    alpha = rgba[:, :, 3]
    # Preserve main silhouettes AND detached expression effects. Remove only tiny
    # isolated residues; retain all enclosed glass/reflective interior pixels.
    labels, _ = ndimage.label(original_rgba[:, :, 3] >= 32)
    counts = np.bincount(labels.ravel())
    keep_ids = np.flatnonzero(counts >= 100)
    keep_ids = keep_ids[keep_ids != 0]
    objects = ndimage.find_objects(labels)
    selected = []
    for label in keep_ids:
        ys, xs = objects[label-1]
        cx, cy = (xs.start+xs.stop)/2, (ys.start+ys.stop)/2
        if roi[0] <= cx < roi[2] and roi[1] <= cy < roi[3]:
            assert roi[0] < xs.start and xs.stop < roi[2] and roi[1] < ys.start and ys.stop < roi[3], (name, 'component clipping', xs, ys)
            selected.append(label)
    core = np.isin(labels, selected)[roi[1]:roi[3],roi[0]:roi[2]]
    silhouette = ndimage.binary_fill_holes(core)
    edge = ndimage.binary_dilation(silhouette, iterations=2)
    keep = silhouette | (edge & (alpha >= 4))
    removed = int(np.count_nonzero((alpha > 0) & ~keep))
    rgba[~keep] = 0
    cleaned = Image.fromarray(rgba)
    bbox = cleaned.getbbox()
    assert bbox is not None
    # None of the meaningful silhouettes may run into a manually chosen ROI.
    assert bbox[0] > 0 and bbox[1] > 0 and bbox[2] < rgba.shape[1] and bbox[3] < rgba.shape[0], (name, bbox, roi)
    clipped = cleaned.crop(bbox)
    absolute_bbox = [bbox[0]+roi[0], bbox[1]+roi[1], bbox[2]+roi[0], bbox[3]+roi[1]]
    if canvas:
        # Align by body landmarks, never by hands or detached expression marks.
        sx = target_body[0] / (body[2] - body[0])
        sy = target_body[1] / (body[3] - body[1])
        size = (round(clipped.width*sx), round(clipped.height*sy))
        aligned = clipped.resize(size, Image.Resampling.LANCZOS)
        x = round(anchor[0] + (absolute_bbox[0]-(body[0]+body[2])/2)*sx)
        y = round(anchor[1] + (absolute_bbox[1]-body[3])*sy)
        assert x >= 12 and y >= 12 and x+size[0] <= canvas[0]-12 and y+size[1] <= canvas[1]-12, (name,x,y,size)
        result = Image.new('RGBA', canvas)
        result.paste(aligned, (x,y))  # No mask: preserve the alpha instead of squaring it.
    else:
        result = Image.new('RGBA', (clipped.width+48,clipped.height+48))
        result.paste(clipped,(24,24))
    dest = OUT / name
    dest.parent.mkdir(parents=True,exist_ok=True)
    result.save(dest)
    a=np.array(result)[:,:,3]
    assert not a[0,:].any() and not a[-1,:].any() and not a[:,0].any() and not a[:,-1].any()
    records.append(dict(path='assets/extracted/'+name,source=source(number).name,
        source_roi=roi,source_alpha_bbox=absolute_bbox,size=list(result.size),
        body_reference=body,target_body=target_body,anchor=anchor,
        discarded_background_pixels=removed,alpha_min=int(a.min()),alpha_max=int(a.max()),
        partially_transparent_pixels=int(((a>0)&(a<255)).sum()),
        edge_clear=True))

backgrounds=['laboratory','campus-plaza','vertical-shaft','capsule-interior']
for i,name in enumerate(backgrounds,1):
    dest=OUT/'backgrounds'/f'{name}.png';dest.parent.mkdir(exist_ok=True)
    shutil.copy2(source(i),dest)
    records.append(dict(path=f'assets/extracted/backgrounds/{name}.png',source=source(i).name,
        size=list(Image.open(dest).size),unchanged_copy=True))

# Sheet 5: five figures in a single row; include ALL fists and exclamation marks.
capsules=[('happy',(10,5,477,710),(83,25,416,684)),
 ('thinking',(477,5,873,710),(495,29,816,684)),
 ('worried',(873,5,1300,710),(925,28,1252,684)),
 ('surprised',(1300,5,1719,710),(1347,25,1673,684)),
 ('wink',(1719,5,2160,710),(1766,28,2097,684))]
for name,roi,body in capsules:
    extract(5,f'characters/capsule/{name}.png',roi,(560,768),body,(330,660),(280,716))

towers=[('happy',(190,10,680,717),(281,30,574,699)),
 ('pointing-wink',(830,10,1340,717),(913,30,1206,700)),
 ('celebrating',(1515,10,2005,717),(1594,30,1887,699))]
for name,roi,body in towers:
    extract(6,f'characters/drop-tower/{name}.png',roi,(640,768),body,(293,669),(320,720))

# Body references use the top of the cap and bottom of the cylindrical shell;
# hands, feet, bolts and sparkles do not change the body's registration.
plates=[('smile',(5,125,535,500),(44,157,503,440)),
 ('excited',(540,125,1070,500),(560,148,994,425)),
 ('thinking',(1070,125,1530,505),(1081,154,1500,447)),
 ('worried',(230,550,748,952),(252,588,717,881)),
 ('confident-wink',(785,540,1440,948),(818,574,1295,857))]
for name,roi,body in plates:
    extract(7,f'characters/plate/{name}.png',roi,(720,520),body,(460,283),(330,418))

props=[('water-drop-round',(65,125,399,452)),
 ('water-drop-long',(425,10,670,505)),
 ('pipette',(680,3,1080,580)),
 ('chamber',(1070,40,1510,612)),
 ('camera',(10,570,403,1007)),
 ('monitor',(395,580,835,1007)),
 ('thought-bubble',(815,575,1265,1000)),
 ('water-tank',(1260,600,1533,1017))]
for name,roi in props:
    extract(8,f'props/{name}.png',roi)

# Contact sheet: the same asset shown on two solid backgrounds, not a checkerboard
# alone, so faint dark/light residues remain visible. Character anchor rails show
# the consistent position across expression swaps.
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(fontpath,22);small=ImageFont.truetype(fontpath,17)
rows=[records[:4],records[4:9],records[9:12],records[12:17],records[17:21],records[21:]]
W=2400; H=2500
preview=Image.new('RGB',(W,H),'#101827');draw=ImageDraw.Draw(preview)
draw.text((32,20),'EXTRACTED ASSETS | 4 backgrounds + 13 expressions + 8 props',font=font,fill='white')
headings=['BACKGROUND ORIGINALS','CAPSULE | aligned body','DROP TOWER | aligned body','PLATE | aligned body','EXPERIMENT PROPS 1/2','EXPERIMENT PROPS 2/2']
for row,items in enumerate(rows):
    y=75+row*400;draw.text((30,y),headings[row],font=font,fill='#76e2ce')
    cell_w=W//len(items)
    for col,item in enumerate(items):
        x=col*cell_w+12; top=y+40;cw=cell_w-24;ch=310
        draw.rectangle((x,top,x+cw,top+ch),fill='#e9eef3')
        if row>0:
            draw.rectangle((x+cw//2,top,x+cw,top+ch),fill='#354356')
            # Draw twice to reveal every part on light and dark backgrounds.
            im=Image.open(ROOT/'public'/item['path']).convert('RGBA')
            factor=min((cw/2-16)/im.width,(ch-12)/im.height)
            thumb=im.resize((round(im.width*factor),round(im.height*factor)),Image.Resampling.LANCZOS)
            for side in range(2):
                px=x+round(side*cw/2+(cw/2-thumb.width)/2);py=top+6+(ch-12-thumb.height)//2
                preview.paste(thumb,(px,py),thumb)
                if item.get('anchor'):
                    ax=px+round(item['anchor'][0]*factor);ay=py+round(item['anchor'][1]*factor)
                    draw.line((ax-12,ay,ax+12,ay),fill='#ef476f',width=2)
                    draw.line((ax,ay-6,ax,ay+6),fill='#ef476f',width=2)
        else:
            im=Image.open(ROOT/'public'/item['path']);im.thumbnail((cw,ch))
            preview.paste(im,(x+(cw-im.width)//2,top+(ch-im.height)//2))
        label='/'.join(item['path'].split('/')[-2:]) if row>0 else Path(item['path']).stem
        draw.text((x,top+ch+8),label,font=small,fill='white')
preview.save(OUT/'preview-all.png')

for p in SOURCE.glob('*.png'):
    assert source_hashes[p.name]==hashlib.sha256(p.read_bytes()).hexdigest(),p
manifest=dict(source_sha256=source_hashes,assets=records,
    notes=['Original sources untouched. Source alpha values retained inside silhouettes.',
     'Remove low-alpha disconnected background haze; keep detached expression effects.',
     'Character bodies aligned to explicit source landmarks; hands/effects excluded from body measurement.',
     'All assets have transparent safety margins. Water drops retain their reflections.',
     'Round and elongated drops provided separately. Pipette includes its attached droplet.',
     'Chamber retains original translucent illustration; glass is not made fully transparent.'])
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Prepared',len(records),'assets and preview; all eight originals hash-verified unchanged.')
