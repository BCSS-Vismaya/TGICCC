const frsData = [
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
    photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%231E293B'/><circle cx='50' cy='42' r='20' fill='%23E2E8F0'/><path d='M30 42 C30 42, 50 25, 70 42' stroke='%23475569' stroke-width='4' fill='none'/><path d='M25 80 C25 65, 35 60, 50 60 C65 60, 75 65, 75 80' fill='%23E2E8F0'/><circle cx='43' cy='42' r='2' fill='%230F172A'/><circle cx='57' cy='42' r='2' fill='%230F172A'/><path d='M47 50 Q50 53 53 50' stroke='%230F172A' stroke-width='1.5' fill='none'/></svg>",
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
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%230F172A'/><circle cx='50' cy='50' r='25' fill='%2364748B'/><path d='M35 50 Q50 35 65 50' stroke='%231E293B' stroke-width='3' fill='none'/><circle cx='45' cy='48' r='2' fill='%23FFF'/><circle cx='55' cy='48' r='2' fill='%23FFF'/><rect x='30' y='30' width='40' height='40' fill='none' stroke='%23EF4444' stroke-width='2'/></svg>"
      },
      {
        id: "E-1002",
        title: "TS08FN9012 Crop",
        type: "Vehicle Sighting",
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60' width='120' height='60'><rect width='120' height='60' fill='%23E2E8F0'/><rect x='10' y='10' width='100' height='40' fill='%23FACC15' rx='4'/><text x='60' y='35' font-family='monospace' font-weight='bold' font-size='14' text-anchor='middle' fill='%231E293B'>TS08FN9012</text></svg>"
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
    photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%231E293B'/><circle cx='50' cy='42' r='20' fill='%23FCD34D'/><path d='M28 35 C28 35, 50 15, 72 35' stroke='%23B45309' stroke-width='4' fill='none'/><path d='M25 80 C25 65, 35 60, 50 60 C65 60, 75 65, 75 80' fill='%23FCD34D'/><circle cx='43' cy='42' r='2' fill='%230F172A'/><circle cx='57' cy='42' r='2' fill='%230F172A'/><path d='M47 50 Q50 53 53 50' stroke='%230F172A' stroke-width='1.5' fill='none'/></svg>",
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
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60' width='120' height='60'><rect width='120' height='60' fill='%23E2E8F0'/><rect x='10' y='10' width='100' height='40' fill='%23EF4444' rx='4'/><text x='60' y='35' font-family='monospace' font-weight='bold' font-size='14' text-anchor='middle' fill='%23FFF'>TS09EB4321</text></svg>"
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
    photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%231E293B'/><circle cx='50' cy='42' r='20' fill='%23FCA5A5'/><path d='M30 30 L70 30' stroke='%230F172A' stroke-width='5' stroke-linecap='round'/><path d='M25 80 C25 65, 35 60, 50 60 C65 60, 75 65, 75 80' fill='%23FCA5A5'/><circle cx='43' cy='42' r='2' fill='%230F172A'/><circle cx='57' cy='42' r='2' fill='%230F172A'/><path d='M47 50 Q50 48 53 50' stroke='%230F172A' stroke-width='1.5' fill='none'/></svg>",
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
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60' width='120' height='60'><rect width='120' height='60' fill='%23E2E8F0'/><rect x='10' y='10' width='100' height='40' fill='%23FACC15' rx='4'/><text x='60' y='35' font-family='monospace' font-weight='bold' font-size='14' text-anchor='middle' fill='%231E293B'>TS10AZ5678</text></svg>"
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
    photo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%231E293B'/><circle cx='50' cy='42' r='20' fill='%23A5F3FC'/><path d='M30 40 Q50 20 70 40' stroke='%230891B2' stroke-width='4' fill='none'/><path d='M25 80 C25 65, 35 60, 50 60 C65 60, 75 65, 75 80' fill='%23A5F3FC'/><circle cx='43' cy='42' r='2' fill='%230F172A'/><circle cx='57' cy='42' r='2' fill='%230F172A'/><path d='M47 50 Q50 53 53 50' stroke='%230F172A' stroke-width='1.5' fill='none'/></svg>",
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
        image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%23B91C1C'/><text x='50' y='55' fill='white' font-weight='bold' font-size='20' text-anchor='middle'>ACCIDENT</text></svg>"
      }
    ]
  }
];

export default frsData;
