import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";

/* 얼굴 인식 훅 */
const useFaceDetection = (
    webcamRef,
    canvasRef,
    filters,
    filterIndex,
    drawFilter
) => {
    const [previousDetections, setPreviousDetections] = useState([]);

    const arraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (
                arr1[i].detection.box.x !== arr2[i]?.detection.box.x ||
                arr1[i].detection.box.y !== arr2[i]?.detection.box.y ||
                arr1[i].detection.box.width !== arr2[i]?.detection.box.width ||
                arr1[i].detection.box.height !== arr2[i]?.detection.box.height
            ) {
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const detectFaces = async () => {
            if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;
                const displaySize = {
                    width: video.videoWidth,
                    height: video.videoHeight,
                };
                faceapi.matchDimensions(canvasRef.current, displaySize);

                const detections = await faceapi
                    .detectAllFaces(
                        video,
                        new faceapi.TinyFaceDetectorOptions()
                    )
                    .withFaceLandmarks();

                const resizedDetections = faceapi.resizeResults(
                    detections,
                    displaySize
                );

                if (!arraysEqual(resizedDetections, previousDetections)) {
                    const ctx = canvasRef.current.getContext("2d");
                    ctx.clearRect(
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height
                    );

                    if (filters[filterIndex] !== "none") {
                        drawFilter(
                            filters[filterIndex],
                            resizedDetections,
                            ctx
                        );
                    }
                    setPreviousDetections(resizedDetections);
                }
            }
        };

        const interval = setInterval(detectFaces, 500); // 500ms마다 얼굴 인식 수행
        return () => clearInterval(interval);
    }, [
        webcamRef,
        canvasRef,
        filters,
        filterIndex,
        previousDetections,
        drawFilter,
    ]);

    useEffect(() => {
        let animationFrameId;

        const renderFrame = () => {
            if (
                filters[filterIndex] === "blackWhite" &&
                canvasRef.current &&
                webcamRef.current.video.readyState === 4
            ) {
                const ctx = canvasRef.current.getContext("2d");
                const video = webcamRef.current.video;
                const { videoWidth, videoHeight } = video;

                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                // mirror 상태에 따라 이미지 뒤집기
                if (video.style.transform === "scaleX(-1)") {
                    ctx.translate(videoWidth, 0);
                    ctx.scale(-1, 1);
                }

                ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

                // 다시 뒤집기
                if (video.style.transform === "scaleX(-1)") {
                    ctx.translate(videoWidth, 0);
                    ctx.scale(-1, 1);
                }

                drawFilter(filters[filterIndex], previousDetections, ctx);
            }
            animationFrameId = requestAnimationFrame(renderFrame);
        };

        renderFrame();

        return () => cancelAnimationFrame(animationFrameId);
    }, [filterIndex, previousDetections, filters, canvasRef, drawFilter, webcamRef]);

    return previousDetections;
};

export default useFaceDetection;
