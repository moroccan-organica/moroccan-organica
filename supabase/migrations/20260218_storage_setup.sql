-- Create storage buckets for products and blog
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog', 'blog', true) 
ON CONFLICT (id) DO NOTHING;

-- Set up access policies (allow public reading)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('products', 'blog'));

-- Allow authenticated users to upload (Admin role)
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('products', 'blog'));
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id IN ('products', 'blog'));
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id IN ('products', 'blog'));
