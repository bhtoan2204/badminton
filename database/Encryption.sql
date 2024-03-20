-- Hàm mã hóa
CREATE OR REPLACE FUNCTION encryption(data TEXT)
RETURNS TEXT AS $$
DECLARE
    p_key TEXT;
BEGIN
    -- Lấy key từ bảng key với id = 1
    SELECT key INTO p_key FROM "key" WHERE id = 1;
    -- Mã hóa dữ liệu với key đã lấy
    RETURN pgp_sym_encrypt(data, p_key, 'compress-algo=1, cipher-algo=aes256')::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Hàm giải mã dữ liệu
CREATE OR REPLACE FUNCTION decryption(encrypted_data TEXT)
RETURNS TEXT AS $$
DECLARE
    p_key TEXT;
BEGIN
    -- Lấy key từ bảng key với id = 1
    SELECT key INTO p_key FROM "key" WHERE id = 1;
    -- Giải mã dữ liệu với key đã lấy
    RETURN pgp_sym_decrypt(encrypted_data::BYTEA, p_key)::TEXT;
END;
$$ LANGUAGE plpgsql;


-- Sử dụng hàm mã hóa và giải mã
--SELECT encryption('Password123');

--SELECT decryption('\xc30d04090302a04830caca0222636dd24101cc454d1d09a75340beeeb0c4949b9435b554240ed99d4a6bcbf52833cb49030002873ea38d75d3ddaad007f89736574f280a588d35ece96e926400eadbb8bbdb');

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

CREATE OR REPLACE PROCEDURE update_key_value()
AS $$
DECLARE
    new_key VARCHAR;
BEGIN
    UPDATE users SET password = decryption(password);

    new_key := generate_key(16);

    UPDATE key SET key = new_key, updated_at = NOW() WHERE id = 1;

    UPDATE users SET password = encryption(password), updated_at = NOW();
END;
$$ LANGUAGE plpgsql;


--select * from generate_key(16)


--insert into "key"("key", created_at, updated_at) values( generate_key(16), now(), now())

CREATE OR REPLACE FUNCTION encrypt_user_password()
RETURNS TRIGGER AS $$
DECLARE
    encryption_key VARCHAR;
BEGIN
    SELECT key INTO encryption_key 
    FROM key 
    where id=1;

    IF TG_OP = 'INSERT' then
        EXECUTE 'CREATE USER "' || NEW.id_user || '" WITH PASSWORD ' || quote_literal(NEW.password) || ';';
        NEW.password := encryption(NEW.password);
       
        EXECUTE 'GRANT CONNECT ON DATABASE famfund_i2wq_a3fq TO "' || NEW.id_user || '";';

    ELSIF TG_OP = 'UPDATE' then
    	EXECUTE 'ALTER USER "' || NEW.id_user || '" WITH PASSWORD ' || quote_literal(NEW.password) || ';';
        NEW.password := encryption(NEW.password);

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_user_password_trigger
BEFORE INSERT OR UPDATE OF password ON users
FOR EACH ROW
EXECUTE FUNCTION encrypt_user_password();


CREATE TRIGGER encrypt_user_password_trigger
BEFORE INSERT OR UPDATE OF password ON users
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
    -- Lấy key từ bảng key với id = 1
    SELECT key INTO decryption_key 
    FROM key 
    WHERE id = 1;

    -- Giải mã hashed_password để so sánh với input_password
    decrypted_password := pgp_sym_decrypt(hashed_password::BYTEA, decryption_key);

    -- So sánh mật khẩu đã giải mã với mật khẩu nhập vào
    RETURN decrypted_password = input_password;
END;
$$ LANGUAGE plpgsql;


select compare_passwords('Password123', '\xc30d04090302a04830caca0222636dd24101cc454d1d09a75340beeeb0c4949b9435b554240ed99d4a6bcbf52833cb49030002873ea38d75d3ddaad007f89736574f280a588d35ece96e926400eadbb8bbdb')
--CREATE OR REPLACE PROCEDURE create_users_from_table()
--LANGUAGE plpgsql
--AS $$
--DECLARE
--    user_record RECORD;
--    user_exists BOOLEAN;
--BEGIN
--    FOR user_record IN SELECT * FROM users LOOP
--        BEGIN
--            EXECUTE 'SELECT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = ''' || user_record.id_user || ''')' INTO user_exists;
--            
--            IF NOT user_exists THEN
--                EXECUTE 'CREATE USER "' || user_record.id_user || '" WITH PASSWORD ' || quote_literal(user_record.password) || ';';
--                RAISE NOTICE 'User % created successfully', user_record.id_user;
--            END IF;
--        EXCEPTION
--            WHEN others THEN
--                RAISE EXCEPTION 'Failed to create user %: %', user_record.id_user, SQLERRM;
--        END;
--    END LOOP;
--END;
CREATE or replace function































