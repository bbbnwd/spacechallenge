"""Extract original pixels and composite restored plates only inside moving masks.

Polygon coordinates use the 640x360 review plane; source images are processed
at native resolution. Original files are never modified.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageChops, ImageFilter
import sys
sys.path.insert(0, '/workspace/.image-tools')
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / 'public/assets/motion-v4'
DEST.mkdir(parents=True, exist_ok=True)
CONFIG = ROOT / 'tools/v4-masks.json'
config = json.loads(CONFIG.read_text())
manifest = {}
for key, scene in config.items():
    original = Image.open(ROOT / 'public/assets/keyframes-v3/generated-originals' / scene['file']).convert('RGB')
    w, h = original.size
    restored = Image.open(ROOT / scene['restored']).convert('RGB').resize((w, h), Image.Resampling.LANCZOS)
    combined = Image.new('L', (w, h))
    masks = []
    for name, shapes in scene['layers'].items():
        mask = Image.new('L', (w, h))
        draw = ImageDraw.Draw(mask)
        for shape in shapes:
            if 'grabcut' in shape:
                seed = np.zeros((h,w),np.uint8)
                points = np.array([(round(x*w/640),round(y*h/360)) for x,y in shape['grabcut']])
                cv2.fillPoly(seed,[points],255)
                expanded = cv2.dilate(seed,np.ones((81,81),np.uint8))
                interior = cv2.erode(seed,np.ones((41,41),np.uint8))
                labels = np.zeros((h,w),np.uint8)
                labels[expanded>0] = cv2.GC_PR_BGD
                labels[seed>0] = cv2.GC_PR_FGD
                labels[interior>0] = cv2.GC_FGD
                cv2.setRNGSeed(42)
                cv2.grabCut(cv2.cvtColor(np.array(original),cv2.COLOR_RGB2BGR),labels,None,np.zeros((1,65)),np.zeros((1,65)),5,cv2.GC_INIT_WITH_MASK)
                alpha = np.where((labels==cv2.GC_FGD)|(labels==cv2.GC_PR_FGD),255,0).astype('uint8')
                count, connected, stats, _ = cv2.connectedComponentsWithStats(alpha)
                largest = 1 + np.argmax(stats[1:,4])
                alpha = (connected==largest).astype('uint8')*255
                # Retain the original black silhouette stroke, which GrabCut may
                # classify as shaft shadow when their colors meet.
                alpha = np.maximum(alpha, seed)
                # Include dark exterior ink along the edge, preserving the
                # illustrated outline rather than leaving it on the plate.
                nearby = cv2.dilate(alpha,np.ones((45,45),np.uint8))
                rgb = np.array(original)
                ink = (rgb[:,:,0]<100)&(rgb[:,:,1]<100)&(rgb[:,:,2]<120)
                alpha[(nearby>0)&ink] = 255
                alpha = cv2.morphologyEx(alpha,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
                alpha = cv2.dilate(alpha,np.ones((3,3),np.uint8))
                mask = Image.fromarray(alpha)
                draw = ImageDraw.Draw(mask)
            elif 'outline' in shape:
                x0,y0,x1,y1 = shape['outline']
                ax,bx,ay,by = round(x0*w/640),round(x1*w/640),round(y0*h/360),round(y1*h/360)
                roi = np.array(original)[ay:by,ax:bx]
                dark = ((roi[:,:,0]<95)&(roi[:,:,1]<95)&(roi[:,:,2]<115)).astype('uint8')*255
                _, labels, stats, _ = cv2.connectedComponentsWithStats(dark)
                candidates = [i for i in range(1,len(stats)) if stats[i,2] > (bx-ax)*.9 and stats[i,3] > (by-ay)*.8]
                if len(candidates)!=1: raise RuntimeError('Ambiguous thought-outline component')
                component = (labels==candidates[0]).astype('uint8')*255
                top = np.flatnonzero(component[0])
                if len(top): component[0,top.min():top.max()+1] = 255
                contours,_ = cv2.findContours(component,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
                filled = np.zeros_like(component)
                cv2.drawContours(filled,contours,-1,255,-1)
                filled = cv2.dilate(filled,np.ones((5,5),np.uint8))
                mask.paste(Image.fromarray(filled),(ax,ay))
                draw = ImageDraw.Draw(mask)
            elif 'polygon' in shape:
                draw.polygon([(round(x*w/640), round(y*h/360)) for x, y in shape['polygon']], fill=255)
            elif 'ellipse' in shape:
                x0,y0,x1,y1 = shape['ellipse']
                draw.ellipse((round(x0*w/640),round(y0*h/360),round(x1*w/640),round(y1*h/360)),fill=255)
        if name == 'drop': mask = mask.filter(ImageFilter.MaxFilter(15))
        if key != 's1': mask = mask.filter(ImageFilter.MaxFilter(9 if name != 'capsule' else 11))
        combined = ImageChops.lighter(combined, mask)
        layer = original.convert('RGBA')
        layer.putalpha(mask)
        bbox = mask.getbbox()
        layer.crop(bbox).save(DEST / f'{key}-{name}.png')
        masks.append((name, mask, bbox))
    plate = Image.composite(restored, original, combined)
    plate.save(DEST / f'{key}-plate.png')
    rebuilt = plate.copy()
    scene_manifest = {'file': scene['file'], 'width': w, 'height': h, 'layers': {}}
    for name, mask, bbox in masks:
        rebuilt.paste(original, (0,0), mask)
        x0,y0,x1,y1 = bbox
        scene_manifest['layers'][name] = {'x': x0/w*1920, 'y': y0/h*1080, 'width': (x1-x0)/w*1920, 'height': (y1-y0)/h*1080}
    # At neutral transforms every original pixel must be recovered exactly.
    diff = ImageChops.difference(rebuilt, original)
    if diff.getbbox():
        raise RuntimeError(f'{key}: neutral reconstruction differs from original')
    print(f'{key}: exact neutral reconstruction verified; {len(masks)} original-pixel layers')
    manifest[key] = scene_manifest
(DEST / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
