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

const MAX_CONTEXT_LENGTH = 2000;

// null = no context; undefined = invalid (message must be ignored).
export function sanitizeContext(value: unknown): HemocioneChatContext | null | undefined {
  if (value === undefined || value === null) return null;
  if (typeof value !== "object" || Array.isArray(value)) return undefined;
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) return undefined;
  let json: string;
  try {
    json = JSON.stringify(value);
  } catch {
    return undefined;
  }
  if (json.length > MAX_CONTEXT_LENGTH) return undefined;
  return value as HemocioneChatContext;
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
    const context = sanitizeContext(data.context);
    if (context === undefined) return;
    await navigate(buildHemarcioPath(data.intent, context));
  });
}

interface ChatLike {
  ask(intent: HemarcioIntent, context?: HemocioneChatContext): void;
  setToken(token: string | null): void;
  destroy(): void;
}

type CreateChat = (opts: {
  mode: "inline";
  container: HTMLElement;
  chatUrl: string;
  token: string | null;
  context: HemocioneChatContext;
}) => ChatLike;

// Drives the inline Hemarcio chat of the /hemarcio page. The embedded chat
// never reads ?token= from its URL: token and question travel through the
// SDK chat protocol (init / ask).
export function createHemarcioPage(opts: {
  createChat: CreateChat;
  container: HTMLElement;
  chatUrl: string;
  token: string | null;
}) {
  const defaults: HemocioneChatContext = { product: "app", screen: "home" };
  const chat = opts.createChat({
    mode: "inline",
    container: opts.container,
    chatUrl: opts.chatUrl,
    token: opts.token,
    context: defaults,
  });
  return {
    // Returns true when ask/ctx were present (caller strips them from the URL).
    handleQuery(query: Record<string, unknown>): boolean {
      const { ask, ctx } = query;
      if (typeof ask !== "string" || !ask) return false;
      if (!isHemarcioIntentId(ask)) return true;
      let parsed: unknown = null;
      if (typeof ctx === "string" && ctx) {
        try {
          parsed = JSON.parse(ctx);
        } catch {
          return true;
        }
      }
      const clean = sanitizeContext(parsed);
      if (clean === undefined) return true;
      chat.ask(ask, { ...defaults, ...(clean ?? {}) });
      return true;
    },
    setToken(token: string | null) {
      chat.setToken(token);
    },
    destroy() {
      chat.destroy();
    },
  };
}
