export const APP_NAME = "Jodiyaan";
export const TAGLINE = "Find your life partner";
export const SUBTAGLINE =
  "A modern platform rooted in Indian values, culture and family — made for meaningful introductions.";

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
    body: "Trust at every step.",
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

export const EMPTY_DISCOVER_FILTERS = {
  ageMin: "",
  ageMax: "",
  city: "",
  religion: "",
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
