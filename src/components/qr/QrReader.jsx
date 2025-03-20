import React, { useState, useEffect } from "react";
import QrReader from "react-qr-scanner";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react";

const QRReader = () => {
  const [data, setData] = useState("No result");
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(true);
  const [camera, setCamera] = useState({
    facingMode: "environment",
  });

  const navigate = useNavigate();
  const location = useLocation();

 
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get("id");


  useEffect(() => {
    if (!eventId) {
      toast.error("No event ID provided", {
        position: "top-center",
        autoClose: 3000,
      });
     
      setTimeout(() => navigate(-1), 3000);
    }
  }, [eventId, navigate]);

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
    toast.error("Scanner error: " + error.message, {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleRead = async (result) => {
    if (result && result.text) {
      console.log("Scan successful:", result);

      // Prevent multiple scans
      setScanning(false);

      
      const email = result.text;
      setData(email);

      try {
        const userResponse = await axios.get(
          `http://localhost:8080/api/auth/getUserIdByEmail/${email}`
        );

   
        const userId = userResponse.data._id;

       
        const checkResponse = await axios.get(
          `http://localhost:8080/events/check-response/${eventId}/${userId}`
        );

       
        if (
          checkResponse.data.hasResponded ||
          checkResponse.data.event.responseBy.includes(userId)
        ) {
          
          const response = await axios.post(
            `http://localhost:8080/events/${eventId}/attendance`,
            { email },
            { headers: { "Content-Type": "application/json" } ,withCredentials:true},
          
          );

       
          setMessage(response.data.message);

        
          toast.success("Attendance Marked Successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          setTimeout(() => {
            navigate("/admin/admindashboard");
          }, 3000);
        } else {
        
          setMessage("User has not responded to this event");
          toast.warning("This user has not responded to attend this event!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Re-enable scanning
          setTimeout(() => setScanning(true), 3000);
        }
      } catch (error) {
        const toastId = "qr-error";

        if (error.response?.status === 409) {
          setMessage("This email has already been marked for attendance");
          if (!toast.isActive(toastId)) {
            toast.warning("Already marked attendance for this email!", {
              toastId,
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } else if (
          error.response?.status === 404 &&
          error.response?.data?.message?.includes("User not found")
        ) {
          setMessage("User not found with this email");
          if (!toast.isActive(toastId)) {
            toast.error(
              "User not found with this email. Please check the QR code.",
              {
                toastId,
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
        } else {
          setMessage(
            error.response?.data?.message || "Error processing attendance"
          );
          if (!toast.isActive(toastId)) {
            toast.error("Failed to mark attendance. Please try again.", {
              toastId,
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        }

        // Re-enable scanning after error
        setTimeout(() => setScanning(true), 2000);
      }
    }
  };

  const toggleCamera = () => {
    setCamera({
      facingMode: camera.facingMode === "environment" ? "user" : "environment",
    });
  };

  const resetScanner = () => {
    setScanning(true);
    setData("No result");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>
      <h2 className="text-2xl font-bold text-blue-400 mb-6">QR Code Scanner</h2>
      {eventId ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          {scanning && (
            // <QrReader
            //   delay={300}
            //   onError={handleError}
            //   onScan={handleRead}
            //   style={{ width: "100%" }}
            //   className="rounded-lg"
            //   constraints={{
            //     video: {
            //       facingMode: camera.facingMode,
            //     },
            //   }}
            // />
            // In your QRReader component, try adjusting these options
            <QrReader
              delay={500} // Increase delay slightly
              onError={handleError}
              onScan={handleRead}
              style={{ width: "100%" }}
              className="rounded-lg"
              resolution={800} 
              constraints={{
                video: {
                  facingMode: camera.facingMode,
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                },
              }}
            />
          )}

          <div className="flex justify-between mt-4">
            <button
              onClick={toggleCamera}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Switch Camera
            </button>

            <button
              onClick={resetScanner}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Reset Scanner
            </button>
          </div>

          <div className="mt-6 text-center">
            {/* <p className="text-gray-300 text-sm mb-2">
              Event ID: <span className="text-blue-400">{eventId}</span>
            </p> */}
            <p className="text-gray-300">
              Scanned Email: <span className="text-blue-400">{data}</span>
            </p>
            {message && (
              <p className="text-gray-300 mt-2">
                Server Response:{" "}
                <span
                  className={
                    message.includes("already")
                      ? "text-yellow-400"
                      : message.includes("not found") ||
                          message.includes("Error")
                        ? "text-red-400"
                        : "text-green-400"
                  }
                >
                  {message}
                </span>
              </p>
            )}
          </div>

          <div className="mt-4 p-3 bg-gray-700 rounded-lg">
            <h3 className="text-blue-300 font-semibold mb-2">Scanner Status</h3>
            <p className="text-sm text-gray-300">
              Camera:{" "}
              <span className="text-blue-400">
                {camera.facingMode === "environment" ? "Back" : "Front"}
              </span>
            </p>
            <p className="text-sm text-gray-300">
              Status:{" "}
              <span className="text-blue-400">
                {scanning ? "Active" : "Paused"}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-red-400">No event ID provided in URL</p>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default QRReader;
