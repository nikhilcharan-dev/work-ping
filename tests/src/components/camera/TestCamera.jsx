import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

import "./testCamera.css";

export default function TEST_CAMERA() {
    const webcamRef = useRef(null);
    const cameraRef = useRef(null);

    const [instruction, setInstruction] = useState("Align your face");
    const [checking, setChecking] = useState(false);
    const [rollNumber, setRollNumber] = useState(null);

    // ✅ percent-based position (IMPORTANT)
    const [labelPos, setLabelPos] = useState({ x: 50, y: 20 });

    const phaseRef = useRef("NO_FACE");
    const holdStartRef = useRef(null);

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
            if (!results.multiFaceLandmarks?.length) {
                phaseRef.current = "NO_FACE";
                setInstruction("No face detected");
                return;
            }

            const lm = results.multiFaceLandmarks[0];

            const noseX = lm[1].x;
            const leftCheekX = lm[234].x;
            const rightCheekX = lm[454].x;

            const faceCenterX = (leftCheekX + rightCheekX) / 2;
            const offset = noseX - faceCenterX;

            /* ---------- LABEL POSITION (PERCENT) ---------- */
            if (rollNumber) {
                const forehead = lm[10];

                setLabelPos({
                    x: (1 - forehead.x) * 100, // mirror-safe
                    y: forehead.y * 100 - 6,
                });
            }

            /* ---------- FLOW ---------- */
            if (phaseRef.current === "NO_FACE") {
                phaseRef.current = "CENTER";
                setInstruction("Center your face");
                return;
            }

            if (phaseRef.current === "CENTER") {
                if (Math.abs(offset) < 0.015) {
                    phaseRef.current = "LEFT";
                    holdStartRef.current = null;
                    setInstruction("Turn LEFT");
                }
                return;
            }

            const now = Date.now();
            const HOLD = 300;

            const checkHold = () => {
                if (!holdStartRef.current) {
                    holdStartRef.current = now;
                    return false;
                }
                return now - holdStartRef.current > HOLD;
            };

            if (phaseRef.current === "LEFT") {
                if (offset > 0.04 && checkHold()) {
                    phaseRef.current = "RIGHT";
                    holdStartRef.current = null;
                    setInstruction("Turn RIGHT");
                }
                return;
            }

            if (phaseRef.current === "RIGHT") {
                if (offset < -0.04 && checkHold()) {
                    phaseRef.current = "DONE";
                    setInstruction("Ready to check roll number");
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
    }, [rollNumber]);

    const handleCheck = async () => {
        setChecking(true);

        try {
            const imageBlob = await captureFrame();

            const formData = new FormData();
            formData.append("image", imageBlob, "frame.jpg");

            const res = await axios.post(
                `https://${agentic-ai.onrender.com}/test-detect-face`, // 👈 Node route
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data?.roll) {
                setRollNumber(res.data.roll);
            } else {
                setRollNumber("UNKNOWN");
            }
        } catch (err) {
            console.error(err);
            setRollNumber("ERROR");
        } finally {
            setChecking(false);
        }
    };


    return (
        <div className="camera-wrapper">
            <Webcam ref={webcamRef} audio={false} mirrored className="webcam" />

            <div className="instruction">{instruction}</div>

            {phaseRef.current === "DONE" && !rollNumber && (
                <button
                    className="attendance-btn overlay-btn"
                    onClick={handleCheck}
                    disabled={checking}
                >
                    {checking ? "Checking..." : "Check Roll Number"}
                </button>
            )}

            {rollNumber && (
                <div
                    className="face-label"
                    style={{
                        left: `${labelPos.x}%`,
                        top: `${labelPos.y}%`,
                    }}
                >
                    🎓 {rollNumber}
                </div>
            )}
        </div>
    );
}
