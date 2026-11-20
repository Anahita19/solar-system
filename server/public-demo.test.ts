import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

const adminContext: TrpcContext = {
  ...context,
  user: {
    id: 1,
    openId: "demo-admin",
    email: "admin@example.test",
    name: "Demo Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
};

describe("public demo mode", () => {
  it("rejects lead submissions before storage or owner notification", async () => {
    const caller = appRouter.createCaller(context);

    await expect(caller.lead.submit({
      address: "123 Demo Street, Austin, TX",
      buildingType: "Office",
      monthlyBill: 9500,
      systemKw: 516,
      annualSavings: 77520,
      paybackYears: 7,
      name: "Demo Visitor",
      company: "Sample Company",
      role: "Facilities Manager",
      email: "demo@example.test",
      phone: "555-0100",
      consent: true,
      utmSource: "demo-test",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects notification mutations before sending any notification", async () => {
    const caller = appRouter.createCaller(adminContext);

    await expect(caller.system.notifyOwner({
      title: "Demo test",
      content: "This must not notify the owner.",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
