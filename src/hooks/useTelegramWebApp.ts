import { useEffect, useState } from "react";

export function getTelegramWebApp(): any {
  return (window as any)?.Telegram?.WebApp;
}

export function getTelegramUserAgent(): any {
  console.log(getTelegramWebApp()?.initDataUnsafe?.user);
  return getTelegramWebApp()?.initDataUnsafe?.user;
}

export function closeTelegramWebApp() {
  getTelegramWebApp()?.close();
}


export function useTelegramWebApp() {
  const [telegramUser, setTelegramUser] = useState(null);

  useEffect(() => {
    setTelegramUser(getTelegramUserAgent());
  }, []);

  return {
    telegramUser
  }
}