import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ownerProcedure, publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { leads } from "../drizzle/schema";
import { z } from "zod";
import { desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { IS_PUBLIC_DEMO } from "@shared/site-mode";

const leadInput = z.object({
  address: z.string().min(5).max(500), buildingType: z.string().min(2).max(100), monthlyBill: z.number().min(100).max(10000000),
  systemKw: z.number().positive(), annualSavings: z.number().positive(), paybackYears: z.number().positive(),
  name: z.string().min(2).max(200), company: z.string().min(2).max(200), role: z.string().min(2).max(160),
  email: z.string().email().max(320), phone: z.string().min(7).max(50), consent: z.literal(true),
  utmSource: z.string().max(255).optional(), utmMedium: z.string().max(255).optional(), utmCampaign: z.string().max(255).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    isOwner: publicProcedure.query(({ ctx }) => {
      if (!ctx.user) return false;
      const email = ctx.user.email?.trim().toLowerCase() ?? "";
      return Boolean((ENV.ownerEmail && email === ENV.ownerEmail) || (ENV.ownerOpenId && ctx.user.openId === ENV.ownerOpenId));
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  lead: router({
    submit: publicProcedure.input(leadInput).mutation(async ({ input }) => {
      if (IS_PUBLIC_DEMO) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Lead submissions are disabled in public demo mode.",
        });
      }
      const db = await getDb();
      if (!db) throw new Error("Lead storage is temporarily unavailable. Please try again.");
      await db.insert(leads).values({ ...input, monthlyBill: String(input.monthlyBill), systemKw: String(input.systemKw), annualSavings: String(input.annualSavings), paybackYears: String(input.paybackYears), consent: 1 });
      const title = `New Solace site assessment request — ${input.company}`;
      const content = `${input.name} (${input.role}) at ${input.company}\n${input.email} · ${input.phone}\nProperty: ${input.address}\n${input.buildingType} · $${input.monthlyBill.toLocaleString()}/mo\nEstimate: ${input.systemKw} kW · $${Math.round(input.annualSavings).toLocaleString()}/yr · ${input.paybackYears} yr payback\nUTM: ${input.utmSource ?? "direct"} / ${input.utmMedium ?? "—"} / ${input.utmCampaign ?? "—"}`;
      try {
        const base = process.env.MANUS_API_URL;
        const key = process.env.MANUS_API_KEY;
        if (base && key) { const response = await fetch(`${base}/webdevtoken.v1.WebDevService/SendNotification`, { method: "POST", headers: { "Content-Type": "application/json", "connect-protocol-version": "1", Authorization: `Bearer ${key}` }, body: JSON.stringify({ title, content }) }); if (!response.ok) console.error("Owner notification rejected:", response.status, (await response.text()).slice(0, 800)); }
      } catch (e) { console.error("Owner notification failed:", e); }
      return { success: true };
    }),
    adminList: ownerProcedure.query(async () => {
      if (IS_PUBLIC_DEMO) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Lead management is disabled in public demo mode.",
        });
      }
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      return db.select().from(leads).orderBy(desc(leads.createdAt));
    }),
  }),
});

export type AppRouter = typeof appRouter;
