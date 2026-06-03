/**
 * Simple Analytics Tracking (optional PostHog integration)
 * Tracks key user events for insights
 */

export type AnalyticsEvent =
  | 'instagram_recipe_shared'
  | 'recipe_parsed'
  | 'recipe_parsed_groq'
  | 'recipe_parsed_fallback'
  | 'image_selected'
  | 'image_skipped'
  | 'recipe_saved'
  | 'error_occurred'
  | 'recipe_view'
  | 'weekplan_generated';

interface AnalyticsPayload {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
}

/**
 * Track analytics event
 * Currently logs to console, can be extended with PostHog
 */
export function trackEvent(event: AnalyticsEvent, properties?: Record<string, any>) {
  const payload: AnalyticsPayload = { event, properties };

  // Log to console for dev
  console.log('[Analytics]', event, properties || {});

  // Future: Send to PostHog
  // if (window.posthog) {
  //   window.posthog.capture(event, properties);
  // }

  // Future: Send to custom analytics endpoint
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(payload) });
}

/**
 * Track recipe parse success
 */
export function trackRecipeParsed(method: 'groq' | 'fallback', zutatenCount: number, zubereitungCount: number) {
  trackEvent(method === 'groq' ? 'recipe_parsed_groq' : 'recipe_parsed_fallback', {
    zutatenCount,
    zubereitungCount,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track image selection
 */
export function trackImageSelected(source: 'unsplash' | 'openverse') {
  trackEvent('image_selected', {
    source,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track error
 */
export function trackError(errorCode: string, context?: string) {
  trackEvent('error_occurred', {
    errorCode,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track recipe save
 */
export function trackRecipeSaved(source: 'instagram' | 'sanamana' | 'manual') {
  trackEvent('recipe_saved', {
    source,
    timestamp: new Date().toISOString(),
  });
}
