import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema20260519000000 implements MigrationInterface {
  name = 'InitialSchema20260519000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Extensions
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Enums
    await queryRunner.query(`CREATE TYPE user_role_enum AS ENUM ('driver', 'passenger')`);
    await queryRunner.query(`CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'deactivated')`);
    await queryRunner.query(`CREATE TYPE trip_status_enum AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled')`);
    await queryRunner.query(`CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'cancelled', 'completed')`);
    await queryRunner.query(`CREATE TYPE payment_method_enum AS ENUM ('pse', 'card', 'sabana_points')`);
    await queryRunner.query(`CREATE TYPE payment_status_enum AS ENUM ('pending', 'success', 'failed', 'refunded')`);
    await queryRunner.query(`CREATE TYPE notification_type_enum AS ENUM ('booking_confirmed', 'booking_cancelled', 'trip_cancelled', 'trip_modified', 'payment_received', 'rating_received', 'sabana_coins_earned')`);
    await queryRunner.query(`CREATE TYPE coin_type_enum AS ENUM ('earned', 'spent', 'redeemed', 'bonus')`);

    // Tables
    await queryRunner.query(`
      CREATE TABLE users (
        id              UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        email           VARCHAR(255)        NOT NULL UNIQUE,
        full_name       VARCHAR(255)        NOT NULL,
        password_hash   VARCHAR(255),
        profile_photo_url  VARCHAR(500),
        faculty         VARCHAR(150),
        phone           VARCHAR(20),
        status          user_status_enum    NOT NULL DEFAULT 'active',
        ms_graph_token  TEXT,
        refresh_token   TEXT,
        average_rating  DECIMAL(3, 2)       NOT NULL DEFAULT 0,
        total_trips     INTEGER             NOT NULL DEFAULT 0,
        created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        CONSTRAINT ck_email_domain CHECK (email LIKE '%@unisabana.edu.co')
      )
    `);

    await queryRunner.query(`
      CREATE TABLE user_roles (
        user_id     UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role        user_role_enum      NOT NULL,
        created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, role)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE vehicles (
        id                  UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        driver_id           UUID                NOT NULL REFERENCES users(id),
        brand               VARCHAR(100)        NOT NULL,
        model               VARCHAR(100)        NOT NULL,
        color               VARCHAR(50)         NOT NULL,
        plate               VARCHAR(20)         NOT NULL,
        created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        deleted_at          TIMESTAMPTZ
      )
    `);

    await queryRunner.query(`CREATE UNIQUE INDEX uq_driver_plate_active ON vehicles(driver_id, plate) WHERE deleted_at IS NULL`);

    await queryRunner.query(`
      CREATE TABLE trips (
        id                  UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        driver_id           UUID                NOT NULL REFERENCES users(id),
        vehicle_id          UUID                REFERENCES vehicles(id),
        origin_name         VARCHAR(255)        NOT NULL,
        origin_lat          DECIMAL(9, 6)       NOT NULL,
        origin_lng          DECIMAL(9, 6)       NOT NULL,
        destination_name    VARCHAR(255)        NOT NULL,
        destination_lat     DECIMAL(9, 6)       NOT NULL,
        destination_lng     DECIMAL(9, 6)       NOT NULL,
        departure_time      TIMESTAMPTZ         NOT NULL,
        total_seats         INTEGER             NOT NULL CHECK (total_seats > 0 AND total_seats <= 7),
        available_seats     INTEGER             NOT NULL,
        price               DECIMAL(10, 2)      NOT NULL CHECK (price >= 0),
        status              trip_status_enum    NOT NULL DEFAULT 'scheduled',
        notes               TEXT,
        created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        CONSTRAINT ck_available_seats CHECK (available_seats >= 0 AND available_seats <= total_seats)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE bookings (
        id                  UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        trip_id             UUID                NOT NULL REFERENCES trips(id),
        passenger_id        UUID                NOT NULL REFERENCES users(id),
        status              booking_status_enum NOT NULL DEFAULT 'pending',
        meeting_point_name  VARCHAR(255),
        meeting_point_lat   DECIMAL(9, 6),
        meeting_point_lng   DECIMAL(9, 6),
        booked_at           TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_booking_trip_passenger UNIQUE (trip_id, passenger_id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE payments (
        id                  UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id          UUID                NOT NULL UNIQUE REFERENCES bookings(id),
        amount              DECIMAL(10, 2)      NOT NULL CHECK (amount > 0),
        method              payment_method_enum NOT NULL,
        status              payment_status_enum NOT NULL DEFAULT 'pending',
        provider_reference  VARCHAR(255),
        provider_response   JSONB,
        paid_at             TIMESTAMPTZ,
        created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE reviews (
        id                  UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        trip_id             UUID                NOT NULL REFERENCES trips(id),
        reviewer_id         UUID                NOT NULL REFERENCES users(id),
        reviewed_user_id    UUID                NOT NULL REFERENCES users(id),
        rating              INTEGER             NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment             TEXT,
        created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_review_trip_reviewer_reviewed UNIQUE (trip_id, reviewer_id, reviewed_user_id),
        CONSTRAINT ck_different_users CHECK (reviewer_id <> reviewed_user_id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE review_tags (
        id          UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        name        VARCHAR(50)         NOT NULL UNIQUE,
        category    VARCHAR(50),
        created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE review_tag_mapping (
        review_id   UUID                NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
        tag_id      UUID                NOT NULL REFERENCES review_tags(id) ON DELETE CASCADE,
        PRIMARY KEY (review_id, tag_id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE sabana_coins_ledger (
        id          UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID                NOT NULL REFERENCES users(id),
        amount      INTEGER             NOT NULL,
        type        coin_type_enum      NOT NULL,
        description VARCHAR(255),
        reference_id UUID,
        created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE notifications (
        id          UUID                    PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID                    NOT NULL REFERENCES users(id),
        type        notification_type_enum  NOT NULL,
        title       VARCHAR(255)            NOT NULL,
        message     TEXT                    NOT NULL,
        is_read     BOOLEAN                 NOT NULL DEFAULT FALSE,
        created_at  TIMESTAMPTZ             NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE user_devices (
        id              UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id         UUID                NOT NULL REFERENCES users(id),
        expo_push_token VARCHAR(255)        NOT NULL,
        platform        VARCHAR(10)         NOT NULL CHECK (platform IN ('ios', 'android')),
        is_active       BOOLEAN             NOT NULL DEFAULT TRUE,
        created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_user_token UNIQUE (user_id, expo_push_token)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE saved_cards (
        id              UUID                PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id         UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        brand           VARCHAR(50)         NOT NULL,
        last_four       VARCHAR(4)          NOT NULL,
        exp_month       INTEGER             NOT NULL CHECK (exp_month >= 1 AND exp_month <= 12),
        exp_year        INTEGER             NOT NULL,
        cardholder_name VARCHAR(255)        NOT NULL,
        is_default      BOOLEAN             NOT NULL DEFAULT FALSE,
        created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
      )
    `);

    // Indexes
    await queryRunner.query(`CREATE INDEX idx_vehicles_driver_id ON vehicles(driver_id)`);
    await queryRunner.query(`CREATE INDEX idx_trips_driver_id ON trips(driver_id)`);
    await queryRunner.query(`CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id)`);
    await queryRunner.query(`CREATE INDEX idx_trips_status ON trips(status)`);
    await queryRunner.query(`CREATE INDEX idx_trips_departure_time ON trips(departure_time)`);
    await queryRunner.query(`CREATE INDEX idx_trips_departure_time_status ON trips(departure_time, status) WHERE status = 'scheduled'`);
    await queryRunner.query(`CREATE INDEX idx_trips_origin_coords ON trips(origin_lat, origin_lng)`);
    await queryRunner.query(`CREATE INDEX idx_trips_destination_coords ON trips(destination_lat, destination_lng)`);
    await queryRunner.query(`CREATE INDEX idx_bookings_trip_id ON bookings(trip_id)`);
    await queryRunner.query(`CREATE INDEX idx_bookings_passenger_id ON bookings(passenger_id)`);
    await queryRunner.query(`CREATE INDEX idx_bookings_status ON bookings(status)`);
    await queryRunner.query(`CREATE INDEX idx_bookings_trip_status ON bookings(trip_id, status)`);
    await queryRunner.query(`CREATE INDEX idx_payments_booking_id ON payments(booking_id)`);
    await queryRunner.query(`CREATE INDEX idx_payments_status ON payments(status)`);
    await queryRunner.query(`CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id)`);
    await queryRunner.query(`CREATE INDEX idx_reviews_reviewed_user_id ON reviews(reviewed_user_id)`);
    await queryRunner.query(`CREATE INDEX idx_reviews_trip_id ON reviews(trip_id)`);
    await queryRunner.query(`CREATE INDEX idx_notifications_user_id ON notifications(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE`);
    await queryRunner.query(`CREATE INDEX idx_sabana_coins_user_id ON sabana_coins_ledger(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_sabana_coins_type ON sabana_coins_ledger(type)`);
    await queryRunner.query(`CREATE INDEX idx_user_devices_user_id ON user_devices(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_user_devices_token ON user_devices(expo_push_token)`);
    await queryRunner.query(`CREATE INDEX idx_saved_cards_user_id ON saved_cards(user_id)`);

    // Triggers
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    await queryRunner.query(`CREATE TRIGGER trigger_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    await queryRunner.query(`CREATE TRIGGER trigger_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    await queryRunner.query(`CREATE TRIGGER trigger_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    await queryRunner.query(`CREATE TRIGGER trigger_user_devices_updated_at BEFORE UPDATE ON user_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);
    await queryRunner.query(`CREATE TRIGGER trigger_saved_cards_updated_at BEFORE UPDATE ON saved_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION decrement_available_seats()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
          UPDATE trips SET available_seats = available_seats - 1 WHERE id = NEW.trip_id;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`CREATE TRIGGER trigger_decrement_seats AFTER INSERT OR UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION decrement_available_seats()`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION increment_available_seats()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
          UPDATE trips SET available_seats = available_seats + 1 WHERE id = NEW.trip_id;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`CREATE TRIGGER trigger_increment_seats AFTER UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION increment_available_seats()`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_user_average_rating()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE users
        SET average_rating = COALESCE(
          (SELECT AVG(rating) FROM reviews WHERE reviewed_user_id = NEW.reviewed_user_id), 0
        )
        WHERE id = NEW.reviewed_user_id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`CREATE TRIGGER trigger_update_average_rating AFTER INSERT ON reviews FOR EACH ROW EXECUTE FUNCTION update_user_average_rating()`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION increment_total_trips()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
          UPDATE users SET total_trips = total_trips + 1 WHERE id = NEW.driver_id;
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    await queryRunner.query(`CREATE TRIGGER trigger_increment_total_trips AFTER UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION increment_total_trips()`);

    // Materialized view
    await queryRunner.query(`
      CREATE MATERIALIZED VIEW user_sabana_coins_balance AS
      SELECT
        user_id,
        COALESCE(SUM(amount), 0) AS balance,
        COALESCE(SUM(CASE WHEN type = 'earned' OR type = 'bonus' THEN amount ELSE 0 END), 0) AS total_earned,
        COALESCE(SUM(CASE WHEN type = 'spent' OR type = 'redeemed' THEN ABS(amount) ELSE 0 END), 0) AS total_spent
      FROM sabana_coins_ledger
      GROUP BY user_id
    `);

    // Seed data
    await queryRunner.query(`
      INSERT INTO review_tags (name, category) VALUES
        ('puntual', 'comportamiento'),
        ('seguro', 'seguridad'),
        ('amable', 'comportamiento'),
        ('ordenado', 'comportamiento'),
        ('conversador', 'comportamiento'),
        ('respetuoso', 'comportamiento'),
        ('música alta', 'comportamiento'),
        ('conductor responsable', 'seguridad'),
        ('vehículo limpio', 'comportamiento'),
        ('flexible con horario', 'comportamiento')
    `);

    // Comments
    await queryRunner.query(`COMMENT ON TABLE users IS 'Core user table for verified university members'`);
    await queryRunner.query(`COMMENT ON TABLE vehicles IS 'Registered vehicles by drivers for trip assignments'`);
    await queryRunner.query(`COMMENT ON TABLE trips IS 'Published trips by drivers with route and seat details'`);
    await queryRunner.query(`COMMENT ON TABLE bookings IS 'Seat reservations linking passengers to trips'`);
    await queryRunner.query(`COMMENT ON TABLE payments IS 'Payment records for completed bookings'`);
    await queryRunner.query(`COMMENT ON TABLE reviews IS 'User ratings and reviews after completed trips'`);
    await queryRunner.query(`COMMENT ON TABLE sabana_coins_ledger IS 'Ledger for Sabana Coins incentive transactions'`);
    await queryRunner.query(`COMMENT ON TABLE notifications IS 'Push and in-app notifications for users'`);
    await queryRunner.query(`COMMENT ON TABLE user_devices IS 'Device tokens for push notification delivery'`);
    await queryRunner.query(`COMMENT ON TABLE saved_cards IS 'Saved card references for quick payments'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse dependency order
    await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS user_sabana_coins_balance`);

    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_increment_total_trips ON trips`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_average_rating ON reviews`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_increment_seats ON bookings`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_decrement_seats ON bookings`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_saved_cards_updated_at ON saved_cards`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_user_devices_updated_at ON user_devices`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_payments_updated_at ON payments`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_trips_updated_at ON trips`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_vehicles_updated_at ON vehicles`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_users_updated_at ON users`);

    await queryRunner.query(`DROP FUNCTION IF EXISTS increment_total_trips`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_user_average_rating`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS increment_available_seats`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS decrement_available_seats`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column`);

    await queryRunner.query(`DROP TABLE IF EXISTS saved_cards CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_devices CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS notifications CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS review_tag_mapping CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS review_tags CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS reviews CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS payments CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS bookings CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS trips CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS vehicles CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_roles CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS sabana_coins_ledger CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE`);

    await queryRunner.query(`DROP TYPE IF EXISTS coin_type_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS notification_type_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_method_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS booking_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS trip_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_status_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
  }
}
