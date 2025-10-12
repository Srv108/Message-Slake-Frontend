# Socket Token Authentication Debug Guide

## 🔍 Issue: "Authentication error: Token is required"

This error occurs when the socket tries to connect without a valid authentication token.

---

## 📋 Diagnostic Steps

### Step 1: Check Console Logs

After login, you should see:

```
🚀 ========== INITIALIZING SOCKET CONNECTION ==========
📍 Step 1: Checking prerequisites
  ✅ User authenticated: true
  ✅ Token length: 150
  ✅ Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6...
  ✅ Network online: true
  ✅ Socket URL: ws://localhost:3300
```

**If you see:**
```
⚠️ No valid auth token available
  - auth exists: true
  - auth.token exists: false
  - auth.token type: undefined
```

**Then the token is not being set in the auth context.**

---

### Step 2: Verify Auth Context

Check that your auth context is properly storing the token after login:

```javascript
// In your auth context or login handler
const handleLogin = async (credentials) => {
    const response = await signinMutation(credentials)
    
    if (response.success) {
        // ✅ MUST store token in auth context
        setAuth({
            user: response.data.user,
            token: response.data.token  // ⚠️ Make sure this exists!
        })
    }
}
```

---

### Step 3: Check API Response

Verify your signin API returns a token:

```javascript
// Expected response format
{
    success: true,
    message: 'SignedIn successfully',
    data: {
        user: { id, username, email, ... },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'  // ⚠️ Must be here!
    }
}
```

---

### Step 4: Verify Token Storage

Check localStorage or wherever you persist the token:

```javascript
// After login, check:
console.log('Stored token:', localStorage.getItem('token'))
console.log('Auth context:', auth)
```

---

## 🔧 Common Issues & Fixes

### Issue 1: Token Not in API Response

**Problem:** Backend doesn't return token in response

**Fix:** Update backend signin endpoint to include token:
```javascript
// Backend
res.json({
    success: true,
    data: {
        user: userData,
        token: generatedToken  // ⚠️ Add this!
    }
})
```

---

### Issue 2: Token Not Stored in Auth Context

**Problem:** Token exists in API response but not stored in context

**Fix:** Update auth context setter:
```javascript
// In useSignin or auth context
if (response.success) {
    setAuth({
        user: response.data.user,
        token: response.data.token  // ⚠️ Make sure to include this!
    })
    
    // Also persist to localStorage
    localStorage.setItem('token', response.data.token)
}
```

---

### Issue 3: Socket Created Before Token Available

**Problem:** Socket initializes before auth context updates

**Fix:** The socket context now has strict validation:
```javascript
// Socket will NOT create until token is valid
if (!auth?.token || typeof auth.token !== 'string' || auth.token.trim() === '') {
    console.log('⚠️ No valid auth token available')
    return  // Wait for token
}
```

**This is already implemented!** ✅

---

### Issue 4: Token Format Incorrect

**Problem:** Token is not a string or is empty

**Fix:** Ensure token is a non-empty string:
```javascript
// Validate before storing
if (response.data.token && typeof response.data.token === 'string') {
    setAuth({
        user: response.data.user,
        token: response.data.token
    })
} else {
    console.error('Invalid token format:', response.data.token)
}
```

---

## 🎯 Quick Fix Checklist

1. **✅ Check API Response**
   - Does signin endpoint return `data.token`?
   - Is it a valid JWT string?

2. **✅ Check Auth Context**
   - Is token stored in `auth.token`?
   - Is it persisted to localStorage?

3. **✅ Check Socket Logs**
   - Does it show "Token length: X"?
   - Does it show "Token preview: eyJ..."?

4. **✅ Check Timing**
   - Does socket try to connect before login?
   - Is auth context updated before socket creation?

---

## 🧪 Test Procedure

### 1. Clear Everything
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
// Refresh page
```

### 2. Login and Watch Logs
```
Expected sequence:
1. User submits login form
2. API returns success with token
3. Auth context updates with token
4. Socket context detects auth.token
5. Socket creates with token
6. Socket connects successfully
```

### 3. Verify Connection
```
Expected logs:
🚀 ========== INITIALIZING SOCKET CONNECTION ==========
  ✅ Token length: 150
  ✅ Token preview: eyJhbGciOiJIUzI1NiIsInR5cCI6...
🔌 Step 3: Creating socket instance with auth token...
✅ Socket instance created and stored
🎉 ========== SOCKET CONNECTED ==========
  📍 Socket ID: abc123xyz
```

---

## 🔍 Debug Commands

### Check Auth State
```javascript
// In browser console
console.log('Auth:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.get(1).getCurrentFiber())
```

### Check Socket State
```javascript
// In browser console
console.log('Socket:', socketRef.current)
console.log('Socket connected:', socketRef.current?.connected)
console.log('Socket auth:', socketRef.current?.auth)
```

### Check Token
```javascript
// In browser console
console.log('Token:', localStorage.getItem('token'))
```

---

## 📝 Expected Flow

```
User Login
    ↓
API Call: POST /signin
    ↓
Response: { success: true, data: { user, token } }
    ↓
Update Auth Context: setAuth({ user, token })
    ↓
Persist Token: localStorage.setItem('token', token)
    ↓
Socket Context Detects: auth.token exists
    ↓
Validate Token: typeof token === 'string' && token.length > 0
    ↓
Create Socket: io(url, { auth: { token } })
    ↓
Backend Validates: JWT verification
    ↓
Socket Connects: emit('connect')
    ↓
✅ Ready to use!
```

---

## 🚨 If Still Not Working

### 1. Check Backend Logs
```bash
# Backend should show:
[Socket] New connection: socketId
[Socket] User authenticated: userId
```

### 2. Check Network Tab
- Open DevTools → Network → WS (WebSocket)
- Look for socket connection
- Check "Messages" tab
- Should see authentication success

### 3. Verify Backend Socket Config
```javascript
// Backend should have:
io.use((socket, next) => {
    const token = socket.handshake.auth.token  // ⚠️ Check this path
    
    if (!token) {
        return next(new Error('Token is required'))
    }
    
    // Verify token...
    next()
})
```

---

## ✅ Solution Summary

The socket context now has **strict token validation**:

1. ✅ Checks if `auth.token` exists
2. ✅ Checks if it's a string
3. ✅ Checks if it's not empty
4. ✅ Logs token length and preview
5. ✅ Only creates socket when token is valid

**Next step:** Verify that your signin process properly stores the token in the auth context!

---

**Last Updated:** 2025-10-12  
**Status:** Enhanced with strict validation ✅
