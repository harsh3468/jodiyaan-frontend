import { getToken, setToken } from "./session";
import type {
  AuthSession,
  BlockedMember,
  InterestStatus,
  InterestView,
  MatchSummary,
  MessageView,
  OwnProfile,
  Paginated,
  ProfileCard,
  ProfileDetail,
  ProfileInput,
  ReportReason,
  SessionUser,
} from "./types";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type Query = Record<string, string | number | boolean | undefined>;

async function request<T>(
  method: string,
  path: string,
  options: { body?: unknown; query?: Query; form?: FormData } = {},
): Promise<T> {
  const url = new URL(API_URL + path);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body:
        options.form ??
        (options.body !== undefined ? JSON.stringify(options.body) : undefined),
    });
  } catch {
    throw new ApiError(
      0,
      "Could not reach Jodiyaan. Check your connection and try again.",
    );
  }

  if (response.status === 401 && token) {
    setToken(null);
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(response.status, errorMessage(data));
  }
  return data as T;
}

function errorMessage(data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message: unknown }).message;
    if (Array.isArray(message)) return message.join(". ");
    if (typeof message === "string") return message;
  }
  return "Something went wrong. Please try again.";
}

export const api = {
  requestOtp: (email: string) =>
    request<{ message: string }>("POST", "/auth/otp/request", {
      body: { email },
    }),
  verifyOtp: (email: string, code: string) =>
    request<AuthSession>("POST", "/auth/otp/verify", {
      body: { email, code },
    }),
  me: () => request<SessionUser>("GET", "/auth/me"),

  myProfile: () => request<OwnProfile>("GET", "/profiles/me"),
  createProfile: (input: ProfileInput) =>
    request<OwnProfile>("POST", "/profiles/me", { body: input }),
  updateProfile: (input: Partial<ProfileInput>) =>
    request<OwnProfile>("PATCH", "/profiles/me", { body: input }),
  uploadPhoto: (file: File) => {
    const form = new FormData();
    form.append("photo", file);
    return request<OwnProfile>("POST", "/profiles/me/photo", { form });
  },
  discover: (query: Query) =>
    request<Paginated<ProfileCard>>("GET", "/profiles/discover", { query }),
  profile: (userId: string) =>
    request<ProfileDetail>("GET", `/profiles/${userId}`),

  sendInterest: (receiverUserId: string, message?: string) =>
    request<{ interest: InterestView; matched: boolean }>(
      "POST",
      "/interests",
      { body: { receiverUserId, message: message || undefined } },
    ),
  receivedInterests: (status?: InterestStatus) =>
    request<Paginated<InterestView>>("GET", "/interests/received", {
      query: { status, limit: 50 },
    }),
  sentInterests: () =>
    request<Paginated<InterestView>>("GET", "/interests/sent", {
      query: { limit: 50 },
    }),
  acceptInterest: (id: string) =>
    request<InterestView>("POST", `/interests/${id}/accept`),
  declineInterest: (id: string) =>
    request<InterestView>("POST", `/interests/${id}/decline`),
  withdrawInterest: (id: string) =>
    request<InterestView>("DELETE", `/interests/${id}`),

  matches: () => request<MatchSummary[]>("GET", "/matches"),
  match: (id: string) =>
    request<{ id: string; matchedAt: string; profile: ProfileCard | null }>(
      "GET",
      `/matches/${id}`,
    ),
  messages: (matchId: string, after?: string) =>
    request<MessageView[]>("GET", `/matches/${matchId}/messages`, {
      query: { after },
    }),
  sendMessage: (matchId: string, body: string) =>
    request<MessageView>("POST", `/matches/${matchId}/messages`, {
      body: { body },
    }),

  blocked: () => request<BlockedMember[]>("GET", "/blocks"),
  block: (userId: string) => request("POST", "/blocks", { body: { userId } }),
  unblock: (userId: string) => request("DELETE", `/blocks/${userId}`),
  report: (userId: string, reason: ReportReason, details?: string) =>
    request<{ message: string }>("POST", "/reports", {
      body: { userId, reason, details: details || undefined },
    }),
};
