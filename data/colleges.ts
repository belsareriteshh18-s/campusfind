import type { College, CollegeType, Stream } from "@/types/college"

type Row = [
  name: string,
  shortName: string,
  city: string,
  state: string,
  type: CollegeType,
  established: number,
  rating: number,
  fees: number,
  stream: Stream,
  placement: number,
]

const rows: Row[] = [
  ["Indian Institute of Technology Bombay", "IITB", "Mumbai", "Maharashtra", "Government", 1958, 4.9, 232000, "Engineering", 24.2],
  ["Indian Institute of Technology Delhi", "IITD", "New Delhi", "Delhi", "Government", 1961, 4.8, 228000, "Engineering", 23.5],
  ["Indian Institute of Technology Madras", "IITM", "Chennai", "Tamil Nadu", "Government", 1959, 4.9, 224000, "Engineering", 22.8],
  ["Indian Institute of Technology Kanpur", "IITK", "Kanpur", "Uttar Pradesh", "Government", 1959, 4.7, 219000, "Engineering", 21.4],
  ["Indian Institute of Technology Kharagpur", "IITKGP", "Kharagpur", "West Bengal", "Government", 1951, 4.7, 217000, "Engineering", 20.6],
  ["Indian Institute of Science", "IISc", "Bengaluru", "Karnataka", "Government", 1909, 4.9, 45000, "Engineering", 25.1],
  ["BITS Pilani", "BITS", "Pilani", "Rajasthan", "Private", 1964, 4.6, 520000, "Engineering", 18.9],
  ["Delhi Technological University", "DTU", "New Delhi", "Delhi", "Government", 1941, 4.5, 190000, "Engineering", 14.2],
  ["Netaji Subhas University of Technology", "NSUT", "New Delhi", "Delhi", "Government", 1983, 4.4, 180000, "Engineering", 13.6],
  ["Veermata Jijabai Technological Institute", "VJTI", "Mumbai", "Maharashtra", "Government", 1887, 4.4, 85000, "Engineering", 12.8],
  ["Vellore Institute of Technology", "VIT", "Vellore", "Tamil Nadu", "Deemed", 1984, 4.3, 398000, "Engineering", 9.4],
  ["Manipal Institute of Technology", "MIT-MAHE", "Manipal", "Karnataka", "Deemed", 1957, 4.2, 420000, "Engineering", 9.1],
  ["SRM Institute of Science and Technology", "SRMIST", "Chennai", "Tamil Nadu", "Deemed", 1985, 4.0, 360000, "Engineering", 7.8],
  ["College of Engineering Pune", "COEP", "Pune", "Maharashtra", "Government", 1854, 4.3, 96000, "Engineering", 11.2],
  ["Thapar Institute of Engineering", "TIET", "Patiala", "Punjab", "Deemed", 1956, 4.1, 386000, "Engineering", 8.6],

  ["Indian Institute of Management Ahmedabad", "IIMA", "Ahmedabad", "Gujarat", "Government", 1961, 4.9, 1250000, "Management", 34.4],
  ["Indian Institute of Management Bangalore", "IIMB", "Bengaluru", "Karnataka", "Government", 1973, 4.9, 1240000, "Management", 33.8],
  ["Indian Institute of Management Calcutta", "IIMC", "Kolkata", "West Bengal", "Government", 1961, 4.8, 1300000, "Management", 34.2],
  ["Faculty of Management Studies", "FMS", "New Delhi", "Delhi", "Government", 1954, 4.7, 45000, "Management", 32.4],
  ["Xavier Labour Relations Institute", "XLRI", "Jamshedpur", "Jharkhand", "Private", 1949, 4.6, 1080000, "Management", 29.6],
  ["Symbiosis Institute of Business Management", "SIBM", "Pune", "Maharashtra", "Deemed", 1978, 4.3, 450000, "Management", 18.4],
  ["Narsee Monjee Institute of Management", "NMIMS", "Mumbai", "Maharashtra", "Deemed", 1981, 4.2, 660000, "Management", 17.2],
  ["Christ University", "CHRIST", "Bengaluru", "Karnataka", "Deemed", 1969, 4.2, 210000, "Management", 8.4],

  ["All India Institute of Medical Sciences", "AIIMS", "New Delhi", "Delhi", "Government", 1956, 4.9, 6100, "Medical", 15.6],
  ["Christian Medical College", "CMC", "Vellore", "Tamil Nadu", "Private", 1900, 4.8, 48000, "Medical", 13.8],
  ["Armed Forces Medical College", "AFMC", "Pune", "Maharashtra", "Government", 1948, 4.7, 64000, "Medical", 12.9],
  ["Maulana Azad Medical College", "MAMC", "New Delhi", "Delhi", "Government", 1958, 4.5, 24000, "Medical", 11.4],
  ["Kasturba Medical College", "KMC", "Manipal", "Karnataka", "Deemed", 1953, 4.3, 1450000, "Medical", 11.8],
  ["JIPMER Puducherry", "JIPMER", "Puducherry", "Puducherry", "Government", 1823, 4.6, 12000, "Medical", 12.2],

  ["National Law School of India University", "NLSIU", "Bengaluru", "Karnataka", "Government", 1986, 4.8, 280000, "Law & Arts", 18.6],
  ["NALSAR University of Law", "NALSAR", "Hyderabad", "Telangana", "Government", 1998, 4.6, 265000, "Law & Arts", 16.2],
  ["Ashoka University", "ASHOKA", "Sonipat", "Haryana", "Private", 2014, 4.5, 980000, "Law & Arts", 9.8],
  ["St. Stephen's College", "STEPHENS", "New Delhi", "Delhi", "Government", 1881, 4.6, 48000, "Law & Arts", 8.9],
  ["Lady Shri Ram College for Women", "LSR", "New Delhi", "Delhi", "Government", 1956, 4.5, 32000, "Law & Arts", 8.2],
  ["St. Xavier's College", "XAVIERS", "Mumbai", "Maharashtra", "Private", 1869, 4.4, 42000, "Law & Arts", 7.4],
  ["Loyola College", "LOYOLA", "Chennai", "Tamil Nadu", "Private", 1925, 4.3, 38000, "Law & Arts", 6.8],
  ["Fergusson College", "FERGUSSON", "Pune", "Maharashtra", "Government", 1885, 4.1, 24000, "Law & Arts", 5.9],
  ["Jadavpur University", "JU", "Kolkata", "West Bengal", "Government", 1955, 4.5, 32000, "Engineering", 10.4],
  ["University of Delhi", "DU", "New Delhi", "Delhi", "Government", 1922, 4.4, 28000, "Law & Arts", 7.6],
  ["Symbiosis Law School", "SLS", "Pune", "Maharashtra", "Deemed", 1977, 4.2, 380000, "Law & Arts", 9.2],
  ["Amity University", "AMITY", "Noida", "Uttar Pradesh", "Private", 2005, 3.9, 320000, "Management", 6.4],
]

const coursesByStream: Record<Stream, string[]> = {
  Engineering: ["B.Tech Computer Science", "B.Tech Electronics", "B.Tech Mechanical", "M.Tech Data Science"],
  Management: ["MBA", "MBA Finance", "BBA", "Executive MBA"],
  Medical: ["MBBS", "MD General Medicine", "B.Sc Nursing", "BDS"],
  "Law & Arts": ["BA LLB", "BA Economics", "BA English", "MA Political Science"],
}

const examsByStream: Record<Stream, string[]> = {
  Engineering: ["JEE Main", "JEE Advanced"],
  Management: ["CAT", "XAT"],
  Medical: ["NEET UG"],
  "Law & Arts": ["CLAT", "CUET"],
}

const tagPool = [
  ["Top ranked", "Highly selective"],
  ["Strong placements", "Metro campus"],
  ["Student favourite", "Active alumni"],
  ["Research heavy", "Great faculty"],
]

const accents = ["#dce8e4", "#f1e5cc", "#dfe8f2", "#e9e0ec"]

const streamRankCounter: Record<string, number> = {}

export const colleges: College[] = rows.map((row, index) => {
  const [name, shortName, city, state, type, established, rating, fees, stream, placement] = row
  streamRankCounter[stream] = (streamRankCounter[stream] ?? 0) + 1

  return {
    id: shortName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    shortName,
    city,
    state,
    type,
    stream,
    established,
    rating,
    reviews: 180 + ((index * 137) % 2400),
    fees,
    placement,
    rank: streamRankCounter[stream],
    acceptanceRate: Number((1.5 + ((index * 7) % 40) * 0.9).toFixed(1)),
    hostel: index % 7 !== 3,
    exams: examsByStream[stream],
    courses: coursesByStream[stream],
    tags: tagPool[index % tagPool.length],
    description: `${name} is one of India's most sought-after institutions for ${stream.toLowerCase()} aspirants, combining rigorous academics with a strong placement record and an active campus community in ${city}.`,
    accent: accents[index % accents.length],
  }
})

export const getCollege = (id: string) => colleges.find((college) => college.id === id)

export const getColleges = (ids: string[]) =>
  ids.map((id) => getCollege(id)).filter((college): college is College => Boolean(college))

export const allStates = Array.from(new Set(colleges.map((c) => c.state))).sort()
export const allExams = Array.from(new Set(colleges.flatMap((c) => c.exams))).sort()
export const maxFeesInData = Math.max(...colleges.map((c) => c.fees))
