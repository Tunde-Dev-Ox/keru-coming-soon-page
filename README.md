# Keru Coming Soon

This is a responsive coming soon page for Keru with a live countdown and email subscribe.

## Subscribe storage: Supabase (recommended)

1. Create a Supabase project. In Table Editor, create table `subscribers`:

```sql
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamp with time zone default now()
);
create index if not exists subscribers_email_idx on public.subscribers (email);
alter table public.subscribers enable row level security;
create policy "Allow insert from anon" on public.subscribers
  for insert
  to anon
  with check ( true );
```

2. In the project root, create `.env` with:

```
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_PUBLIC_KEY"
```

3. Restart the dev server. The app inserts `{ email, source, created_at }` into `public.subscribers`.

Optional: add rate limits or a trigger to dedupe emails.

## Configure Subscribe to Google Sheets (Easy)

1. Create a new Google Sheet and name the first row headers:
   - `timestamp`, `email`, `source`
2. Open Extensions → Apps Script. Replace the code with the following:

```javascript
function doPost(e) {
  try {
    var params = e.parameter;
    var email = params.email || '';
    var source = params.source || '';
    var timestamp = params.timestamp || new Date().toISOString();
    if (!email) return ContentService.createTextOutput('Missing email').setMimeType(ContentService.MimeType.TEXT).setResponseCode(400);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    sheet.appendRow([timestamp, email, source]);

    var output = ContentService.createTextOutput(JSON.stringify({ ok: true }));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (err) {
    return ContentService.createTextOutput('Error').setMimeType(ContentService.MimeType.TEXT).setResponseCode(500);
  }
}
```

3. Click Deploy → New deployment → Select type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Copy the web app URL.
4. Create a `.env` file in the project root and set:

```
VITE_SUBSCRIBE_WEBHOOK_URL="<paste-your-web-app-url>"
```

5. Restart dev server so Vite picks up the env var.

Security note: the endpoint is public. Consider rate limiting or adding a simple token check in Apps Script if needed.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
