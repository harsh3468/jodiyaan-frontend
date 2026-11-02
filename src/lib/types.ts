export type Gender = "male" | "female";
export type MaritalStatus =
  | "never_married"
  | "divorced"
  | "widowed"
  | "awaiting_divorce";
export type ManagedBy = "self" | "parent" | "sibling" | "relative" | "friend";
export type InterestStatus = "pending" | "accepted" | "declined" | "withdrawn";
export type InterestDirection = "sent" | "received";
export type ReportReason =
  | "fake_profile"
  | "inappropriate_content"
  | "harassment"
  | "scam"
  | "already_married"
  | "other";

export interface SessionUser {
  id: string;
  email: string;
  role: "user" | "admin";
  hasProfile: boolean;
}

export interface AuthSession {
  accessToken: string;
  user: SessionUser;
}

export interface ProfileCard {
  userId: string;
  fullName: string;
  age: number;
  heightCm: number | null;
  maritalStatus: MaritalStatus;
  religion: string | null;
  motherTongue: string | null;
  city: string;
  state: string | null;
  education: string | null;
  profession: string | null;
  photoUrl: string | null;
  lastActiveAt: string | null;
}

export interface ProfileRelationship {
  interestId: string;
  status: InterestStatus;
  direction: InterestDirection;
}

export interface ProfileDetail extends ProfileCard {
  gender: Gender;
  community: string | null;
  country: string;
  about: string | null;
  managedBy: ManagedBy;
  partnerAgeMin: number | null;
  partnerAgeMax: number | null;
  relationship: ProfileRelationship | null;
}

export interface OwnProfile extends Omit<ProfileDetail, "relationship"> {
  dateOfBirth: string;
  isVisible: boolean;
}

export interface ProfileInput {
  fullName: string;
  gender: Gender;
  dateOfBirth: string;
  heightCm?: number;
  maritalStatus?: MaritalStatus;
  religion?: string;
  community?: string;
  motherTongue?: string;
  city: string;
  state?: string;
  education?: string;
  profession?: string;
  about?: string;
  managedBy?: ManagedBy;
  partnerAgeMin?: number;
  partnerAgeMax?: number;
  isVisible?: boolean;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface InterestView {
  id: string;
  status: InterestStatus;
  direction: InterestDirection;
  message: string | null;
  createdAt: string;
  respondedAt: string | null;
  profile: ProfileCard | null;
}

export interface MessageView {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  mine: boolean;
}

export interface MatchSummary {
  id: string;
  matchedAt: string;
  profile: ProfileCard | null;
  lastMessage: Pick<MessageView, "body" | "senderId" | "createdAt"> | null;
  unreadCount: number;
}

export interface BlockedMember {
  userId: string;
  fullName: string;
  photoUrl: string | null;
  blockedAt: string;
}

export interface ProfileFormState {
  fullName: string;
  gender: Gender | "";
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  managedBy: ManagedBy;
  heightCm: string;
  religion: string;
  community: string;
  motherTongue: string;
  city: string;
  state: string;
  education: string;
  profession: string;
  about: string;
  partnerAgeMin: string;
  partnerAgeMax: string;
}

export interface ProfileFormProps {
  profile?: OwnProfile;
  submitLabel: string;
  onSubmit: (input: ProfileInput) => Promise<void>;
}

export interface DiscoverFilters {
  ageMin: string;
  ageMax: string;
  city: string;
  religion: string;
}

export type InterestTab = "received" | "sent";
