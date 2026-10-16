# Deployment

The Nestly frontend is deployed on Vercel in two environments, each talking to its own API.

| | Production | Staging |
| --- | --- | --- |
| Branch | `main` | `staging` |
| URL | https://www.nestlyapp.site | https://staging.nestlyapp.site |
| API | https://api.nestlyapp.site/api | https://api-staging.nestlyapp.site/api |
| Payments | live (real money) | Paystack test mode (test cards only) |
| Search engines | indexed | blocked (robots.txt + noindex) |

## Release flow

1. Merge finished work into `staging`. Vercel deploys it to staging.nestlyapp.site.
2. Testers check it there. A "Staging · test data" badge shows bottom-left on every page.
3. When it passes, merge `staging` into `main`. Vercel deploys it to production.

Deploy the backend before the frontend whenever a release needs new API endpoints (see the backend repo's DEPLOYMENT.md).

## Environment variables (Vercel, Settings, Environment Variables)

`NEXT_PUBLIC_*` values are baked into the build, so redeploy after changing one.

| Variable | Production (environment: Production) | Staging (environment: Preview, branch `staging`) |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | not set | `staging` |
| `NEXT_PUBLIC_API_URL` | https://api.nestlyapp.site/api | https://api-staging.nestlyapp.site/api |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | production | staging account (or same) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | production preset | a separate preset, e.g. one uploading to a `nestly-staging` folder |

In Vercel, add each staging value with the environment set to **Preview** and the branch set to **staging**, so other preview branches don't pick them up.

## One-time staging setup

1. **Git**: `git checkout -b staging && git push -u origin staging`.
2. **Vercel**: Project, Settings, Domains, add `staging.nestlyapp.site` and assign it to the `staging` branch.
3. **DNS**: add the CNAME record Vercel shows for `staging` (usually `cname.vercel-dns.com`).
4. **Variables**: add the staging values from the table above, then redeploy the `staging` branch.
5. **Check**: open https://staging.nestlyapp.site. The staging badge shows, and https://staging.nestlyapp.site/robots.txt says `Disallow: /`.
