"""Verify delivered videos using ffprobe and full-frame decoding."""
import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
results = {}
for filename, count, duration in [
    ('scene-1-v4-test-2s.mp4', 60, 2),
    ('webtoon-v4-15s.mp4', 450, 15),
]:
    path = root / 'deliverables' / filename
    data = json.loads(subprocess.check_output([
        'ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)
    ], text=True))
    video = next(s for s in data['streams'] if s['codec_type']=='video')
    assert (video['width'],video['height']) == (1920,1080)
    assert video['r_frame_rate'] == '30/1'
    assert int(video['nb_frames']) == count
    assert abs(float(data['format']['duration'])-duration) < .00001
    assert not any(s['codec_type']=='audio' for s in data['streams'])
    subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(path),'-f','null','-'],check=True)
    results[filename] = {
        'width':1920,'height':1080,'fps':30,'frames':count,
        'durationSeconds':duration,'bytes':path.stat().st_size,
        'codec':video['codec_name'],'audio':False,'fullDecode':'passed',
    }
(root/'deliverables/v4-validation.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
