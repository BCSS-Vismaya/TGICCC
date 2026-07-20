const staticData = [
  {
    id: "FACE-1000",
    name: "Rajesh Kumar Reddy",
    age: 50,
    gender: "Male",
    address: "H.No 232-66, Gachibowli, Hyderabad",
    aliases: "Rajesh Bhai",
    vehicles: ["TS08FN9012"],
    caseNumber: "CASE-2026-104",
    lastSeen: "Iqbal Minar",
    lastSeenTime: "12h ago",
    watchlistStatus: "MISSING PERSON",
    currentStatus: "Active Search",
    confidenceScore: "98.0%",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200",
    notes: "Subject is reported missing since 2026-06-30. Last spotted near Iqbal Minar area wearing a blue shirt. Suspected medical condition requiring regular assistance. Family has filed a missing report. High priority trace.",
    timeline: [
      {
        id: "V-9001",
        date: "2026-06-30",
        time: "10:15 AM",
        camera: "C21",
        location: "Iqbal Minar",
        violationType: "Crowd Detection",
        officer: "Insp. S. Mahesh",
        status: "In Progress",
        coords: [17.4035, 78.4705]
      },
      {
        id: "V-9002",
        date: "2026-06-29",
        time: "04:30 PM",
        camera: "C13",
        location: "Park Continental",
        violationType: "Vehicle Stagnation",
        officer: "SI A. Kavitha",
        status: "Acknowledged",
        coords: [17.4050, 78.4280]
      },
      {
        id: "V-9003",
        date: "2026-06-28",
        time: "09:00 AM",
        camera: "C05",
        location: "Gun Park",
        violationType: "Crowd Detection",
        officer: "Insp. S. Mahesh",
        status: "Resolved",
        coords: [17.3985, 78.4715]
      }
    ],
    evidence: [
      {
        id: "E-1001",
        title: "Iqbal Minar CCTV Sighting",
        type: "Face Crop",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150"
      },
      {
        id: "E-1002",
        title: "TS08FN9012 Crop",
        type: "Vehicle Sighting",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=150&h=100"
      }
    ]
  },
  {
    id: "FACE-1001",
    name: "Priya Sharma",
    age: 28,
    gender: "Female",
    address: "Flat 402, Banjara Hills, Hyderabad",
    aliases: "Priya, Pinky",
    vehicles: ["TS09EB4321"],
    caseNumber: "CASE-2026-215",
    lastSeen: "Road 12 MRC Gate",
    lastSeenTime: "2h ago",
    watchlistStatus: "HIGH RISK",
    currentStatus: "Monitored",
    confidenceScore: "90.0%",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
    notes: "Identified as a repeat traffic offender with active warrants for speed violation and evasion. Flagged under high risk list due to persistent behavior. Monitored closely via automated camera sweeps.",
    timeline: [
      {
        id: "V-9011",
        date: "2026-07-01",
        time: "01:20 PM",
        camera: "C04",
        location: "Road 12 MRC Gate",
        violationType: "Signal Jump",
        officer: "Traffic Unit",
        status: "Pending",
        coords: [17.4140, 78.4340]
      },
      {
        id: "V-9012",
        date: "2026-06-25",
        time: "11:10 AM",
        camera: "C06",
        location: "Secretariat",
        violationType: "Running",
        officer: "SI A. Kavitha",
        status: "Resolved",
        coords: [17.4062, 78.4712]
      }
    ],
    evidence: [
      {
        id: "E-2001",
        title: "Banjara Hills Signal Violation",
        type: "Vehicle Sighting",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=150&h=100"
      }
    ]
  },
  {
    id: "FACE-1002",
    name: "Venkatesh Rao",
    age: 45,
    gender: "Male",
    address: "Plot 12, Jubilee Hills, Hyderabad",
    aliases: "Venkat",
    vehicles: ["TS10AZ5678"],
    caseNumber: "CASE-2026-882",
    lastSeen: "Punjagutta X Road",
    lastSeenTime: "5h ago",
    watchlistStatus: "WANTED",
    currentStatus: "Under Investigation",
    confidenceScore: "97.0%",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
    notes: "Wanted for financial fraud and corporate breach. Subject is currently under investigation by CCB. Believed to be hiding in local commercial spaces. Check all vehicle routes daily.",
    timeline: [
      {
        id: "V-9021",
        date: "2026-07-01",
        time: "10:45 AM",
        camera: "C02",
        location: "Punjagutta X Road",
        violationType: "Fake Number Plate",
        officer: "PC L. Suresh",
        status: "In Progress",
        coords: [17.4250, 78.4550]
      }
    ],
    evidence: [
      {
        id: "E-3001",
        title: "TS10AZ5678 Sighting",
        type: "Plate Crop",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=150&h=100"
      }
    ]
  },
  {
    id: "FACE-1003",
    name: "Anitha Devi",
    age: 37,
    gender: "Female",
    address: "H.No 4-12, Secunderabad, Hyderabad",
    aliases: "Anitha",
    vehicles: ["TS11BC7890"],
    caseNumber: "CASE-2026-309",
    lastSeen: "Chilkalguda X Road",
    lastSeenTime: "1d ago",
    watchlistStatus: "HIGH RISK",
    currentStatus: "Monitored",
    confidenceScore: "82.0%",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
    notes: "Monitored due to suspect presence at multiple high-alert public junctions. Vehicle has been tracked traversing Secunderabad route at odd hours. Recommended for manual verification if sighted.",
    timeline: [
      {
        id: "V-9031",
        date: "2026-06-30",
        time: "08:00 AM",
        camera: "C07",
        location: "Chilkalguda X Road",
        violationType: "Road Accident",
        officer: "SI A. Kavitha",
        status: "Resolved",
        coords: [17.4330, 78.5020]
      }
    ],
    evidence: [
      {
        id: "E-4001",
        title: "Chilkalguda CCTV Crash Frame",
        type: "Accident Sighting",
        image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=150&h=100"
      }
    ]
  }
];


const malePortraits = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150"
];

const femalePortraits = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=150&h=150"
];

const cctvCrops = [
  "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=250&h=250",
  "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=250&h=250",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=250&h=250"
];

const vehicleCrops = [
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=250&h=150",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=250&h=150",
  "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=250&h=150",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=250&h=150"
];

const sceneCrops = [
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=250&h=150",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=250&h=150",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=250&h=150"
];

// Helper functions for mock generation
const firstNamesM = [
  "Raj", "Rajesh", "Rajan", "Rajeev", "Rajender", "Rajat", "Rajiv", "Raju", 
  "Rajpal", "Amit", "Sunil", "Anil", "Sanjay", "Vikram", "Rahul", "Vivek", 
  "Manoj", "Harish", "Suresh", "Mahesh", "Ramesh", "Ajay", "Vijay", "Anand", 
  "Pawan", "Deepak", "Ashok", "Sandeep", "Karan", "Arjun", "Aditya", "Rohan"
];

const firstNamesF = [
  "Rajni", "Rajeswari", "Rajlaxmi", "Priya", "Anitha", "Shreya", "Sneha", 
  "Pooja", "Neha", "Kavitha", "Sunitha", "Divya", "Geetha", "Swapna", 
  "Madhavi", "Swathi", "Rekha", "Rani", "Radha", "Meena", "Jyothi", 
  "Archana", "Lakshmi", "Parvathi", "Nisha", "Kiran", "Preeti", "Aisha"
];

const lastNames = [
  "Kumar", "Reddy", "Rao", "Sharma", "Verma", "Singh", "Nair", "Kapoor", 
  "Patel", "Das", "Khan", "Joshi", "Devi", "Bhat", "Gupta", "Sen", 
  "Chowdary", "Prasad", "Murthy", "Iyer", "Saxena", "Choudhury", "Bose"
];

const areas = [
  "Gachibowli", "Banjara Hills", "Jubilee Hills", "Madhapur", "Secunderabad", 
  "Begumpet", "Charminar", "Hitech City", "Kukatpally", "Ameerpet", 
  "Dilsukhnagar", "Kondapur", "Somajiguda", "Koti", "Himayatnagar",
  "Yusufguda", "Tolichowki", "Mehdipatnam", "Punjagutta", "Chilkalguda"
];

const violationTypes = [
  "Speeding", "Signal Jump", "Suspicious Loitering", "Crowd Detection", 
  "Vehicle Stagnation", "Accident Sighting", "Intrusion Alert", "Unattended Baggage"
];

const officers = [
  "Insp. S. Mahesh", "SI A. Kavitha", "PC L. Suresh", "Insp. K. Rao", 
  "Insp. G. Reddy", "SI M. Pasha", "PC R. Kumar", "SI T. Naidu"
];

const currentStatuses = ["Active Search", "Monitored", "Under Investigation", "Open Sighting", "Resolved Case"];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Construct full list of 1500 records
const frsData = [...staticData];

// Generate remaining 1496 records
for (let i = 4; i < 1500; i++) {
  const gender = Math.random() > 0.45 ? "Male" : "Female";
  let firstName = "";
  
  // Ensure we have a high frequency of "Raj" names to satisfy search requirements
  if (i % 6 === 0 || i % 7 === 0) {
    // Specifically name them Raj-related
    firstName = gender === "Male" ? getRandomItem(["Raj", "Rajesh", "Rajan", "Rajeev", "Rajender", "Rajat", "Rajiv", "Raju"]) : getRandomItem(["Rajni", "Rajeswari", "Rajlaxmi"]);
  } else {
    firstName = gender === "Male" ? getRandomItem(firstNamesM) : getRandomItem(firstNamesF);
  }
  
  const lastName = getRandomItem(lastNames);
  const name = `${firstName} ${lastName}`;
  const age = getRandomInt(21, 72);
  const faceId = `FACE-${1000 + i}`;
  const address = `H.No ${getRandomInt(10, 450)}-${getRandomInt(1, 99)}, ${getRandomItem(areas)}, Hyderabad`;
  const aliases = `${firstName} ${getRandomItem(["Bhai", "Baba", "Beta", "Madam", "Pappu", "Chotu", ""])}`.trim();
  const vehicles = [`TS09${String.fromCharCode(65 + getRandomInt(0, 25))}${String.fromCharCode(65 + getRandomInt(0, 25))}${getRandomInt(1000, 9999)}`];
  const caseNumber = `CASE-2026-${getRandomInt(100, 999)}`;
  const lastSeen = getRandomItem(areas);
  const lastSeenTime = getRandomInt(1, 23) + (Math.random() > 0.5 ? "h ago" : "d ago");
  
  // Distribute watchlist status
  // 15% wanted, 15% missing, 15% high risk, 55% none
  const randStatus = Math.random();
  let watchlistStatus = "None";
  if (randStatus < 0.15) {
    watchlistStatus = "WANTED";
  } else if (randStatus < 0.30) {
    watchlistStatus = "MISSING PERSON";
  } else if (randStatus < 0.45) {
    watchlistStatus = "HIGH RISK";
  }

  const currentStatus = getRandomItem(currentStatuses);
  const confidenceScore = `${(Math.random() * 25 + 75).toFixed(1)}%`;
  
  const photo = gender === "Male" ? getRandomItem(malePortraits) : getRandomItem(femalePortraits);

  const notes = `Subject flagged in system intelligence network. Associated with query ${caseNumber}. Known to operate or reside near ${lastSeen}. Suspect behavior recorded on CCTV network. Investigate matching detections.`;

  // Timeline events: generate between 2 to 4 events, ordered by date
  const numEvents = getRandomInt(2, 4);
  const timeline = [];
  const coordsBase = [
    [17.4483, 78.3741], // Gachibowli
    [17.4140, 78.4340], // Banjara Hills
    [17.4325, 78.4070], // Jubilee Hills
    [17.4485, 78.3908], // Madhapur
    [17.4399, 78.4983], // Secunderabad
    [17.4448, 78.4730], // Begumpet
    [17.3616, 78.4747], // Charminar
    [17.4504, 78.3808], // Hitech City
    [17.4855, 78.3970], // Kukatpally
    [17.4344, 78.4482], // Ameerpet
    [17.3688, 78.5307], // Dilsukurnagar
    [17.4622, 78.3568], // Kondapur
    [17.4176, 78.4623], // Somajiguda
    [17.3833, 78.4762], // Koti
    [17.4019, 78.4855], // Himayatnagar
    [17.4243, 78.4300]  // Yusufguda
  ];

  for (let j = 0; j < numEvents; j++) {
    // Generate dates: 2026-06-25 to 2026-07-02
    const day = getRandomInt(25, 30);
    const dateStr = `2026-06-${day}`;
    const timeStr = `${String(getRandomInt(1, 12)).padStart(2, '0')}:${String(getRandomInt(0, 59)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;
    const loc = getRandomItem(areas);
    
    // Choose coordinate matching the location or close to it
    const baseCoords = getRandomItem(coordsBase);
    const coords = [
      baseCoords[0] + (Math.random() - 0.5) * 0.015,
      baseCoords[1] + (Math.random() - 0.5) * 0.015
    ];

    timeline.push({
      id: `V-${9000 + i * 10 + j}`,
      date: dateStr,
      time: timeStr,
      camera: `C${getRandomInt(1, 30).toString().padStart(2, '0')}`,
      location: loc,
      violationType: getRandomItem(violationTypes),
      officer: getRandomItem(officers),
      status: getRandomItem(["Resolved", "Pending", "In Progress"]),
      coords: coords
    });
  }

  // Sort timeline newest date and time first (descending)
  timeline.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time.replace(/(AM|PM)/, ' $1')}`);
    const dateB = new Date(`${b.date} ${b.time.replace(/(AM|PM)/, ' $1')}`);
    return dateB - dateA;
  });

  // Evidence Gallery items
  const evidenceCount = getRandomInt(1, 3);
  const evidence = [];
  for (let k = 0; k < evidenceCount; k++) {
    const evId = `E-${i * 10 + k}`;
    if (k === 0) {
      evidence.push({
        id: evId,
        title: `${timeline[0].location} CCTV Sighting`,
        type: "Face Crop",
        image: getRandomItem(cctvCrops)
      });
    } else if (k === 1) {
      evidence.push({
        id: evId,
        title: `${vehicles[0]} Sighting Crop`,
        type: "Vehicle Sighting",
        image: getRandomItem(vehicleCrops)
      });
    } else {
      evidence.push({
        id: evId,
        title: `Scene Sighting Crop`,
        type: "Sighting Image",
        image: getRandomItem(sceneCrops)
      });
    }
  }

  frsData.push({
    id: faceId,
    name: name,
    age: age,
    gender: gender,
    address: address,
    aliases: aliases,
    vehicles: vehicles,
    caseNumber: caseNumber,
    lastSeen: lastSeen,
    lastSeenTime: lastSeenTime,
    watchlistStatus: watchlistStatus,
    currentStatus: currentStatus,
    confidenceScore: confidenceScore,
    photo: photo,
    notes: notes,
    timeline: timeline,
    evidence: evidence
  });
}

export default frsData;
