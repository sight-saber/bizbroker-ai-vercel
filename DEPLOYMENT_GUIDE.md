# 🚀 Deployment Guide - Valuation Agent

**Target Platform:** Vercel
**Region:** Singapore (sin1)
**Status:** Production Ready ✅

---

## Pre-Deployment Checklist

### ✅ Code Ready
- [x] All tests passing
- [x] All bugs fixed
- [x] Code reviewed
- [x] Environment variables documented

### ✅ Airtable Ready
- [x] Valuations table created (20 fields)
- [x] API key configured
- [x] Test records working

### ✅ APIs Ready
- [x] Claude API key valid
- [x] All endpoints tested
- [x] Error handling complete

---

## Deployment Steps

### Step 1: Verify Build Locally

```bash
# Clean install
rm -rf .next node_modules
npm install

# Build for production
npm run build

# Test production build
npm start
# Visit http://localhost:3000
```

**Expected Output:**
```
✓ Compiled successfully
✓ Ready on http://localhost:3000
```

---

### Step 2: Create Vercel Account

1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Verify email

---

### Step 3: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add remote (replace with your repo)
git remote add origin https://github.com/yourusername/bizbroker-ai-vercel.git

# Add all files
git add .

# Commit
git commit -m "Production ready - Valuation Agent MVP

- ✅ Complete valuation calculation engine
- ✅ Airtable integration
- ✅ PDF export
- ✅ History tracking
- ✅ Input validation
- ✅ Error handling
- ✅ All tests passing

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to GitHub
git push -u origin main
```

---

### Step 4: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Go to [vercel.com/new](https://vercel.com/new)**

2. **Import Git Repository**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**

   Click "Environment Variables" and add:

   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
   AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
   AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   RESEND_API_KEY=re_XXXXXXXXXXXXXXXXX
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ADMIN_EMAIL=your@email.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

   **Important:**
   - Select "Production", "Preview", and "Development" for all variables
   - Use your actual Vercel URL for `NEXT_PUBLIC_APP_URL` (you'll get this after first deployment, can update later)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Deployment complete!

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - What's your project's name? bizbroker-ai-valuation
# - In which directory is your code located? ./
# - Want to override the settings? No

# Add environment variables
vercel env add ANTHROPIC_API_KEY
vercel env add AIRTABLE_API_KEY
vercel env add AIRTABLE_BASE_ID
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
vercel env add ADMIN_EMAIL
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

---

### Step 5: Update Environment Variables

After first deployment, you'll get a URL like:
```
https://bizbroker-ai-valuation.vercel.app
```

**Update `NEXT_PUBLIC_APP_URL`:**

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `NEXT_PUBLIC_APP_URL`
3. Update value to your actual URL
4. Click "Save"
5. Redeploy (click "Deployments" → "..." → "Redeploy")

---

### Step 6: Verify Deployment

**Visit your deployed URL:**
```
https://your-app.vercel.app
```

**Test Checklist:**

1. ✅ **Homepage loads**
   - Valuation Agent card displays
   - "Start Valuation Consultation" button works

2. ✅ **Start conversation**
   - Click button
   - Agent sends first message

3. ✅ **Complete Q&A**
   - Answer 7 questions
   - Responses display correctly

4. ✅ **Calculate valuation**
   - Click "Calculate" button
   - Results display (3 tiers)

5. ✅ **Save to Airtable**
   - Click "Save" button
   - Check Airtable for new record

6. ✅ **View history**
   - Click "History" button
   - Modal shows records

7. ✅ **Export PDF**
   - Click "Export PDF"
   - New window opens with report

---

## Post-Deployment Configuration

### Custom Domain (Optional)

1. **Purchase Domain** (e.g., `valuationagent.sg`)

2. **Add to Vercel:**
   - Go to Project → Settings → Domains
   - Enter your domain
   - Follow DNS configuration instructions

3. **Update Environment Variable:**
   ```env
   NEXT_PUBLIC_APP_URL=https://valuationagent.sg
   ```

4. **Redeploy**

---

### Vercel Configuration

**`vercel.json`** (already configured):

```json
{
  "regions": ["sin1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

**Settings:**
- Region: Singapore (sin1) - Lowest latency for SG users
- Max Duration: 30s - Handles Claude API calls
- Node Version: 20.x (auto)

---

### Performance Optimization

**Already Configured:**
- ✅ Next.js 14 optimizations
- ✅ API routes optimized
- ✅ Static generation where possible
- ✅ Image optimization (built-in)

**Optional Enhancements:**
- Enable Vercel Analytics
- Enable Vercel Speed Insights
- Configure caching headers

---

## Monitoring & Maintenance

### Vercel Dashboard

**Access:** [vercel.com/dashboard](https://vercel.com/dashboard)

**Monitor:**
- Deployments (history, logs)
- Analytics (if enabled)
- Function logs (errors, performance)
- Bandwidth usage

### Error Tracking (Optional)

**Setup Sentry:**

```bash
npm install @sentry/nextjs

# Follow setup wizard
npx @sentry/wizard@latest -i nextjs
```

---

## Troubleshooting

### Build Fails

**Check:**
1. All dependencies in `package.json`
2. Environment variables set correctly
3. No TypeScript errors: `npm run build` locally

**Common Issues:**
- Missing dependencies → `npm install`
- TypeScript errors → Check `DEPLOYMENT_GUIDE.md`
- Environment variables → Verify in Vercel dashboard

### Runtime Errors

**Check Vercel Function Logs:**
1. Go to Deployments
2. Click on deployment
3. Click "Functions" tab
4. View logs for errors

**Common Issues:**
- API key invalid → Update environment variables
- Airtable connection → Check API key and Base ID
- Claude API rate limit → Wait or upgrade plan

### API Timeouts

**If Claude API is slow:**
1. Current timeout: 30s (configured)
2. If needed, increase in `vercel.json`:
   ```json
   "maxDuration": 60
   ```
3. Note: Requires Pro plan for >30s

---

## Rollback Plan

**If something goes wrong:**

1. **Via Dashboard:**
   - Go to Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Via CLI:**
   ```bash
   vercel rollback
   ```

---

## Cost Estimation

### Vercel

| Plan | Price | Includes |
|------|-------|----------|
| Hobby | Free | 100GB bandwidth, Basic analytics |
| Pro | $20/mo | Unlimited bandwidth, Speed Insights |

**Expected Usage (MVP):**
- ~1,000 valuations/month
- ~5GB bandwidth
- **Cost: $0** (Hobby plan sufficient)

### APIs

| Service | Cost |
|---------|------|
| Anthropic Claude | ~$15-30/mo (1000 valuations) |
| Airtable | Free (1,200 records/base) |
| Resend | Free (3,000 emails/mo) |

**Total Monthly Cost: ~$15-30** (mostly Claude API)

---

## Security Best Practices

### ✅ Already Implemented
- Environment variables (not in code)
- API keys secured
- Input validation
- Error messages safe (no data leakage)

### Recommended
1. **Enable Rate Limiting** (Vercel Edge Config)
2. **Add Authentication** (NextAuth.js) for admin
3. **Setup Monitoring** (Sentry)
4. **Regular Backups** (Airtable exports)

---

## Scaling Considerations

### Current Capacity
- **API:** 30s timeout handles Claude
- **Database:** Airtable free (1,200 records)
- **Bandwidth:** Vercel free (100GB)

### When to Scale
- \>1,000 records → Airtable paid plan ($20/mo)
- \>100GB bandwidth → Vercel Pro ($20/mo)
- \>10,000 valuations/mo → Claude rate limit increase

---

## Continuous Deployment

**Automatic Deployments:**

1. **Every push to `main`** → Production deployment
2. **Every PR** → Preview deployment
3. **Every branch** → Preview URL

**Disable if needed:**
- Go to Settings → Git → Uncheck "Production Branch"

---

## Next Steps After Deployment

### Week 1: Monitor
- [ ] Check error logs daily
- [ ] Monitor Airtable record count
- [ ] Track user feedback
- [ ] Fix urgent bugs

### Week 2-4: Iterate
- [ ] Add requested features
- [ ] Optimize performance
- [ ] Improve UX based on feedback
- [ ] Add analytics

### Month 2+: Scale
- [ ] Marketing and user acquisition
- [ ] Add payment (if monetizing)
- [ ] Expand features (restore other agents?)
- [ ] Enterprise features

---

## Support Contacts

### Platform Issues
- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **Airtable:** [support.airtable.com](https://support.airtable.com)
- **Anthropic:** [support@anthropic.com](mailto:support@anthropic.com)

### Documentation
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **This Project:** See `README.md`, `TESTING_GUIDE.md`

---

## 🎉 You're Ready to Deploy!

**Quick Deploy Command:**
```bash
# From project root
vercel --prod
```

**Or via Dashboard:**
[vercel.com/new](https://vercel.com/new) → Import your GitHub repo

---

**Good luck with your deployment! 🚀**

Questions? See `QUICK_START.md` or `FINAL_TEST_REPORT.md`
