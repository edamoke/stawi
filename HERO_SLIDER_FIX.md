# Hero Slider Fix Documentation

## Issue: Placeholder Images Not Loading

**Root Cause:** Database column mismatch between what the database had and what the React component expected.

### Database Schema (Before Fix)
```
- title
- subtitle  
- image_url
- cta_text
- cta_link
- display_order
- is_active
```

### Component Expected (hero-slider.tsx)
```typescript
interface HeroSlide {
  id: string
  image_url: string
  alt: string          // ❌ Missing
  heading: string      // ❌ Missing
  subheading: string   // ❌ Missing
  description: string  // ❌ Missing
  position: number     // ❌ Missing (was display_order)
  active: boolean      // ❌ Missing (was is_active)
}
```

## Fix Applied

Added missing columns to `hero_slides` table:
- `heading` (mapped from `title`)
- `subheading` (mapped from `subtitle`)
- `description` (mapped from `subtitle`)
- `alt` (generated from title + subtitle)
- `position` (mapped from `display_order`)
- `active` (mapped from `is_active`)

## Verification

The hero slider should now display correctly with all 3 slides showing proper images and text.

## Current Hero Slides Data

1. **Modern Islamic Fashion**
   - Subheading: "Discover our latest collection of modest and stylish clothing"
   - CTA: "Shop Now" → `/shop`

2. **New Arrivals**
   - Subheading: "Fresh styles for the season"
   - CTA: "View Collection" → `/shop?filter=new`

3. **Special Offers**
   - Subheading: "Up to 30% off on selected items"
   - CTA: "Shop Sale" → `/shop?filter=sale`

## Managing Hero Slides

Admins can manage hero slides at: `/admin/hero-slides` (coming soon)

Or via SQL:

```sql
-- Add a new hero slide
INSERT INTO hero_slides (
  heading, subheading, description, alt, 
  image_url, position, active
) VALUES (
  'Summer Collection',
  'Light and breezy styles',
  'Discover our breathable summer fabrics',
  'Summer Collection - Light and breezy styles',
  '/placeholder.svg?height=600&width=1200',
  4,
  true
);

-- Update a slide
UPDATE hero_slides 
SET active = false 
WHERE heading = 'Special Offers';

-- Reorder slides
UPDATE hero_slides SET position = 1 WHERE heading = 'New Arrivals';
UPDATE hero_slides SET position = 2 WHERE heading = 'Modern Islamic Fashion';
