import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";

const imageLookupSchema = z.object({
  imageDataUrl: z.string().min(100).max(8_000_000),
});

function readJson(content: unknown) {
  const raw = typeof content === "string" ? content : "";
  const fenced = raw.match(/\{[\s\S]*\}/)?.[0] ?? "{}";
  try {
    return JSON.parse(fenced) as { brand?: string; model?: string; keywords?: string[]; category?: string; confidence?: number; summary?: string };
  } catch {
    return { keywords: [], confidence: 0, summary: "تعذر قراءة الصورة بدقة." };
  }
}

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  productVision: router({
    identify: publicProcedure.input(imageLookupSchema).mutation(async ({ input }) => {
      const response = await invokeLLM({
        model: "gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You inspect retail product photos for a mobile accessories shop. Return JSON only. Do not invent a price, stock quantity, serial number, or product identity if unreadable. Extract visible brand/model/label terms to search a local catalog.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this product photo. Return exactly a JSON object with brand (string), model (string), category (string), keywords (array of up to 8 strings), confidence (integer 0-100), summary (Arabic string). Use empty strings or an empty array if unknown." },
              { type: "image_url", image_url: { url: input.imageDataUrl, detail: "low" } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });
      const output = readJson(response.choices?.[0]?.message?.content);
      return {
        brand: String(output.brand ?? "").slice(0, 80),
        model: String(output.model ?? "").slice(0, 120),
        category: String(output.category ?? "").slice(0, 80),
        keywords: Array.isArray(output.keywords) ? output.keywords.map(String).slice(0, 8) : [],
        confidence: Math.max(0, Math.min(100, Number(output.confidence) || 0)),
        summary: String(output.summary ?? "تعذر التعرّف على تفاصيل واضحة.").slice(0, 240),
      };
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
