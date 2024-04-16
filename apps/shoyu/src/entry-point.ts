interface LSEmbedCache {
  url: string | undefined;
  updatedAt: Date | undefined;
}

(async function () {
  if (typeof document === 'undefined') return;

  const appId = 'bentoEmbedScript';
  const lsKey = 'bento-embedUrl';
  const fetchDebounceSeconds = 120; // 2min

  const isDebugEnabled =
    (window as any).debugBento === true ||
    window.localStorage.getItem('debugBento') === 'true';

  const debugMessage = (msg: string) => {
    // eslint-disable-next-line
    if (isDebugEnabled) console.debug(msg);
  };

  const handleError = (e: string | Event) => {
    // eslint-disable-next-line
    console.warn('[BENTO] Failed to load script', e);
    window.localStorage.removeItem(lsKey);
  };

  try {
    const appLoaded = document.getElementById(appId);
    if (appLoaded) {
      debugMessage('[BENTO] App already loaded.');
      return;
    }

    const urlCache = JSON.parse(
      window.localStorage.getItem(lsKey) || '{}'
    ) as LSEmbedCache;

    const secondsSinceLastCheck =
      urlCache.updatedAt && urlCache.url
        ? Math.abs(
            (new Date().getTime() - new Date(urlCache.updatedAt).getTime()) /
              1000
          )
        : 999;

    const useCache = secondsSinceLastCheck < fetchDebounceSeconds;

    debugMessage(
      `[BENTO] Seconds since last check: ${secondsSinceLastCheck}. Using cache: ${useCache}`
    );

    let embedUrl = urlCache.url;
    if (!useCache) {
      const urlResult = await fetch(
        `${process.env.VITE_PUBLIC_API_URL_BASE}/embed/get-url`,
        { method: 'GET' }
      );
      embedUrl = urlResult ? await urlResult.text() : undefined;
    }
    if (!embedUrl) {
      // eslint-disable-next-line
      console.warn(`[BENTO] Invalid embed URL received: ${embedUrl}`);
      return;
    }

    if (!useCache)
      window.localStorage.setItem(
        lsKey,
        JSON.stringify({
          url: embedUrl,
          updatedAt: new Date(),
        } as LSEmbedCache)
      );

    const script = document.createElement('script');
    script.id = appId;
    script.src = embedUrl;
    // eslint-disable-next-line
    script.onerror = handleError;
    script.type = 'module';
    document.body.appendChild(script);
  } catch (e) {
    handleError(e as Event);
  }
})();
