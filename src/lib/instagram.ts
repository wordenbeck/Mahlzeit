/**
 * Instagram integration for recipe parsing
 * Fetch caption from Instagram Reel URL via oEmbed
 */

export async function fetchInstagramCaption(url: string): Promise<string> {
  try {
    // Validate Instagram URL
    if (!url.includes('instagram.com') && !url.includes('instagra.m')) {
      throw new Error('Ungültige Instagram URL');
    }

    // Use Instagram oEmbed API
    const oembedUrl = new URL('https://www.instagram.com/oembed');
    oembedUrl.searchParams.set('url', url);

    const response = await fetch(oembedUrl.toString());

    if (!response.ok) {
      throw new Error(`Instagram oEmbed failed: ${response.status}`);
    }

    const data = await response.json() as { title?: string; media_type?: string };

    // Extract caption from title (Instagram oEmbed returns caption in title field)
    if (data.title) {
      return data.title;
    }

    throw new Error('Keine Caption in diesem Reel gefunden');
  } catch (error) {
    console.error('[Instagram] Fetch failed:', error);
    throw error instanceof Error ? error : new Error('Instagram-Fehler');
  }
}

/**
 * Validate Instagram URL format
 */
export function isValidInstagramUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      (u.hostname.includes('instagram.com') || u.hostname.includes('instagra.m')) &&
      u.pathname.includes('/p/')
    );
  } catch {
    return false;
  }
}
