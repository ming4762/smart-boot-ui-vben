interface SmartTableMessageHandler {
  error: (message: string) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
}

export { SmartTableMessageHandler };
