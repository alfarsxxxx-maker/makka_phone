export type WalletOperationKind = "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "fee" | "adjustment";

export type Wallet = {
  id: string;
  name: string;
  provider: string;
  accountIdentifier?: string;
  senderPatterns: string[];
  smsKeywords: string[];
  balanceAnchors: string[];
  amountAnchors: string[];
  ruleCategory: string;
  ruleTags: string[];
  balance: number;
  maximumBalance: number;
  singleTransactionLimit: number;
  warningThreshold: number;
  criticalThreshold: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
  createdAt: string;
  updatedAt: string;
  updateSource: "manual" | "sms";
};

export type WalletOperation = {
  id: string;
  walletId: string;
  kind: WalletOperationKind;
  amount: number;
  occurredAt: string;
  note?: string;
  source: "manual" | "sms";
};

export type Product = {
  id: string;
  name: string;
  sku?: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  costPrice: number;
  salePrice: number;
  photoUri?: string;
  createdAt: string;
  updatedAt: string;
};

export type Sale = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  occurredAt: string;
};

export type AppSettings = {
  currency: string;
  notificationsEnabled: boolean;
  smsImportEnabled: boolean;
  minimumMargin: number;
  shopName: string;
  presetWalletsSeeded: boolean;
  lastRulesBackupAt?: string;
  lastRulesBackupFilename?: string;
};

export const defaultBalanceAnchors = ["الرصيد", "رصيدك", "الرصيد الحالي", "المتاح", "balance", "available"];
export const defaultAmountAnchors = ["تم شحن", "تم سحب", "تم تحويل", "قيمة العملية", "المبلغ", "amount"];

export type WalletPreset = Pick<Wallet, "name" | "provider" | "senderPatterns" | "smsKeywords" | "balanceAnchors" | "amountAnchors" | "ruleCategory" | "ruleTags" | "maximumBalance" | "singleTransactionLimit" | "warningThreshold" | "criticalThreshold" | "dailyLimit" | "monthlyLimit"> & { sourceNote: string };

export const walletPresets: WalletPreset[] = [
  {
    name: "فودافون كاش", provider: "فودافون كاش", senderPatterns: ["vodafone", "vf cash", "فودافون"], smsKeywords: ["فودافون كاش", "vodafone cash", "الرصيد"], balanceAnchors: defaultBalanceAnchors, amountAnchors: defaultAmountAnchors, ruleCategory: "محافظ شركات الاتصالات", ruleTags: ["قالب مبدئي", "مصر"], maximumBalance: 200000, singleTransactionLimit: 60000, dailyLimit: 60000, monthlyLimit: 200000, warningThreshold: 5000, criticalThreshold: 1500,
    sourceNote: "مرجع أولي قابل للتعديل — الحد اليومي/الشهري والسعة منشورة لدى فودافون مصر.",
  },
  {
    name: "أورنج كاش", provider: "أورنج كاش", senderPatterns: ["orange", "orange cash", "اورنج"], smsKeywords: ["أورنج كاش", "اورنج كاش", "orange cash", "الرصيد"], balanceAnchors: defaultBalanceAnchors, amountAnchors: defaultAmountAnchors, ruleCategory: "محافظ شركات الاتصالات", ruleTags: ["قالب مبدئي", "مصر"], maximumBalance: 200000, singleTransactionLimit: 60000, dailyLimit: 60000, monthlyLimit: 200000, warningThreshold: 5000, criticalThreshold: 1500,
    sourceNote: "مرجع أولي لحساب فردي؛ أورنج تنشر حدودًا مختلفة للشركات ويمكن تعديلها هنا.",
  },
  {
    name: "اتصالات كاش (e& money)", provider: "اتصالات كاش", senderPatterns: ["etisalat", "e& money", "eand"], smsKeywords: ["اتصالات كاش", "e& money", "etisalat cash", "الرصيد"], balanceAnchors: defaultBalanceAnchors, amountAnchors: defaultAmountAnchors, ruleCategory: "محافظ شركات الاتصالات", ruleTags: ["قالب مبدئي", "مصر"], maximumBalance: 0, singleTransactionLimit: 0, dailyLimit: 0, monthlyLimit: 0, warningThreshold: 5000, criticalThreshold: 1500,
    sourceNote: "لا تُثبت حدود تشغيلية افتراضية؛ أدخلها حسب نوع محفظتك وتعليمات المزود.",
  },
  {
    name: "Axis Pay", provider: "Axis Pay", senderPatterns: ["axis", "axis pay", "أكسس"], smsKeywords: ["axis", "axis pay", "أكسس", "الرصيد"], balanceAnchors: defaultBalanceAnchors, amountAnchors: defaultAmountAnchors, ruleCategory: "محافظ رقمية", ruleTags: ["قالب مبدئي", "مصر"], maximumBalance: 0, singleTransactionLimit: 0, dailyLimit: 0, monthlyLimit: 0, warningThreshold: 5000, criticalThreshold: 1500,
    sourceNote: "لا تُثبت حدود تشغيلية افتراضية لعدم نشر جدول حدود عام في المصدر المتاح؛ اضبطها محليًا.",
  },
  {
    name: "إنستا باي", provider: "إنستا باي", senderPatterns: ["instapay", "insta pay", "انستا باي"], smsKeywords: ["instapay", "انستا باي", "تحويل", "الرصيد"], balanceAnchors: defaultBalanceAnchors, amountAnchors: defaultAmountAnchors, ruleCategory: "مدفوعات لحظية", ruleTags: ["قالب مبدئي", "مصر"], maximumBalance: 0, singleTransactionLimit: 70000, dailyLimit: 120000, monthlyLimit: 400000, warningThreshold: 5000, criticalThreshold: 1500,
    sourceNote: "مرجع أولي لحدود إنستا باي؛ ليس للمحفظة سعة مستقلة لأن الرصيد تابع للحساب المرتبط.",
  },
];

export type WalletStatus = "healthy" | "warning" | "critical" | "limit";

export function formatCurrency(value: number, currency = "ج.م"): string {
  return new Intl.NumberFormat("ar-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ` ${currency}`;
}

export function percentage(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export function walletStatus(wallet: Wallet): WalletStatus {
  if ((wallet.dailyLimit > 0 && wallet.dailyUsed >= wallet.dailyLimit) || (wallet.monthlyLimit > 0 && wallet.monthlyUsed >= wallet.monthlyLimit)) {
    return "limit";
  }
  if (wallet.balance <= wallet.criticalThreshold) return "critical";
  if (wallet.balance <= wallet.warningThreshold) return "warning";
  return "healthy";
}

export function walletStatusLabel(status: WalletStatus): string {
  return { healthy: "طبيعي", warning: "تحتاج متابعة", critical: "رصيد حرج", limit: "تم بلوغ الحد" }[status];
}

export function marginPercent(costPrice: number, salePrice: number): number {
  if (salePrice <= 0) return 0;
  return Math.round(((salePrice - costPrice) / salePrice) * 100);
}

export function normalizeArabicDigits(text: string): string {
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  return text
    .replace(/[٠-٩]/g, (digit) => String(arabic.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(persian.indexOf(digit)));
}

export type SmsWalletSuggestion = {
  provider?: string;
  balance?: number;
  amount?: number;
  kind?: WalletOperationKind;
  confidence: "high" | "medium" | "low";
};

const providerKeywords: Array<[string, string[]]> = [
  ["فودافون كاش", ["vodafone cash", "فودافون كاش"]],
  ["أورانج موني", ["orange money", "اورانج موني", "أورانج موني"]],
  ["اتصالات كاش", ["etisalat cash", "اتصالات كاش", "e& cash"]],
  ["WE Pay", ["we pay", "وي باي", "wepay"]],
  ["فوري", ["fawry", "فوري"]],
  ["Axis Pay", ["axis pay", "axis", "أكسس"]],
  ["إنستا باي", ["instapay", "insta pay", "انستا باي"]],
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function amountAfter(text: string, anchors: string[]): number | undefined {
  for (const anchor of anchors) {
    const cleanAnchor = anchor.trim();
    if (!cleanAnchor) continue;
    const match = text.match(new RegExp(`${escapeRegExp(cleanAnchor)}[^0-9]{0,24}([0-9][0-9,]*(?:\\.[0-9]{1,2})?)`, "i"));
    if (match?.[1]) {
      const value = Number(match[1].replace(/,/g, ""));
      if (Number.isFinite(value)) return value;
    }
  }
  return undefined;
}

export function parseWalletSms(message: string, walletRules: Pick<Wallet, "name" | "senderPatterns" | "smsKeywords" | "balanceAnchors" | "amountAnchors">[] = []): SmsWalletSuggestion {
  const normalized = normalizeArabicDigits(message).replace(/،/g, ",");
  const lower = normalized.toLowerCase();
  const configured = walletRules.find((wallet) => [...wallet.senderPatterns, ...wallet.smsKeywords].some((keyword) => keyword.trim().length > 1 && lower.includes(keyword.trim().toLowerCase())));
  const provider = configured?.name ?? providerKeywords.find(([, keywords]) => keywords.some((keyword) => lower.includes(keyword)))?.[0];
  const balance = amountAfter(lower, configured?.balanceAnchors?.length ? configured.balanceAnchors : defaultBalanceAnchors);
  const amount = amountAfter(lower, configured?.amountAnchors?.length ? configured.amountAnchors : defaultAmountAnchors);
  let kind: WalletOperationKind | undefined;
  if (/شحن|إيداع|تحويل وارد|استقبال|received/.test(lower)) kind = "deposit";
  if (/سحب|خصم|تحويل صادر|تم الدفع|withdraw/.test(lower)) kind = "withdrawal";
  const confidence = provider && balance !== undefined ? "high" : balance !== undefined || amount !== undefined ? "medium" : "low";
  return { provider, balance, amount, kind, confidence };
}
