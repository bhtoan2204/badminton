CREATE TABLE shopping_lists (
    id_list SERIAL PRIMARY KEY,
    id_family INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Active',
    FOREIGN KEY (id_family) REFERENCES family(id_family)
);

CREATE TABLE shopping_items (
    id_item SERIAL PRIMARY KEY,
    id_list INTEGER NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    priority INTEGER DEFAULT 1,
    is_purchased BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_list) REFERENCES shopping_lists(id_list)
);

CREATE INDEX idx_shoppinglists_family ON shopping_lists(id_family);
CREATE INDEX idx_items_list ON shopping_items(id_list);

ALTER TABLE shopping_items ADD COLUMN item_type VARCHAR(50);
ALTER TABLE shopping_items ADD CONSTRAINT chk_item_type CHECK (item_type IN ('consumable', 'durable'));

ALTER TABLE shopping_items ADD COLUMN priority_level INTEGER DEFAULT 1;
ALTER TABLE shopping_items ADD CONSTRAINT chk_priority_level CHECK (priority_level BETWEEN 1 AND 10);

ALTER TABLE shopping_items ADD COLUMN reminder_date TIMESTAMP;

CREATE TABLE shopping_purchase_history (
    id_history SERIAL PRIMARY KEY,
    id_item INTEGER NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price DECIMAL(10, 2),
    FOREIGN KEY (id_item) REFERENCES shopping_items(id_item)
);

CREATE TABLE shopping_promotions (
    id_promotion SERIAL PRIMARY KEY,
    item_name VARCHAR(255),
    discount_rate DECIMAL(5, 2),
    start_date TIMESTAMP,
    end_date TIMESTAMP
);
