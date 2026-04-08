# SavingsApp — Frontend Specification Document

> Complete API and feature reference for building a **mobile-friendly web app** (React / Vite recommended).

---

## 1. Project Overview

**SavingsApp** is a personal savings management platform. Users create saving goals (daily, flexible, event-based, travel, or group), deposit money into them, withdraw when needed, and get real-time notifications on all activity.

**Backend**: ASP.NET Core 8 Web API  
**Base URL (dev)**: `https://localhost:7282`  
**CORS**: AllowAll (any origin)  
**Auth**: None currently — all endpoints use `userId` as a query parameter or in the request body.  
**Hardcoded test user**: Use `userId: 1` (or any seeded user ID in the database).

---

## 2. Global Error Response Format

Every error from the API follows this exact shape:

```json
{
  "error": "Human-readable error message",
  "status": 400,
  "traceId": "0HN..."
}
```

| HTTP Status | Meaning | When |
|---|---|---|
| `400` | Bad Request | Validation failure, invalid input |
| `404` | Not Found | Entity doesn't exist |
| `401` | Unauthorized | (Reserved, not used yet) |
| `409` | Conflict | Duplicate / conflicting state |
| `500` | Internal Server Error | Unhandled exceptions |

**Edge Case**: Some service methods throw generic `Exception` (not custom), which maps to `500`. The frontend should always handle `500` gracefully.

---

## 3. Enum Reference (Integer Values)

All enums are serialized as **integers** in JSON. The frontend must map them to labels/icons.

### SavingType
| Value | Name | Arabic Label | Suggested Icon |
|---|---|---|---|
| `1` | FixedDaily | يومي ثابت | 📅 |
| `2` | Flexible | مرن | 🔄 |
| `3` | EventBased | مناسبة | 🎉 |
| `4` | Travel | سفر | ✈️ |
| `5` | Group | جماعي | 👥 |

### SavingStatus
| Value | Name | Arabic Label | Color Suggestion |
|---|---|---|---|
| `1` | Active | نشط | Green |
| `2` | Completed | مكتمل | Blue |
| `3` | Paused | متوقف | Orange |
| `4` | Cancelled | ملغي | Red |

### ContributionType
| Value | Name | Description |
|---|---|---|
| `1` | Manual | User manually deposits |
| `2` | Suggested | System-suggested amount |
| `3` | Withdraw | Withdrawal transaction |

### EventType
| Value | Name |
|---|---|
| `1` | Birthday |
| `2` | Wedding |
| `3` | Holiday |
| `4` | Festival |
| `5` | Anniversary |
| `6` | Graduation |
| `7` | Other |

### CurrencyType
| Value | Name | Label |
|---|---|---|
| `1` | IQD | دينار عراقي |
| `2` | USD | دولار |
| `3` | EUR | يورو |
| `4` | TRY | ليرة تركية |
| `5` | AED | درهم |

### GroupRole
| Value | Name |
|---|---|
| `1` | Owner |
| `2` | Member |

### NotificationType
| Value | Name | Suggested Icon |
|---|---|---|
| `0` | AmountAdded | 💰 |
| `1` | AmountWithdrawn | 💸 |
| `2` | GoalReached | 🏆 |
| `3` | GoalCreated | 🎯 |
| `4` | GroupInvitation | 👥 |
| `5` | GroupMemberJoined | 👤 |
| `6` | GroupMemberLeft | 👋 |
| `7` | EventReminder | 📅 |
| `8` | TravelPlanCreated | ✈️ |
| `9` | MilestoneReached | ⚡ |
| `10` | GoalFailed | ❌ |
| `11` | SystemNotification | 🔔 |

### NotificationStatus
| Value | Name |
|---|---|
| `0` | Unread |
| `1` | Read |
| `2` | Archived |
| `3` | Dismissed |

---

## 4. API Endpoints — Saving Goals

### 4.1 Create Saving Goal

```
POST /api/saving-goals
```

**Request Body:**
```json
{
  "goalName": "شراء لابتوب",
  "targetAmount": 1500.00,
  "durationDays": 90,
  "savingType": 1,
  "userId": 1
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `goalName` | string | Yes | Non-empty |
| `targetAmount` | decimal | Yes | > 0 |
| `durationDays` | int | Yes | > 0 |
| `savingType` | int | Yes | 1-5 (see SavingType enum) |
| `userId` | int | Yes | Must exist in DB |

**Success Response (201):**
```json
{
  "id": 12,
  "message": "Saving goal created successfully"
}
```

**Side Effects:** Creates a `GoalCreated` notification automatically.

**Edge Cases:**
- `userId` not found → `500` (generic exception)
- `targetAmount <= 0` → `500`
- `savingType` values outside 1-5 are technically accepted by the API but have no label

---

### 4.2 Get All User Goals

```
GET /api/saving-goals?userId=1
```

**Success Response (200):**
```json
[
  {
    "id": 5,
    "goalName": "شراء لابتوب",
    "targetAmount": 1500.00,
    "currentAmount": 350.00,
    "durationDays": 90,
    "savingType": 1,
    "status": 1,
    "createdAt": "2025-03-15T10:30:00Z",
    "progressPercent": 23.33
  }
]
```

**Notes:**
- `progressPercent` is calculated server-side: `(currentAmount / targetAmount) * 100`, rounded to 2 decimals
- Returns empty array `[]` if user has no goals
- `savingType` and `status` are **integers** (enum values)

---

### 4.3 Get Goal Details

```
GET /api/saving-goals/{id}?userId=1
```

**Success Response (200):**
```json
{
  "id": 5,
  "goalName": "شراء لابتوب",
  "targetAmount": 1500.00,
  "currentAmount": 350.00,
  "durationDays": 90,
  "savingType": 1,
  "status": 1,
  "createdAt": "2025-03-15T10:30:00Z",
  "transactions": [
    {
      "id": 10,
      "amount": 100.00,
      "contributionType": 1,
      "createdAt": "2025-03-20T14:00:00Z"
    },
    {
      "id": 11,
      "amount": 50.00,
      "contributionType": 3,
      "createdAt": "2025-03-21T09:00:00Z"
    }
  ]
}
```

**Notes:**
- `transactions` are ordered by `createdAt` descending (newest first)
- `contributionType` is an integer: `1` = Manual deposit, `2` = Suggested, `3` = Withdraw
- `savingType` and `status` are **integers**

**Edge Cases:**
- `userId <= 0` → `400`
- Goal not found → `404`

---

### 4.4 Update Saving Goal

```
PUT /api/saving-goals/{id}
```

**Request Body:**
```json
{
  "userId": 1,
  "goalName": "شراء لابتوب جديد",
  "targetAmount": 2000.00,
  "durationDays": 120
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `userId` | int | Yes | Must match goal owner |
| `goalName` | string | Yes | Non-empty |
| `targetAmount` | decimal | Yes | > 0 |
| `durationDays` | int | Yes | > 0 |

**Success Response (200):**
```json
{
  "message": "Saving goal updated successfully"
}
```

**Business Logic:**
- If a goal was `Completed` but the new `targetAmount` is higher than `currentAmount`, the status is automatically reverted to `Active`.
- `savingType` and `status` cannot be changed via this endpoint.
- `currentAmount` is never modified by this endpoint.

---

## 5. API Endpoints — Transactions (Deposit & Withdraw)

### 5.1 Deposit (Add Transaction)

```
POST /api/saving-transactions
```

**Request Body:**
```json
{
  "savingGoalId": 5,
  "userId": 1,
  "amount": 100.50,
  "contributionType": 1
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `savingGoalId` | int | Yes | Must exist, belong to user |
| `userId` | int | Yes | Must match goal owner |
| `amount` | decimal | Yes | > 0 |
| `contributionType` | int (enum) | Yes | 1 = Manual, 2 = Suggested |

**Success Response (200):**
```json
{
  "message": "Amount added successfully"
}
```

**Business Logic:**
- `currentAmount` increases by `amount`
- If `currentAmount >= targetAmount`, status auto-changes to `Completed`
- Creates `AmountAdded` notification
- If goal completes, also creates `GoalReached` notification

**Edge Cases:**
- Goal status is not `Active` → `500` ("Saving goal is not active")
- `amount <= 0` → `500`
- Goal not found for this user → `500`
- **IMPORTANT**: `contributionType` is an **enum** field (`ContributionType`). The backend expects the enum value. Sending an integer like `1` or `2` works with default System.Text.Json. Sending a string like `"Manual"` will **fail** unless a `JsonStringEnumConverter` is configured (it is NOT configured in the original backend). **Always send integers for this field.**

---

### 5.2 Withdraw

```
POST /api/saving-transactions/withdraw
```

**Request Body:**
```json
{
  "savingGoalId": 5,
  "userId": 1,
  "amount": 50.00
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `savingGoalId` | int | Yes | Must exist, belong to user |
| `userId` | int | Yes | Must match goal owner |
| `amount` | decimal | Yes | > 0, <= currentAmount |

**Success Response (200):**
```json
{
  "message": "Withdraw completed successfully"
}
```

**Business Logic:**
- `currentAmount` decreases by `amount`
- Transaction is created with `contributionType: 3` (Withdraw) automatically
- Creates `AmountWithdrawn` notification

**Edge Cases:**
- `amount > currentAmount` → `500` ("Insufficient balance")
- `amount <= 0` → `500`
- Goal not found → `500`
- **Note**: Withdrawal does NOT check goal status. You can withdraw from a `Completed` goal.

---

## 6. API Endpoints — Notifications

### 6.1 Get User Notifications

```
GET /api/notifications/user/{userId}
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "💰 Amount Added",
    "message": "$100.5 has been added to 'شراء لابتوب'",
    "type": 0,
    "status": 0,
    "relatedEntityId": 5,
    "relatedEntityType": "SavingGoal",
    "createdAt": "2025-03-20T14:00:00Z",
    "readAt": null
  }
]
```

**Notes:**
- `type` is integer (see NotificationType enum)
- `status` is integer (see NotificationStatus enum)
- `readAt` is `null` for unread notifications
- Returns empty array `[]` if no notifications

---

### 6.2 Get Unread Count

```
GET /api/notifications/user/{userId}/unread-count
```

**Success Response (200):**
```json
{
  "unreadCount": 5
}
```

---

### 6.3 Mark as Read

```
PUT /api/notifications/{id}/mark-as-read
```

**Success Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

### 6.4 Mark All as Read

```
PUT /api/notifications/user/{userId}/mark-all-as-read
```

**Success Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

---

### 6.5 Delete Notification

```
DELETE /api/notifications/{id}
```

**Success Response (200):**
```json
{
  "message": "Notification deleted successfully"
}
```

---

### 6.6 Get Notifications by Type

```
GET /api/notifications/user/{userId}/type/{type}
```

Where `{type}` is the integer value from `NotificationType` enum (e.g., `0` for AmountAdded).

**Success Response (200):** Same array format as 6.1.

---

### 6.7 Get Notification by ID

```
GET /api/notifications/{id}
```

**Success Response (200):** Single notification object (same shape as items in 6.1).

---

### 6.8 Update Notification Status

```
PUT /api/notifications/{id}/status
```

**Request Body:**
```json
{
  "status": 1
}
```

Where `status` is the integer from `NotificationStatus` enum.

**Success Response (200):**
```json
{
  "message": "Notification status updated"
}
```

---

### 6.9 Create Notification (Admin/System Use)

```
POST /api/notifications
```

**Request Body:**
```json
{
  "userId": 1,
  "title": "🔔 Custom Alert",
  "message": "This is a custom notification",
  "type": 11,
  "relatedEntityId": null,
  "relatedEntityType": null
}
```

**Success Response (201):**
```json
{
  "id": 15,
  "message": "Notification created successfully"
}
```

---

## 7. API Endpoints — Event Savings

### 7.1 Create Event Saving

```
POST /api/event-saving
```

**Request Body:**
```json
{
  "savingGoalId": 5,
  "userId": 1,
  "eventDate": "2025-06-15T00:00:00Z",
  "eventType": 1
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `savingGoalId` | int | Yes | > 0, goal must exist |
| `userId` | int | Yes | > 0 |
| `eventDate` | DateTime | Yes | — |
| `eventType` | int | Yes | 1-7 (see EventType enum) |

**Success Response (201):**
```json
{
  "id": 3,
  "message": "Event saving created successfully"
}
```

### 7.2 Get Event Saving

```
GET /api/event-saving/{goalId}
```

**Success Response (200):** Returns the `EventSaving` entity object.

### 7.3 Get All Events for Goal

```
GET /api/event-saving/goal/{goalId}/all
```

**Success Response (200):** Array of `EventSaving` objects.

### 7.4 Update Event Saving

```
PUT /api/event-saving/{goalId}
```

**Request Body:** Same as create.

### 7.5 Delete Event Saving

```
DELETE /api/event-saving/{goalId}
```

---

## 8. API Endpoints — Travel Savings

### 8.1 Create Travel Saving

```
POST /api/travel-saving
```

**Request Body:**
```json
{
  "savingGoalId": 5,
  "userId": 1,
  "country": "Turkey",
  "currencyType": 4,
  "equivalentAmount": 25000.00
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `savingGoalId` | int | Yes | > 0, goal must exist |
| `userId` | int | Yes | > 0 |
| `country` | string | Yes | 2-100 characters |
| `currencyType` | int | Yes | 1-5 (see CurrencyType enum) |
| `equivalentAmount` | decimal | Yes | > 0 |

**Success Response (201):**
```json
{
  "id": 2,
  "message": "Travel saving created successfully"
}
```

### 8.2 Get Travel Saving

```
GET /api/travel-saving/{goalId}
```

### 8.3 Update Travel Saving

```
PUT /api/travel-saving/{goalId}
```

**Request Body:** Same as create.

### 8.4 Delete Travel Saving

```
DELETE /api/travel-saving/{goalId}
```

---

## 9. API Endpoints — Group Savings

### 9.1 Create Group Saving

```
POST /api/group-saving
```

**Request Body:**
```json
{
  "savingGoalId": 5,
  "userId": 1
}
```

**Business Logic:**
- Creates the group and automatically adds the `userId` as `Owner` (role = 1)
- Only one group per saving goal

**Success Response (201):**
```json
{
  "id": 2,
  "message": "Group saving created successfully"
}
```

**Edge Cases:**
- Goal not found → `404`
- Group already exists for this goal → `409`

### 9.2 Get Group Saving

```
GET /api/group-saving/{goalId}
```

**Success Response (200):**
```json
{
  "id": 2,
  "savingGoalId": 5,
  "groupMembers": [
    { "id": 1, "groupSavingId": 2, "userId": 1, "role": 1 },
    { "id": 2, "groupSavingId": 2, "userId": 2, "role": 2 }
  ]
}
```

### 9.3 Add Group Member

```
POST /api/group-saving/{goalId}/members
```

**Request Body:**
```json
{
  "userId": 2
}
```

**Business Logic:** Adds user as `Member` (role = 2).

**Edge Cases:**
- Group not found → `404`
- User already in group → `409`

### 9.4 Remove Group Member

```
DELETE /api/group-saving/{goalId}/members/{userId}
```

**Edge Cases:**
- Cannot remove the Owner → `400`
- Member not found → `404`

### 9.5 Delete Group Saving

```
DELETE /api/group-saving/{goalId}
```

---

## 10. Frontend Pages & Features

### 10.1 Recommended Pages

| Page | Route | Description |
|---|---|---|
| **Home / Dashboard** | `/` | Summary cards, total saved, active goals count, recent activity |
| **Goals List** | `/goals` | All saving goals with progress bars, filter by status |
| **Goal Details** | `/goals/:id` | Full details, transaction history, deposit/withdraw actions |
| **Create Goal** | `/goals/new` | Form wizard: basic info → type-specific fields |
| **Notifications** | `/notifications` | List with unread badge, mark as read, delete |

### 10.2 Dashboard Data (Home Page)

Computed from `GET /api/saving-goals?userId=X`:
- **Total Saved**: Sum of all `currentAmount`
- **Active Goals Count**: Count where `status === 1`
- **Completed Goals**: Count where `status === 2`
- **Overall Progress**: Average of all `progressPercent`
- **Recent Activity**: Use notifications endpoint

### 10.3 Goal Creation Wizard

**Step 1 — Basic Info** (all types):
- Goal name, target amount, duration days, saving type selector

**Step 2 — Type-specific** (conditional based on `savingType`):
- **FixedDaily (1)**: No extra fields. Daily amount = `targetAmount / durationDays`
- **Flexible (2)**: No extra fields
- **EventBased (3)**: Show event type selector + event date picker → calls `POST /api/event-saving` after goal creation
- **Travel (4)**: Show country input + currency selector + equivalent amount → calls `POST /api/travel-saving` after goal creation
- **Group (5)**: After goal creation → calls `POST /api/group-saving`, then allow adding members

### 10.4 Deposit Modal

Fields needed:
- **Amount input** (decimal, > 0)
- **Contribution type**: Send as integer. Use `1` (Manual) for user-initiated deposits, `2` (Suggested) if showing a recommended amount

Submit: `POST /api/saving-transactions`

**Edge case**: If goal becomes `Completed` after deposit, show a celebration UI. Check if `currentAmount >= targetAmount` in the response goal data after refreshing.

### 10.5 Withdraw Modal

Fields needed:
- **Amount input** (decimal, > 0, max = goal's `currentAmount`)
- Show current balance prominently
- If `currentAmount === 0`, disable form and show empty state message

Submit: `POST /api/saving-transactions/withdraw`

### 10.6 Notifications

- Poll `GET /api/notifications/user/{userId}/unread-count` every 30 seconds for badge count
- Use `GET /api/notifications/user/{userId}` for full list
- Swipe-to-dismiss (mobile) → `DELETE /api/notifications/{id}`
- Tap notification → `PUT /api/notifications/{id}/mark-as-read`, navigate to related goal if `relatedEntityType === "SavingGoal"`

---

## 11. Important Edge Cases & Notes

### 11.1 Enum Serialization
- **All enums in responses are integers** (no string converter is configured)
- `SavingType` and `SavingStatus` in goal responses are integer values
- `ContributionType` in the deposit request is an **enum type** — send integer values (`1`, `2`). **Do NOT send strings** like `"Manual"` — it will cause a deserialization error and 400 response.

### 11.2 No Authentication
- All endpoints trust the `userId` parameter. The frontend should store a single `USER_ID` constant.
- No JWT tokens or session cookies needed.

### 11.3 Automatic Notifications
These are created server-side automatically (never create them from frontend):
- `GoalCreated` — when a goal is created
- `AmountAdded` — on every deposit
- `AmountWithdrawn` — on every withdrawal
- `GoalReached` — when deposit causes completion

### 11.4 Status Transitions
```
Active (1) ──deposit──> Completed (2)  [automatic when currentAmount >= targetAmount]
Completed (2) ──update goal (higher target)──> Active (1)  [automatic reactivation]
```
`Paused (3)` and `Cancelled (4)` exist in the enum but are **not set by any API endpoint** currently. They are for future use.

### 11.5 Withdraw Doesn't Check Status
A withdrawal can happen even on a `Completed` goal. After withdrawal, if `currentAmount < targetAmount`, the status remains `Completed` (it does NOT revert to Active). Only the Update Goal endpoint can reactivate.

### 11.6 Progress Calculation
- `progressPercent` is only included in the list endpoint response (`GET /api/saving-goals`)
- It is NOT in the details endpoint. Calculate it client-side: `Math.round((currentAmount / targetAmount) * 100 * 100) / 100`
- If `targetAmount === 0`, `progressPercent` is `0` (server handles division by zero)

### 11.7 Transaction History
- Transactions are only available in the **Goal Details** endpoint response
- There is no standalone "get all transactions" endpoint
- `contributionType: 3` in a transaction means it was a withdrawal

### 11.8 Dates
- All dates from the API are in **UTC** (`DateTime.UtcNow`)
- Format: ISO 8601 (`"2025-03-15T10:30:00Z"`)
- Display in local time using `new Date(dateString).toLocaleString("ar-IQ")`

### 11.9 Currency / Amounts
- All amounts are `decimal` — the API returns them as JSON numbers (e.g., `1500.00`)
- Display with 2 decimal places and Arabic locale: `amount.toLocaleString("ar-IQ")`
- Currency symbol: Use `د.إ` (or configurable per user)

---

## 12. Suggested Tech Stack

| Layer | Recommendation |
|---|---|
| Framework | React 18+ with Vite |
| Routing | React Router v6 |
| State | React Context + useReducer (or Zustand) |
| HTTP | Native `fetch` wrapper (see API service pattern below) |
| Styling | Tailwind CSS or inline styles (dark theme) |
| Icons | Emoji-based (as seen in notifications) |
| Language | Arabic (RTL layout) |

### Suggested API Service Pattern

```javascript
const BASE_URL = "https://localhost:7282";
const USER_ID = 1;

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, error: data.error };
  return data;
}

// Usage examples:
const goals = await apiFetch(`/api/saving-goals?userId=${USER_ID}`);
const details = await apiFetch(`/api/saving-goals/5?userId=${USER_ID}`);
await apiFetch("/api/saving-transactions", {
  method: "POST",
  body: JSON.stringify({ savingGoalId: 5, userId: USER_ID, amount: 100, contributionType: 1 }),
});
```

---

## 13. Mobile-Friendly Design Guidelines

- **RTL layout**: Use `dir="rtl"` on root element
- **Touch targets**: Minimum 44×44px for all interactive elements
- **Bottom navigation**: Home, Goals, Add (+), Notifications, Profile
- **Cards**: Use rounded corners (12-20px), subtle shadows, dark theme (`#0f172a` / `#1e293b` backgrounds)
- **Pull to refresh**: On goals list and notifications
- **Swipe actions**: Swipe left on notifications to delete
- **Empty states**: Show helpful illustrations when no goals / no notifications
- **Loading states**: Skeleton screens, not spinners
- **Toast notifications**: Bottom of screen, auto-dismiss after 3 seconds
- **Progress bars**: Animated, color-coded by percentage (red < 25%, orange < 50%, green ≥ 50%)
