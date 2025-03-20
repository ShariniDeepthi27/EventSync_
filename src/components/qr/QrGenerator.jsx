import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../../context/authContext";

const QRgenerator = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user?._id) {
      const storedEmail = user.email;
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [user]);

  const downloadQR = () => {
    const canvas = document.getElementById("qrCodeCanvas");
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "myqr.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.error("Canvas not found");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-6">
      {email ? (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            Your QR Code
          </h2>
          <p className="text-gray-300 mb-6">Email: {email}</p>
          <div className="flex justify-center mb-6 bg-white p-4 rounded-lg">
            <QRCodeCanvas
              id="qrCodeCanvas"
              value={email}
              size={256}
              level={"H"}
              // includeMargin={true}
              bgColor="#FFFFFF" 
              fgColor="#000000" 
            />
          </div>
          <button
            onClick={downloadQR}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Download QR Code
          </button>
        </div>
      ) : (
        <p className="text-gray-300">No email found. Please sign up.</p>
      )}
    </div>
  );
};

export default QRgenerator;
