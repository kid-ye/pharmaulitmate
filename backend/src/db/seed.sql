-- Admin (password: admin123)
INSERT INTO admins (email, password_hash, name) VALUES
('admin@WombAndBeyond.com', '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Admin User')
ON CONFLICT (email) DO NOTHING;

-- Products
INSERT INTO products (name, sku, category, price, original_price, stock, status, is_new, is_sold_out, image1, image2, rating, reviews_count, featured_order, description, date_added) VALUES
('Complete First Aid Kit',       'EKM-KIT-001', 'Medical Kits',        1299, 1799, 24, 'In Stock',    FALSE, FALSE, '/images/product-first-aid-kit.svg',    '/images/product-emergency-hamper.svg', 4.8, 47,  10, 'Comprehensive first aid kit for homes and offices.',          '2024-01-01'),
('Home Care Medical Kit',        'EKM-KIT-002', 'Medical Kits',         999, 1299,  4, 'Low Stock',   FALSE, FALSE, '/images/product-home-care-kit.svg',    '/images/product-first-aid-kit.svg',    4.6, 32,   9, 'Essential home care supplies in one organized kit.',          '2024-02-15'),
('Diagnostic Essentials Kit',    'EKM-DIA-001', 'Diagnostics',          849, 1299, 31, 'In Stock',    FALSE, FALSE, '/images/product-diagnostic-kit.svg',   '/images/product-home-care-kit.svg',    4.9, 128, 12, 'Thermometer, oximeter, stethoscope and more.',               '2023-11-20'),
('Medicine Organizer Pack',      'EKM-DIA-002', 'Diagnostics',          749, NULL,  2, 'Low Stock',   FALSE, FALSE, '/images/product-medicine-pack.svg',    '/images/product-diagnostic-kit.svg',   4.7, 85,   8, 'Compact organizer for daily medicines and supplements.',      '2024-03-10'),
('Wound Care Components Set',    'EKM-WND-001', 'Wound Care',           399,  699, 18, 'In Stock',    FALSE, FALSE, '/images/product-wound-care.svg',       '/images/product-first-aid-kit.svg',    4.8, 210, 11, 'Sterile dressings, bandages, and antiseptic components.',    '2023-09-05'),
('Sterile Dressing Refill Pack', 'EKM-WND-002', 'Wound Care',           449, NULL,  0, 'Out of Stock',FALSE, TRUE,  '/images/product-wound-care.svg',       '/images/product-medicine-pack.svg',    4.5, 18,   7, 'Refill pack for wound care kits.',                           '2024-04-01'),
('PPE Safety Pack',              'EKM-PPE-001', 'PPE',                  699,  999,  8, 'In Stock',    TRUE,  FALSE, '/images/product-ppe-pack.svg',         '/images/product-surgical-tools.svg',   5.0,  5,  15, 'Masks, gloves, and face shields for workplace safety.',      '2024-05-01'),
('Emergency Response Hamper',    'EKM-EMG-001', 'Emergency Kits',      2499, NULL,  3, 'Low Stock',   FALSE, FALSE, '/images/product-emergency-hamper.svg', '/images/product-first-aid-kit.svg',    4.9, 42,  14, 'Complete emergency hamper for homes and workplaces.',        '2023-12-10'),
('Surgical Tools Starter Kit',   'EKM-CLN-001', 'Clinical Components', 1599, NULL, 42, 'In Stock',    FALSE, FALSE, '/images/product-surgical-tools.svg',   '/images/product-diagnostic-kit.svg',   4.7, 93,   6, 'Basic surgical tools for clinic restocking.',                '2024-01-20'),
('Mask and Gloves Refill Set',   'EKM-PPE-002', 'PPE',                  299, NULL, 15, 'In Stock',    FALSE, FALSE, '/images/product-ppe-pack.svg',         '/images/product-home-care-kit.svg',    4.6, 54,   5, 'Refill set of masks and gloves for PPE packs.',              '2024-02-28'),
('Clinic Restock Bundle',        'EKM-CLN-002', 'Clinical Components', 2499, NULL,  0, 'Out of Stock',FALSE, TRUE,  '/images/about-medical-components.svg', '/images/product-wound-care.svg',       4.9, 112, 13, 'Bulk restock bundle for clinics and medical facilities.',    '2024-03-05'),
('Travel Emergency Kit',         'EKM-EMG-002', 'Emergency Kits',      1499, NULL, 11, 'In Stock',    FALSE, FALSE, '/images/product-emergency-hamper.svg', '/images/product-home-care-kit.svg',    4.8, 88,  16, 'Compact emergency kit designed for travel.',                 '2024-04-15')
ON CONFLICT (sku) DO NOTHING;

-- Demo users (password for all: demo1234)
INSERT INTO users (name, email, password_hash, city, segment) VALUES
('Priya Sharma',  'priya.sharma@example.com',  '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Mumbai',    'Clinic Buyer'),
('Ananya Roy',    'ananya.roy@example.com',    '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Delhi',     'Home Care'),
('Meera Iyer',    'meera.iyer@example.com',    '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Bangalore', 'Workplace Safety'),
('Roshni Gupta',  'roshni.gupta@example.com',  '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Hyderabad', 'Emergency Kits'),
('Kavya Nair',    'kavya.nair@example.com',    '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Chennai',   'Home Care'),
('Divya Singh',   'divya.singh@example.com',   '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Pune',      'Diagnostics'),
('Shreya Pillai', 'shreya.pillai@example.com', '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Kochi',     'Clinic Buyer'),
('Tanvi Mehta',   'tanvi.mehta@example.com',   '$2a$10$N95U77DzGy589j9UR0sH1euOzMeRAQOmfEhM5vShBtjbYzFnZes/q', 'Ahmedabad', 'PPE')
ON CONFLICT (email) DO NOTHING;

-- Orders
INSERT INTO orders (order_ref, customer_id, customer_name, customer_email, subtotal, shipping, total, status, created_at) VALUES
('EKM-1042', 1, 'Priya Sharma',  'priya.sharma@example.com',  1299, 0,  1299, 'Delivered',  '2024-05-10 10:00:00'),
('EKM-1041', 2, 'Ananya Roy',    'ananya.roy@example.com',     999, 0,   999, 'Shipped',    '2024-05-10 09:30:00'),
('EKM-1040', 3, 'Meera Iyer',    'meera.iyer@example.com',     798, 0,   798, 'Processing', '2024-05-09 14:00:00'),
('EKM-1039', 4, 'Roshni Gupta',  'roshni.gupta@example.com',  2499, 0,  2499, 'Delivered',  '2024-05-09 11:00:00'),
('EKM-1038', 5, 'Kavya Nair',    'kavya.nair@example.com',     999, 0,   999, 'Pending',    '2024-05-09 08:00:00'),
('EKM-1037', 6, 'Divya Singh',   'divya.singh@example.com',    599, 60,  659, 'Shipped',    '2024-05-08 16:00:00'),
('EKM-1036', 7, 'Shreya Pillai', 'shreya.pillai@example.com', 1599, 0,  1599, 'Delivered',  '2024-05-08 12:00:00'),
('EKM-1035', 8, 'Tanvi Mehta',   'tanvi.mehta@example.com',    299, 60,  359, 'Cancelled',  '2024-05-07 10:00:00')
ON CONFLICT (order_ref) DO NOTHING;

-- Order Items
INSERT INTO order_items (order_id, product_id, product_name, qty, price_at_purchase) VALUES
(1, 1,  'Complete First Aid Kit',       1, 1299),
(2, 3,  'Diagnostic Essentials Kit',    1,  999),
(3, 5,  'Wound Care Components Set',    2,  399),
(4, 8,  'Emergency Response Hamper',    1, 2499),
(5, 2,  'Home Care Medical Kit',        1,  999),
(6, 4,  'Medicine Organizer Pack',      1,  599),
(7, 9,  'Surgical Tools Starter Kit',   1, 1599),
(8, 10, 'Mask and Gloves Refill Set',   1,  299)
ON CONFLICT DO NOTHING;

-- Reviews
INSERT INTO reviews (product_id, customer_id, customer_name, rating, text, is_featured) VALUES
(1, 1, 'Priya Sharma',  5, 'The first aid kit is neatly packed and easy to use during rushed moments.',                    TRUE),
(3, 2, 'Ananya Roy',    5, 'Our clinic restocked wound care components from here and the quality felt consistent.',        TRUE),
(8, 3, 'Meera Iyer',    5, 'The emergency hamper made our office medical shelf feel properly prepared.',                   TRUE),
(7, 6, 'Divya Singh',   4, 'Good quality refills for our office safety shelf.',                                            FALSE),
(3, 2, 'Ananya Roy',    5, 'Useful starter kit with the basics we needed.',                                                FALSE),
(5, 3, 'Meera Iyer',    5, 'The refill pack made clinic restocking much faster.',                                          FALSE)
ON CONFLICT DO NOTHING;
