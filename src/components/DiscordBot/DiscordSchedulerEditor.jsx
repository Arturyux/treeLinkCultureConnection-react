import { useState, useEffect } from "react";

function DiscordSchedulerEditor() {
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  const [newMessageData, setNewMessageData] = useState({
    name: "",
    turnon: false,
    channelId: "",
    responseChannelId: "",
    roleId: "",
    hour: "0",
    minutes: "0",
    seconds: "0",
    dayoftheweek: "0",
    timezone: "Europe/Stockholm",
    messageContent: "",
    automaticResponses: [
      {
        title: "",
        content: "",
      },
    ],
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Enhanced logging
        // Access the nested scheduledMessages array
        setScheduledMessages(data.scheduledMessages.scheduledMessages || []);
      })
      .catch((error) => console.error("Error fetching links:", error));
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...scheduledMessages[index] });
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditData(null);
  };

  const handleSave = () => {
    if (editIndex === null || editData === null) return;

    fetch(`${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages/${editIndex}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        const updatedList = [...scheduledMessages];
        updatedList[editIndex] = updatedItem;
        setScheduledMessages(updatedList);
        setEditIndex(null);
        setEditData(null);
      })
      .catch((error) => {
        console.error("Error updating scheduled message:", error);
      });
  };

  const handleDelete = (index) => {
    fetch(`${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages/${index}`, {
      method: "DELETE",
    })
      .then(() => {
        setScheduledMessages((prev) => prev.filter((_, i) => i !== index));
        if (index === editIndex) {
          setEditIndex(null);
          setEditData(null);
        }
      })
      .catch((error) => {
        console.error("Error deleting scheduled message:", error);
      });
  };

  const handleFieldChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAutomaticResponseChange = (respIndex, field, value) => {
    setEditData((prev) => {
      const updatedResponses = [...(prev.automaticResponses || [])];
      updatedResponses[respIndex] = {
        ...updatedResponses[respIndex],
        [field]: value,
      };
      return { ...prev, automaticResponses: updatedResponses };
    });
  };

  const handleAddAutomaticResponseEdit = () => {
    setEditData((prev) => ({
      ...prev,
      automaticResponses: [
        ...(prev.automaticResponses || []),
        {
          title: "",
          content: "",
        },
      ],
    }));
  };

  const handleRemoveAutomaticResponseEdit = (respIndex) => {
    setEditData((prev) => {
      const updatedResponses = [...(prev.automaticResponses || [])];
      updatedResponses.splice(respIndex, 1);
      return { ...prev, automaticResponses: updatedResponses };
    });
  };

  const handleAddAutomaticResponseNew = () => {
    setNewMessageData((prev) => ({
      ...prev,
      automaticResponses: [
        ...prev.automaticResponses,
        {
          title: "",
          content: "",
        },
      ],
    }));
  };

  const handleRemoveAutomaticResponseNew = (respIndex) => {
    setNewMessageData((prev) => {
      const updatedResponses = [...prev.automaticResponses];
      updatedResponses.splice(respIndex, 1);
      return { ...prev, automaticResponses: updatedResponses };
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

  const validateNewMessageData = () => {
    const {
      name,
      channelId,
      responseChannelId,
      roleId,
      hour,
      minutes,
      dayoftheweek,
      timezone,
      messageContent,
    } = newMessageData;

    if (
      !name.trim() ||
      !channelId.trim() ||
      !responseChannelId.trim() ||
      !roleId.trim() ||
      hour === "" ||
      minutes === "" ||
      dayoftheweek === "" ||
      !timezone.trim() ||
      !messageContent.trim()
    ) {
      return false;
    }
    return true;
  };

  const handleAddNewMessage = () => {
    if (!validateNewMessageData()) {
      alert("All fields are required. Please fill them out.");
      return;
    }

    const messageToSend = { ...newMessageData };

    fetch(`${import.meta.env.VITE_API_DISCORD_URL}/scheduledMessages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageToSend),
    })
      .then((res) => res.json())
      .then((createdItem) => {
        setScheduledMessages((prev) => [...prev, createdItem]);
        setNewMessageData({
          name: "",
          turnon: false,
          channelId: "",
          responseChannelId: "",
          roleId: "",
          hour: "0",
          minutes: "0",
          seconds: "0",
          dayoftheweek: "0",
          timezone: "Europe/Stockholm",
          messageContent: "",
          automaticResponses: [
            {
              title: "",
              content: "",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error creating new scheduled message:", error);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Discord Scheduler Editor</h2>

      {scheduledMessages.length === 0 ? (
        <p>No scheduled messages found.</p>
      ) : (
        <div className="space-y-4">
          {scheduledMessages.map((msg, index) => (
            <div key={index} className="border p-4 rounded">
              <p>
                <strong>Name:</strong> {msg.name}
              </p>
              <p>
                <strong>Turn On:</strong> {msg.turnon ? "True" : "False"}
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
              <p>
                <strong>Time:</strong>{" "}
                {msg.hour.padStart(2, "0")}:
                {msg.minutes.padStart(2, "0")}:
                {msg.seconds.padStart(2, "0")}{" "}
                (Day:{" "}
                {
                  [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ][parseInt(msg.dayoftheweek)]
                }
                )
              </p>
              <p>
                <strong>Timezone:</strong> {msg.timezone}
              </p>
              <p>
                <strong>Message Content:</strong> {msg.messageContent}
              </p>

              {msg.automaticResponses && msg.automaticResponses.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Automatic Responses:</p>
                  {msg.automaticResponses.map((resp, i) => (
                    <div key={i} className="ml-2">
                      <p>
                        - <strong>{resp.title}</strong>: {resp.content}
                      </p>
                    </div>
                  ))}
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
          ))}
        </div>
      )}

      {/* Add New Scheduled Message Form will be added in the next steps */}
    </div>
  );
}

export default DiscordSchedulerEditor;