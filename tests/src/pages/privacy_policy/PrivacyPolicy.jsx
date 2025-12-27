import React from "react";
import "./styles.css";

export default function PrivacyPolicy() {
    return (
        <div className="privacy-container">
            <h1>Privacy Policy</h1>
            <p className="updated">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <p>
                WorkPing ("we", "our", "us") operates internal tools and services to support
                our business operations, including communication through the WhatsApp
                Business Platform.
            </p>

            <h2>Information We Collect</h2>
            <p>
                We collect only the information necessary to operate our services,
                including:
            </p>
            <ul>
                <li>Business and user contact information</li>
                <li>WhatsApp message metadata (timestamps, delivery status)</li>
                <li>Message content used strictly for operational and support purposes</li>
            </ul>

            <h2>How We Use Information</h2>
            <ul>
                <li>Respond to user queries and support requests</li>
                <li>Send important service-related notifications when required</li>
                <li>Operate and monitor internal workflows and automation</li>
            </ul>

            <h2>WhatsApp Communication & Notifications</h2>
            <p>
                Users of WorkPing may receive WhatsApp messages only when such communication
                is necessary for service operation, support, or essential updates.
            </p>
            <p>
                WhatsApp messages are sent under the following conditions:
            </p>
            <ul>
                <li>The user has contacted WorkPing via WhatsApp or explicitly opted in</li>
                <li>The message is required to respond to a query or provide a service update</li>
                <li>The user has been informed in advance that WhatsApp may be used for communication</li>
            </ul>
            <p>
                WorkPing does not send unsolicited promotional or marketing messages.
            </p>

            <h2>Data Sharing</h2>
            <p>
                We do not sell, rent, or trade personal data. Information is accessed only
                by authorized WorkPing personnel and trusted infrastructure providers
                required to operate our services.
            </p>

            <h2>Data Retention</h2>
            <p>
                Data is retained only for as long as necessary to fulfill operational
                requirements or comply with legal obligations.
            </p>

            <h2>Data Security</h2>
            <p>
                We apply appropriate technical and organizational safeguards to protect
                information against unauthorized access, disclosure, or loss.
            </p>

            <h2>User Rights</h2>
            <p>
                Users may contact us to request information about how their data is used
                or to raise concerns related to privacy.
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
