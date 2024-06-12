import React, {
    useRef,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from "react";
import "./WebcamComponent.css";
import Webcam from "react-webcam";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import icons from "../assets/ImageList";
import filters, { drawFilter, filterImages } from "./filters";
import useCapture from "../components/hook/useCapture";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";

const WebcamComponent = ({ onCapture }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const captureCanvasRef = useRef(null);
    const sliderRef = useRef(null);
    const [filterIndex, setFilterIndex] = useState(0);
    const filterKeys = useMemo(() => Object.keys(filters), []);

    const capture = useCapture(
        webcamRef,
        captureCanvasRef,
        canvasRef,
        onCapture
    ); 

    const toggleMirror = () => {
        const video = webcamRef.current.video;
        video.style.transform =
            video.style.transform === "scaleX(-1)" ? "scaleX(1)" : "scaleX(-1)";
    };

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        afterChange: (index) => {
            setTimeout(() => {
                setFilterIndex(index);
            }, 0);
        },
    };

    const handleClick = (index) => {
        setFilterIndex(index);
    };

    const drawFaces = useCallback(
        (predictions) => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const video = webcamRef.current.video;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 필터 적용
            const filterKey = filterKeys[filterIndex];
            if (filterKey !== "none") {
                drawFilter(filterKey, predictions, ctx);
            }
        },
        [filterIndex, filterKeys]
    );

    // BlazeFace 모델을 로드 및 얼굴을 감지
    useEffect(() => {
        let isCancelled = false;

        const loadBlazeFace = async () => {
            const model = await blazeface.load();

            const detectFace = async () => {
                if (
                    webcamRef.current &&
                    webcamRef.current.video.readyState === 4
                ) {
                    const video = webcamRef.current.video;
                    const predictions = await model.estimateFaces(video, false);

                    if (!isCancelled) {
                        drawFaces(predictions);
                    }
                }
                requestAnimationFrame(detectFace);
            };
            detectFace();
        };

        loadBlazeFace();

        return () => {
            isCancelled = true;
        };
    }, [filterIndex, drawFaces]);

    return (
        <div className="ipad-frame">
            <div className="webcam-container">
                <Webcam
                    className="webcam"
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    mirrored
                />
                <canvas ref={canvasRef} className="webcam-canvas" />
                <canvas ref={captureCanvasRef} style={{ display: "none" }} />
                <div className="webcam-top-bar">
                    <button onClick={toggleMirror}>
                        <img src={icons.transform} />
                    </button>
                </div>
                <div className="webcam-bottom-bar">
                    <div
                        className="webcam-capture-button"
                        onClick={capture}
                    ></div>
                </div>
                <div className="webcam-slide-buttons">
                    <Slider {...sliderSettings} ref={sliderRef}>
                        {filterKeys.map((key, index) => (
                            <div
                                key={key}
                                className={`webcam-slide-button ${
                                    filterIndex === index ? "active" : ""
                                }`}
                                onClick={() => handleClick(index)}
                            >
                                {key === "none" ? (
                                    <span>일반</span>
                                ) : (
                                    <img
                                        src={filterImages[key]}
                                        alt={key}
                                        className="filter-image"
                                    />
                                )}
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default WebcamComponent;
