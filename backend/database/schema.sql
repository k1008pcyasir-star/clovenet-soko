-- CloveNet Soko Database Schema
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Vendors / Stores
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  owner_name VARCHAR(150) NOT NULL,
  store_name VARCHAR(150) NOT NULL UNIQUE,
  whatsapp VARCHAR(30) NOT NULL UNIQUE,
  location VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,

  password_hash TEXT NOT NULL,

  status VARCHAR(30) NOT NULL DEFAULT 'pending_verification',
  is_verified BOOLEAN NOT NULL DEFAULT false,

  plan VARCHAR(30) NOT NULL DEFAULT 'free',
  product_limit INTEGER NOT NULL DEFAULT 15,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  verified_at TIMESTAMP
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,

  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,

  price NUMERIC(12, 2) NOT NULL,
  old_price NUMERIC(12, 2) NOT NULL DEFAULT 0,

  specs TEXT,
  description TEXT,

  featured BOOLEAN NOT NULL DEFAULT false,

  views INTEGER NOT NULL DEFAULT 0,
  order_clicks INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- 3. Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,

  role VARCHAR(30) NOT NULL DEFAULT 'admin',

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

-- 5. Password Reset OTPs
CREATE TABLE IF NOT EXISTS password_reset_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,

  phone VARCHAR(30) NOT NULL,
  otp_code VARCHAR(10) NOT NULL,

  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
CREATE INDEX IF NOT EXISTS idx_vendors_whatsapp ON vendors(whatsapp);

CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_otps_phone ON password_reset_otps(phone);
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_vendor_id ON password_reset_otps(vendor_id);