import type {
  DiscoverFilters,
  OnboardingStep,
  ProfileCard,
  ProfileDetail,
} from "./types";

export const APP_NAME = "Jodiyaan";
export const TAGLINE = "Find your life partner";
export const SUBTAGLINE =
  "A modern platform rooted in Indian values, culture and family — made for meaningful introductions.";

export const HERO_CONTENT = {
  badge: "Indian Matrimonial",
  titlePrefix: "Find your ",
  titleHighlight: "Life Partner",
  subtitle:
    "A modern platform rooted in Indian values, culture and family — made for meaningful introductions.",
  heroImage: "/images/hero-couple.jpg",
  verifiedBadgeText: "10,000+ Verified Matches",
  searchButtonText: "Find matches",
} as const;

export const APPROACH_CONTENT = {
  badge: "Our Approach",
  title: "Tradition, with a Modern Touch",
  description:
    "We combine India's rich cultural heritage with modern technology to help you find a meaningful and lasting relationship. Built for individuals and families who value respect, trust, and shared values.",
  ctaText: "Know More →",
  ctaHref: "/discover",
  imageSrc: "/images/heritage-palace.jpg",
  imageAlt: "Carved Indian heritage palace mandap with floral marigold decorations",
} as const;

export const LANDING_NAV_ITEMS = [
  { href: "/discover", label: "Find Matches" },
  { href: "/#stories", label: "Success Stories" },
  { href: "/#membership", label: "Membership" },
  { href: "/#about", label: "About" },
] as const;

export const APP_NAV_ITEMS = [
  { href: "/discover", label: "Find Matches", icon: "search" },
  { href: "/interests", label: "Interests", icon: "heart" },
  { href: "/matches", label: "Messages", icon: "message-circle" },
  { href: "/me", label: "Profile", icon: "user" },
] as const;

export const TRUST_PILLARS = [
  {
    title: "Verified profiles",
    body: "Trust at every step with government ID and social verification.",
    icon: "shield-check",
  },
  {
    title: "Family friendly",
    body: "Share with confidence.",
    icon: "heart-handshake",
  },
  {
    title: "Better matching",
    body: "Preferences that matter.",
    icon: "sparkles",
  },
  {
    title: "Privacy first",
    body: "You stay in control.",
    icon: "lock",
  },
] as const;

export const QUICK_SEARCH_AGE_OPTIONS = [
  { label: "21 – 25", min: 21, max: 25 },
  { label: "24 – 30", min: 24, max: 30 },
  { label: "28 – 35", min: 28, max: 35 },
  { label: "32 – 42", min: 32, max: 42 },
] as const;

export const TOP_INDIAN_CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
] as const;

export const RELIGIONS_LIST = [
  "Hindu",
  "Muslim",
  "Sikh",
  "Christian",
  "Jain",
  "Buddhist",
  "Parsi",
  "Jewish",
  "No religion",
  "Other",
] as const;

export const COMMUNITIES_LIST = [
  "Brahmin",
  "Kshatriya",
  "Vaishya",
  "Kayastha",
  "Maratha",
  "Agarwal",
  "Jat",
  "Rajput",
  "Sunni",
  "Shia",
  "Jat Sikh",
  "Khatri",
  "Other",
] as const;

export const EDUCATION_LIST = [
  "B.Tech / B.E.",
  "MBA / PGDM",
  "M.Tech / M.E.",
  "MBBS / MD",
  "CA / CS",
  "B.Com / M.Com",
  "B.Sc / M.Sc",
  "BBA / BBM",
  "Law / LLB / LLM",
  "Ph.D / Doctorate",
  "Other",
] as const;

export const PROFILE_TABS = [
  { id: "about", label: "About" },
  { id: "family", label: "Family" },
  { id: "education", label: "Education & career" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "partner", label: "Partner preferences" },
] as const;

export const MATCH_FILTER_TABS = [
  { id: "all", label: "All matches" },
  { id: "new", label: "New members" },
  { id: "near", label: "Near you" },
] as const;

export const HEIGHTS_CM = Array.from({ length: 31 }, (_, i) =>
  Math.round((54 + i) * 2.54),
);

export const PROFILE_TEXT_FIELDS = [
  "fullName",
  "religion",
  "community",
  "motherTongue",
  "city",
  "state",
  "education",
  "profession",
  "about",
] as const;

export const EMPTY_DISCOVER_FILTERS: DiscoverFilters = {
  ageMin: "",
  ageMax: "",
  city: "",
  religion: "",
  community: "",
  education: "",
  verifiedOnly: false,
  withPhoto: false,
};

export const DISCOVER_PAGE_SIZE = 12;

export const PHOTO_MAX_MB = 5;

export const SENT_STATUS_CONFIG = {
  pending: { label: "Awaiting reply", tone: "bg-secondary text-primary font-semibold" },
  accepted: { label: "Matched", tone: "bg-emerald-50 text-emerald-800 font-semibold" },
  declined: { label: "Not available", tone: "bg-secondary/60 text-muted-foreground" },
  withdrawn: { label: "Withdrawn", tone: "bg-secondary/60 text-muted-foreground" },
} as const;

export const POLL_VISIBLE_MS = 4_000;
export const POLL_HIDDEN_MS = 15_000;

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 1, label: "Basic Info", sublabel: "Essentials" },
  { id: 2, label: "Personal", sublabel: "Background" },
  { id: 3, label: "Education", sublabel: "Career" },
  { id: 4, label: "Family", sublabel: "Traditions" },
  { id: 5, label: "Preferences", sublabel: "Partner" },
];

export const SAMPLE_PROFILES: ProfileCard[] = [
  {
    userId: "sample-ishita",
    fullName: "Ishita Gupta",
    age: 27,
    heightCm: 163,
    maritalStatus: "never_married",
    religion: "Hindu",
    motherTongue: "Hindi",
    city: "Bengaluru",
    state: "Karnataka",
    education: "MBA",
    profession: "Product Manager",
    photoUrl: "/images/profiles/ishita.jpg",
    lastActiveAt: new Date().toISOString(),
  },
  {
    userId: "sample-aarav",
    fullName: "Aarav Sharma",
    age: 29,
    heightCm: 178,
    maritalStatus: "never_married",
    religion: "Hindu",
    motherTongue: "Hindi",
    city: "Bengaluru",
    state: "Karnataka",
    education: "B.Tech",
    profession: "Software Engineer",
    photoUrl: "/images/profiles/aarav.jpg",
    lastActiveAt: new Date().toISOString(),
  },
  {
    userId: "sample-riya",
    fullName: "Riya Mehta",
    age: 26,
    heightCm: 160,
    maritalStatus: "never_married",
    religion: "Hindu",
    motherTongue: "Gujarati",
    city: "Mumbai",
    state: "Maharashtra",
    education: "MBA",
    profession: "Consultant",
    photoUrl: "/images/profiles/riya.jpg",
    lastActiveAt: new Date().toISOString(),
  },
];

export const SAMPLE_PROFILE_DETAILS: Record<string, ProfileDetail> = {
  "sample-ishita": {
    userId: "sample-ishita",
    fullName: "Ishita Gupta",
    age: 27,
    heightCm: 163,
    maritalStatus: "never_married",
    religion: "Hindu",
    community: "Brahmin",
    motherTongue: "Hindi",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    education: "MBA (IIM Bangalore)",
    profession: "Product Manager",
    photoUrl: "/images/profiles/ishita.jpg",
    lastActiveAt: new Date().toISOString(),
    gender: "female",
    about:
      "Warm, family-oriented, and ambitious. Working as a Senior PM at a fintech leader in Bengaluru. I cherish meaningful conversations over chai, exploring classical Indian arts, weekend hikes, and spending quality time with family. Looking for someone grounded, with shared values, intellectual curiosity, and mutual respect.",
    managedBy: "self",
    partnerAgeMin: 27,
    partnerAgeMax: 32,
    relationship: null,
  },
  "sample-aarav": {
    userId: "sample-aarav",
    fullName: "Aarav Sharma",
    age: 29,
    heightCm: 178,
    maritalStatus: "never_married",
    religion: "Hindu",
    community: "Brahmin",
    motherTongue: "Hindi",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    education: "B.Tech (IIT Bombay)",
    profession: "Software Engineer",
    photoUrl: "/images/profiles/aarav.jpg",
    lastActiveAt: new Date().toISOString(),
    gender: "male",
    about:
      "Software architect who enjoys solving hard engineering challenges and exploring Indian indie music on weekends. Deeply respect family values, open communication, and shared laughter. Seeking a partner who is passionate about her career, values traditions, and is ready to embark on life's journey together.",
    managedBy: "self",
    partnerAgeMin: 24,
    partnerAgeMax: 30,
    relationship: null,
  },
  "sample-riya": {
    userId: "sample-riya",
    fullName: "Riya Mehta",
    age: 26,
    heightCm: 160,
    maritalStatus: "never_married",
    religion: "Hindu",
    community: "Vaishya",
    motherTongue: "Gujarati",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    education: "MBA (NMIMS)",
    profession: "Management Consultant",
    photoUrl: "/images/profiles/riya.jpg",
    lastActiveAt: new Date().toISOString(),
    gender: "female",
    about:
      "Based in South Mumbai, passionate about strategy consulting, classical dance, and travel. Believes a successful marriage is built on mutual respect, strong cultural grounding, and continuous encouragement of each other's dreams.",
    managedBy: "parent",
    partnerAgeMin: 26,
    partnerAgeMax: 32,
    relationship: null,
  },
};
