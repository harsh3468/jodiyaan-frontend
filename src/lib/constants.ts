import type {
  DiscoverFilters,
  FooterColumn,
  OnboardingStep,
  ProfileForOption,
  StoryCard,
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

export const JOURNEY_HERO_CONTENT = {
  eyebrow: "Begin Your Journey",
  title: "Let's find your life partner",
  subtitle:
    "Tell us who you're looking for to begin your personalized introduction.",
  submitButtonText: "Begin Your Journey",
  exploreButtonText: "Or browse verified profiles first",
  trustNote: "100% Verified Profiles · Strict Privacy · Respectful Introductions",
} as const;

export const PROFILE_FOR_OPTIONS: ProfileForOption[] = [
  { value: "self", label: "Myself" },
  { value: "parent", label: "My Son / Daughter" },
  { value: "sibling", label: "My Brother / Sister" },
  { value: "relative", label: "A Relative / Friend" },
];

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

export const ABOUT_CONTENT = {
  badge: "About",
  title: "Made for families who still believe in introductions",
  description:
    "Jodiyaan is a matrimonial for people who want a serious conversation, not a swipe. You create an account with an email code, share what matters, and chat only after both sides accept an interest.",
} as const;

export const STORIES_SECTION = {
  badge: "Success stories",
  title: "Conversations that became introductions",
  subtitle:
    "Sample stories that show the pace we want: a match, a careful chat, then the families.",
} as const;

export const SUCCESS_STORIES: StoryCard[] = [
  {
    names: "Meera & Kabir",
    place: "Pune",
    quote:
      "We wrote for two weeks before our families met. The slow start made the first visit feel easy.",
  },
  {
    names: "Ananya & Rohan",
    place: "Bengaluru",
    quote:
      "Same city, same values, and a conversation that began with work and ended with Sunday lunch plans.",
  },
  {
    names: "Sana & Imran",
    place: "Hyderabad",
    quote:
      "Our parents sent the interest. We took the chat from there, and both families stayed in the loop.",
  },
];

export const MEMBERSHIP_BANNER = {
  badge: "Membership",
  title: "Create an account. Chat only after you both say yes.",
  description:
    "Sign-in is a one-time email code. The first account creates your profile, and messages open only on a mutual match.",
  cta: "Create your account",
  href: "/login?intent=onboarding",
  points: ["Email code, no password", "Interest before chat", "You choose who can see you"],
} as const;

export const FOOTER_NOTE =
  "Jodiyaan · Modern Indian matrimonial · Sachi jodiyaan, sache log.";

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Start",
    links: [
      { href: "/login?intent=onboarding", label: "Create account" },
      { href: "/login", label: "Log in" },
      { href: "/discover", label: "Find matches" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/#stories", label: "Success stories" },
      { href: "/#membership", label: "Membership" },
      { href: "/#about", label: "About" },
    ],
  },
];

export const CHAT_SAFETY_NOTE =
  "For your safety, never send money or share bank, OTP, or identity details in chat.";

export const CHAT_COMPOSER_HINT = "Enter to send. Shift+Enter for a new line.";

export const CHAT_STATUS = {
  seen: "Seen",
  sent: "Sent",
} as const;

export const CHAT_STARTERS = [
  "Namaste! Glad we matched.",
  "What does a relaxed Sunday look like for you?",
  "What matters most to you in a partner?",
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

export const ANNUAL_INCOME_OPTIONS = [
  "Under ₹5 LPA",
  "₹5–10 LPA",
  "₹10–15 LPA",
  "₹15–20 LPA",
  "₹20–30 LPA",
  "₹30–50 LPA",
  "₹50–75 LPA",
  "₹75 LPA and above",
] as const;

export const PROFILE_TEXT_FIELDS = [
  "fullName",
  "religion",
  "community",
  "motherTongue",
  "city",
  "state",
  "education",
  "profession",
  "annualIncome",
  "about",
] as const;

export const EMPTY_DISCOVER_FILTERS: DiscoverFilters = {
  ageMin: "",
  ageMax: "",
  city: "",
  religion: "",
  community: "",
  education: "",
};

export const DISCOVER_PAGE_SIZE = 12;

export const PHOTO_MAX_MB = 5;

export const PROFILE_FACT_LABELS = {
  profession: "Profession",
  salary: "Salary",
  education: "Education",
  caste: "Caste",
  religion: "Religion",
  motherTongue: "Mother tongue",
  maritalStatus: "Marital status",
  height: "Height",
  livesIn: "Lives in",
  gender: "Gender",
  managedBy: "Profile for",
  lookingFor: "Looking for",
} as const;

export const SWIPE_ACCEPT_PX = 110;

export const INTERESTS_COPY = {
  title: "Interests",
  subtitle: "People who want to begin a conversation with you.",
  received: "Received",
  sent: "Sent",
  emptyReceivedTitle: "No new interests yet",
  emptyReceivedBody:
    "When someone likes your profile, their card will appear here.",
  emptySentTitle: "You haven’t sent any",
  emptySentLink: "Find someone on Discover",
  swipeHint: "Swipe the photo right to accept, left to pass.",
  accept: "Accept",
  pass: "Pass",
  caughtUp: "You’ve seen every new interest.",
  theyWrote: "They wrote",
  about: "About",
  fullProfile: "Full profile",
  accepted: "Accepted",
  sendMessage: "Send message",
  viewProfile: "View profile",
  withdraw: "Withdraw",
  queueOne: "1 new interest",
  queueMany: "new interests",
} as const;

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
