import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./QRScanner.css";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  const createScanner = () => {
    const config = { fps: 10, qrbox: 250 };
    return new Html5QrcodeScanner("qr-reader", config, false);
  };

  const startScan = () => {
    if (!scannerRef.current) {
      const qrScanner = createScanner();
      scannerRef.current = qrScanner;

      qrScanner.render(
        (decodedText) => {
          try {
            const parsedResult = JSON.parse(decodedText);
            setScanResult(parsedResult);
          } catch (err) {
            console.error("Invalid QR content:", decodedText);
            setScanResult({ status: "invalid" });
          }
          stopScan();
        },
        (errorMessage) => {
          console.warn(`QR Code Scan Error: ${errorMessage}`);
        }
      );
    }
    setIsScanning(true);
  };

  const stopScan = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((error) => {
        console.error("Failed to clear scanner:", error);
      });
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleRefresh = () => {
    setScanResult(null);
    startScan();
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScan();
      }
    };
  }, []);

  return (
    <div className="QRScanner">
      <h1>QR Code Scanner</h1>

      <div className="controls">
        <button
          onClick={isScanning ? stopScan : startScan}
          className={`scan-button ${isScanning ? "stop" : "start"}`}
        >
          {isScanning ? "Stop Scan" : "Start Scan"}
        </button>

        {scanResult && (
          <button onClick={handleRefresh} className="refresh-button">
            Scan Again
          </button>
        )}
      </div>

      <div id="qr-reader" className="qr-reader-container"></div>

      {scanResult && (
        <div className="scan-result">
          {scanResult.status === "approved" ? (
            <div className="valid-pass">
              <div className="tick-mark">&#10004;</div>
              <h2>Valid Pass</h2>
            </div>
          ) : (
            <div className="invalid-pass">
              <div className="cross-mark">&#10006;</div>
              <h2>Invalid Pass</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
