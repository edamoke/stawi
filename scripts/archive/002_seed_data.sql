-- Insert default body types
INSERT INTO public.body_types (name, description, thumbnail_url, prompt_modifier, sort_order) VALUES
  ('Slim', 'Slim body type', '/placeholder.svg?height=100&width=100', 'slim and athletic build', 1),
  ('Athletic', 'Athletic body type', '/placeholder.svg?height=100&width=100', 'athletic and toned build', 2),
  ('Average', 'Average body type', '/placeholder.svg?height=100&width=100', 'average and balanced build', 3),
  ('Curvy', 'Curvy body type', '/placeholder.svg?height=100&width=100', 'curvy and full-figured build', 4),
  ('Plus Size', 'Plus size body type', '/placeholder.svg?height=100&width=100', 'plus size and voluptuous build', 5)
ON CONFLICT DO NOTHING;

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Dresses', 'dresses', 'Elegant dresses for all occasions'),
  ('Co-ords', 'co-ords', 'Matching sets and co-ordinated outfits'),
  ('Tops', 'tops', 'Stylish tops and blouses'),
  ('Bottoms', 'bottoms', 'Trousers, skirts, and more')
ON CONFLICT (slug) DO NOTHING;
