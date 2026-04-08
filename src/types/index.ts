// ── Saving Goal ──
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

// ── Auth ──
export interface AuthUser {
  id: number;
  fullName: string;
  phoneNumber: string;
}

// ── API Error ──
export interface ApiError {
  error: string;
  status: number;
  traceId?: string;
}

// ── Request DTOs ──
export interface CreateGoalRequest {
  goalName: string;
  targetAmount: number;
  durationDays: number;
  savingType: string;
  userId: number;
}

export interface UpdateGoalRequest {
  userId: number;
  goalName: string;
  targetAmount: number;
  durationDays: number;
}

export interface DepositRequest {
  savingGoalId: number;
  userId: number;
  amount: number;
  contributionType: string;
}

export interface WithdrawRequest {
  savingGoalId: number;
  userId: number;
  amount: number;
}

export interface CreateEventSavingRequest {
  savingGoalId: number;
  userId: number;
  eventDate: string;
  eventType: number;
}

export interface CreateTravelSavingRequest {
  savingGoalId: number;
  userId: number;
  country: string;
  currencyType: number;
  equivalentAmount: number;
}
