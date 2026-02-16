-- Main seed loader
-- This file tells Supabase to run each file in the seed folder in order.

\ir seed/00_cleanup.sql
\ir seed/01_users.sql
\ir seed/02_customers.sql
\ir seed/03_categories.sql
\ir seed/04_products_part1.sql
\ir seed/04_products_part2.sql
\ir seed/04_products_part3.sql
\ir seed/05_blog.sql
\ir seed/06_seo_static.sql
