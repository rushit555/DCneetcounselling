# 🔐 DC Neet Counselling: Security Maintenance Policy

This project is currently in **Security Maintenance Mode**. This document defines the mandatory security practices and protocols that must be followed for all modifications and deployments.

## 🚫 Core Directive: No New Features
*   **DO NOT** add new functional features.
*   **DO NOT** modify UI/UX unless it is directly required to fix a security vulnerability.
*   **DO NOT** change business logic except to enhance security or data integrity.

---

## 🔒 Mandatory Security Practices

### 1. Authentication & Session Management
*   **JWT Integrity**: Maintain secure authentication via Supabase Auth.
*   **Storage**: Tokens must be stored in HTTP-only cookies where possible (or managed by Supabase securely).
*   **[STRICT RULE] No Inactivity Logout**: Implementation of automatic logout based on user inactivity is strictly forbidden. 
*   **Session Persistence**: Verify session status on every protected operation.

### 2. Input Validation & Sanitization
*   **Zero-Trust Input**: Trust no user-supplied data (form fields, query params, etc.).
*   **XSS Prevention**: All dynamic HTML rendering must pass through `window.sanitizeHTML`.
*   **SQL Injection**: Use Supabase's built-in parameterized queries; never concatenate strings for SQL.

### 3. API & Backend Security
*   **Rate Limiting**: Maintain existing rate limits on login and sensitive API endpoints.
*   **Least Privilege**: Database access must be restricted via Row Level Security (RLS) policies. Every record MUST be associated with an `auth.uid()`.

### 4. Payment Security (Razorpay)
*   **Verification**: Rule 7.2 dictates that frontend success responses must **NEVER** be trusted as definitive proof of payment.
*   **Backend Fulfillment**: All payment verification must eventually be handled by a secure backend webhook/Edge Function verifying the Razorpay cryptographic signature.

### 5. Data Protection
*   **Bcrypt Hashing**: Ensure all sensitive credentials (managed by Supabase) remain hashed.
*   **Log Masking**: Never print PII (Personally Identifiable Information) or sensitive tokens to the browser console or server logs.

---

## 🔁 Change Validation Protocol
Before applying ANY modification, the following questions must be answered:
1.  **Does this change affect authentication?** (If yes, verify it doesn't weaken it).
2.  **Does this change expose any user data?** (If yes, it must be rejected).
3.  **Does this change bypass any database permissions (RLS)?**
4.  **Is this change a "new feature"?** (If yes, it must be rejected).

---

## 🧠 Maintenance Philosophy: Zero Trust
Trust nothing: not user input, not API responses, not headers. Always validate everything.

---

*Last Updated: 2026-04-18*
