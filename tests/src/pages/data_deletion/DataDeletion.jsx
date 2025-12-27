import React from "react";
import "../privacy_policy/styles.css";

export default function DataDeletion() {
    return (
        <div className="privacy-container">
            <h1>Data Deletion Instructions</h1>
            <p className="updated">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <p>
                WorkPing respects user privacy and provides a clear process for requesting
                deletion of personal data.
            </p>

            <h2>How to Request Data Deletion</h2>
            <p>
                Users may request deletion of their data by contacting us using one of the
                methods below:
            </p>
            <ul>
                <li>
                    Email: <strong>support@workping.live</strong>
                </li>
                <li>
                    Subject line: <strong>“Data Deletion Request”</strong>
                </li>
            </ul>

            <h2>Information Required</h2>
            <p>
                To process your request efficiently, please include:
            </p>
            <ul>
                <li>Your name or business name</li>
                <li>The WhatsApp phone number associated with your communication</li>
                <li>A brief description of your request</li>
            </ul>

            <h2>Processing Time</h2>
            <p>
                Data deletion requests are typically processed within a reasonable time
                frame, subject to legal and operational requirements.
            </p>

            <h2>Exceptions</h2>
            <p>
                Certain information may be retained where required by law or for legitimate
                business purposes, such as security, fraud prevention, or compliance.
            </p>

            <h2>Contact Information</h2>
            <div className="contact-box">
                <p><strong>Business Name:</strong> WorkPing</p>
                <p><strong>Email:</strong> support@workping.live</p>
                <p><strong>Website:</strong> https://workping.live</p>
            </div>
        </div>
    );
}
