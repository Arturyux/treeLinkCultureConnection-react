import { useState, useEffect } from "react";

function DiscordSchedulerEditor() {
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  // Default new message data (type defaults to "weekly")
  const [newMessageData, setNewMessageData] = useState({
    type: "weekly",            // Either "weekly" or "date"
    name: "",
    turnon: false,
    channelId: "",
    responseChannelId: "",
    roleId: "",
    // Weekly fields
    hour: "0",
    minutes: "0",
    dayoftheweek: "0",

    // Date fields
    year: "2025",
    month: "1",
    day: "1",
    time: "12:00:00",
    daybefore: "0",

    // Always set seconds to "0" in the final payload
    seconds: "0",
    // No explicit timezone field in UI, default to "Europe/Stockholm" in final payload

    // Default message content with role mention
    messageContent: `Sup all <@&COMMITTEE_ROLE_ID>,\n\n**Friendly reminder:** Need to make a post on social media!\n\nReact to this message\n❤️ - Automatically send a message in Discord\n\n*Not necessary to react; you can send message manually.*`,
    automaticResponses: [
      {
        title: "",
        content: "",
      },
    ],
  });

  // Fetch data on mount
  useEffect(() => {
    fetchScheduledMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========== FETCH ALL SCHEDULED MESSAGES ==========
  const fetchScheduledMessages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // Expected shape: { success: true, data: [...] }
      if (result && result.success && Array.isArray(result.data)) {
        setScheduledMessages(result.data);
      } else {
        console.warn("Unexpected response structure:", result);
        setScheduledMessages([]);
      }
    } catch (error) {
      console.error("Error fetching scheduled messages:", error);
      setScheduledMessages([]);
    }
  };

  // ========== EDIT EXISTING ITEM ==========
  const handleEdit = (index) => {
    setEditIndex(index);
    // Deep copy so we don't mutate state directly
    setEditData(JSON.parse(JSON.stringify(scheduledMessages[index])));
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditData(null);
  };

  const handleSave = async () => {
    if (editIndex === null || !editData) return;

    // Always set seconds to "0" and timezone to "Europe/Stockholm"
    const updatedData = {
      ...editData,
      seconds: "0",
      timezone: "Europe/Stockholm",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages/${editIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Expected: { success: true, data: { ...updatedItem... } }
      const result = await response.json();
      if (result && result.success && result.data) {
        setScheduledMessages((prev) => {
          const updatedList = [...prev];
          updatedList[editIndex] = result.data;
          return updatedList;
        });
        setEditIndex(null);
        setEditData(null);
      } else {
        console.warn("Unexpected response structure:", result);
      }
    } catch (error) {
      console.error("Error updating scheduled message:", error);
    }
  };

  // ========== DELETE BY INDEX ==========
  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this scheduled message?")) {
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages/${index}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Expected: { success: true, data: { ...deletedItem... } }
      const result = await response.json();
      if (result && result.success) {
        setScheduledMessages((prev) => prev.filter((_, i) => i !== index));
        if (index === editIndex) {
          setEditIndex(null);
          setEditData(null);
        }
      } else {
        console.warn("Unexpected response structure:", result);
      }
    } catch (error) {
      console.error("Error deleting scheduled message:", error);
    }
  };

  // ========== EDIT MODE FIELD HANDLING ==========
  const handleFieldChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAutomaticResponseChange = (respIndex, field, value) => {
    setEditData((prev) => {
      const updated = [...(prev.automaticResponses || [])];
      updated[respIndex] = {
        ...updated[respIndex],
        [field]: value,
      };
      return { ...prev, automaticResponses: updated };
    });
  };

  const handleAddAutomaticResponseEdit = () => {
    setEditData((prev) => ({
      ...prev,
      automaticResponses: [
        ...(prev.automaticResponses || []),
        { title: "", content: "" },
      ],
    }));
  };

  const handleRemoveAutomaticResponseEdit = (respIndex) => {
    setEditData((prev) => {
      const updated = [...(prev.automaticResponses || [])];
      updated.splice(respIndex, 1);
      return { ...prev, automaticResponses: updated };
    });
  };

  // ========== ADD NEW SCHEDULED MESSAGE ==========
  const handleAddAutomaticResponseNew = () => {
    setNewMessageData((prev) => ({
      ...prev,
      automaticResponses: [
        ...prev.automaticResponses,
        { title: "", content: "" },
      ],
    }));
  };

  const handleRemoveAutomaticResponseNew = (respIndex) => {
    setNewMessageData((prev) => {
      const updated = [...prev.automaticResponses];
      updated.splice(respIndex, 1);
      return { ...prev, automaticResponses: updated };
    });
  };

  const handleNewFieldChange = (field, value) => {
    setNewMessageData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewAutoRespFieldChange = (respIndex, field, value) => {
    setNewMessageData((prev) => {
      const updated = [...prev.automaticResponses];
      updated[respIndex] = {
        ...updated[respIndex],
        [field]: value,
      };
      return { ...prev, automaticResponses: updated };
    });
  };

  // Basic validation
  const validateNewMessageData = () => {
    if (!newMessageData.name.trim()) return false;
    if (!newMessageData.channelId.trim()) return false;
    if (!newMessageData.responseChannelId.trim()) return false;
    if (!newMessageData.roleId.trim()) return false;
    if (!newMessageData.messageContent.trim()) return false;

    // If weekly
    if (newMessageData.type === "weekly") {
      if (newMessageData.hour === "" || newMessageData.minutes === "" || newMessageData.dayoftheweek === "") {
        return false;
      }
    }

    // If date
    if (newMessageData.type === "date") {
      if (
        !newMessageData.year.trim() ||
        !newMessageData.month.trim() ||
        !newMessageData.day.trim() ||
        !newMessageData.time.trim()
      ) {
        return false;
      }
    }

    return true;
  };

  const handleAddNewMessage = async () => {
    if (!validateNewMessageData()) {
      alert("Please fill out all required fields.");
      return;
    }

    // Always set seconds = "0" and timezone = "Europe/Stockholm"
    const messageDataToSend = {
      ...newMessageData,
      seconds: "0",
      timezone: "Europe/Stockholm",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageDataToSend),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      // Expecting { success: true, data: { ...createdItem } }
      if (result && result.success && result.data) {
        setScheduledMessages((prev) => [...prev, result.data]);
      } else {
        console.warn("Unexpected response structure:", result);
      }

      // Reset the form with defaults
      setNewMessageData({
        type: "weekly",
        name: "",
        turnon: false,
        channelId: "",
        responseChannelId: "",
        roleId: "",
        hour: "0",
        minutes: "0",
        dayoftheweek: "0",
        year: "2025",
        month: "1",
        day: "1",
        time: "12:00:00",
        daybefore: "0",
        seconds: "0",
        messageContent: `Sup all <@&COMMITTEE_ROLE_ID>,\n\n**Friendly reminder:** Need to make a post on social media!\n\nReact to this message\n❤️ - Automatically send a message in Discord\n\n*Not necessary to react; you can send message manually.*`,
        automaticResponses: [{ title: "", content: "" }],
      });
    } catch (error) {
      console.error("Error creating new scheduled message:", error);
    }
  };

  // ========== RENDER ==========
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Discord Scheduler Editor</h2>

      {/* Existing scheduled messages */}
      {scheduledMessages.length === 0 ? (
        <p>No scheduled messages found.</p>
      ) : (
        <div className="space-y-4">
          {scheduledMessages.map((msg, index) => {
            const isEditing = index === editIndex;

            if (isEditing && editData) {
              // ============ EDIT MODE ============
              return (
                <div key={index} className="border p-4 rounded bg-gray-100">
                  <div className="space-y-2">
                    {/* TYPE */}
                    <div>
                      <label className="block font-semibold">Type:</label>
                      <select
                        value={editData.type || "weekly"}
                        onChange={(e) => handleFieldChange("type", e.target.value)}
                        className="border p-1 w-full"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="date">Date</option>
                      </select>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block font-semibold">Name:</label>
                      <input
                        type="text"
                        value={editData.name || ""}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="border p-1 w-full"
                      />
                    </div>

                    {/* Turn On */}
                    <div>
                      <label className="block font-semibold">Turn On:</label>
                      <input
                        type="checkbox"
                        checked={editData.turnon || false}
                        onChange={(e) => handleFieldChange("turnon", e.target.checked)}
                      />
                    </div>

                    {/* Channel ID */}
                    <div>
                      <label className="block font-semibold">Channel ID:</label>
                      <input
                        type="text"
                        value={editData.channelId || ""}
                        onChange={(e) => handleFieldChange("channelId", e.target.value)}
                        className="border p-1 w-full"
                      />
                    </div>

                    {/* Response Channel ID */}
                    <div>
                      <label className="block font-semibold">Response Channel ID:</label>
                      <input
                        type="text"
                        value={editData.responseChannelId || ""}
                        onChange={(e) => handleFieldChange("responseChannelId", e.target.value)}
                        className="border p-1 w-full"
                      />
                    </div>

                    {/* Role ID */}
                    <div>
                      <label className="block font-semibold">Role ID:</label>
                      <input
                        type="text"
                        value={editData.roleId || ""}
                        onChange={(e) => handleFieldChange("roleId", e.target.value)}
                        className="border p-1 w-full"
                      />
                    </div>

                    {/* Conditional: If type === "weekly" */}
                    {editData.type === "weekly" && (
                      <div className="border p-2 rounded bg-white">
                        <p className="font-semibold">Weekly Schedule:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-semibold">Hour:</label>
                            <select
                              value={editData.hour || "0"}
                              onChange={(e) => handleFieldChange("hour", e.target.value)}
                              className="border p-1 w-full"
                            >
                              {[...Array(24)].map((_, i) => (
                                <option key={i} value={i}>
                                  {i < 10 ? `0${i}` : i}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-semibold">Minutes:</label>
                            <select
                              value={editData.minutes || "0"}
                              onChange={(e) => handleFieldChange("minutes", e.target.value)}
                              className="border p-1 w-full"
                            >
                              {["0","5","10","15","20","25","30","35","40","45","50","55"].map((val) => (
                                <option key={val} value={val}>
                                  {val === "0" ? "00" : val}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block font-semibold">Day of Week:</label>
                          <select
                            value={editData.dayoftheweek || "0"}
                            onChange={(e) => handleFieldChange("dayoftheweek", e.target.value)}
                            className="border p-1 w-full"
                          >
                            <option value="0">Sunday</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Conditional: If type === "date" */}
                    {editData.type === "date" && (
                      <div className="border p-2 rounded bg-white">
                        <p className="font-semibold">One-Time Date Schedule:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-semibold">Year:</label>
                            <input
                              type="text"
                              value={editData.year || ""}
                              onChange={(e) => handleFieldChange("year", e.target.value)}
                              className="border p-1 w-full"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold">Month (1-12):</label>
                            <input
                              type="text"
                              value={editData.month || ""}
                              onChange={(e) => handleFieldChange("month", e.target.value)}
                              className="border p-1 w-full"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <label className="block font-semibold">Day:</label>
                            <input
                              type="text"
                              value={editData.day || ""}
                              onChange={(e) => handleFieldChange("day", e.target.value)}
                              className="border p-1 w-full"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold">Time (HH:MM:SS):</label>
                            <input
                              type="text"
                              value={editData.time || ""}
                              onChange={(e) => handleFieldChange("time", e.target.value)}
                              className="border p-1 w-full"
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block font-semibold">Day Before:</label>
                          <input
                            type="text"
                            value={editData.daybefore || "0"}
                            onChange={(e) => handleFieldChange("daybefore", e.target.value)}
                            className="border p-1 w-full"
                          />
                          <p className="text-sm text-gray-500">
                            (Number of days before main date to also send a reminder)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Message Content */}
                    <div>
                      <label className="block font-semibold">Message Content:</label>
                      <textarea
                        rows={3}
                        value={editData.messageContent || ""}
                        onChange={(e) => handleFieldChange("messageContent", e.target.value)}
                        className="border p-1 w-full"
                      />
                    </div>

                    {/* Editing Automatic Responses */}
                    <div className="mt-4 border-t pt-2">
                      <p className="font-semibold">Automatic Responses:</p>
                      {editData.automaticResponses && editData.automaticResponses.length > 0 ? (
                        editData.automaticResponses.map((resp, respIndex) => (
                          <div key={respIndex} className="border p-2 mb-2 rounded bg-white">
                            <label className="block font-semibold">Title:</label>
                            <input
                              type="text"
                              value={resp.title || ""}
                              onChange={(e) =>
                                handleAutomaticResponseChange(respIndex, "title", e.target.value)
                              }
                              className="border p-1 w-full mb-2"
                            />

                            <label className="block font-semibold">Content:</label>
                            <textarea
                              rows={2}
                              value={resp.content || ""}
                              onChange={(e) =>
                                handleAutomaticResponseChange(respIndex, "content", e.target.value)
                              }
                              className="border p-1 w-full mb-2"
                            />
                            <button
                              onClick={() => handleRemoveAutomaticResponseEdit(respIndex)}
                              className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No automatic responses yet.</p>
                      )}
                      <button
                        onClick={handleAddAutomaticResponseEdit}
                        className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
                      >
                        Add Automatic Response
                      </button>
                    </div>

                    {/* Save / Cancel */}
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 px-4 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else {
              // ============ VIEW MODE ============
              return (
                <div key={index} className="border p-4 rounded">
                  <p>
                    <strong>Type:</strong> {msg.type}
                  </p>
                  <p>
                    <strong>Name:</strong> {msg.name}
                  </p>
                  <p>
                    <strong>Turn On:</strong> {msg.turnon ? "true" : "false"}
                  </p>
                  <p>
                    <strong>Channel ID:</strong> {msg.channelId}
                  </p>
                  <p>
                    <strong>Response Channel ID:</strong> {msg.responseChannelId}
                  </p>
                  <p>
                    <strong>Role ID:</strong> {msg.roleId}
                  </p>

                  {msg.type === "weekly" && (
                    <p>
                      <strong>Weekly Time:</strong>{" "}
                      {msg.hour?.toString().padStart(2, "0")}:
                      {msg.minutes?.toString().padStart(2, "0")} on{" "}
                      {(() => {
                        switch (msg.dayoftheweek) {
                          case "0":
                            return "Sunday";
                          case "1":
                            return "Monday";
                          case "2":
                            return "Tuesday";
                          case "3":
                            return "Wednesday";
                          case "4":
                            return "Thursday";
                          case "5":
                            return "Friday";
                          case "6":
                            return "Saturday";
                          default:
                            return msg.dayoftheweek;
                        }
                      })()}
                    </p>
                  )}

                  {msg.type === "date" && (
                    <div>
                      <p>
                        <strong>One-Time Date:</strong> {msg.year}-{msg.month}-{msg.day} at {msg.time}
                      </p>
                      <p>
                        <strong>Day Before Reminder:</strong> {msg.daybefore}
                      </p>
                    </div>
                  )}

                  <p>
                    <strong>Message Content:</strong> {msg.messageContent}
                  </p>

                  {msg.automaticResponses && msg.automaticResponses.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold">Automatic Responses:</p>
                      {msg.automaticResponses.map((resp, i) => (
                        <div key={i} className="ml-2">
                          <p>- <strong>{resp.title}</strong>: {resp.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-400 px-4 py-1 mr-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* ========== ADD NEW SCHEDULED MESSAGE FORM ========== */}
      <div className="border p-4 rounded mt-6 bg-gray-50">
        <h3 className="text-2xl font-bold mb-2">Add New Scheduled Message</h3>

        {/* TYPE */}
        <div className="space-y-2 mb-4">
          <label className="block font-semibold">Type:</label>
          <select
            value={newMessageData.type}
            onChange={(e) => handleNewFieldChange("type", e.target.value)}
            className="border p-1 w-full"
          >
            <option value="weekly">Weekly</option>
            <option value="date">Date</option>
          </select>
        </div>

        {/* Name */}
        <div className="space-y-2 mb-4">
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            value={newMessageData.name}
            onChange={(e) => handleNewFieldChange("name", e.target.value)}
            className="border p-1 w-full"
          />
        </div>

        {/* Turn On */}
        <div className="space-y-2 mb-4">
          <label className="block font-semibold">Turn On:</label>
          <input
            type="checkbox"
            checked={newMessageData.turnon}
            onChange={(e) => handleNewFieldChange("turnon", e.target.checked)}
          />
        </div>

        {/* Channel ID */}
        <div className="space-y-2 mb-4">
          <label className="block font-semibold">Channel ID:</label>
          <input
            type="text"
            value={newMessageData.channelId}
            onChange={(e) => handleNewFieldChange("channelId", e.target.value)}
            className="border p-1 w-full"
          />
        </div>

        {/* Response Channel ID */}
        <div className="space-y-2 mb-4">
          <label className="block font-semibold">Response Channel ID:</label>
          <input
            type="text"
            value={newMessageData.responseChannelId}
            onChange={(e) =>
              handleNewFieldChange("responseChannelId", e.target.value)
            }
            className="border p-1 w-full"
          />
        </div>

        {/* Role ID */}
        <div className="space-y-2 mb-4">
          <label className="block font-semibold">Role ID:</label>
          <input
            type="text"
            value={newMessageData.roleId}
            onChange={(e) => handleNewFieldChange("roleId", e.target.value)}
            className="border p-1 w-full"
          />
        </div>

        {/* Conditional Weekly Fields */}
        {newMessageData.type === "weekly" && (
          <div className="border p-2 rounded bg-white mb-4">
            <p className="font-semibold mb-2">Weekly Schedule:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold">Hour:</label>
                <select
                  value={newMessageData.hour}
                  onChange={(e) => handleNewFieldChange("hour", e.target.value)}
                  className="border p-1 w-full"
                >
                  {[...Array(24)].map((_, i) => (
                    <option key={i} value={i}>
                      {i < 10 ? `0${i}` : i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold">Minutes:</label>
                <select
                  value={newMessageData.minutes}
                  onChange={(e) => handleNewFieldChange("minutes", e.target.value)}
                  className="border p-1 w-full"
                >
                  {["0","5","10","15","20","25","30","35","40","45","50","55"].map((val) => (
                    <option key={val} value={val}>
                      {val === "0" ? "00" : val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2">
              <label className="block font-semibold">Day of Week:</label>
              <select
                value={newMessageData.dayoftheweek}
                onChange={(e) => handleNewFieldChange("dayoftheweek", e.target.value)}
                className="border p-1 w-full"
              >
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
            </div>
          </div>
        )}

        {/* Conditional Date Fields */}
        {newMessageData.type === "date" && (
          <div className="border p-2 rounded bg-white mb-4">
            <p className="font-semibold mb-2">One-Time Date Schedule:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold">Year:</label>
                <input
                  type="text"
                  value={newMessageData.year}
                  onChange={(e) => handleNewFieldChange("year", e.target.value)}
                  className="border p-1 w-full"
                />
              </div>
              <div>
                <label className="block font-semibold">Month (1-12):</label>
                <input
                  type="text"
                  value={newMessageData.month}
                  onChange={(e) => handleNewFieldChange("month", e.target.value)}
                  className="border p-1 w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block font-semibold">Day:</label>
                <input
                  type="text"
                  value={newMessageData.day}
                  onChange={(e) => handleNewFieldChange("day", e.target.value)}
                  className="border p-1 w-full"
                />
              </div>
              <div>
                <label className="block font-semibold">Time (HH:MM:SS):</label>
                <input
                  type="text"
                  value={newMessageData.time}
                  onChange={(e) => handleNewFieldChange("time", e.target.value)}
                  className="border p-1 w-full"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="block font-semibold">Day Before:</label>
              <input
                type="text"
                value={newMessageData.daybefore}
                onChange={(e) => handleNewFieldChange("daybefore", e.target.value)}
                className="border p-1 w-full"
              />
              <p className="text-sm text-gray-500">
                (Number of days before main date to also send a reminder)
              </p>
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className="space-y-2 mb-4">
          <label className="block font-semibold">Message Content:</label>
          <textarea
            rows={4}
            value={newMessageData.messageContent}
            onChange={(e) => handleNewFieldChange("messageContent", e.target.value)}
            className="border p-1 w-full"
          />
        </div>

        {/* Automatic Responses */}
        <div className="border p-2 mb-4 bg-white">
          <p className="font-semibold mb-2">Automatic Responses:</p>
          {newMessageData.automaticResponses.map((resp, idx) => (
            <div key={idx} className="border p-2 mb-2 rounded">
              <label className="block font-semibold">Title:</label>
              <input
                type="text"
                value={resp.title}
                onChange={(e) => handleNewAutoRespFieldChange(idx, "title", e.target.value)}
                className="border p-1 w-full mb-2"
              />
              <label className="block font-semibold">Content:</label>
              <textarea
                rows={2}
                value={resp.content}
                onChange={(e) => handleNewAutoRespFieldChange(idx, "content", e.target.value)}
                className="border p-1 w-full mb-2"
              />
              <button
                onClick={() => handleRemoveAutomaticResponseNew(idx)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAddAutomaticResponseNew}
            className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
          >
            Add Automatic Response
          </button>
        </div>

        {/* Add New Button */}
        <button
          onClick={handleAddNewMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Scheduled Message
        </button>
      </div>
    </div>
  );
}

export default DiscordSchedulerEditor;