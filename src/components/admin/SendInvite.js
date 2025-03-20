import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SendInvite = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [invitees, setInvitees] = useState([{ email: "", username: "" }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedInputIndex, setFocusedInputIndex] = useState(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Fetch event details when component mounts
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/events/${eventId}`
        );
        setEventDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch event details");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const searchEmails = async (query, index) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/auth/search-emails?query=${encodeURIComponent(query)}`,{
          withCredentials:true
        }
      );
      setSearchResults(
        response.data.map((item) => ({
          ...item,
          inputIndex: index, // Store which input this search is for
        }))
      );
      setActiveIndex(-1);
    } catch (err) {
      console.error("Email search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEmailInputChange = (index, value) => {
    handleInviteeChange(index, "email", value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a timeout to avoid too many API calls while typing
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        searchEmails(value, index);
      } else {
        setSearchResults([]);
      }
    }, 300);
  };

  const handleEmailInputFocus = (index) => {
    setFocusedInputIndex(index);
    const currentEmail = invitees[index].email;
    if (currentEmail.trim().length >= 2) {
      searchEmails(currentEmail, index);
    }
  };

  const handleEmailInputBlur = () => {
    // Use setTimeout to allow click events on suggestions to fire first
    setTimeout(() => {
      setFocusedInputIndex(null);
      setSearchResults([]);
    }, 200);
  };

  const handleKeyDown = (e, index) => {
    if (!searchResults.length) return;

    // Filter results to only show those for the current input
    const filteredResults = searchResults.filter(
      (result) => result.inputIndex === index
    );
    if (!filteredResults.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex < filteredResults.length - 1 ? prevIndex + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredResults.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredResults.length) {
          selectEmailSuggestion(filteredResults[activeIndex], index);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSearchResults([]);
        break;
      default:
        break;
    }
  };

  const selectEmailSuggestion = (suggestion, index) => {
    const newInvitees = [...invitees];
    newInvitees[index].email = suggestion.email;
    if (suggestion.username && !newInvitees[index].username) {
      newInvitees[index].username = suggestion.username;
    }
    setInvitees(newInvitees);
    setSearchResults([]);
    setActiveIndex(-1);
  };

  const addInviteeField = () => {
    setInvitees([...invitees, { email: "", username: "" }]);
  };

  const removeInviteeField = (index) => {
    const newInvitees = [...invitees];
    newInvitees.splice(index, 1);
    setInvitees(newInvitees);
  };

  const handleInviteeChange = (index, field, value) => {
    const newInvitees = [...invitees];
    newInvitees[index][field] = value;
    setInvitees(newInvitees);
  };

  const validateEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let validationError = "";

    const invalidEntries = invitees.filter(
      ({ email }) => email.trim() !== "" && !emailRegex.test(email)
    );

    if (invalidEntries.length > 0) {
      validationError = `Invalid email format in: ${invalidEntries.map((i) => i.email).join(", ")}`;
    }

    return validationError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate emails
    const validationError = validateEmails();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Filter out empty entries
    const filteredInvitees = invitees.filter(
      ({ email }) => email.trim() !== ""
    );

    if (filteredInvitees.length === 0) {
      setError("Please enter at least one email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("http://localhost:8080/api/auth/send-invites", {
        eventId,
        emails: filteredInvitees.map((i) => i.email),
        usernames: filteredInvitees.map((i) => i.username),
      },{
        withCredentials:true
      });

      setSuccess(true);
      setInvitees([{ email: "", username: "" }]);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send invites");
      setLoading(false);
    }
  };

  if (loading && !eventDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !eventDetails) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-md mt-8">
        <p>{error}</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  // Filter search results for the currently focused input
  const filteredSearchResults = searchResults.filter(
    (result) => result.inputIndex === focusedInputIndex
  );

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      {eventDetails && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {eventDetails.name}
          </h2>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Date:</span>{" "}
            {formatDate(eventDetails.startDate)}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Time:</span> {eventDetails.startTime}
          </p>
        </div>
      )}

      <h1 className="text-xl font-bold text-gray-800 mb-4">
        Send Event Invitations
      </h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Invitations sent successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          {invitees.map((invitee, index) => (
            <div key={index} className="mb-4 flex items-start space-x-2">
              <div className="flex-1">
                <div className="mb-2 relative">
                  <label
                    htmlFor={`email-${index}`}
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id={`email-${index}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Email"
                    value={invitee.email}
                    onChange={(e) =>
                      handleEmailInputChange(index, e.target.value)
                    }
                    onFocus={() => handleEmailInputFocus(index)}
                    onBlur={handleEmailInputBlur}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    autoComplete="off"
                  />
                  {isSearching && focusedInputIndex === index && (
                    <div className="absolute right-3 top-9">
                      <div className="animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full"></div>
                    </div>
                  )}

                  {/* Email suggestions dropdown */}
                  {focusedInputIndex === index &&
                    filteredSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                        {filteredSearchResults.map((result, resultIndex) => (
                          <div
                            key={resultIndex}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                              activeIndex === resultIndex ? "bg-blue-100" : ""
                            }`}
                            onClick={() => selectEmailSuggestion(result, index)}
                            onMouseEnter={() => setActiveIndex(resultIndex)}
                          >
                            <div className="font-medium">{result.email}</div>
                            {result.username && (
                              <div className="text-sm text-gray-600">
                                {result.username}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                <div>
                  <label
                    htmlFor={`username-${index}`}
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    id={`username-${index}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Name"
                    value={invitee.username}
                    onChange={(e) =>
                      handleInviteeChange(index, "username", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="pt-8">
                {invitees.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeInviteeField(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mb-4 text-blue-500 hover:text-blue-700 flex items-center text-sm"
            onClick={addInviteeField}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Another Invitee
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invites"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendInvite;
