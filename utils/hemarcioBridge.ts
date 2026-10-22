import {
  HEMARCIO_INTENTS,
  type HemarcioIntent,
  type HemocioneChatContext,
} from "@hemocione/sdk";

export function isHemarcioIntentId(value: unknown): value is HemarcioIntent {
  return (
    typeof value === "string" &&
    (HEMARCIO_INTENTS as readonly string[]).includes(value)
  );
}

// Path of the Hemarcio page that asks the chat a ready-made question.
export function buildHemarcioPath(
  intent: HemarcioIntent,
  context?: HemocioneChatContext | null,
): string {
  const params = new URLSearchParams({ ask: intent });
  if (context && typeof context === "object") {
    params.set("ctx", JSON.stringify(context));
  }
  return `/hemarcio?${params.toString()}`;
}

type QueryValue = string | null | (string | null)[] | undefined;

// URL of the chat iframe: slug as path, route query forwarded (ask/ctx
// included), session token and iframed flag appended.
export function buildChatUrl(
  baseUrl: string,
  opts: {
    slug?: string | string[];
    query?: Record<string, QueryValue>;
    token?: string | null;
    includeToken?: boolean;
  } = {},
): string {
  const url = new URL(baseUrl);
  const slugPath = Array.isArray(opts.slug)
    ? opts.slug.filter(Boolean).join("/")
    : opts.slug;
  url.pathname = slugPath || "/";
  for (const [key, raw] of Object.entries(opts.query ?? {})) {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (typeof value === "string") url.searchParams.set(key, value);
  }
  url.searchParams.delete("token");
  if (opts.includeToken) url.searchParams.set("token", opts.token ?? "");
  url.searchParams.set("iframed", "true");
  return url.toString();
}

interface ReceiverLike {
  on(type: string, handler: (data: any) => Promise<any>): void;
}

// Registers the two Hemarcio handlers. Origin filtering is done by the
// receiver itself (createIframeReceiver(isHemocioneOrigin)).
export function registerHemarcioHandlers(
  receiver: ReceiverLike,
  navigate: (path: string) => unknown,
) {
  receiver.on("hemocione:hemarcio-capable", async () => ({ capable: true }));
  receiver.on("hemocione:open-hemarcio", async (data) => {
    if (!data || !isHemarcioIntentId(data.intent)) return;
    const context =
      data.context && typeof data.context === "object" ? data.context : null;
    await navigate(buildHemarcioPath(data.intent, context));
  });
}
