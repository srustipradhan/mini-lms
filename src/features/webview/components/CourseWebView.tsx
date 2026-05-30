import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import { EmptyState } from '@/components/common/EmptyState';
import { buildCourseViewerHtml, getCourseViewerBaseUrl } from '@/features/webview/courseViewerTemplate';
import {
  buildCourseViewerHeaders,
  buildHeadersInjectionScript,
  type CourseViewerHeaders,
} from '@/features/webview/webviewHeaders';
import { useTheme } from '@/hooks/useTheme';
import { useLearningStore } from '@/store/learning.store';
import { useToastStore } from '@/store/toast.store';

interface CourseWebViewProps {
  courseId: string;
  courseTitle: string;
  courseDescription: string;
  instructorName: string;
  category: string;
  lessonTitle?: string;
}

interface WebViewMessage {
  type: string;
  payload?: Record<string, unknown>;
}

const BLOCKED_SCHEME_PREFIXES = ['http://', 'https://', 'intent://', 'tel:', 'mailto:'];
const WEBVIEW_BASE_URL = getCourseViewerBaseUrl();
type WebViewNavigationRequest = { url: string };

export function CourseWebView({
  courseId,
  courseTitle,
  courseDescription,
  instructorName,
  category,
  lessonTitle = 'Introduction & fundamentals',
}: CourseWebViewProps) {
  const webRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const { resolved } = useTheme();
  const showToast = useToastStore((s) => s.show);
  const setProgress = useLearningStore((s) => s.setProgress);
  const savedProgress = useLearningStore((s) => s.getProgress(courseId));

  const nativeHeaders = useMemo(
    () =>
      buildCourseViewerHeaders({
        courseId,
        courseTitle,
        lessonTitle,
        instructorName,
        category,
        description: courseDescription,
        progress: savedProgress,
        theme: resolved,
      }),
    [
      category,
      courseDescription,
      courseId,
      courseTitle,
      instructorName,
      lessonTitle,
      resolved,
      savedProgress,
    ],
  );

  const html = useMemo(() => buildCourseViewerHtml(), []);
  const headersInjectionScript = useMemo(
    () => buildHeadersInjectionScript(nativeHeaders),
    [nativeHeaders],
  );

  const pushHeadersToWebView = useCallback((headers: CourseViewerHeaders) => {
    webRef.current?.injectJavaScript(`
      window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify({ type: 'HEADERS_UPDATE', payload: ${JSON.stringify(headers)} })
      }));
      true;
    `);
  }, []);

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as WebViewMessage;
        if (data.type === 'LESSON_COMPLETE') {
          void setProgress(courseId, 100);
          showToast('Lesson marked complete', 'success');
        }
      } catch {
        // Ignore malformed postMessage payloads from the embedded viewer.
      }
    },
    [courseId, setProgress, showToast],
  );

  useEffect(() => {
    if (!isLoading && !hasError) {
      pushHeadersToWebView(nativeHeaders);
    }
  }, [hasError, isLoading, nativeHeaders, pushHeadersToWebView]);

  const shouldStartLoad = useCallback((request: WebViewNavigationRequest) => {
    if (request.url === 'about:blank') return true;
    if (request.url.startsWith(WEBVIEW_BASE_URL)) return true;
    return !BLOCKED_SCHEME_PREFIXES.some((prefix) => request.url.startsWith(prefix));
  }, []);

  const handleLoadError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return (
    <View className="flex-1 overflow-hidden rounded-3xl">
      {isLoading && !hasError ? (
        <View className="absolute inset-0 z-10 items-center justify-center bg-slate-900/20">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : null}

      {hasError ? (
        <View className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95">
          <EmptyState
            icon="cloud-offline-outline"
            title="Unable to load lesson"
            description="The embedded viewer failed to load. Check your connection and try again."
            actionLabel="Retry"
            onAction={handleRetry}
          />
        </View>
      ) : null}

      <WebView
        key={reloadKey}
        ref={webRef}
        originWhitelist={['about:blank', `${WEBVIEW_BASE_URL}/*`]}
        source={{
          html,
          baseUrl: WEBVIEW_BASE_URL,
          headers: nativeHeaders,
        }}
        injectedJavaScriptBeforeContentLoaded={headersInjectionScript}
        onShouldStartLoadWithRequest={shouldStartLoad}
        onLoadStart={() => {
          setIsLoading(true);
          setHasError(false);
        }}
        onLoadEnd={() => {
          setIsLoading(false);
          pushHeadersToWebView(nativeHeaders);
        }}
        onError={handleLoadError}
        onHttpError={handleLoadError}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowsInlineMediaPlayback
        style={{ flex: 1, backgroundColor: 'transparent' }}
      />
    </View>
  );
}
