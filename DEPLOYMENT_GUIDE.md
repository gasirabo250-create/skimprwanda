# SKIMP Rwanda Vercel Deployment Guide

## Overview
- **Frontend**: https://skimprwanda.vercel.app (React + Vite)
- **Backend**: https://skimprwanda-backend.vercel.app (Express + Node.js)
- **Database**: MongoDB Atlas (SKIMP-RW)

---

## Step 1: Deploy Backend to Vercel

### 1.1 Create Backend Project on Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **skimprwanda** GitHub repository
5. Click **"Import"**
6. In the **Configure Project** screen:
   - **Framework Preset**: Node.js
   - **Root Directory**: `.` (leave as is)
   - Click **"Deploy"**

This creates your first Vercel project. Wait for deployment to complete.

### 1.2 Rename Project to Backend

1. After deployment, go to **Settings** → **General**
2. Scroll to **Project Name**
3. Change it to: `skimprwanda-backend`
4. Click **"Save"**

### 1.3 Add Environment Variables to Backend

1. Still in **Settings**, click **"Environment Variables"** (left sidebar)
2. Add these 4 variables one by one:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI_ATLAS` | `mongodb+srv://gasirabo250_db_user:j5sAibV2aTziYBpI@cluster0.qtdt6dg.mongodb.net/SKIMP-RW` |
   | `JWT_SECRET` | `skimp-secret-key-production-change-later` |
   | `CLIENT_URL` | `https://skimprwanda.vercel.app` |
   | `NODE_ENV` | `production` |

3. Click **"Save"** after each one
4. Vercel automatically redeploys

### 1.4 Test Backend

After redeployment (2-3 min):
- Open: https://skimprwanda-backend.vercel.app/health
- Should see: `{"ok":true}`
- Open: https://skimprwanda-backend.vercel.app/api/brands
- Should see: JSON list of car brands

If you see 404, wait another minute and refresh.

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Frontend Project on Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **skimprwanda** GitHub repository again
5. In **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - Click **"Environment Variables"** and add:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://skimprwanda-backend.vercel.app/api` |
   | `VITE_WHATSAPP_NUMBER` | `250793810796` |

   - Click **"Deploy"**

### 2.2 Rename Project to Frontend

1. After deployment, go to **Settings** → **General**
2. Change project name to: `skimprwanda`
3. Click **"Save"**

### 2.3 Test Frontend

After deployment (2-3 min):
- Open: https://skimprwanda.vercel.app
- Should see: SKIMP Rwanda homepage with car listings
- Try clicking "View all" on Featured Vehicles or Browse Cars
- Should load without errors

---

## Step 3: Verify Everything Works

### Backend Health Checks:
```
https://skimprwanda-backend.vercel.app/health
https://skimprwanda-backend.vercel.app/api/brands
https://skimprwanda-backend.vercel.app/api/vehicles
```

### Frontend:
```
https://skimprwanda.vercel.app
```

Open browser DevTools (F12) → **Console** tab:
- Should see: `[API] Using endpoint: https://skimprwanda-backend.vercel.app/api`
- Should NOT see any red error messages

---

## Step 4: Test Admin Login (Optional)

1. Go to https://skimprwanda.vercel.app/admin/login
2. Email: `admin@skimprwanda.com`
3. Password: `ChangeMe123!`
4. Should log in successfully

---

## Troubleshooting

### Backend still shows 404
- Check Environment Variables are set correctly
- Click **"Deployments"** tab and look for **"View Build Logs"**
- Scroll through logs for errors

### Frontend shows "Cannot reach API"
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser DevTools Console for actual error message
- Verify backend is responding at https://skimprwanda-backend.vercel.app/health

### Database errors
- Verify `MONGODB_URI_ATLAS` is exactly correct
- Make sure MongoDB Atlas allows connections from Vercel's IPs
- Check if database SKIMP-RW exists and has data (was seeded)

---

## Next Steps (After Deployment Works)

1. Change admin password
2. Replace placeholder car images with real ones
3. Update contact information and social media handles
4. Set up proper CI/CD pipeline
5. Enable automatic deployments on git push

