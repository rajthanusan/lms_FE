import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminWhatsAppPanel = () => {
    const [qrCode, setQrCode] = useState(null);
    const [status, setStatus] = useState("Checking...");

    useEffect(() => {
        // Fetch QR code and connection status from the backend
        axios.get('/api/whatsapp/status')
            .then(response => {
                setQrCode(response.data.qr_code);
                setStatus(response.data.status);
            })
            .catch(err => {
                console.error("Error fetching WhatsApp status:", err);
                setStatus("Error fetching status");
            });
    }, []);

    return (
        <div className="whatsapp-panel">
            <h1>Admin WhatsApp Panel</h1>
            <p>Status: {status}</p>
            {qrCode ? (
                <div>
                    <h2>Scan this QR code to connect:</h2>
                    <pre>{qrCode}</pre> {/* Render QR code text */}
                </div>
            ) : (
                <p>No QR code available. WhatsApp is {status}.</p>
            )}
        </div>
    );
};

export default AdminWhatsAppPanel;
