-- Create cities bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cities', 'cities', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cities bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'cities');
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cities');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'cities');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'cities');
