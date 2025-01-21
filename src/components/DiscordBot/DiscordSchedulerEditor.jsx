import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import EditableTextArea from "./EditableTextArea"
import "react-datepicker/dist/react-datepicker.css";

function DiscordSchedulerEditor() {
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  const [newMessageData, setNewMessageData] = useState({
    type: "weekly",
    name: "",
    turnon: false,
    channelId: "",
    responseChannelId: "",
    roleId: "",
    hour: "0",
    minutes: "0",
    dayoftheweek: "0",
    selectedDate: new Date(),
    daybefore: "0",
    seconds: "0",
    timezone: "Europe/Stockholm",
    messageContent: `Sup all,\n\n**Friendly reminder:** Need to make a post on social media!\n\nReact to this message\n❤️ - Automatically send a message in Discord\n\n*Not necessary to react; you can send message manually.*`,
    automaticResponses: [],
  });

  const [addNewOpen, setAddNewOpen] = useState(false);
  const [discordInputsOpenNew, setDiscordInputsOpenNew] = useState(false);
  const [discordInputsOpenEdit, setDiscordInputsOpenEdit] = useState(false);
  const [typeDropdownOpenNew, setTypeDropdownOpenNew] = useState(false);
  const [hourDropdownOpenNew, setHourDropdownOpenNew] = useState(false);
  const [minutesDropdownOpenNew, setMinutesDropdownOpenNew] = useState(false);
  const [dayOfWeekDropdownOpenNew, setDayOfWeekDropdownOpenNew] = useState(false);
  const [typeDropdownOpenEdit, setTypeDropdownOpenEdit] = useState(false);
  const [hourDropdownOpenEdit, setHourDropdownOpenEdit] = useState(false);
  const [minutesDropdownOpenEdit, setMinutesDropdownOpenEdit] = useState(false);
  const [dayOfWeekDropdownOpenEdit, setDayOfWeekDropdownOpenEdit] = useState(false);

  useEffect(() => {
    fetchScheduledMessages();
  }, []);

  async function fetchScheduledMessages() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result && result.success && Array.isArray(result.data)) setScheduledMessages(result.data);
      else setScheduledMessages([]);
    } catch (error) {
      console.error("Error fetching scheduled messages:", error);
      setScheduledMessages([]);
    }
  }

  function handleEdit(index) {
    setEditIndex(index);
    const item = scheduledMessages[index];
    if (item.type === "date") {
      const y = parseInt(item.year || "2025", 10);
      const m = parseInt(item.month || "1", 10) - 1;
      const d = parseInt(item.day || "1", 10);
      setEditData({ ...item, selectedDate: new Date(y, m, d, 12, 0, 0) });
    } else setEditData({ ...item });
  }

  function handleCancel() {
    setEditIndex(null);
    setEditData(null);
  }

  async function handleSave() {
    if (editIndex === null || !editData) return;
    let payload = { ...editData, seconds: "0", timezone: "Europe/Stockholm" };
    if (editData.type === "date") {
      const sel = editData.selectedDate || new Date();
      payload.year = sel.getFullYear().toString();
      payload.month = (sel.getMonth() + 1).toString();
      payload.day = sel.getDate().toString();
      payload.time = "12:00:00";
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages/${editIndex}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result && result.success && result.data) {
        setScheduledMessages((prev) => {
          const copy = [...prev];
          copy[editIndex] = result.data;
          return copy;
        });
        setEditIndex(null);
        setEditData(null);
      }
    } catch (error) {
      console.error("Error updating scheduled message:", error);
    }
  }

  async function handleDelete(index) {
    if (!window.confirm("Are you sure you want to delete this scheduled message?")) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages/${index}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result && result.success) {
        setScheduledMessages((prev) => prev.filter((_, i) => i !== index));
        if (index === editIndex) {
          setEditIndex(null);
          setEditData(null);
        }
      }
    } catch (error) {
      console.error("Error deleting scheduled message:", error);
    }
  }

  function toggleTurnOnEdit() {
    if (!editData) return;
    setEditData((prev) => ({ ...prev, turnon: !prev.turnon }));
  }

  function handleFieldChange(field, value) {
    setEditData((prev) => ({ ...prev, [field]: value }));
  }

  function handleAutomaticResponseChange(i, field, val) {
    setEditData((prev) => {
      const arr = [...(prev.automaticResponses || [])];
      arr[i] = { ...arr[i], [field]: val };
      return { ...prev, automaticResponses: arr };
    });
  }

  function handleAddAutomaticResponseEdit() {
    setEditData((prev) => ({
      ...prev,
      automaticResponses: [...(prev.automaticResponses || []), { title: "", content: "" }],
    }));
  }

  function handleRemoveAutomaticResponseEdit(i) {
    setEditData((prev) => {
      const arr = [...(prev.automaticResponses || [])];
      arr.splice(i, 1);
      return { ...prev, automaticResponses: arr };
    });
  }

  function toggleNewTurnOn() {
    setNewMessageData((prev) => ({ ...prev, turnon: !prev.turnon }));
  }

  function handleNewFieldChange(field, value) {
    setNewMessageData((prev) => ({ ...prev, [field]: value }));
  }

  function handleNewAutoRespFieldChange(i, field, val) {
    setNewMessageData((prev) => {
      const arr = [...prev.automaticResponses];
      arr[i] = { ...arr[i], [field]: val };
      return { ...prev, automaticResponses: arr };
    });
  }

  function handleAddAutomaticResponseNew() {
    setNewMessageData((prev) => ({
      ...prev,
      automaticResponses: [...prev.automaticResponses, { title: "", content: "" }],
    }));
  }

  function handleRemoveAutomaticResponseNew(i) {
    setNewMessageData((prev) => {
      const arr = [...prev.automaticResponses];
      arr.splice(i, 1);
      return { ...prev, automaticResponses: arr };
    });
  }

  function validateNewMessage() {
    if (!newMessageData.name.trim()) return false;
    if (!newMessageData.messageContent.trim()) return false;
    if (!newMessageData.channelId.trim()) return false;
    if (!newMessageData.responseChannelId.trim()) return false;
    if (!newMessageData.roleId.trim()) return false;
    if (newMessageData.type === "weekly") {
      if (newMessageData.hour === "" || newMessageData.minutes === "" || newMessageData.dayoftheweek === "") return false;
    } else if (newMessageData.type === "date") {
      if (!newMessageData.selectedDate) return false;
    }
    return true;
  }

  async function handleCreateNewMessage() {
    if (!validateNewMessage()) {
      alert("Please fill out all required fields.");
      return;
    }
    let payload = { ...newMessageData, seconds: "0", timezone: "Europe/Stockholm" };
    if (newMessageData.type === "date") {
      const d = newMessageData.selectedDate || new Date();
      payload.year = d.getFullYear().toString();
      payload.month = (d.getMonth() + 1).toString();
      payload.day = d.getDate().toString();
      payload.time = "12:00:00";
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result && result.success && result.data) {
        setScheduledMessages((prev) => [...prev, result.data]);
      }
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
        selectedDate: new Date(),
        daybefore: "0",
        seconds: "0",
        timezone: "Europe/Stockholm",
        messageContent: `Sup all <@&COMMITTEE_ROLE_ID>,\n\n**Friendly reminder:** Need to make a post on social media!\n\nReact to this message\n❤️ - Automatically send a message in Discord\n\n*Not necessary to react; you can send message manually.*`,
        automaticResponses: [{ title: "", content: "" }],
      });
      setAddNewOpen(false);
    } catch (error) {
      console.error("Error creating new scheduled message:", error);
    }
  }

  function DaysOfWeekLabel(val) {
    switch (val) {
      case "0": return "Sunday";
      case "1": return "Monday";
      case "2": return "Tuesday";
      case "3": return "Wednesday";
      case "4": return "Thursday";
      case "5": return "Friday";
      case "6": return "Saturday";
      default: return "Sunday";
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-4">Discord Scheduler Editor</h2>

      {scheduledMessages.length === 0 ? (
        <p>No scheduled messages found.</p>
      ) : (
        <div className="space-y-4">
          {scheduledMessages.map((msg, index) => {
            const isEditing = index === editIndex;
            if (isEditing && editData) {
              return (
                <div key={index} className="border p-4 rounded bg-gray-100">
                  <div className="space-y-2">
                    <div>
                      <label className="block font-semibold">Name:</label>
                      <input
                        type="text"
                        value={editData.name || ""}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        className="border p-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold">Turn On:</label>
                      <button
                        type="button"
                        onClick={toggleTurnOnEdit}
                        className={`px-4 py-2 rounded text-white ${
                          editData.turnon ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {editData.turnon ? "Enabled" : "Disabled"}
                      </button>
                    </div>
                    <div className="text-center mb-2">
                      <label className="font-semibold text-lg">Discord Inputs</label>
                    </div>
                    <div className="relative inline-block text-left mb-4">
                      <button
                        type="button"
                        onClick={() => setDiscordInputsOpenEdit((p) => !p)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                                   focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                                   text-sm px-5 py-2.5 inline-flex items-center 
                                   dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        {discordInputsOpenEdit ? "Hide" : "Show"} Inputs
                      </button>
                      {discordInputsOpenEdit && (
                        <div
                          className="z-10 absolute mt-2 bg-white divide-y divide-gray-100 
                                     rounded-lg shadow w-72 dark:bg-gray-700 p-3"
                        >
                          <div className="mb-2">
                            <label className="block font-semibold">Channel ID:</label>
                            <input
                              type="text"
                              value={editData.channelId || ""}
                              onChange={(e) => handleFieldChange("channelId", e.target.value)}
                              className="border p-1 w-full"
                            />
                          </div>
                          <div className="mb-2">
                            <label className="block font-semibold">Response Channel ID:</label>
                            <input
                              type="text"
                              value={editData.responseChannelId || ""}
                              onChange={(e) => handleFieldChange("responseChannelId", e.target.value)}
                              className="border p-1 w-full"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold">Role ID:</label>
                            <input
                              type="text"
                              value={editData.roleId || ""}
                              onChange={(e) => handleFieldChange("roleId", e.target.value)}
                              className="border p-1 w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold">Type:</label>
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setTypeDropdownOpenEdit((p) => !p)}
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                                     focus:outline-none focus:ring-blue-300 font-medium 
                                     rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                        >
                          {editData.type === "weekly" ? "Weekly" : "Date"}
                          <svg
                            className="w-2.5 h-2.5 ml-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 10 6"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 4 4 4-4"
                            />
                          </svg>
                        </button>
                        {typeDropdownOpenEdit && (
                          <div
                            className="z-10 absolute mt-2 bg-white divide-y divide-gray-100 
                                       rounded-lg shadow w-28 p-2"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                handleFieldChange("type", "weekly");
                                setTypeDropdownOpenEdit(false);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                              Weekly
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleFieldChange("type", "date");
                                setTypeDropdownOpenEdit(false);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                              Date
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {editData.type === "weekly" && (
                      <div className="border p-2 mt-2 rounded bg-white">
                        <p className="font-semibold">Weekly Schedule:</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <label className="font-semibold">Hour:</label>
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setHourDropdownOpenEdit((p) => !p)}
                              className="text-white bg-blue-700 hover:bg-blue-800 
                                         focus:ring-4 focus:outline-none focus:ring-blue-300 
                                         font-medium rounded-lg text-sm px-3 py-1 inline-flex items-center"
                            >
                              {editData.hour}
                              <svg
                                className="w-2.5 h-2.5 ml-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 4 4 4-4"
                                />
                              </svg>
                            </button>
                            {hourDropdownOpenEdit && (
                              <div
                                className="z-10 absolute mt-1 bg-white 
                                           rounded-lg shadow w-24 p-1"
                              >
                                {[...Array(24)].map((_, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                      handleFieldChange("hour", i.toString());
                                      setHourDropdownOpenEdit(false);
                                    }}
                                    className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                  >
                                    {i < 10 ? `0${i}` : i}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <label className="font-semibold">Minutes:</label>
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setMinutesDropdownOpenEdit((p) => !p)}
                              className="text-white bg-blue-700 hover:bg-blue-800 
                                         focus:ring-4 focus:outline-none focus:ring-blue-300 
                                         font-medium rounded-lg text-sm px-3 py-1 inline-flex items-center"
                            >
                              {editData.minutes}
                              <svg
                                className="w-2.5 h-2.5 ml-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 4 4 4-4"
                                />
                              </svg>
                            </button>
                            {minutesDropdownOpenEdit && (
                              <div className="z-10 absolute mt-1 bg-white 
                                              rounded-lg shadow w-24 p-1">
                                {["0","5","10","15","20","25","30","35","40","45","50","55"].map((val) => (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => {
                                      handleFieldChange("minutes", val);
                                      setMinutesDropdownOpenEdit(false);
                                    }}
                                    className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                  >
                                    {val === "0" ? "00" : val}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <label className="font-semibold">Day:</label>
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setDayOfWeekDropdownOpenEdit((p) => !p)}
                              className="text-white bg-blue-700 hover:bg-blue-800 
                                         focus:ring-4 focus:outline-none focus:ring-blue-300 
                                         font-medium rounded-lg text-sm px-3 py-1 inline-flex items-center"
                            >
                              {DaysOfWeekLabel(editData.dayoftheweek || "0")}
                              <svg
                                className="w-2.5 h-2.5 ml-2"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 4 4 4-4"
                                />
                              </svg>
                            </button>
                            {dayOfWeekDropdownOpenEdit && (
                              <div className="z-10 absolute mt-1 bg-white 
                                              rounded-lg shadow w-24 p-1">
                                {["0","1","2","3","4","5","6"].map((val) => (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => {
                                      handleFieldChange("dayoftheweek", val);
                                      setDayOfWeekDropdownOpenEdit(false);
                                    }}
                                    className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                  >
                                    {DaysOfWeekLabel(val)}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {editData.type === "date" && (
                      <div className="border p-2 mt-2 rounded bg-white">
                        <p className="font-semibold">One-Time Date Schedule:</p>
                        <div className="mt-2">
                          <DatePicker
                            selected={editData.selectedDate}
                            onChange={(date) => handleFieldChange("selectedDate", date)}
                            dateFormat="yyyy-MM-dd"
                            className="border p-1"
                          />
                          <label className="block font-semibold mt-2">Day Before:</label>
                          <input
                            type="text"
                            value={editData.daybefore || "0"}
                            onChange={(e) => handleFieldChange("daybefore", e.target.value)}
                            className="border p-1 w-full"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block font-semibold">Message Content:</label>
                      <textarea
                        rows={3}
                        value={editData.messageContent || ""}
                        onChange={(e) => handleFieldChange("messageContent", e.target.value)}
                        className="border p-1 w-full"
                      />
                    </div>
                    <div className="mt-4 border-t pt-2">
                      <p className="font-semibold">Automatic Responses:</p>
                      {(editData.automaticResponses || []).map((resp, i) => (
                        <div key={i} className="border p-2 mb-2 rounded bg-white">
                          <label className="block font-semibold">Title:</label>
                          <input
                            type="text"
                            value={resp.title}
                            onChange={(e) => handleAutomaticResponseChange(i, "title", e.target.value)}
                            className="border p-1 w-full mb-2"
                          />
                          <label className="block font-semibold">Content:</label>
                          <textarea
                            rows={2}
                            value={resp.content}
                            onChange={(e) => handleAutomaticResponseChange(i, "content", e.target.value)}
                            className="border p-1 w-full mb-2"
                          />
                          <button
                            onClick={() => handleRemoveAutomaticResponseEdit(i)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={handleAddAutomaticResponseEdit}
                        className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
                      >
                        Add Automatic Response
                      </button>
                    </div>
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
              return (
                <div key={index} className="sm:w-[70%] w-[97%] mx-auto bg-white py-10 mt-6 rounded-lg border-2 border-black focus:outline-none placeholder">
                  <p><strong>Name:</strong> {msg.name}</p>
                  <p>
                    <strong>Turn On:</strong>{" "}
                    {msg.turnon ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded">
                        Enabled
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded">
                        Disabled
                      </span>
                    )}
                  </p>
                  {msg.type === "weekly" ? (
                    <p>
                      <strong>Weekly:</strong> {msg.hour?.toString().padStart(2, "0")}:
                      {msg.minutes?.toString().padStart(2, "0")} on{" "}
                      {DaysOfWeekLabel(msg.dayoftheweek || "0")}
                    </p>
                  ) : (
                    <div>
                      <p>
                        <strong>Date:</strong> {msg.year}-{msg.month}-{msg.day} (12:00:00)
                      </p>
                      <p className="text-lg font-semibold">Will remind {msg.daybefore} day before</p>
                    </div>
                  )}
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

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setAddNewOpen((p) => !p)}
          className="w-96 mt-6 text-center p-2 bg-blue-400 rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
        >
          <p className="text-xl font-bold">{addNewOpen ? "Hide" : "Show"} New Schedule Form</p>
        </button>
      </div>

      {addNewOpen && (
        <div className="sm:w-[70%] w-[97%] mx-auto bg-white py-10 mt-6 rounded-lg border-2 border-black focus:outline-none placeholder">
          <div className="space-y-2 mb-4">
          <h3 className="text-5xl font-semibold mb-4">Add New Link</h3>
            <label className="block font-semibold">Name:</label>
            <input
              type="text"
              placeholder="Text"
              value={newMessageData.name}
              onChange={(e) => handleNewFieldChange("name", e.target.value)}
              className="placeholder font-bold sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
            />
          </div>
          <div className="space-y-2 mb-4">
            <label className="block font-semibold">Turn On:</label>
            <button
              type="button"
              onClick={toggleNewTurnOn}
              className={`px-4 py-2 rounded text-white ${
                newMessageData.turnon ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {newMessageData.turnon ? "Enabled" : "Disabled"}
            </button>
          </div>
          <div className="text-center mb-2">
            <label className="text-xl font-bold mt-2">Discord Inputs</label>
          </div>
          <div>
          <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => window.open("https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS5CRSRTWYCGPHZQ37H", "_blank")}
            >
              How to find IDs on Discord
            </button>
          </div>
          <div className="relative inline-block text-left mb-4">
            <button
              type="button"
              onClick={() => setDiscordInputsOpenNew((p) => !p)}
              className="w-96 mt-6 text-center p-2 bg-blue-700 text-white rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
            >
              <p className="text-xl font-bold">{discordInputsOpenNew ? "Hide" : "Show"} Inputs</p>
            </button>
            {discordInputsOpenNew && (
              <div
                className="z-10 absolute placeholder bg-white font-bold sm:w-96 mx-auto mt-6 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
              >
                <div className="mb-2">
                  <label className="block font-semibold">Channel ID:</label>
                  <input
                    type="text"
                    value={newMessageData.channelId}
                    onChange={(e) => handleNewFieldChange("channelId", e.target.value)}
                    className="border p-1 w-full"
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-semibold">Response Channel ID:</label>
                  <input
                    type="text"
                    value={newMessageData.responseChannelId}
                    onChange={(e) => handleNewFieldChange("responseChannelId", e.target.value)}
                    className="border p-1 w-full"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Role ID:</label>
                  <input
                    type="text"
                    value={newMessageData.roleId}
                    onChange={(e) => handleNewFieldChange("roleId", e.target.value)}
                    className="border p-1 w-full"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2 mb-4">
            <label className="block text-xl font-bold mt-2">Type:</label>
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={() => setTypeDropdownOpenNew((p) => !p)}
                className="w-96 text-center mb-4 p-2 bg-blue-700 text-white rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
              >
                <p className="text-xl font-bold">{newMessageData.type === "weekly" ? "Weekly" : "Date"}</p>
              </button>
              {typeDropdownOpenNew && (
                <div
                  className="z-10 absolute placeholder bg-white font-bold sm:w-96 mx-auto mt-6 text-center rounded border-2 border-black focus:outline-none"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleNewFieldChange("type", "weekly");
                      setTypeDropdownOpenNew(false);
                    }}
                    className="block text-center w-full border-b-2 border-black py-4 hover:bg-gray-200"
                  >
                    <p className="font-semibold text-lg">Weekly</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleNewFieldChange("type", "date");
                      setTypeDropdownOpenNew(false);
                    }}
                    className="block text-center w-full py-4 border-black hover:bg-gray-200"
                  >
                    <p className="font-semibold text-lg">Date</p>
                  </button>
                </div>
              )}
            </div>
          </div>
          {newMessageData.type === "weekly" && (
            <div className="border p-2 rounded bg-white m-4">
              <p className="block text-xl font-bold mt-2">Weekly Schedule:</p>
              <div className="mx-auto space-x-2 mb-2">
                <label className="font-semibold">Hour:</label>
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    onClick={() => setHourDropdownOpenNew((p) => !p)}
                    className="w-16 text-center my-4 p-2 bg-blue-700 text-white rounded py-1 border-2 border-black"
                  >
                    <p className="font-semibold text-lg">{newMessageData.hour}</p>
                  </button>
                  {hourDropdownOpenNew && (
                    <div className="z-10 absolute mt-1 bg-white rounded-lg shadow w-24 p-1">
                      {[...Array(24)].map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            handleNewFieldChange("hour", i.toString());
                            setHourDropdownOpenNew(false);
                          }}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                        >
                          {i < 10 ? `0${i}` : i}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <label className="font-semibold">Minutes:</label>
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    onClick={() => setMinutesDropdownOpenNew((p) => !p)}
                    className="w-16 text-center mb-4 p-2 bg-blue-700 text-white rounded py-1 border-2 border-black"
                  >
                    <p className="font-semibold text-lg">{newMessageData.minutes}</p>
                  </button>
                  {minutesDropdownOpenNew && (
                    <div className="z-10 absolute mt-1 bg-white rounded-lg shadow w-24 p-1">
                      {["0","5","10","15","20","25","30","35","40","45","50","55"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            handleNewFieldChange("minutes", val);
                            setMinutesDropdownOpenNew(false);
                          }}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                        >
                          {val === "0" ? "00" : val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
                <label className="font-semibold">Day:</label>
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    onClick={() => setDayOfWeekDropdownOpenNew((p) => !p)}
                    className="text-center m-2 mb-4 px-4 bg-blue-700 text-white rounded py-1 border-2 border-black"
                  >
                    <p className="font-semibold text-lg">{DaysOfWeekLabel(newMessageData.dayoftheweek)}</p>
                  </button>
                  {dayOfWeekDropdownOpenNew && (
                    <div className="z-10 absolute mt-1 bg-white rounded-lg shadow w-24 p-1">
                      {["0","1","2","3","4","5","6"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            handleNewFieldChange("dayoftheweek", val);
                            setDayOfWeekDropdownOpenNew(false);
                          }}
                          className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                        >
                          {DaysOfWeekLabel(val)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
          )}
          {newMessageData.type === "date" && (
            <div className="border p-2 rounded bg-white mb-4">
              <p className="font-semibold mb-2">One-Time Date Schedule:</p>
              <DatePicker
                selected={newMessageData.selectedDate}
                onChange={(date) => handleNewFieldChange("selectedDate", date)}
                dateFormat="yyyy-MM-dd"
                placeholder="Date"
                className="placeholder font-bold sm:w-96 mx-auto text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
              />
              <label className="block font-semibold mb-2 mt-6">Day Before:</label>
              <div className="mx-auto space-x-1">
                {/* Minus Button */}
                <button
                  type="button"
                  className="bg-green-500 text-white font-bold rounded-l hover:bg-green-600 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
                  onClick={() =>
                    handleNewFieldChange("daybefore", String(Number(newMessageData.daybefore) + 1))
                  }
                >
                  <p className="font-bold text-lg">+</p>
                </button>
                <input
                  type="text"
                  value={newMessageData.daybefore}
                  onChange={(e) => handleNewFieldChange("daybefore", e.target.value)}
                  className="placeholder font-bold sm:w-54 mx-auto text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
                />

                {/* Plus Button */}
                <button
                  type="button"
                  className="bg-red-500 text-white font-bold rounded-l hover:bg-red-600 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
                  onClick={() =>
                    handleNewFieldChange("daybefore", String(Number(newMessageData.daybefore) - 1))
                  }
                >
                  <p className="font-bold text-lg">-</p>
                </button>
              </div>
            </div>
          )}
          <div className="border p-2 rounded bg-white mb-4">
          <label className="block text-xl font-bold mt-2">Message Content:</label>
            <textarea
              rows={4}
              value={newMessageData.messageContent}
              onChange={(e) => handleNewFieldChange("messageContent", e.target.value)}
              className="border p-1 w-full"
            />
          </div>
          <div className="border p-2 mb-4 bg-white">
          <label className="block text-xl font-bold mt-2">Automatic Responses:</label>
            {newMessageData.automaticResponses.map((resp, idx) => (
              <div key={idx} className="border p-2 mb-2 rounded">
                <label className="block text-lg font-semibold">Title:</label>
                <input
                  type="text"
                  value={resp.title}
                  onChange={(e) => handleNewAutoRespFieldChange(idx, "title", e.target.value)}
                  className="placeholder font-bold sm:w-96 mx-auto mt-2 text-center p-4 rounded py-3 border-2 border-black focus:outline-none"
                />
                <label className="block text-lg mt-2 font-semibold">Content:</label>
                {resp ? (
                  <EditableTextArea
                    idx={idx}
                    resp={resp}
                    handleNewAutoRespFieldChange={handleNewAutoRespFieldChange}
                  />
                ) : (
                  <p>Loading data...</p>
                )}
                <div>
                <button
                  onClick={() => handleRemoveAutomaticResponseNew(idx)}
                  className="w-96 text-center mb-4 p-2 bg-red-500 text-white rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
                >
                  <p className="text-xl font-bold">Remove</p>
                </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddAutomaticResponseNew}
              className="w-96 text-center mb-4 p-2 bg-green-400 text-white rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
            >
              <p className="text-xl font-bold">Add Automatic Response</p>
            </button>
          </div>
          <button
            onClick={handleCreateNewMessage}
            className="w-96 text-center mb-4 p-2 bg-blue-600 text-white rounded py-3 border-2 border-black shadow-custom hover:shadow-none transition-all hover:translate-x-1 translate-y-1"
          >
            <p className="text-xl font-bold">Add New Scheduled Message</p>
          </button>
        </div>
      )}
    </div>
  );
}

export default DiscordSchedulerEditor;