import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

import "./testCamera.css";

const STABLE_TIME = 1200;

export default function TEST_CAMERA() {
    const webcamRef = useRef(null);
    const cameraRef = useRef(null);

    const [instruction, setInstruction] = useState("Initializing camera…");
    const [labels, setLabels] = useState([]);
    const [checking, setChecking] = useState(false);

    const facePresentRef = useRef(false);
    const stableSinceRef = useRef(null);
    const apiCalledRef = useRef(false);
    const lastResultRef = useRef(null);

    const captureFrame = async () => {
        const video = webcamRef.current?.video;
        if (!video) return null;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        return new Promise((resolve) =>
            canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
        );
    };

    const callFaceAPI = async () => {
        if (checking || apiCalledRef.current) return;

        apiCalledRef.current = true;
        setChecking(true);

        try {
            const blob = await captureFrame();
            if (!blob) return;

            const fd = new FormData();
            fd.append("image", blob, "frame.jpg");

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/api/test/test-detect-face`,
                fd,
                { withCredentials: true }
            );

            lastResultRef.current = {
                roll: res.data?.roll || "UNKNOWN",
                similarity: res.data?.similarity ?? null,
            };
        } catch {
            lastResultRef.current = {
                roll: "ERROR",
                similarity: null,
            };
        } finally {
            setChecking(false);
        }
    };

    useEffect(() => {
        if (!webcamRef.current?.video) return;
        const video = webcamRef.current.video;

        const faceMesh = new FaceMesh({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
            maxNumFaces: 5,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        faceMesh.onResults((results) => {
            const faces = results.multiFaceLandmarks || [];

            if (faces.length === 0) {
                setInstruction("No face detected");
                setLabels([]);
                facePresentRef.current = false;
                stableSinceRef.current = null;
                apiCalledRef.current = false;
                lastResultRef.current = null;
                return;
            }

            if (faces.length > 1) {
                setInstruction("Multiple faces detected");
                setLabels(
                    faces.map((lm, i) => ({
                        id: i,
                        x: (1 - lm[10].x) * 100,
                        y: lm[10].y * 100 - 18,
                        text: `FACE ${i + 1}`,
                    }))
                );
                facePresentRef.current = false;
                stableSinceRef.current = null;
                apiCalledRef.current = false;
                lastResultRef.current = null;
                return;
            }

            const lm = faces[0];
            const forehead = lm[10];

            if (!facePresentRef.current) {
                facePresentRef.current = true;
                stableSinceRef.current = Date.now();
                apiCalledRef.current = false;
                lastResultRef.current = null;
                setInstruction("Hold still…");
                return;
            }

            if (
                !apiCalledRef.current &&
                Date.now() - stableSinceRef.current > STABLE_TIME
            ) {
                callFaceAPI();
            }

            const roll = lastResultRef.current?.roll;
            const sim = lastResultRef.current?.similarity;

            setInstruction("Face locked");

            setLabels([
                {
                    id: 0,
                    x: (1 - forehead.x) * 100,
                    y: forehead.y * 100 - 22,
                    text: roll
                        ? `🎓 ${roll}\nSimilarity: ${(sim * 100).toFixed(1)}%`
                        : "Detecting…",
                },
            ]);
        });

        cameraRef.current = new Camera(video, {
            onFrame: async () => {
                await faceMesh.send({ image: video });
            },
        });

        cameraRef.current.start();
        return () => cameraRef.current?.stop();
    }, []);

    return (
        <div className="camera-wrapper">
            <Webcam ref={webcamRef} audio={false} mirrored className="webcam" />

            <div className="instruction">{instruction}</div>

            {labels.map((l) => (
                <div
                    key={l.id}
                    className="face-label"
                    style={{ left: `${l.x}%`, top: `${l.y}%` }}
                >
                    {l.text}
                </div>
            ))}
        </div>
    );
}
