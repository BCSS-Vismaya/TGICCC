import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiCpu, 
  FiSend, 
  FiUser, 
  FiMessageSquare, 
  FiHelpCircle,
  FiInfo
} from "react-icons/fi";
import incidents from "../data/incidents";
import anomaliesData from "../data/anomaliesData";
import frsData from "../data/frsData";
import { useSeverity } from "../context/SeverityContext";

function AIAssistant() {
  const navigate = useNavigate();
  const viewportRef = useRef(null);
  const { getSeverity } = useSeverity();

  // Chat message state
  const [messages, setMessages] = useState([
    {
      id: "m-0",
      sender: "bot",
      content: "Good day, Officer. I am the TGICCC AI Assistant. I can help summarise active incidents, locate detections by anomaly type or area, and identify offline cameras. How may I assist?"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Suggested prompts
  const suggestedPrompts = [
    "Show all Tree Fall incidents today",
    "Find Fire Detection near Charminar",
    "Which cameras are offline?",
    "Summarize today's critical incidents",
    "Show Fake Number Plate detections",
    "Show Water Logging in North Zone",
    "Show cameras with poor health",
    "Find all Road Accident incidents this week"
  ];

  // Smart Query Natural Language Processor
  const generateAIResponse = (query) => {
    const q = query.toLowerCase();

    const dynamicIncidents = incidents.map(i => ({
      ...i,
      severity: getSeverity(i.title)
    }));

    // 1. Tree Fall Detections today
    if (q.includes("tree") && q.includes("fall")) {
      return `I found 1 active Tree Fall [${getSeverity("Tree Fall").toUpperCase()}] incident in today's logs:
* **Location**: Gun Park (C05)
* **Timestamp**: Today, 6:12:00 AM (20m ago)
* **Assigned Officer**: Insp. S. Mahesh
* **Status**: In Progress
* **AI Confidence**: 97%

You can view the dynamic coordinates and camera feeds here: [View Tree Fall Page](/anomalies/tree-fall).`;
    }

    // 2. Fire Detection near Charminar
    if (q.includes("fire") && q.includes("charminar")) {
      return `Searching for active Fire Detection [${getSeverity("Fire Detection").toUpperCase()}] camera nodes in the Charminar zone...
No active Fire Detection incidents or cameras are located near Charminar. 
The nearest active Fire Detection camera is **C07** at Chilkalguda X Road.

However, the following active nodes are near Charminar:
* **C16** (Charminar) - Crowd Detection [${getSeverity("Crowd Detection").toUpperCase()}]
* **C17** (Afzalgunj) - Fight Detection [${getSeverity("Fight Detection").toUpperCase()}]

You can view the overall fire module alerts here: [View Fire Detection Page](/anomalies/fire-detection).`;
    }

    // 3. Offline Cameras
    if (q.includes("offline") || (q.includes("camera") && q.includes("off"))) {
      // Find offline cameras across all anomaly data
      const offlineCams = [];
      Object.keys(anomaliesData).forEach((key) => {
        const anomaly = anomaliesData[key];
        anomaly.cameras.forEach((cam) => {
          if (cam.status === "Offline" && !offlineCams.some(c => c.id === cam.id)) {
            offlineCams.push({ id: cam.id, name: cam.name, module: anomaly.title, path: `/anomalies/${key}` });
          }
        });
      });

      if (offlineCams.length > 0) {
        let response = `I checked the node connections. There is currently **${offlineCams.length} offline camera** in the network:\n\n`;
        offlineCams.forEach((cam) => {
          response += `* **${cam.id}** (${cam.name}) under the [${cam.module} Module [${getSeverity(cam.module).toUpperCase()}]](${cam.path}).\n`;
        });
        response += `\nA heartbeat alert has been sent to the maintenance unit.`;
        return response;
      }
      return "All configured security cameras are currently Online and reporting heartbeat status.";
    }

    // 4. Summarize today's critical incidents
    if ((q.includes("summarize") || q.includes("summary")) && q.includes("critical")) {
      const criticalIncidents = dynamicIncidents.filter(i => i.severity === "Critical");
      if (criticalIncidents.length > 0) {
        let response = `Summary of today's critical incidents requiring immediate dispatch:\n\n`;
        criticalIncidents.forEach((inc) => {
          response += `* **${inc.title}** [${getSeverity(inc.title).toUpperCase()}] at **${inc.location}** (${inc.camera}) - Status: **${inc.status}** (Officer: ${inc.officer})\n`;
        });
        response += `\nYou can monitor the operational dispatch queues here: [View Dashboard](/).`;
        return response;
      }
      return "No critical status incidents are currently active in the queue.";
    }

    // 5. Show Fake Number Plate detections
    if (q.includes("fake") && (q.includes("plate") || q.includes("number"))) {
      const fakePlatesObj = anomaliesData["fake-number-plate"];
      if (fakePlatesObj) {
        const currentSeverity = getSeverity("Fake Number Plate").toUpperCase();
        let response = `I found Fake Number Plate [${currentSeverity}] detections in the system:\n\n`;
        fakePlatesObj.detections.forEach((det) => {
          response += `* **${det.id}**: Vehicle plate detected as fake at **${det.location}** (${det.camera}) - Severity: **${currentSeverity}** (${det.confidence} conf.) &bull; Status: ${det.status}\n`;
        });
        response += `\nDetailed plate cross-checks and images are available here: [View Fake Number Plate Page](/anomalies/fake-number-plate).`;
        return response;
      }
    }

    // 6. Show Water Logging in North Zone
    if (q.includes("water") && q.includes("logging") && q.includes("north")) {
      return `Water Logging [${getSeverity("Water Logging").toUpperCase()}] in North Zone: 1 active incident. City-wide total: 1.
Active camera feed:
* **C06** (Secretariat) - Incident status, Health 85%

You can review flood depths and maps here: [View Water Logging Page](/anomalies/water-logging).`;
    }

    // 7. Show cameras with poor health
    if (q.includes("poor") && q.includes("health")) {
      const poorHealthCams = [];
      Object.keys(anomaliesData).forEach((key) => {
        const anomaly = anomaliesData[key];
        anomaly.cameras.forEach((cam) => {
          if (cam.status !== "Offline" && cam.health < 80 && !poorHealthCams.some(c => c.id === cam.id)) {
            poorHealthCams.push({ id: cam.id, name: cam.name, health: cam.health, status: cam.status, module: anomaly.title });
          }
        });
      });

      if (poorHealthCams.length > 0) {
        let response = `I scanned all healthy/warning streams. Found **${poorHealthCams.length} cameras** reporting sub-optimal health (< 80%):\n\n`;
        poorHealthCams.forEach((cam) => {
          response += `* **${cam.id}** (${cam.name}) - **${cam.health}% Health** (${cam.status}) [${cam.module} [${getSeverity(cam.module).toUpperCase()}]]\n`;
        });
        response += `\nMaintenance checks are recommended for these streams.`;
        return response;
      }
      return "All online camera nodes are reporting optimal health parameters above 80%.";
    }

    // 8. Find all Road Accident incidents this week
    if (q.includes("accident") || q.includes("collision")) {
      const accidents = anomaliesData["road-accident"];
      if (accidents) {
        const currentSeverity = getSeverity("Road Accident").toUpperCase();
        let response = `I found Road Accident [${currentSeverity}] incidents logged this week:\n\n`;
        accidents.detections.forEach((det) => {
          response += `* **${det.camera}** at **${det.location}** - Detected: ${det.timestamp} (${det.confidence} confidence) - Status: **${det.status}**\n`;
        });
        response += `\nView full collision timelines and impact vectors here: [View Road Accident Page](/anomalies/road-accident).`;
        return response;
      }
    }

    // Generic fallbacks for general categories
    if (q.includes("crowd") || q.includes("gathering")) {
      return `Crowd Detection [${getSeverity("Crowd Detection").toUpperCase()}] Module is active:
* Active cameras: C16 (Charminar), C19 (Gulzar House), C18 (Madina)
* Recent alert: Crowd density threshold exceeded at Charminar Junction (12:15 PM)
You can view full feeds here: [View Crowd Detection Page](/anomalies/crowd-detection).`;
    }

    if (q.includes("flood") || q.includes("rain") || q.includes("water")) {
      return `Water Logging [${getSeverity("Water Logging").toUpperCase()}] Module is active:
* Active cameras: C06 (Secretariat), C14 (BRK Bhavan)
You can view street flooding levels here: [View Water Logging Page](/anomalies/water-logging).`;
    }

    if (q.includes("stagnation") || q.includes("traffic") || q.includes("stuck")) {
      return `Vehicle Stagnation [${getSeverity("Vehicle Stagnation").toUpperCase()}] Module is active:
* Active cameras: C13 (Park Continental)
You can view stationary vehicle alerts here: [View Vehicle Stagnation Page](/anomalies/vehicle-stagnation).`;
    }

    if (q.includes("fire") || q.includes("smoke")) {
      return `Fire Detection [${getSeverity("Fire Detection").toUpperCase()}] Module is active:
* Active cameras: C07 (Chilkalguda X Road)
You can view flame scans here: [View Fire Detection Page](/anomalies/fire-detection).`;
    }

    if (q.includes("fight") || q.includes("assault") || q.includes("violence")) {
      return `Fight Detection [${getSeverity("Fight Detection").toUpperCase()}] Module is active:
* Active cameras: C17 (Afzalgunj)
You can view action grids here: [View Fight Detection Page](/anomalies/fight-detection).`;
    }

    if (q.includes("running") || q.includes("panic")) {
      return `Running [${getSeverity("Running").toUpperCase()}] Module is active:
* Active cameras: C03 (Nampally T Junction)
You can view velocity tracking vectors here: [View Running Page](/anomalies/running).`;
    }

    if (q.includes("suspect") || q.includes("face") || q.includes("person") || q.includes("citizen") || q.includes("rajesh")) {
      return `I found suspect matches and citizen files in the FRS registry. 
To search suspect records, upload photos, or capture webcam frames, please visit the [Face Recognition System](/frs) page.`;
    }

    // Default Fallback response
    return `I received your query: "${query}". 
I am a specialized assistant trained on TGICCC active logs. I can assist you with:
* Summarizing active critical incidents (try: "summarize critical incidents")
* Locating offline nodes (try: "which cameras are offline?")
* Listing anomaly specific reports (try: "show Fake Number Plate detections" or "show all Tree Fall incidents today")
* Listing poor health nodes (try: "show cameras with poor health")`;
  };

  // Handle message send
  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsgId = `m-${Date.now()}`;
    const newMessages = [
      ...messages,
      { id: userMsgId, sender: "user", content: text }
    ];
    setMessages(newMessages);
    setInputText("");

    // Simulate typing delay
    setIsTyping(true);
    setTimeout(() => {
      const responseText = generateAIResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: `m-${Date.now() + 1}`, sender: "bot", content: responseText }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  // Helper to parse markdown-style links [Text](/Path) and return styled React elements
  const formatBubbleText = (text) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const linkText = match[1];
      const linkPath = match[2];

      parts.push(
        <span
          key={match.index}
          className="chat-link"
          onClick={() => navigate(linkPath)}
          style={{
            color: "var(--primary)",
            fontWeight: "700",
            textDecoration: "underline",
            cursor: "pointer"
          }}
        >
          {linkText}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Render list elements if text starts with "* "
    const isListText = text.includes("\n* ");
    if (isListText) {
      const lines = text.split("\n");
      const renderedLines = [];
      let listItems = [];

      lines.forEach((line, idx) => {
        if (line.startsWith("* ")) {
          const listLineText = line.substring(2);
          listItems.push(<li key={`li-${idx}`}>{formatBubbleText(listLineText)}</li>);
        } else {
          if (listItems.length > 0) {
            renderedLines.push(<ul key={`ul-${idx}`}>{listItems}</ul>);
            listItems = [];
          }
          if (line.trim() !== "") {
            renderedLines.push(<p key={`p-${idx}`}>{formatBubbleText(line)}</p>);
          }
        }
      });

      if (listItems.length > 0) {
        renderedLines.push(<ul key="ul-end">{listItems}</ul>);
      }

      return <div>{renderedLines}</div>;
    }

    // Default formatting for line breaks
    if (parts.length === 1 && typeof parts[0] === "string") {
      return parts[0].split("\n").map((line, idx) => (
        <p key={idx} style={{ margin: "4px 0" }}>{line}</p>
      ));
    }

    return <div>{parts}</div>;
  };

  return (
    <div className="assistant-container">
      {/* Header */}
      <div className="assistant-header-wrapper">
        <span className="module-tag">Operations Intelligence</span>
        <h1>AI Assistant</h1>
      </div>

      {/* Main Workspace grid */}
      <div className="assistant-workspace-grid">
        {/* Chat window */}
        <div className="chat-window">
          {/* Chat log viewport */}
          <div className="chat-viewport" ref={viewportRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="chat-avatar">
                  {msg.sender === "bot" ? <FiCpu /> : <FiUser />}
                </div>
                <div className="chat-bubble">
                  {formatBubbleText(msg.content)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message bot">
                <div className="chat-avatar">
                  <FiCpu />
                </div>
                <div className="chat-bubble" style={{ background: "#f1f5f9" }}>
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat input footer */}
          <form onSubmit={handleFormSubmit} className="chat-input-bar">
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Ask anything operational..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
              />
            </div>
            <button 
              type="submit" 
              className="chat-btn-send"
              disabled={!inputText.trim() || isTyping}
            >
              <FiSend /> Send
            </button>
          </form>
        </div>

        {/* Suggested Prompts sidebar */}
        <div className="assistant-sidebars">
          <div className="prompt-suggestions-card">
            <h3>
              <FiHelpCircle style={{ color: "var(--primary)" }} /> Suggested Prompts
            </h3>
            <div className="suggestions-list">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="suggestion-btn"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="assistant-note-card">
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
              <FiInfo style={{ flexShrink: 0, marginTop: "2px", fontSize: "14px", color: "var(--primary)" }} />
              <div>
                <strong>Note:</strong> This assistant is a prototype responder. Responses are derived from current TGICCC mock data. Verify before operational dispatch.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;