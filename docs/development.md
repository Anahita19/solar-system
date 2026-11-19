# توسعه، پیکربندی و استقرار

## پیش‌نیازها

- Node.js سازگار با محیط Cloud و `pnpm` مطابق `packageManager` در `package.json`.
- MySQL سازگار با MySQL 8.
- تنظیمات OAuth/session پلتفرم در اجرای کامل.
- دسترسی به سرویس Maps و اعلان پلتفرم برای ویژگی‌های مربوطه.

## متغیرهای محیطی

مقادیر را در secret/config manager محیط توسعه یا استقرار وارد کنید؛ `.env` واقعی را commit نکنید.

| نام | حساس | کاربرد |
| --- | --- | --- |
| `DATABASE_URL` | بله | اتصال Drizzle و برنامه به MySQL |
| `MANUS_PROJECT_ID` | کم‌حساس/زیرساخت | شناسه پروژه OAuth |
| `MANUS_JWT_SECRET` | بله | امضای نشست/auth |
| `MANUS_OAUTH_API_URL` | زیرساخت | سرویس سمت سرور OAuth |
| `MANUS_OAUTH_PORTAL_URL` | عمومی | آدرس پورتال ورود |
| `MANUS_API_URL` | زیرساخت | پایه endpointهای Maps و اعلان |
| `MANUS_API_KEY` | بله | کلید API سمت سرور برای Maps proxy و اعلان |
| `MANUS_API_BROWSER_KEY` | عمومی | پیکربندی public پلتفرم؛ کد نقشه فعلی از endpoint server-side استفاده می‌کند |
| `SOLACE_OWNER_EMAIL` | بله | ایمیل مجاز برای بررسی مالک در `/admin` |
| `PORT` | خیر | پورت سرور، پیش‌فرض 3000 |
| `NODE_ENV` | خیر | حالت اجرای Node؛ dev در script توسعه تعیین می‌شود |

مقادیر `MANUS_*` در محیط مدیریت‌شده توسط پلتفرم فراهم می‌شوند. برای اجرای خارج از آن، قرارداد OAuth و Maps را با provider سازگار تنظیم کنید. `MANUS_API_KEY` هرگز نباید در متغیرهای build فرانت‌اند یا فایل tracked قرار بگیرد.

## اجرای محلی

```bash
pnpm install
# DATABASE_URL و secrets لازم را از محیط امن فراهم کنید
pnpm db:migrate
pnpm dev
```

سرور dev روی `PORT` و به‌طور پیش‌فرض `3000` اجرا می‌شود. در اجرای بدون DB، برنامه اصلی ممکن است بالا بیاید اما ثبت lead/admin کار نمی‌کند. برآورد آدرس به endpoint Maps نیاز دارد. برای کار آفلاین با صفحات فقط نمایشی از `pnpm dev:static` استفاده کنید؛ این فرمان Express، DB، احراز هویت و API نقشه را فراهم نمی‌کند.

## پایگاه داده

- `pnpm db:migrate`: اجرای migrationهای checked-in در `drizzle/`.
- `pnpm db:push`: تولید migration جدید از schema و اعمال آن؛ فقط برای تغییر آگاهانه schema.
- schema در `drizzle/schema.ts` و اتصال Drizzle در `drizzle.config.ts` است.
- migration موجود جدول `leads` را اضافه می‌کند؛ برای داده‌های محیط اشتراکی، قبل از تغییر schema از DB backup بگیرید.

## کنترل کیفیت

```bash
pnpm check       # TypeScript
pnpm test        # Vitest
pnpm build       # فرانت‌اند و سرور production
```

پس از تغییر مسیرها، `client/public/manus-routes.json` را هم به‌روز کنید.

## استقرار و دمو

این برنامه به runtime دارای Node/Express، MySQL، secrets، OAuth و proxy API نیاز دارد. GitHub Pages فقط فایل ایستا میزبانی می‌کند؛ بنابراین مسیرهای `/api/trpc`، `/api/property-map`، ورود مالک و persistence را اجرا نمی‌کند. برای دموی تعاملی از میزبانی Node-capable و DB استفاده کنید؛ envهای `all`, `dev`, `production` را طبق محیط تعیین کنید، migrationها را اعمال کنید و `/api/health` را برای health check تنظیم کنید.

انتقال مخزن به GitHub به‌تنهایی برنامه را deploy یا public نمی‌کند و تغییر visibility/publication باید جداگانه از مسیر رسمی همان سرویس انجام شود. عکس‌های داخل repo باعث می‌شوند رابط در clone قابل مشاهده باشد؛ بدون backend، تخمین‌های مبتنی بر آدرس، lead capture و `/admin` فعال نیستند.
