# Supabase Data & Storage Migration Guide

We have successfully backed up all the data and files from your old paid Supabase project. They are stored in this `supabase_backup/` folder:
- **`data/`**: JSON backups of all 20 tables.
- **`storage/`**: All files from your `products` and `blog` storage buckets.

Follow the instructions below to migrate everything to your new free-tier Supabase project.

---

## 🛠️ Step-by-Step Migration Instructions

### Step 1: Create your new Supabase project
1. Log in to [Supabase](https://supabase.com/).
2. Create a new project (which will be on the free tier).
3. Wait for the project to finish initializing.

### Step 2: Apply database migrations (Schema)
Before inserting data, you need to create the table structure in the new database.
1. In your new Supabase dashboard, go to the **SQL Editor** tab (on the left menu).
2. Open each file in your local `supabase/migrations` folder and execute them in the SQL Editor in order:
   1. `20260216_initial_schema.sql` (Creates all tables & enums)
   2. `20260218_storage_setup.sql` (Creates buckets & RLS policies)
   3. `20260221_add_product_details.sql` (Adds details column)
   4. `20260226_add_product_h1.sql` (Adds h1 column)
   5. `20260304_add_blog_french_columns.sql` (Adds French columns)
   6. `20260618_enable_rls_policies.sql` (Applies security policies)

*Alternatively, if you have Supabase CLI configured locally, you can run:*
```bash
npx supabase db push
```

### Step 3: Configure target credentials
1. Create a new file named `.env.new` in the root of this project.
2. Add your **new** Supabase project URL and **Service Role Key** (found in your new Supabase Dashboard under `Settings > API`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key_here
```
> [!IMPORTANT]
> Make sure to use the **Service Role Key** (starts with `ey...`) and NOT the anon key. The Service Role Key is required to bypass RLS policies and insert the backup data with original IDs.

### Step 4: Run the restoration script
In your project terminal, run the following command to restore all database rows and storage bucket files:
```bash
npx tsx scripts/restore_supabase.ts
```
The script will automatically:
- Create the storage buckets `blog`, `products`, and `moroccanorganica`.
- Upload all 117 files to their correct buckets.
- Import all rows into the 20 database tables in the correct order to satisfy all foreign key constraints.

### Step 5: Update project environment variables
Once the restoration is complete and you have verified the data:
1. Delete or rename your old `.env` file (e.g. to `.env.old`).
2. Rename `.env.new` to `.env` so that your Next.js application connects to your new free-tier database.
3. Test your website locally:
   ```bash
   npm run dev
   ```
4. Deploy the updated env variables to Vercel/production (if applicable).
