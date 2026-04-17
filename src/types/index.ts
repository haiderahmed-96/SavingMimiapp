// ── Paging ──
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ── Saving Goal ──
// status values: "Active" | "Completed" | "Paused" | "Cancelled" | "Archived"
export interface SavingGoal {
  id: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  durationDays: number;
  savingType: string;
  status: string;
  createdAt: string;
  progressPercent?: number;
}

export interface Transaction {
  id: number;
  amount: number;
  contributionType: string;
  createdAt: string;
}

export interface GoalDetails extends SavingGoal {
  transactions: Transaction[];
}

export interface UserSummary {
  totalSaved: number;
  activeGoals: number;
  completedGoals: number;
  totalGoals: number;
  archivedGoals?: number;
}

// ── Event Saving ──
export interface EventSaving {
  id: number;
  savingGoalId: number;
  userId: number;
  eventDate: string;
  eventType: number;
}

// ── Travel Saving ──
export interface TravelSaving {
  id: number;
  savingGoalId: number;
  userId: number;
  country: string;
  currencyType: number;
  equivalentAmount: number;
}

// ── Group Saving ──
export interface GroupMember {
  id: number;
  groupSavingId: number;
  userId: number;
  role: number;
}

export interface GroupSaving {
  id: number;
  savingGoalId: number;
  groupMembers: GroupMember[];
}

// ── Notification ──
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  status: string;
  relatedEntityId: number | null;
  relatedEntityType: string | null;
  createdAt: string;
  readAt: string | null;
}

// ── Payment Method ──
// cardNumber is always masked by the server (e.g. "****1234").
export interface PaymentMethod {
  id: number;
  userId: number;
  cardNumber: string;
  cardType: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
}

// ── Auth ──
export interface AuthUser {
  id: number;
  fullName: string;
  phoneNumber: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface UserLoginResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ── API Error ──
export interface ApiError {
  error: string;
  status: number;
  traceId?: string;
}

// ── Request DTOs (UserId is NEVER sent — server derives it from JWT) ──
export interface CreateGoalRequest {
  goalName: string;
  targetAmount: number;
  durationDays: number;
  savingType: string;
}

export interface UpdateGoalRequest {
  goalName: string;
  targetAmount: number;
  durationDays: number;
}

export interface DepositRequest {
  savingGoalId: number;
  amount: number;
  contributionType: string;
}

export interface WithdrawRequest {
  savingGoalId: number;
  amount: number;
}

export interface CreateEventSavingRequest {
  savingGoalId: number;
  eventDate: string;
  eventType: number;
}

export interface CreateTravelSavingRequest {
  savingGoalId: number;
  country: string;
  currencyType: number;
  equivalentAmount: number;
}
