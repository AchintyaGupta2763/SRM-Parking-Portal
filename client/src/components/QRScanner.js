import React, { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./QRScanner.css";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState("");
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
          console.log(`Decoded Text: ${decodedText}`);
          setScanResult(decodedText);
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
      scannerRef.current.clear().catch(error => {
        console.error("Failed to clear scanner:", error);
      });
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleRefresh = () => {
    setScanResult("");
    startScan();
  };

  // Cleanup on component unmount
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
          className={`scan-button ${isScanning ? 'stop' : 'start'}`}
        >
          {isScanning ? 'Stop Scan' : 'Start Scan'}
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
          <h3>Scanned Data:</h3>
          <p>{scanResult}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;