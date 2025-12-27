import React from "react";
import "../privacy_policy/styles.css";

export default function Terms() {
    return (
        <div className="privacy-container">
            <h1>Terms of Service</h1>
            <p className="updated">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <p>
                These Terms of Service ("Terms") govern the use of WorkPing’s services,
                applications, and internal tools operated by WorkPing ("we", "our", "us").
            </p>

            <h2>Use of Services</h2>
            <p>
                WorkPing provides internal tools and communication services, including
                WhatsApp-based messaging, to support business operations and user
                interactions. You agree to use these services only for lawful and
                legitimate purposes.
            </p>

            <h2>User Responsibilities</h2>
            <ul>
                <li>Provide accurate information when interacting with WorkPing</li>
                <li>Use the services in compliance with applicable laws</li>
                <li>Not misuse, disrupt, or attempt unauthorized access to our systems</li>
            </ul>

            <h2>WhatsApp Communication</h2>
            <p>
                By contacting WorkPing or opting in to receive WhatsApp messages, you
                consent to receive service-related communications when necessary.
                WorkPing does not send unsolicited promotional or marketing messages.
            </p>

            <h2>Intellectual Property</h2>
            <p>
                All content, software, and materials associated with WorkPing are owned
                by or licensed to WorkPing and may not be copied or reused without
                permission.
            </p>

            <h2>Service Availability</h2>
            <p>
                We strive to maintain reliable service availability but do not guarantee
                uninterrupted access at all times.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
                WorkPing shall not be liable for indirect, incidental, or consequential
                damages arising from the use or inability to use our services.
            </p>

            <h2>Changes to Terms</h2>
            <p>
                We may update these Terms from time to time. Continued use of our
                services constitutes acceptance of the updated Terms.
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
