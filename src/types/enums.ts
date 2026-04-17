// All enums serialized as strings from the API

export const SavingTypeMap: Record<string, { label: string; icon: string; color: string }> = {
  FixedDaily: { label: "يومي ثابت", icon: "📅", color: "#0D9E6C" },
  Flexible: { label: "مرن", icon: "🔄", color: "#7C3AED" },
  EventBased: { label: "مناسبة", icon: "🎉", color: "#E5A100" },
  Travel: { label: "سفر", icon: "✈️", color: "#3B82F6" },
  Group: { label: "جماعي", icon: "👥", color: "#0891B2" },
};

export const SavingStatusMap: Record<string, { label: string; color: string; bg: string }> = {
  Active: { label: "نشط", color: "#0D9E6C", bg: "rgba(13,158,108,0.1)" },
  Completed: { label: "مكتمل", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  Paused: { label: "متوقف", color: "#E5A100", bg: "rgba(229,161,0,0.1)" },
  Cancelled: { label: "ملغي", color: "#E5484D", bg: "rgba(229,72,77,0.1)" },
  Archived: { label: "مؤرشف", color: "#64748B", bg: "rgba(100,116,139,0.1)" },
};

export const ContributionTypeMap: Record<string, { label: string; color: string }> = {
  Deposit: { label: "إيداع", color: "#15803d" },
  Withdrawal: { label: "سحب", color: "#DC2626" },
};

export const EventTypeMap: Record<number, { name: string; label: string }> = {
  1: { name: "Birthday", label: "عيد ميلاد" },
  2: { name: "Wedding", label: "زفاف" },
  3: { name: "Holiday", label: "عطلة" },
  4: { name: "Festival", label: "مهرجان" },
  5: { name: "Anniversary", label: "ذكرى سنوية" },
  6: { name: "Graduation", label: "تخرج" },
  7: { name: "Other", label: "أخرى" },
};

export const CurrencyTypeMap: Record<number, { name: string; label: string; symbol: string }> = {
  1: { name: "IQD", label: "دينار عراقي", symbol: "د.ع" },
  2: { name: "USD", label: "دولار", symbol: "$" },
  3: { name: "EUR", label: "يورو", symbol: "€" },
  4: { name: "TRY", label: "ليرة تركية", symbol: "₺" },
  5: { name: "AED", label: "درهم", symbol: "د.إ" },
};

export const NotificationTypeMap: Record<string, { icon: string; label: string }> = {
  AmountAdded: { icon: "💰", label: "تم إضافة مبلغ" },
  AmountWithdrawn: { icon: "💸", label: "تم سحب مبلغ" },
  GoalReached: { icon: "🏆", label: "تم تحقيق الهدف" },
  GoalCreated: { icon: "🎯", label: "تم إنشاء هدف" },
  GroupInvitation: { icon: "👥", label: "دعوة جماعية" },
  GroupMemberJoined: { icon: "👤", label: "انضم عضو جديد" },
  GroupMemberLeft: { icon: "👋", label: "غادر عضو" },
  EventReminder: { icon: "📅", label: "تذكير بمناسبة" },
  TravelPlanCreated: { icon: "✈️", label: "تم إنشاء خطة سفر" },
  MilestoneReached: { icon: "⚡", label: "وصلت إلى مرحلة" },
  GoalFailed: { icon: "❌", label: "فشل الهدف" },
  SystemNotification: { icon: "🔔", label: "إشعار" },
  GoalArchived: { icon: "📦", label: "تم أرشفة الهدف" },
};
