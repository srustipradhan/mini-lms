export const WEBVIEW_HEADER_KEYS = {
  courseId: 'Course-Id',
  courseTitle: 'Course-Title',
  lessonTitle: 'Lesson-Title',
  instructorName: 'Course-Instructor',
  category: 'Course-Category',
  description: 'Course-Description',
  progress: 'Progress',
  theme: 'Theme',
} as const;

export type WebViewHeaderKey = (typeof WEBVIEW_HEADER_KEYS)[keyof typeof WEBVIEW_HEADER_KEYS];

export type CourseViewerHeaders = Record<WebViewHeaderKey, string>;

export interface CourseViewerHeaderInput {
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  instructorName: string;
  category: string;
  description: string;
  progress: number;
  theme: string;
}

export function buildCourseViewerHeaders(input: CourseViewerHeaderInput): CourseViewerHeaders {
  const progress = Math.max(0, Math.min(100, Math.round(input.progress)));

  return {
    [WEBVIEW_HEADER_KEYS.courseId]: input.courseId,
    [WEBVIEW_HEADER_KEYS.courseTitle]: input.courseTitle,
    [WEBVIEW_HEADER_KEYS.lessonTitle]: input.lessonTitle,
    [WEBVIEW_HEADER_KEYS.instructorName]: input.instructorName,
    [WEBVIEW_HEADER_KEYS.category]: input.category,
    [WEBVIEW_HEADER_KEYS.description]: input.description,
    [WEBVIEW_HEADER_KEYS.progress]: String(progress),
    [WEBVIEW_HEADER_KEYS.theme]: input.theme,
  };
}

export function buildHeadersInjectionScript(headers: CourseViewerHeaders): string {
  return `
    window.__NATIVE_HEADERS__ = ${JSON.stringify(headers)};
    if (typeof window.applyNativeHeaders === 'function') {
      window.applyNativeHeaders(window.__NATIVE_HEADERS__);
    }
    true;
  `;
}
