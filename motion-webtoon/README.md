# 15초 가로형 모션 웹툰 준비 프로젝트

Remotion 4.0.535 / React 19.2.3. 공식 remotion-dev/template-empty를 기반으로 준비했습니다.

- Composition: `MotionWebtoon`
- 1920×1080, 30fps, 450프레임(15초)
- 캐릭터 이미지와 음성 없이 텍스트와 진행 막대만 포함한 환경 확인용 화면
- 공식 Agent Skills: `.agents/skills/` (공식 명령 `npx skills add remotion-dev/skills --agent codex --yes`로 설치)

## 설치

```bash
cd /workspace/spacechallenge/motion-webtoon
npm ci --cache /workspace/.npm-cache --prefer-offline
```

이 클라우드 환경에는 Node.js, npm, `/usr/bin/chromium`, ffprobe가 설치되어 있습니다.
렌더링은 `remotion.config.ts`에 지정한 시스템 Chromium을 사용합니다.
다른 컴퓨터에서 실행할 때에는 해당 컴퓨터의 Chromium 경로로 설정해야 합니다.

## 미리보기

```bash
npm run dev -- --port=3000 --no-open
```

Studio의 왼쪽에서 `MotionWebtoon`을 선택하고 재생 버튼을 누릅니다.
이 온보딩 화면에서는 localhost 미리보기 링크를 제공하지 않으므로
서버와 실제 브라우저의 화면 로딩을 내부에서 검증합니다.

## MP4 내보내기

```bash
npm run render
```

결과: `out/motion-webtoon.mp4` (H.264, 소리 없음).
Studio에 접근 가능한 환경에서는 `MotionWebtoon` 선택 → `Render` → H.264 선택 → 렌더링으로 내보낼 수도 있습니다.

## 검사

```bash
npm run lint
npm run build
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,nb_frames:format=duration -of json out/motion-webtoon.mp4
```

프로젝트 소스와 공식 Agent Skills는 GitHub 저장소 `bbbnwd/spacechallenge`의 `motion-webtoon` 폴더에서 관리합니다.
`node_modules`, 빌드 결과, 테스트 영상은 Git에서 제외합니다.
이미지는 `public/assets/`에 업로드하세요.
클라우드 환경 설정을 검토하고 저장한 후 환경을 게시하여 설치 파일을 스냅샷에 보존하세요.
현재 살아 있는 Studio 프로세스는 다음 작업에서 다시 시작해야 합니다.

## 드롭타워 모션 웹툰

Composition `DropTowerWebtoon`: 1920×1080, 30fps, 정확히 450프레임(15초).
6컷은 0–60–120–195–270–360–450 프레임으로 구성됩니다.
음성·음악은 없으며 한국어 자막은 별도 React 텍스트 레이어입니다.
원본에서 분리한 `public/assets/extracted` 소재만 사용합니다.

- 렌더링: `npm run render:webtoon`
- 영상: `out/drop-tower-silent.mp4`
- 6컷 미리보기: `out/drop-tower-six-scenes.png`
- 개별 대표 프레임: `out/scenes/scene-1.png`부터 `scene-6.png`
- 검증 결과: `out/drop-tower-validation.json`
- 대표 프레임 재생성: `npm run build` 후 `node tools/preview-webtoon.cjs`

플레이트·카메라·챔버의 위치는 4–5컷에 공유되며, 챔버 앞면은 물방울보다 앞에 합성합니다.
통로는 고정하고 3컷의 캡슐과 내부 확대 그림은 같은 가속 곡선으로 함께 이동합니다.
마지막 30프레임은 정지 상태입니다.
