// CustomAudioPlay.jsx
import React, { useRef, useState, useEffect } from "react";
import icons from "../../../assets/ImageList";

const CustomAudioPlay = ({ src, duration }) => {
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(duration);

    const handleAudioPlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onplay = () => setIsPlaying(true);
            audioRef.current.onpause = () => setIsPlaying(false);
            audioRef.current.ontimeupdate = () => setCurrentTime(duration - audioRef.current.currentTime);
            audioRef.current.onended = () => {
                setIsPlaying(false);
                setCurrentTime(duration);
            };
        }
    }, [duration]);

    useEffect(() => {
        if (audioRef.current && duration) {
            progressBarRef.current.style.width = `${((duration - currentTime) / duration) * 100}%`;
        }
    }, [currentTime, duration]);

    return (
        <div className="custom-audio-play-bar">
            <button
                className="custom-audio-play-button"
                onClick={handleAudioPlay}
            >
                <img
                    src={isPlaying ? icons.messagePauseIcon : icons.messagePlayIcon}
                    alt={isPlaying ? "Pause" : "Play"}
                    className="custom-audio-play-icon"
                />
            </button>
            <div
                className="custom-audio-play-bar-fill"
                ref={progressBarRef}
            ></div>
            <span className="custom-audio-play-time">
                {formatTime(currentTime)}
            </span>
            <audio ref={audioRef} src={src} hidden />
        </div>
    );
};

export default CustomAudioPlay;
