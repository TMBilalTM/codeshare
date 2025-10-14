// Keep-alive mekanizması
// Not: Production'da UptimeRobot kullanılması önerilir

let keepAliveInterval: NodeJS.Timeout | null = null;

export function startKeepAlive() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_URL) {
    // Her 5 dakikada bir kendi API'sine ping at
    keepAliveInterval = setInterval(async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/health`);
        console.log('✅ Keep-alive ping sent');
      } catch (error) {
        console.error('❌ Keep-alive ping failed:', error);
      }
    }, 5 * 60 * 1000); // 5 dakika

    console.log('🚀 Keep-alive mechanism started');
  }
}

export function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('🛑 Keep-alive mechanism stopped');
  }
}
