interface TelegramWebApps {
  WebApp: {
    ready(): void;
    expand(): void;
    // Add other methods and properties as needed
  }
}

interface Window {
  Telegram: TelegramWebApps;
}