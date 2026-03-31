import { useCallback, useEffect } from 'react';

// Event types based on existing patterns in the codebase
export type EventType =
  | 'CLICK'
  | 'HOVER'
  | 'SCROLL'
  | 'KEY_DOWN'
  | 'FORM_FIELD_FILLED'
  | 'PAGE_LOAD'
  | 'COMPONENT_LOAD'
  | 'TIME_SPENT_ON_PAGE'
  | 'TIME_SPENT_ON_COMPONENT'
  | 'EVENT_SUCCESS'
  | 'EVENT_FAILURE'
  | 'TIMELINE'
  | 'VIEW'
  | 'LOG'
  | 'EXPERIMENT_STARTED';

// Event data structure
export interface EventData {
  type: EventType;
  eventName: string;
  eventData?: Record<string, unknown>;
  url: string;
}

// Main event tracking hook
export const useEventTracker = (visualizerName: string) => {
  const trackEvent = useCallback((
    eventType: EventType,
    action: string,
    data?: Record<string, unknown>
  ) => {
    window.parent.postMessage({
      type: eventType,
      eventName: `${visualizerName}-${action}`,
      eventData: data,
      url: window.location.href
    }, "*");
  }, [visualizerName]);

  return { trackEvent };
};

// Lifecycle events hook - automatically tracks component load/unload
export const useLifecycleEvents = (visualizerName: string) => {
  const { trackEvent } = useEventTracker(visualizerName);

  useEffect(() => {
    // Track component load
    trackEvent('COMPONENT_LOAD', 'loaded');

    const startTime = Date.now();

    // Track component unload and time spent
    return () => {
      const timeSpent = Date.now() - startTime;
      trackEvent('TIME_SPENT_ON_PAGE', 'unloaded');
      trackEvent('TIME_SPENT_ON_COMPONENT', 'time-spent', { timeSpentMs: timeSpent });
    };
  }, [trackEvent]);

  return { trackEvent };
};

// HOC for wrapping event handlers
export const createEventHandler = <T extends (...args: unknown[]) => unknown>(
  trackEvent: (eventType: EventType, action: string, data?: Record<string, unknown>) => void,
  eventType: EventType,
  actionName: string,
  originalHandler: T,
  eventData?: Record<string, unknown>
): T => {
  return ((...args: Parameters<T>) => {
    // Track the event
    trackEvent(eventType, actionName, eventData);

    // Execute original handler
    return originalHandler(...args);
  }) as T;
};

// Predefined common event handlers
export const useCommonEventHandlers = (visualizerName: string) => {
  const { trackEvent } = useEventTracker(visualizerName);

  const trackClick = useCallback((action: string, data?: Record<string, unknown>) => {
    trackEvent('CLICK', action, data);
  }, [trackEvent]);

  const trackFormInput = useCallback((action: string, data?: Record<string, unknown>) => {
    trackEvent('FORM_FIELD_FILLED', action, data);
  }, [trackEvent]);

  const trackAlgorithmStart = useCallback((data?: Record<string, unknown>) => {
    trackEvent('EXPERIMENT_STARTED', 'algorithm-started', data);
  }, [trackEvent]);

  const trackAlgorithmStep = useCallback((data?: Record<string, unknown>) => {
    trackEvent('TIMELINE', 'step-executed', data);
  }, [trackEvent]);

  const trackAlgorithmComplete = useCallback((success: boolean, data?: Record<string, unknown>) => {
    trackEvent(success ? 'EVENT_SUCCESS' : 'EVENT_FAILURE', `algorithm-${success ? 'completed' : 'failed'}`, data);
  }, [trackEvent]);

  return {
    trackEvent,
    trackClick,
    trackFormInput,
    trackAlgorithmStart,
    trackAlgorithmStep,
    trackAlgorithmComplete,
  };
};

// Utility function to get visualizer name from route
export const getVisualizerNameFromRoute = (): string => {
  if (typeof window === 'undefined') return '';

  const pathname = window.location.pathname;
  // Remove leading slash and convert to kebab-case if needed
  return pathname.slice(1) || '';
};