import { useCallback } from "react";

const useCapture = (
    webcamRef,
    captureCanvasRef,
    canvasRef,
    onCapture
) => {
    const capture = useCallback(() => {
        const video = webcamRef.current.video;
        const captureCanvas = captureCanvasRef.current;
        const captureCtx = captureCanvas.getContext("2d");

        const overlayCanvas = canvasRef.current;
        // const overlayCtx = overlayCanvas.getContext("2d");

        captureCanvas.width = video.videoWidth;
        captureCanvas.height = video.videoHeight;

        // 비디오의 현재 변환 상태를 확인
        const isMirrored = video.style.transform === "scaleX(-1)";

        captureCtx.save();
        if (isMirrored) {
            captureCtx.scale(-1, 1);
            captureCtx.drawImage(
                video,
                -video.videoWidth,
                0,
                video.videoWidth,
                video.videoHeight
            );
        } else {
            captureCtx.drawImage(
                video,
                0,
                0,
                video.videoWidth,
                video.videoHeight
            );
        }
        captureCtx.restore();

        // 얼굴 인식된 이미지 및 필터 추가
        captureCtx.drawImage(overlayCanvas, 0, 0);

        const imageSrc = captureCanvas.toDataURL("image/jpeg");
        onCapture(imageSrc);
    }, [webcamRef, captureCanvasRef, canvasRef, onCapture]);

    return capture;
};

export default useCapture;
