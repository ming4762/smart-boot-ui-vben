interface SmartTableMessageHandler {
  confirm: (options: Record<string, any>) => void;
  error: (message: string) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
}

export type { SmartTableMessageHandler };
