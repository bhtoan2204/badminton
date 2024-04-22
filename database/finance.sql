CREATE TABLE finance_income (
    income_id SERIAL PRIMARY KEY,
    id_family INT NOT NULL,
    id_user uuid,
    source VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    income_date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY (id_family) REFERENCES family(id_family),
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE finance_expenditure (
    expenditure_id SERIAL PRIMARY KEY,
    id_family INT NOT NULL,
    id_user uuid,
    category VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    expenditure_date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY (id_family) REFERENCES family(id_family),
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE finance_loans (
    loan_id SERIAL PRIMARY KEY,
    id_family INT NOT NULL,
    creditor VARCHAR(255),
    amount DECIMAL(12, 2) NOT NULL,
    interest_rate DECIMAL(5, 2),
    due_date DATE NOT NULL,
    description TEXT,
    FOREIGN KEY (id_family) REFERENCES family(id_family)
);

CREATE TABLE finance_assets (
    asset_id SERIAL PRIMARY KEY,
    id_family INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    purchase_date DATE,
    description TEXT,
    FOREIGN KEY (id_family) REFERENCES family(id_family)
);

CREATE TABLE financial_summary (
    summary_id SERIAL PRIMARY KEY,
    id_family INT NOT NULL,
    summary_date DATE NOT NULL,
    total_income DECIMAL(12, 2) DEFAULT 0,
    total_expenditure DECIMAL(12, 2) DEFAULT 0,
    daily_balance DECIMAL(12, 2) DEFAULT 0,
    weekly_balance DECIMAL(12, 2) DEFAULT 0,
    monthly_balance DECIMAL(12, 2) DEFAULT 0,
    yearly_balance DECIMAL(12, 2) DEFAULT 0,
    current_balance DECIMAL(12, 2) DEFAULT 0,
    FOREIGN KEY (id_family) REFERENCES family(id_family)
);

ALTER TABLE financial_summary
ADD CONSTRAINT unique_family_date UNIQUE (id_family, summary_date);

CREATE INDEX idx_summary_date ON financial_summary(summary_date);


CREATE OR REPLACE FUNCTION f_update_income_summary()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE financial_summary
    SET total_income = total_income + NEW.amount,
        current_balance = current_balance + NEW.amount
    WHERE id_family = NEW.id_family AND summary_date = NEW.income_date;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_income_summary
AFTER INSERT ON finance_income
FOR EACH ROW
EXECUTE FUNCTION f_update_income_summary();

CREATE OR REPLACE FUNCTION f_update_expenditure_summary()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE financial_summary
    SET total_expenditure = total_expenditure + NEW.amount,
        current_balance = current_balance - NEW.amount
    WHERE id_family = NEW.id_family AND summary_date = NEW.expenditure_date;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_expenditure_summary
AFTER INSERT ON finance_expenditure
FOR EACH ROW
EXECUTE FUNCTION f_update_expenditure_summary();

CREATE TABLE finance_savings (
    savings_id SERIAL PRIMARY KEY,
    id_family INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    savings_date DATE NOT NULL,
    purpose VARCHAR(255),
    target_amount DECIMAL(12, 2),
    estimated_completion_date DATE,
    notes TEXT, -- Ghi chú bổ sung
    FOREIGN KEY (id_family) REFERENCES family(id_family)
);

CREATE INDEX idx_savings_date ON finance_savings(savings_date);

