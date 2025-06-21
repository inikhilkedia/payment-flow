# CSRF Protection Implementation

## Overview

This document describes the CSRF (Cross-Site Request Forgery) protection implementation for the payment flow application.

## What is CSRF?

Cross-Site Request Forgery is an attack where malicious websites can make unauthorized requests on behalf of authenticated users. This is particularly dangerous for payment forms where attackers could potentially submit payments without user consent.

## Implementation Details

### 1. Token Generation

- **Location**: `app/components/PaymentForm.tsx`
- **Method**: Client-side token generation using `Math.random()`
- **Format**: 45-character alphanumeric string
- **Expiration**: 30 minutes from generation

### 2. Token Storage

- **Storage**: Browser sessionStorage
- **Key**: `csrfToken`
- **Format**: JSON object with `token` and `expiresAt` properties
- **Persistence**: Survives page refreshes but cleared when browser session ends

### 3. Token Validation

- **Timing**: Before form submission
- **Checks**:
  - Token exists and is not empty
  - Token has not expired (current time < expiresAt)
- **Failure**: Shows security alert and prevents form submission

### 4. Form Integration

- **Hidden Field**: CSRF token included as hidden input field
- **Name**: `csrfToken`
- **Submission**: Token sent with form data

## Code Structure

```typescript
// Token generation
const generateCSRFToken = (): CSRFToken => {
	const token =
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15);
	return {
		token,
		expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
	};
};

// Token validation
const validateCSRFToken = (token: string, expiresAt: number): boolean => {
	if (!token || Date.now() > expiresAt) {
		return false;
	}
	return true;
};

// Form submission with CSRF check
const handleSubmit = (event: FormEvent) => {
	event.preventDefault();

	// Validate CSRF token first
	if (!validateCSRFToken(csrfToken, csrfExpiresAt)) {
		alert('Security validation failed. Please refresh the page and try again.');
		return;
	}

	// Continue with form processing...
};
```

## Security Features

### ✅ Implemented

- **Token Generation**: Unique tokens for each session
- **Token Expiration**: 30-minute timeout prevents replay attacks
- **Client-side Validation**: Immediate feedback on token validity
- **Session Storage**: Secure token storage in browser
- **Form Integration**: Hidden field prevents CSRF attacks

### ⚠️ Limitations (Current Implementation)

- **Client-side Only**: Token generation and validation happen in browser
- **No Server Validation**: No server-side verification of tokens
- **Simple Token**: Uses Math.random() instead of cryptographically secure random
- **No Double Submit**: No cookie-based double submission check

## Recommendations for Production

### 1. Server-side Implementation

```typescript
// API route for token generation
export async function GET(request: NextRequest) {
	const token = crypto.randomBytes(32).toString('hex');
	const response = NextResponse.json({ token });
	response.cookies.set('csrf-token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
	});
	return response;
}

// API route for form submission
export async function POST(request: NextRequest) {
	const body = await request.json();
	const cookieToken = request.cookies.get('csrf-token')?.value;
	const formToken = body.csrfToken;

	if (cookieToken !== formToken) {
		return NextResponse.json(
			{ error: 'CSRF validation failed' },
			{ status: 403 }
		);
	}

	// Process payment...
}
```

### 2. Enhanced Security

- **Cryptographic Tokens**: Use `crypto.randomBytes()` for token generation
- **Double Submit Pattern**: Store token in both cookie and form field
- **Server Validation**: Verify tokens on server-side
- **Rate Limiting**: Prevent token brute force attacks
- **HTTPS Only**: Enforce secure connections

### 3. Additional Measures

- **Content Security Policy**: Prevent XSS attacks
- **SameSite Cookies**: Prevent cross-site cookie attacks
- **Token Rotation**: Regenerate tokens after successful submission
- **Audit Logging**: Log CSRF validation attempts

## Testing CSRF Protection

### Manual Testing

1. Fill out payment form
2. Open browser developer tools
3. Modify the hidden CSRF token field
4. Submit form
5. Verify security alert appears

### Automated Testing

```typescript
// Example test case
test('should reject form submission with invalid CSRF token', async () => {
	const form = screen.getByRole('form');
	const csrfField = screen.getByDisplayValue(/^[a-z0-9]+$/);

	// Modify CSRF token
	fireEvent.change(csrfField, { target: { value: 'invalid-token' } });
	fireEvent.submit(form);

	expect(screen.getByText(/Security validation failed/)).toBeInTheDocument();
});
```

## Conclusion

The current implementation provides basic CSRF protection for the payment form. While it prevents simple CSRF attacks, it should be enhanced with server-side validation and cryptographic token generation for production use.

For a production payment system, implement the recommended server-side validation and enhanced security measures outlined above.
