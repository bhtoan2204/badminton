CREATE OR REPLACE FUNCTION encryption(
    plaintext VARCHAR
) RETURNS VARCHAR AS $$
DECLARE 
	encryption_key VARCHAR;
BEGIN
    SELECT key INTO encryption_key 
    FROM key 
    ORDER BY created_at DESC 
    LIMIT 1;
   RETURN pgp_sym_encrypt(plaintext, encryption_key);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decryption(
    ciphertext VARCHAR
) RETURNS VARCHAR AS $$
DECLARE 
	decryption_key VARCHAR;
    decrypted_bytea BYTEA;
BEGIN
	SELECT key INTO decryption_key 
    FROM key 
    ORDER BY created_at DESC 
    LIMIT 1;

    -- Chuyển đổi ciphertext sang kiểu bytea và sau đó giải mã
    decrypted_bytea := pgp_sym_decrypt(ciphertext::BYTEA, decryption_key);
    
    -- Chuyển đổi kết quả giải mã từ bytea sang kiểu VARCHAR
    RETURN decrypted_bytea::TEXT;
END;
$$ LANGUAGE plpgsql;


CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tạo key
CREATE OR REPLACE FUNCTION generate_key(length INT)
RETURNS VARCHAR AS $$
DECLARE
    random_key VARCHAR;
BEGIN
    SELECT gen_salt('md5') || substr(md5(random()::text), 0, length) INTO random_key;

    RETURN random_key;
END;
$$ LANGUAGE plpgsql;

-- Cập nhật key và mã hóa mật khẩu
CREATE OR REPLACE PROCEDURE update_key_value()
AS $$
DECLARE
    new_key VARCHAR;
BEGIN
    -- Giải mã mật khẩu sử dụng key hiện tại
    UPDATE users SET password = decryption(password);

    -- Tạo key mới
    new_key := generate_key(16);

    -- Cập nhật key mới và thời gian cập nhật
    UPDATE key SET key = new_key, updated_at = NOW() WHERE id = 1;

    -- Mã hóa lại mật khẩu sử dụng key mới và cập nhật thời gian cập nhật
    UPDATE users SET password = encryption(password), updated_at = NOW();
END;
$$ LANGUAGE plpgsql;


--call update_key_value()


--insert into "key"("key", created_at, updated_at) values( generate_key(16), now(), now())


CREATE OR REPLACE FUNCTION encrypt_user_password()
RETURNS TRIGGER AS $$
BEGIN
        NEW.password := encryption(NEW.password);
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_user_password_trigger
BEFORE INSERT OR UPDATE OF password ON "users"
FOR EACH ROW
EXECUTE FUNCTION encrypt_user_password();


CREATE OR REPLACE FUNCTION compare_passwords(
    input_password VARCHAR,
    hashed_password VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    decryption_key VARCHAR;
    decrypted_password VARCHAR;
BEGIN
    SELECT key INTO decryption_key 
    FROM key 
    ORDER BY created_at DESC 
    LIMIT 1;

    decrypted_password := pgp_sym_decrypt(hashed_password::BYTEA, decryption_key)::TEXT;
    
    RETURN decrypted_password = input_password;
END;
$$ LANGUAGE plpgsql;


