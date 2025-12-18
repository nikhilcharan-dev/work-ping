import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

import "./styles.css";

export default function WEB_CAMERA() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);

    const [instruction, setInstruction] = useState("No face detected");
    const [done, setDone] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const phaseRef = useRef("NO_FACE");
    const stabilizeTimerRef = useRef(null);
    const holdStartRef = useRef(null);
    const imageSuspicionRef = useRef(0);
    const yawHistoryRef = useRef([]);

    useEffect(() => {
        if (!webcamRef.current) return;
        const video = webcamRef.current.video;
        if (!video) return;

        const faceMesh = new FaceMesh({
            locateFile: (file) =>
                `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
        });

        faceMesh.onResults((results) => {
            if (blocked || loading) return;

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (!results.multiFaceLandmarks?.length) {
                resetLogic();
                setInstruction("No face detected");
                return;
            }

            const lm = results.multiFaceLandmarks[0];

            const noseX = lm[1].x;
            const leftCheekX = lm[234].x;
            const rightCheekX = lm[454].x;
            const leftEye = lm[33];
            const rightEye = lm[263];

            const faceCenterX = (leftCheekX + rightCheekX) / 2;
            const offset = noseX - faceCenterX;

            const yaw = rightEye.x - leftEye.x;
            yawHistoryRef.current.push(yaw);
            if (yawHistoryRef.current.length > 15)
                yawHistoryRef.current.shift();

            if (phaseRef.current === "NO_FACE") {
                phaseRef.current = "ALIGN_CENTER";
                setInstruction("Align your face to the center");
                return;
            }

            if (phaseRef.current === "ALIGN_CENTER") {
                if (Math.abs(offset) < 0.015) {
                    phaseRef.current = "STABILIZING";
                    setInstruction("Face aligned ✅ Hold still...");
                    stabilizeTimerRef.current = setTimeout(() => {
                        phaseRef.current = "LEFT";
                        holdStartRef.current = null;
                        setInstruction("Turn LEFT and hold");
                    }, 2000);
                }
                return;
            }

            if (phaseRef.current === "STABILIZING") return;

            if (yawHistoryRef.current.length >= 10) {
                const yawRange =
                    Math.max(...yawHistoryRef.current) -
                    Math.min(...yawHistoryRef.current);

                if (Math.abs(offset) > 0.02 && yawRange < 0.004) {
                    imageSuspicionRef.current += 2;
                } else {
                    imageSuspicionRef.current = Math.max(
                        0,
                        imageSuspicionRef.current - 1
                    );
                }

                if (imageSuspicionRef.current > 20) {
                    setInstruction("Image detected. Camera closed.");
                    setBlocked(true);
                    cameraRef.current?.stop();
                    return;
                }
            }

            const now = Date.now();
            const HOLD = 400;

            const checkHold = () => {
                if (!holdStartRef.current) {
                    holdStartRef.current = now;
                    return false;
                }
                return now - holdStartRef.current >= HOLD;
            };

            if (phaseRef.current === "LEFT") {
                if (offset > 0.04 && checkHold()) {
                    phaseRef.current = "CENTER";
                    holdStartRef.current = null;
                    setInstruction("Return to CENTER and hold");
                }
                return;
            }

            if (phaseRef.current === "CENTER") {
                if (Math.abs(offset) < 0.015 && checkHold()) {
                    phaseRef.current = "RIGHT";
                    holdStartRef.current = null;
                    setInstruction("Turn RIGHT and hold");
                }
                return;
            }

            if (phaseRef.current === "RIGHT") {
                if (offset < -0.04 && checkHold()) {
                    phaseRef.current = "DONE";
                    setInstruction("Liveness verified ✅");
                    setDone(true);
                }
            }
        });

        cameraRef.current = new Camera(video, {
            onFrame: async () => {
                await faceMesh.send({ image: video });
            },
        });

        cameraRef.current.start();

        return () => cameraRef.current?.stop();
    }, [blocked, loading]);

    const resetLogic = () => {
        clearTimeout(stabilizeTimerRef.current);
        phaseRef.current = "NO_FACE";
        holdStartRef.current = null;
        imageSuspicionRef.current = 0;
        yawHistoryRef.current = [];
        setDone(false);
        setResult(null);
    };

    const handleMarkAttendance = async () => {
        setLoading(true);
        setResult(null);

        const API_URL = import.meta.env.VITE_ATTENDANCE_API;

        try {
            // 1️⃣ Capture frames from webcam (example: 3 frames already stored as blobs)
            // Assume you already have these blobs captured earlier
            // framesRef.current = [Blob, Blob, Blob]

            const formData = new FormData();

            // attach frames
            framesRef.current.forEach((blob, idx) => {
                formData.append("frames", blob, `frame_${idx}.jpg`);
            });

            // attach metadata
            formData.append("timestamp", Date.now());
            formData.append("device", "web");
            formData.append("liveness", "passed");

            // 2️⃣ REAL API CALL
            const res = await fetch(API_URL, {
                method: "POST",
                body: formData,
                credentials: "include", // if using cookies / sessions
            });

            if (!res.ok) {
                throw new Error("API failed");
            }

            const data = await res.json();

            // 3️⃣ HANDLE RESPONSE
            if (data.status === "marked") {
                setResult(
                    `Attendance marked ✅ (${Math.round(data.confidence * 100)}%)`
                );
            } else {
                setResult("Attendance verification failed ❌");
            }
        } catch (err) {
            setResult("Server error ❌");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="camera-wrapper">
            <Webcam ref={webcamRef} audio={false} mirrored className="webcam" />
            <canvas ref={canvasRef} className="overlay-canvas" />

            <div className="instruction">{instruction}</div>

            {done && !blocked && (
                <button
                    className="attendance-btn overlay-btn"
                    onClick={handleMarkAttendance}
                    disabled={loading}
                >
                    {loading ? "Marking..." : "Mark Attendance"}
                </button>
            )}

            {result && <div className="result-pill">{result}</div>}

            {blocked && (
                <div className="blocked-overlay">
                    Image / phone detected
                    <br />
                    Camera disabled
                </div>
            )}
        </div>
    );
}
