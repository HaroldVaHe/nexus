-- Test data seed for Nexus Carpooling App
-- This script creates sample data for testing

BEGIN;

-- Clean up test data first
DELETE FROM review_tag_mapping WHERE tag_id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::UUID, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::UUID, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::UUID, 'ffffffff-ffff-ffff-ffff-ffffffffffff'::UUID);
DELETE FROM review_tags WHERE id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::UUID, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::UUID, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::UUID, 'ffffffff-ffff-ffff-ffff-ffffffffffff'::UUID);
DELETE FROM reviews WHERE trip_id = '55555555-5555-5555-5555-555555555555'::UUID;
DELETE FROM notifications WHERE user_id IN ('11111111-1111-1111-1111-111111111111'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, '33333333-3333-3333-3333-333333333333'::UUID);
DELETE FROM user_devices WHERE user_id IN ('11111111-1111-1111-1111-111111111111'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, '33333333-3333-3333-3333-333333333333'::UUID);
DELETE FROM sabana_coins_ledger WHERE user_id IN ('11111111-1111-1111-1111-111111111111'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, '33333333-3333-3333-3333-333333333333'::UUID);
DELETE FROM payments WHERE booking_id IN ('66666666-6666-6666-6666-666666666666'::UUID, '77777777-7777-7777-7777-777777777777'::UUID);
DELETE FROM bookings WHERE trip_id = '55555555-5555-5555-5555-555555555555'::UUID;
DELETE FROM trips WHERE id = '55555555-5555-5555-5555-555555555555'::UUID;
DELETE FROM vehicles WHERE id = '44444444-4444-4444-4444-444444444444'::UUID;
DELETE FROM user_roles WHERE user_id IN ('11111111-1111-1111-1111-111111111111'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, '33333333-3333-3333-3333-333333333333'::UUID);
DELETE FROM users WHERE id IN ('11111111-1111-1111-1111-111111111111'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, '33333333-3333-3333-3333-333333333333'::UUID);

-- Create test users
INSERT INTO users (id, email, full_name, password_hash, faculty, phone, status, average_rating, total_trips) 
VALUES ('11111111-1111-1111-1111-111111111111'::UUID, 'driver.test@unisabana.edu.co', 'Juan Carlos Pedraza', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvQOu', 'Facultad de Ingeniería', '+57 320 123 4567', 'active', 4.5, 12);

INSERT INTO users (id, email, full_name, password_hash, faculty, phone, status, average_rating, total_trips) 
VALUES ('22222222-2222-2222-2222-222222222222'::UUID, 'passenger.test@unisabana.edu.co', 'María Gómez García', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvQOu', 'Facultad de Administración', '+57 310 987 6543', 'active', 4.0, 8);

INSERT INTO users (id, email, full_name, password_hash, faculty, phone, status, average_rating, total_trips) 
VALUES ('33333333-3333-3333-3333-333333333333'::UUID, 'passenger2.test@unisabana.edu.co', 'Lucas Rodríguez López', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvQOu', 'Facultad de Educación', '+57 301 555 8899', 'active', 3.8, 5);

-- Add user roles
INSERT INTO user_roles (user_id, role) VALUES ('11111111-1111-1111-1111-111111111111'::UUID, 'driver');
INSERT INTO user_roles (user_id, role) VALUES ('22222222-2222-2222-2222-222222222222'::UUID, 'passenger');
INSERT INTO user_roles (user_id, role) VALUES ('33333333-3333-3333-3333-333333333333'::UUID, 'passenger');

-- Create vehicle
INSERT INTO vehicles (id, driver_id, brand, model, color, plate) 
VALUES ('44444444-4444-4444-4444-444444444444'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, 'Toyota', 'Corolla 2023', 'Plata Metálico', 'ABC-1234');

-- Create test trip
INSERT INTO trips (id, driver_id, vehicle_id, origin_name, origin_lat, origin_lng, destination_name, destination_lat, destination_lng, departure_time, total_seats, available_seats, price, status, notes) 
VALUES ('55555555-5555-5555-5555-555555555555'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, '44444444-4444-4444-4444-444444444444'::UUID, 'Universidad de La Sabana - Puerta Principal', 4.870206, -74.156482, 'Centro Comercial Mayorca - Bogotá', 4.688276, -74.045410, NOW() + INTERVAL '3 hours', 4, 2, 25000.00, 'scheduled', 'Viaje de prueba. Depart desde campus, regreso alrededor de las 18:00');

-- Create bookings
INSERT INTO bookings (id, trip_id, passenger_id, status, meeting_point_name, meeting_point_lat, meeting_point_lng) 
VALUES ('66666666-6666-6666-6666-666666666666'::UUID, '55555555-5555-5555-5555-555555555555'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, 'confirmed', 'Parada Transmilenio - Facultad de Administración', 4.870500, -74.156800);

INSERT INTO bookings (id, trip_id, passenger_id, status, meeting_point_name, meeting_point_lat, meeting_point_lng) 
VALUES ('77777777-7777-7777-7777-777777777777'::UUID, '55555555-5555-5555-5555-555555555555'::UUID, '33333333-3333-3333-3333-333333333333'::UUID, 'pending', 'Punto de encuentro - Biblioteca Central', 4.870100, -74.156200);

-- Create payments
INSERT INTO payments (id, booking_id, amount, method, status, provider_reference, paid_at) 
VALUES ('88888888-8888-8888-8888-888888888888'::UUID, '66666666-6666-6666-6666-666666666666'::UUID, 25000.00, 'card', 'success', 'test_payment_ref_001', NOW());

-- Create reviews
INSERT INTO reviews (id, trip_id, reviewer_id, reviewed_user_id, rating, comment) 
VALUES ('99999999-9999-9999-9999-999999999999'::UUID, '55555555-5555-5555-5555-555555555555'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, 5, 'Excelente conductor. Puntual, amable y el vehículo en perfectas condiciones. ¡Muy recomendado!');

INSERT INTO reviews (id, trip_id, reviewer_id, reviewed_user_id, rating, comment) 
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, '55555555-5555-5555-5555-555555555555'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, 4, 'Pasajera cortés y responsable. Sin inconvenientes.');

-- Create review tags
INSERT INTO review_tags (id, name, category) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID, 'Puntual', 'driver');
INSERT INTO review_tags (id, name, category) VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc'::UUID, 'Amable', 'general');
INSERT INTO review_tags (id, name, category) VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd'::UUID, 'Vehiculo limpio', 'vehicle');
INSERT INTO review_tags (id, name, category) VALUES ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::UUID, 'Conversador', 'personality');
INSERT INTO review_tags (id, name, category) VALUES ('ffffffff-ffff-ffff-ffff-ffffffffffff'::UUID, 'Responsable', 'general');

-- Map tags to reviews
INSERT INTO review_tag_mapping (review_id, tag_id) VALUES ('99999999-9999-9999-9999-999999999999'::UUID, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::UUID);
INSERT INTO review_tag_mapping (review_id, tag_id) VALUES ('99999999-9999-9999-9999-999999999999'::UUID, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::UUID);
INSERT INTO review_tag_mapping (review_id, tag_id) VALUES ('99999999-9999-9999-9999-999999999999'::UUID, 'dddddddd-dddd-dddd-dddd-dddddddddddd'::UUID);
INSERT INTO review_tag_mapping (review_id, tag_id) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, 'ffffffff-ffff-ffff-ffff-ffffffffffff'::UUID);
INSERT INTO review_tag_mapping (review_id, tag_id) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID, 'cccccccc-cccc-cccc-cccc-cccccccccccc'::UUID);

-- Create sabana coins
INSERT INTO sabana_coins_ledger (id, user_id, amount, type, description, reference_id) 
VALUES ('10101010-0101-0101-0101-010101010101'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, 50, 'earned', 'Monedas por viaje completado', '55555555-5555-5555-5555-555555555555'::UUID);

INSERT INTO sabana_coins_ledger (id, user_id, amount, type, description, reference_id) 
VALUES ('11111111-0202-0202-0202-020202020202'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, 30, 'earned', 'Monedas por viaje como pasajero', '55555555-5555-5555-5555-555555555555'::UUID);

INSERT INTO sabana_coins_ledger (id, user_id, amount, type, description, reference_id) 
VALUES ('12121212-0303-0303-0303-030303030303'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, 10, 'bonus', 'Bono por excelentes calificaciones', NULL);

INSERT INTO sabana_coins_ledger (id, user_id, amount, type, description, reference_id) 
VALUES ('13131313-0404-0404-0404-040404040404'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, -15, 'spent', 'Descuento en reserva usando monedas Sabana', NULL);

-- Create notifications
INSERT INTO notifications (id, user_id, type, title, message, is_read) 
VALUES ('20202020-0101-0101-0101-010101010101'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, 'booking_confirmed', 'Reserva Confirmada', 'María Gómez ha confirmado su reserva en tu viaje a Centro Comercial Mayorca.', FALSE);

INSERT INTO notifications (id, user_id, type, title, message, is_read) 
VALUES ('21212121-0202-0202-0202-020202020202'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, 'booking_confirmed', 'Reserva Confirmada', 'Tu reserva en el viaje de Juan Carlos Pedraza ha sido confirmada.', TRUE);

INSERT INTO notifications (id, user_id, type, title, message, is_read) 
VALUES ('22222222-0303-0303-0303-030303030303'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, 'rating_received', 'Nueva Calificación', 'María Gómez te ha dejado una calificación de 5 estrellas.', FALSE);

INSERT INTO notifications (id, user_id, type, title, message, is_read) 
VALUES ('23232323-0404-0404-0404-040404040404'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, 'sabana_coins_earned', 'Monedas Sabana Ganadas', 'Has ganado 30 monedas Sabana por completar tu viaje.', TRUE);

-- Create user devices
INSERT INTO user_devices (id, user_id, expo_push_token, platform, is_active) 
VALUES ('30303030-0101-0101-0101-010101010101'::UUID, '11111111-1111-1111-1111-111111111111'::UUID, 'ExponentPushToken[test_driver_device_001]', 'android', TRUE);

INSERT INTO user_devices (id, user_id, expo_push_token, platform, is_active) 
VALUES ('31313131-0202-0202-0202-020202020202'::UUID, '22222222-2222-2222-2222-222222222222'::UUID, 'ExponentPushToken[test_passenger1_device_001]', 'ios', TRUE);

INSERT INTO user_devices (id, user_id, expo_push_token, platform, is_active) 
VALUES ('32323232-0303-0303-0303-030303030303'::UUID, '33333333-3333-3333-3333-333333333333'::UUID, 'ExponentPushToken[test_passenger2_device_001]', 'android', TRUE);

-- Refresh materialized view
REFRESH MATERIALIZED VIEW user_sabana_coins_balance;

COMMIT;

SELECT 'SUCCESS: Test data seed completed' AS status;
