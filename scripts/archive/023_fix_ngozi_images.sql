-- Update script to ensure images array is populated for Ngozi collection
UPDATE products
SET images = ARRAY[image_url]
WHERE image_url LIKE '/products/ngozi-collection/%'
AND (images IS NULL OR array_length(images, 1) = 0);
