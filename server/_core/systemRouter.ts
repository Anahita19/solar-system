import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { IS_PUBLIC_DEMO } from "@shared/site-mode";
import { TRPCError } from "@trpc/server";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      if (IS_PUBLIC_DEMO) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Owner notifications are disabled in public demo mode.",
        });
      }
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),
});
