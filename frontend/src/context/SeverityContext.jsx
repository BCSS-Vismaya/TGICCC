import { createContext, useContext, useState, useEffect } from "react";

const SeverityContext = createContext();

export const initialDefaultRules = [
  { 
    id: "fake-number-plate", 
    title: "Fake Number Plate", 
    enabled: true, 
    minSeverity: "High", 
    channels: ["Email", "SMS"], 
    recipients: [
      { id: "r-1", name: "Rahul Sharma", channel: "Email", channelId: "rahul.sharma@telangana.gov.in", duration: "Always", status: "Active" },
      { id: "r-2", name: "SI A. Kavitha", channel: "SMS", channelId: "+91 9876543210", duration: "Always", status: "Active" }
    ] 
  },
  { 
    id: "crowd-detection", 
    title: "Crowd Detection", 
    enabled: false, 
    minSeverity: "High", 
    channels: ["Phone"], 
    recipients: [
      { id: "r-3", name: "Inspector Kumar", channel: "Phone", channelId: "+91 9876543211", duration: "Always", status: "Active" }
    ] 
  },
  { 
    id: "water-logging", 
    title: "Water Logging", 
    enabled: false, 
    minSeverity: "Critical", 
    channels: ["SMS"], 
    recipients: [
      { id: "r-4", name: "Disaster Response Unit", channel: "SMS", channelId: "+91 9999988888", duration: "1 Month", status: "Active" }
    ] 
  },
  { 
    id: "vehicle-stagnation", 
    title: "Vehicle Stagnation", 
    enabled: true, 
    minSeverity: "Medium", 
    channels: ["SMS"], 
    recipients: [
      { id: "r-5", name: "Traffic Patrol", channel: "SMS", channelId: "+91 9888877777", duration: "1 Week", status: "Active" }
    ] 
  },
  { 
    id: "road-accident", 
    title: "Road Accident", 
    enabled: true, 
    minSeverity: "Critical", 
    channels: ["Phone"], 
    recipients: [
      { id: "r-6", name: "Medical Response Wing", channel: "Phone", channelId: "+91 9111122222", duration: "Always", status: "Active" }
    ] 
  },
  { 
    id: "fire-detection", 
    title: "Fire Detection", 
    enabled: false, 
    minSeverity: "Medium", 
    channels: ["SMS"], 
    recipients: [
      { id: "r-7", name: "City Fire Control", channel: "SMS", channelId: "+91 9555544444", duration: "Always", status: "Active" }
    ] 
  },
  { 
    id: "fight-detection", 
    title: "Fight Detection", 
    enabled: true, 
    minSeverity: "Critical", 
    channels: ["Email"], 
    recipients: [
      { id: "r-8", name: "Police Patrol Area 4", channel: "Email", channelId: "patrol4@telangana.gov.in", duration: "Until Disabled", status: "Active" }
    ] 
  },
  { 
    id: "running", 
    title: "Running / Fleeing", 
    enabled: true, 
    minSeverity: "Medium", 
    channels: ["SMS"], 
    recipients: [
      { id: "r-9", name: "Sector 1 Supervisor", channel: "SMS", channelId: "+91 9777766666", duration: "Always", status: "Active" }
    ] 
  },
  { 
    id: "tree-fall", 
    title: "Tree Fall", 
    enabled: true, 
    minSeverity: "Medium", 
    channels: ["Email"], 
    recipients: [
      { id: "r-10", name: "GHMC Forestry Unit", channel: "Email", channelId: "forestry@telangana.gov.in", duration: "Always", status: "Active" }
    ] 
  },
  { 
    id: "camera-offline", 
    title: "Camera Offline", 
    enabled: true, 
    minSeverity: "High", 
    channels: ["Email"], 
    recipients: [
      { id: "r-11", name: "TGICCC Network Team", channel: "Email", channelId: "network.admin@telangana.gov.in", duration: "Always", status: "Active" }
    ] 
  }
];

export const mapTitleToId = (title) => {
  if (!title) return "";
  const t = title.toLowerCase().trim();
  if (t.includes("plate") || t.includes("fake")) return "fake-number-plate";
  if (t.includes("crowd")) return "crowd-detection";
  if (t.includes("water") || t.includes("logging") || t.includes("flood")) return "water-logging";
  if (t.includes("stagnation") || t.includes("stagnant") || t.includes("vehicle stagnation")) return "vehicle-stagnation";
  if (t.includes("accident") || t.includes("crash") || t.includes("road")) return "road-accident";
  if (t.includes("fire")) return "fire-detection";
  if (t.includes("fight") || t.includes("brawl") || t.includes("assault")) return "fight-detection";
  if (t.includes("run") || t.includes("flee") || t.includes("running")) return "running";
  if (t.includes("tree")) return "tree-fall";
  if (t.includes("camera") || t.includes("offline")) return "camera-offline";
  return "";
};

export function SeverityProvider({ children }) {
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("tgiccc_rules");
    return saved ? JSON.parse(saved) : initialDefaultRules;
  });

  useEffect(() => {
    localStorage.setItem("tgiccc_rules", JSON.stringify(rules));
  }, [rules]);

  // Helper to retrieve severity value by anomaly title or id
  const getSeverity = (titleOrId) => {
    const matchedId = mapTitleToId(titleOrId) || titleOrId;
    const rule = rules.find(r => r.id === matchedId);
    return rule ? rule.minSeverity : "Medium"; // Default fallback
  };

  // Helper to retrieve severity color mapping class name
  const getSeverityColorClass = (severity) => {
    const s = severity?.toLowerCase() || "";
    if (s === "critical") return "critical";
    if (s === "high") return "high";
    if (s === "medium") return "medium";
    if (s === "low") return "low";
    return "medium";
  };

  const updateRuleSeverity = (ruleId, nextSeverity) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, minSeverity: nextSeverity } : r));
  };

  return (
    <SeverityContext.Provider value={{ rules, setRules, getSeverity, getSeverityColorClass, updateRuleSeverity }}>
      {children}
    </SeverityContext.Provider>
  );
}

export function useSeverity() {
  const context = useContext(SeverityContext);
  if (!context) {
    throw new Error("useSeverity must be used within a SeverityProvider");
  }
  return context;
}
