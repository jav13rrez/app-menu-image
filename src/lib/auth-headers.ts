/**
 * Shared auth header utility for API calls outside of api.ts.
 *
 * Uses the same module-scoped token that Providers.tsx sets via setAuthToken().
 * This replaces the broken window.__auth_token pattern.
 */

let _token: string | null = null;

export function setSharedAuthToken(token: string | null): void {
    _token = token;
}

export function getSharedAuthToken(): string | null {
    return _token;
}

export function getAuthHeaders(): HeadersInit {
    return _token
        ? { Authorization: `Bearer ${_token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };
}
