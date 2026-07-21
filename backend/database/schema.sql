-- ===========================================
-- Smart Logistics & Delivery Intelligence Platform
-- Database Schema
-- Team: Gradient Gurus
-- ===========================================
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS smart_logistics_db;
CREATE DATABASE smart_logistics_db;

USE smart_logistics_db;

-- ===========================================
-- CUSTOMERS
-- ===========================================

CREATE TABLE customers (
    customer_id VARCHAR(50) PRIMARY KEY,
    customer_unique_id VARCHAR(50),
    customer_zip_code_prefix INT,
    customer_city VARCHAR(100),
    customer_state VARCHAR(5)
);

-- ===========================================
-- SELLERS
-- ===========================================

CREATE TABLE sellers (
    seller_id VARCHAR(50) PRIMARY KEY,
    seller_zip_code_prefix INT,
    seller_city VARCHAR(100),
    seller_state VARCHAR(5)
);

-- ===========================================
-- PRODUCT CATEGORIES
-- ===========================================

CREATE TABLE product_categories (
    product_category_name VARCHAR(100) PRIMARY KEY,
    product_category_name_english VARCHAR(100)
);

-- ===========================================
-- PRODUCTS
-- ===========================================

CREATE TABLE products (
    product_id VARCHAR(50) PRIMARY KEY,
    product_category_name VARCHAR(100),
    product_name_length INT,
    product_description_length INT,
    product_photos_qty INT,
    product_weight_g FLOAT,
    product_length_cm FLOAT,
    product_height_cm FLOAT,
    product_width_cm FLOAT,

    FOREIGN KEY (product_category_name)
        REFERENCES product_categories(product_category_name)
);

-- ===========================================
-- ORDERS
-- ===========================================

CREATE TABLE orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50),
    order_status VARCHAR(30),

    order_purchase_timestamp DATETIME,
    order_approved_at DATETIME,
    order_delivered_carrier_date DATETIME,
    order_delivered_customer_date DATETIME,
    order_estimated_delivery_date DATETIME,

    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);

-- ===========================================
-- ORDER ITEMS
-- ===========================================

CREATE TABLE order_items (
    order_id VARCHAR(50),
    order_item_id INT,
    product_id VARCHAR(50),
    seller_id VARCHAR(50),

    shipping_limit_date DATETIME,

    price DECIMAL(10,2),
    freight_value DECIMAL(10,2),

    PRIMARY KEY(order_id, order_item_id),

    FOREIGN KEY(order_id)
        REFERENCES orders(order_id),

    FOREIGN KEY(product_id)
        REFERENCES products(product_id),

    FOREIGN KEY(seller_id)
        REFERENCES sellers(seller_id)
);

-- ===========================================
-- PAYMENTS
-- ===========================================

CREATE TABLE payments (
    order_id VARCHAR(50),
    payment_sequential INT,

    payment_type VARCHAR(30),
    payment_installments INT,
    payment_value DECIMAL(10,2),

    PRIMARY KEY(order_id, payment_sequential),

    FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
);

-- ===========================================
-- REVIEWS
-- ===========================================

CREATE TABLE reviews (
    review_id VARCHAR(50),
    order_id VARCHAR(50),

    review_score INT,
    review_comment_title TEXT,
    review_comment_message TEXT,

    review_creation_date DATETIME,
    review_answer_timestamp DATETIME,

    PRIMARY KEY(review_id),

    FOREIGN KEY(order_id)
        REFERENCES orders(order_id)
);

-- ===========================================
-- GEOLOCATION
-- ===========================================

CREATE TABLE geolocation (
    geolocation_zip_code_prefix INT,
    geolocation_lat DECIMAL(10,7),
    geolocation_lng DECIMAL(10,7),
    geolocation_city VARCHAR(100),
    geolocation_state VARCHAR(5)
);