-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Sling Bags', 'sling-bags', 'Compact and stylish sling bags perfect for daily essentials'),
  ('Side Bags', 'side-bags', 'Versatile side bags with ample storage space'),
  ('Cross Body Bags', 'cross-body-bags', 'Comfortable crossbody bags for hands-free convenience'),
  ('Tote Bags', 'tote-bags', 'Spacious tote bags for work and travel'),
  ('Backpacks', 'backpacks', 'Durable leather backpacks for everyday use')
ON CONFLICT (slug) DO NOTHING;
