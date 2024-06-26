import { useState, useEffect, useRef } from "react";

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });  // 웹엠 형식 사용
        const chunks = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            setAudioBlob(blob);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setIsRecording(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current = null;
    };

    return { isRecording, audioBlob, startRecording, stopRecording, resetRecording };
};

export default useAudioRecorder;
