This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment variables

Copy `.env.example` to `.env.local` and set values as needed.

- **NEXT_PUBLIC_API_BASE_URL** (required): API base URL, e.g. `http://localhost:7000/api/v1`.
- **NEXT_PUBLIC_ENCRYPTION_KEY** (optional): 64 hex characters (256-bit key). When set, login, addUser, and editUser payloads are encrypted with AES-256-CBC before sending; the value must match the backend `ENCRYPTION_KEY`. If omitted, those requests are sent as plain JSON.

## Security

- **Sanitization** (`src/lib/sanitize.ts`): User-generated HTML is sanitized with DOMPurify before render; links use `sanitizeUrl()`; descriptions/excerpts use `sanitizeTextContent()`. File uploads are validated with `validateFile()` (type, size, image extension).
- **Request safety** (`src/lib/security/rscGuard.ts`): For future API routes or server actions that accept JSON, use `checkRequestSecurity(headers, body)` and `validateRequestBody(body)`; use `createSafeResponse()` when returning arbitrary data to avoid leaking dangerous payloads.
- **Transport encryption**: Optional client-side encryption for login and sensitive forms is provided by `src/lib/encryption.ts`; use with HTTPS and server-side validation.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
