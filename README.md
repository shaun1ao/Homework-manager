# Homework Manager

A simple teacher-only web app for managing classes and homework assignments, backed by Firebase Firestore. Plain HTML, CSS, and vanilla JavaScript — no build step, no framework, no npm install.

## Running it

Any static file server works, since the JavaScript is loaded as ES modules (which most browsers block from `file://` for CORS reasons). The simplest option:

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173.

## Files

```
index.html         Login page
classes.html        Class list + create class
class.html          One class's roster + its assignments (?id=...)
assignments.html    Assignment list + create form
assignment.html     One assignment's detail (?id=...)
settings.html       Change username/password
css/style.css       All styling
js/firebase-config.js  Firebase app init (Firestore only)
js/db.js            Firestore reads/writes for classes, students, assignments
js/auth.js          Login/logout/session + credential changes
js/helpers.js       Small shared utilities (HTML escaping, query params, etc.)
```

## Login

- Username: `b.hossain`
- Password: `1234`

Change either from the **Settings** page once logged in.

## What it does

- **Classes** — create classes, add people to a roster (new or existing person), and the same person can belong to multiple classes.
- **Assignments** — assign work to a whole class or to specific individuals, with a title, due date, and free-text extra info. Click any assignment to see full details.
- **Settings** — change the teacher username/password.

## Notes

- There's no Firebase Authentication — the login is a simple username/password check against a `settings/teacher` document in Firestore, as requested (no security requirement). The "session" is just a flag in `localStorage`.
- Firestore rules (`firestore.rules`) are wide open (`allow read, write: if true`) so the client can read/write without auth. Do not put sensitive data in this app.
- Data model: `classes`, `students` (each with a `classIds` array), and `assignments` (each targets either a `classId` or a `studentIds` list) collections in Firestore.
- The Firebase SDK is loaded straight from Google's CDN (`gstatic.com`) as ES modules — no `npm install` required.
