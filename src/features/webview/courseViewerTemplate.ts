const WEBVIEW_BASE_URL = 'https://minilms.local';

export function getCourseViewerBaseUrl(): string {
  return WEBVIEW_BASE_URL;
}

export function buildCourseViewerHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>Mini LMS Lesson</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(165deg, #0f172a 0%, #1e1b4b 45%, #312e81 100%);
      color: #f8fafc;
      min-height: 100vh;
      padding: 20px 16px 28px;
    }
    body.theme-light {
      background: linear-gradient(165deg, #f8fafc 0%, #eef2ff 50%, #e0e7ff 100%);
      color: #0f172a;
    }
    .shell { max-width: 560px; margin: 0 auto; }
    .card {
      backdrop-filter: blur(18px);
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 22px;
      padding: 22px;
      margin-bottom: 14px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.25);
    }
    body.theme-light .card {
      background: rgba(255,255,255,0.88);
      border-color: rgba(99, 102, 241, 0.15);
      box-shadow: 0 12px 30px rgba(99, 102, 241, 0.12);
    }
    .eyebrow {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #a5b4fc;
      margin-bottom: 10px;
    }
    body.theme-light .eyebrow { color: #6366f1; }
    h1 {
      font-size: 1.55rem;
      line-height: 1.25;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    .lesson-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(99, 102, 241, 0.22);
      border: 1px solid rgba(165, 180, 252, 0.35);
      color: #e0e7ff;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 18px;
    }
    body.theme-light .lesson-badge {
      background: #eef2ff;
      border-color: #c7d2fe;
      color: #4338ca;
    }
    .section-title {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 10px;
    }
    body.theme-light .section-title { color: #64748b; }
    .progress-wrap { margin-bottom: 18px; }
    .progress-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 0.88rem;
      color: #cbd5e1;
    }
    body.theme-light .progress-head { color: #475569; }
    .progress-value {
      font-weight: 700;
      color: #34d399;
    }
    body.theme-light .progress-value { color: #059669; }
    .progress {
      height: 10px;
      background: rgba(255,255,255,0.12);
      border-radius: 999px;
      overflow: hidden;
    }
    body.theme-light .progress { background: #e2e8f0; }
    .progress > span {
      display: block;
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #34d399, #22d3ee);
      border-radius: 999px;
      transition: width 0.35s ease;
    }
    .description {
      line-height: 1.65;
      color: #cbd5e1;
      font-size: 0.95rem;
      margin-bottom: 4px;
    }
    body.theme-light .description { color: #334155; }
    .details-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.1);
    }
    body.theme-light .details-table {
      border-color: #e2e8f0;
    }
    .details-table tr + tr td,
    .details-table tr + tr th {
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    body.theme-light .details-table tr + tr td,
    body.theme-light .details-table tr + tr th {
      border-top-color: #e2e8f0;
    }
    .details-table th {
      width: 38%;
      text-align: left;
      padding: 12px 14px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #94a3b8;
      background: rgba(15, 23, 42, 0.35);
      vertical-align: top;
    }
    body.theme-light .details-table th {
      color: #64748b;
      background: #f8fafc;
    }
    .details-table td {
      padding: 12px 14px;
      font-size: 0.92rem;
      line-height: 1.45;
      color: #f1f5f9;
      background: rgba(255,255,255,0.04);
      word-break: break-word;
    }
    body.theme-light .details-table td {
      color: #0f172a;
      background: #ffffff;
    }
    .details-table tr:nth-child(even) td {
      background: rgba(255,255,255,0.07);
    }
    body.theme-light .details-table tr:nth-child(even) td {
      background: #fafbff;
    }
    button {
      width: 100%;
      border: 0;
      border-radius: 14px;
      padding: 15px;
      margin-top: 18px;
      font-size: 1rem;
      font-weight: 700;
      color: white;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      box-shadow: 0 10px 24px rgba(99, 102, 241, 0.35);
      cursor: pointer;
    }
    button:active { transform: scale(0.985); }
  </style>
</head>
<body>
  <div class="shell">
    <div class="card">
      <div class="eyebrow">Lesson viewer</div>
      <h1 id="courseTitle">Loading course...</h1>
      <div class="lesson-badge" id="lessonBadge">Preparing lesson...</div>

      <div class="progress-wrap">
        <div class="progress-head">
          <span>Your progress</span>
          <span class="progress-value" id="progressLabel">0%</span>
        </div>
        <div class="progress"><span id="progressBar"></span></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">About this course</div>
      <p class="description" id="courseDescription">
        Course details will appear once the native app sends headers.
      </p>
    </div>

    <div class="card">
      <div class="section-title">Course details</div>
      <table class="details-table" id="detailsTable">
        <tbody id="detailsBody">
          <tr>
            <th>Course ID</th>
            <td id="cell-courseId">—</td>
          </tr>
          <tr>
            <th>Instructor</th>
            <td id="cell-instructor">—</td>
          </tr>
          <tr>
            <th>Category</th>
            <td id="cell-category">—</td>
          </tr>
          <tr>
            <th>Lesson</th>
            <td id="cell-lesson">—</td>
          </tr>
          <tr>
            <th>Progress</th>
            <td id="cell-progress">—</td>
          </tr>
          <tr>
            <th>Theme</th>
            <td id="cell-theme">—</td>
          </tr>
        </tbody>
      </table>
      <button id="completeBtn" type="button">Mark lesson complete</button>
    </div>
  </div>
  <script>
    const post = (type, payload) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
      }
    };

    const setCell = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || '—';
    };

    const applyTheme = (theme) => {
      document.body.classList.toggle('theme-light', theme === 'light');
    };

    const applyProgress = (value) => {
      const progress = Math.max(0, Math.min(100, Number(value) || 0));
      document.getElementById('progressBar').style.width = progress + '%';
      document.getElementById('progressLabel').textContent = progress + '%';
      setCell('cell-progress', progress + '% complete');
    };

    window.applyNativeHeaders = (headers) => {
      window.__NATIVE_HEADERS__ = headers;

      const title = headers['Course-Title'] || 'Course';
      const lesson = headers['Lesson-Title'] || 'Introduction';
      const instructor = headers['Course-Instructor'] || 'Instructor';
      const category = headers['Course-Category'] || 'General';
      const description = headers['Course-Description'] ||
        'Interactive lesson content rendered inside WebView. Mark complete when finished.';
      const courseId = headers['Course-Id'] || '—';
      const theme = headers['Theme'] || 'dark';

      document.getElementById('courseTitle').textContent = title;
      document.getElementById('lessonBadge').textContent = '📘 ' + lesson;
      document.getElementById('courseDescription').textContent = description;

      setCell('cell-courseId', courseId);
      setCell('cell-instructor', instructor);
      setCell('cell-category', category);
      setCell('cell-lesson', lesson);
      setCell('cell-theme', theme.charAt(0).toUpperCase() + theme.slice(1));

      applyProgress(headers['Progress']);
      applyTheme(theme);
    };

    document.getElementById('completeBtn').addEventListener('click', () => {
      post('LESSON_COMPLETE', { progress: 100 });
      applyProgress(100);
    });

    window.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'HEADERS_UPDATE' && data.payload) {
          window.applyNativeHeaders(data.payload);
        } else if (data.type === 'THEME' && data.payload) {
          applyTheme(data.payload);
        }
      } catch (_) {}
    });

    if (window.__NATIVE_HEADERS__) {
      window.applyNativeHeaders(window.__NATIVE_HEADERS__);
      post('READY', { headers: window.__NATIVE_HEADERS__ });
    }
  </script>
</body>
</html>`;
}
