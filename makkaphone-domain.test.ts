import { describe, expect, it } from "vitest";
import { marginPercent, parseWalletSms, percentage, walletPresets, walletStatus, type Wallet } from "../lib/makkaphone-domain";

const wallet: Wallet = {
  id: "wallet-1",
  name: "فودافون كاش",
  provider: "فودافون كاش",
  accountIdentifier: "",
  senderPatterns: ["vodafone"],
  smsKeywords: ["الرصيد"],
  balanceAnchors: ["الرصيد"],
  amountAnchors: ["تم شحن"],
  ruleCategory: "اختبار",
  ruleTags: ["محلي"],
  balance: 900,
  maximumBalance: 200000,
  singleTransactionLimit: 60000,
  warningThreshold: 700,
  criticalThreshold: 300,
  dailyLimit: 5000,
  monthlyLimit: 50000,
  dailyUsed: 0,
  monthlyUsed: 0,
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-22T00:00:00.000Z",
  updateSource: "manual",
};

describe("منطق مكة فون التشغيلي", () => {
  it("يحسب نسبة استخدام الحد ويمنع تجاوز 100%", () => {
    expect(percentage(1250, 5000)).toBe(25);
    expect(percentage(6500, 5000)).toBe(100);
  });

  it("يصنف رصيد المحفظة بحسب حدود التحذير والحرج", () => {
    expect(walletStatus(wallet)).toBe("healthy");
    expect(walletStatus({ ...wallet, balance: 650 })).toBe("warning");
    expect(walletStatus({ ...wallet, balance: 200 })).toBe("critical");
    expect(walletStatus({ ...wallet, dailyUsed: 5000 })).toBe("limit");
  });

  it("يحسب هامش الربح من سعر البيع", () => {
    expect(marginPercent(80, 100)).toBe(20);
    expect(marginPercent(0, 100)).toBe(100);
  });

  it("يستخرج مزود المحفظة والرصيد من رسالة عربية بأرقام عربية", () => {
    const result = parseWalletSms("فودافون كاش: تم شحن المحفظة. الرصيد الحالي ١,٢٥٠.٥٠ جنيه");
    expect(result.provider).toBe("فودافون كاش");
    expect(result.balance).toBe(1250.5);
    expect(result.kind).toBe("deposit");
    expect(result.confidence).toBe("high");
  });

  it("يعطي أولوية لقواعد المرسل والكلمات المفتاحية التي يضبطها المتجر", () => {
    const result = parseWalletSms("AXIS-MERCHANT: الرصيد المتاح 5500 جنيه", [{ name: "Axis Pay الرئيسي", senderPatterns: ["axis-merchant"], smsKeywords: ["الرصيد المتاح"], balanceAnchors: ["الرصيد المتاح"], amountAnchors: [] }]);
    expect(result.provider).toBe("Axis Pay الرئيسي");
    expect(result.balance).toBe(5500);
  });

  it("يتعامل بأمان مع رموز خاصة في عبارة الرصيد التي يضيفها المستخدم", () => {
    const result = parseWalletSms("VF: [الرصيد] = 8500 جنيه", [{ name: "فودافون مخصص", senderPatterns: ["vf:"], smsKeywords: ["فودافون"], balanceAnchors: ["[الرصيد]"], amountAnchors: [] }]);
    expect(result.provider).toBe("فودافون مخصص");
    expect(result.balance).toBe(8500);
  });

  it("يوفر القوالب الخمسة المطلوبة مع حد إنستا باي اليومي كقيمة قابلة للتحرير", () => {
    expect(walletPresets.map((preset) => preset.name)).toEqual(expect.arrayContaining(["فودافون كاش", "أورنج كاش", "اتصالات كاش (e& money)", "Axis Pay", "إنستا باي"]));
    expect(walletPresets.find((preset) => preset.name === "إنستا باي")?.dailyLimit).toBe(120000);
    expect(walletPresets.every((preset) => preset.ruleCategory.length > 0 && preset.ruleTags.length > 0)).toBe(true);
  });
});
