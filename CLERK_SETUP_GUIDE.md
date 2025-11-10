# 🔐 Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication with Google OAuth for your CodeBattle Arena project.

## 📋 Prerequisites

- Node.js installed
- Clerk SDK already installed (`@clerk/nextjs`)

## 🚀 Step-by-Step Setup

### 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Click "Sign Up" (it's free for development)
3. Create your account using Google, GitHub, or email

### 2. Create a New Application

1. Once logged in, click "Add application"
2. Name it "CodeBattle Arena" (or any name you prefer)
3. Select your authentication methods:
   - ✅ **Email** (recommended)
   - ✅ **Google** (OAuth)
   - ✅ **GitHub** (optional)
4. Click "Create application"

### 3. Get Your API Keys

After creating the application, you'll see your API keys:

1. Copy the **Publishable key** (starts with `pk_test_...`)
2. Copy the **Secret key** (starts with `sk_test_...`)

### 4. Configure Environment Variables

1. In the frontend directory, rename `.env.local.example` to `.env.local`:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Clerk keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/community
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/community
   ```

### 5. Enable Google OAuth (Important!)

1. In your Clerk Dashboard, go to **"Configure"** → **"SSO Connections"**
2. Find **Google** in the list
3. Click **"Enable"** or **"Configure"**
4. Clerk will automatically set up Google OAuth for you
5. No need to create your own Google Cloud credentials!

### 6. Configure Allowed Redirect URLs

1. In Clerk Dashboard, go to **"Configure"** → **"Paths"**
2. Make sure these paths are set:
   - Sign in: `/sign-in`
   - Sign up: `/sign-up`
   - After sign in: `/community`
   - After sign up: `/community`

### 7. Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/sign-in`

3. You should see the Clerk sign-in component with:
   - Email/Password option
   - **"Continue with Google"** button
   - GitHub option (if enabled)

4. Click "Continue with Google" to test Google OAuth!

## 🎨 Customization

The Clerk components are already styled to match your dark theme. You can customize further in `app/layout.tsx`:

```typescript
<ClerkProvider
  appearance={{
    baseTheme: dark,
    variables: {
      colorPrimary: '#8B5CF6',  // Purple theme
      colorBackground: '#1a1a2e', // Dark background
    }
  }}
>
```

## 📱 Features Enabled

### ✅ Navigation Bar
- Shows "Login" and "Sign Up" buttons when logged out
- Shows user avatar and dropdown when logged in
- Displays user name from Google/Clerk account

### ✅ Profile Page
- Shows Google profile picture (if available)
- Displays name and email from Clerk/Google
- Editable bio, location, skills, etc.
- Logout functionality

### ✅ Protected Routes
- `/profile` - Requires authentication
- Other routes are public by default
- Middleware configured in `middleware.ts`

## 🔧 Troubleshooting

### Issue: "Clerk publishable key not found"
**Solution:** Make sure `.env.local` exists and has the correct keys. Restart the dev server after adding keys.

### Issue: Google login doesn't work
**Solution:** 
1. Check that Google is enabled in Clerk Dashboard
2. Make sure you're using `http://localhost:3000` (not `127.0.0.1`)
3. Clear browser cookies and try again

### Issue: User data not showing
**Solution:** The Clerk hooks (`useUser`) only work in client components. Make sure your component has `'use client'` at the top.

## 📚 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk + Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Google OAuth Setup](https://clerk.com/docs/authentication/social-connections/google)

## ✨ What's Next?

Your authentication is now set up! Users can:
- ✅ Sign up with email or Google
- ✅ Log in with email or Google
- ✅ Access protected routes
- ✅ View and edit their profile
- ✅ Log out

Enjoy building your CodeBattle Arena! 🚀

