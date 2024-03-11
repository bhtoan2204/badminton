-- DROP SCHEMA public;

--CREATE SCHEMA public AUTHORIZATION root;

-- DROP TYPE public."users_login_type_enum";

CREATE TYPE public."users_login_type_enum" AS ENUM (
	'local',
	'google',
	'facebook');

-- DROP SEQUENCE public.family_id_family_seq;

CREATE SEQUENCE public.family_id_family_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.family_id_sequence;

CREATE SEQUENCE public.family_id_sequence
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.key_id_seq;

CREATE SEQUENCE public.key_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.member_family_id_seq;

CREATE SEQUENCE public.member_family_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.order_id_order_seq;

CREATE SEQUENCE public.order_id_order_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.otp_otp_id_seq;

CREATE SEQUENCE public.otp_otp_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.refresh_token_id_seq;

CREATE SEQUENCE public.refresh_token_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.category_expense definition

-- Drop table

-- DROP TABLE category_expense;

CREATE TABLE category_expense (
	id_category int4 NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT category_expense_pk PRIMARY KEY (id_category)
);


-- public.category_income definition

-- Drop table

-- DROP TABLE category_income;

CREATE TABLE category_income (
	id_income int4 NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT cateory_income_pk PRIMARY KEY (id_income)
);


-- public.coupon definition

-- Drop table

-- DROP TABLE coupon;

CREATE TABLE coupon (
	id_coupon int4 NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	quantity int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT coupon_pk PRIMARY KEY (id_coupon)
);


-- public."family" definition

-- Drop table

-- DROP TABLE "family";

CREATE TABLE "family" (
	id_family serial4 NOT NULL,
	quantity int4 NOT NULL,
	description varchar NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	"name" varchar NULL,
	owner_id uuid NULL,
	CONSTRAINT family_pk PRIMARY KEY (id_family)
);


-- public."key" definition

-- Drop table

-- DROP TABLE "key";

CREATE TABLE "key" (
	id serial4 NOT NULL,
	"key" varchar NOT NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NULL,
	CONSTRAINT key_pk PRIMARY KEY (id)
);


-- public."order" definition

-- Drop table

-- DROP TABLE "order";

CREATE TABLE "order" (
	id_user uuid NOT NULL,
	id_package int4 NOT NULL,
	amount int4 NOT NULL,
	status bit(1) NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	id_order serial4 NOT NULL,
	expried_at timestamp NULL,
	CONSTRAINT order_pk PRIMARY KEY (id_order)
);


-- public.package definition

-- Drop table

-- DROP TABLE package;

CREATE TABLE package (
	id_package int4 NOT NULL,
	"name" varchar NOT NULL,
	price int4 NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT package_pk PRIMARY KEY (id_package)
);


-- public.recordcount definition

-- Drop table

-- DROP TABLE recordcount;

CREATE TABLE recordcount (
	count int8 NULL
);


-- public."role" definition

-- Drop table

-- DROP TABLE "role";

CREATE TABLE "role" (
	"name" varchar NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	"role" varchar NOT NULL,
	CONSTRAINT role_pk PRIMARY KEY (role)
);

-- Table Triggers

create trigger tr_insert_role after
insert
    on
    public.role for each row execute function p_create_role();
create trigger tr_delete_role before
delete
    on
    public.role for each row execute function p_delete_role();


-- public.users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	id_user uuid NOT NULL DEFAULT uuid_generate_v4(),
	email varchar NULL,
	phone varchar NULL,
	"password" varchar NULL,
	"language" varchar NULL,
	twofa bool NOT NULL DEFAULT false,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	isphoneverified bool NOT NULL DEFAULT false,
	isadmin bool NOT NULL DEFAULT false,
	login_type public."users_login_type_enum" NOT NULL DEFAULT 'local'::users_login_type_enum,
	firstname varchar NULL,
	lastname varchar NULL,
	isemailverified bool NOT NULL DEFAULT false,
	avatar varchar NULL,
	CONSTRAINT user_pk PRIMARY KEY (id_user)
);

-- Table Triggers

create trigger encrypt_user_password_trigger before
insert
    or
update
    of password on
    public.users for each row execute function encrypt_user_password();


-- public.wallet_family definition

-- Drop table

-- DROP TABLE wallet_family;

CREATE TABLE wallet_family (
	id_wallet int4 NOT NULL,
	"name" varchar NULL,
	"money" money NULL,
	updated_at timestamp NULL,
	created_at timestamp NULL,
	CONSTRAINT wallet_family_pk PRIMARY KEY (id_wallet)
);


-- public.wallet_user definition

-- Drop table

-- DROP TABLE wallet_user;

CREATE TABLE wallet_user (
	id_wallet int4 NOT NULL,
	"name" varchar NULL,
	"money" money NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT wallet_user_pk PRIMARY KEY (id_wallet)
);


-- public.calendar definition

-- Drop table

-- DROP TABLE calendar;

CREATE TABLE calendar (
	id_calendar int4 NOT NULL,
	datetime timestamp NOT NULL,
	description varchar NULL,
	id_family int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT calendar_pk PRIMARY KEY (id_calendar),
	CONSTRAINT calendar_fk FOREIGN KEY (id_family) REFERENCES "family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED
);


-- public.expense_family definition

-- Drop table

-- DROP TABLE expense_family;

CREATE TABLE expense_family (
	id_expense int4 NOT NULL,
	id_family int4 NULL,
	description varchar NULL,
	id_category int4 NULL,
	id_wallet int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT expense_family_pk PRIMARY KEY (id_expense),
	CONSTRAINT expense_family_fk FOREIGN KEY (id_family) REFERENCES "family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT expense_family_fk2 FOREIGN KEY (id_expense) REFERENCES category_expense(id_category) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT expense_family_fk_1 FOREIGN KEY (id_wallet) REFERENCES wallet_family(id_wallet) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.expense_user definition

-- Drop table

-- DROP TABLE expense_user;

CREATE TABLE expense_user (
	id_expense int4 NOT NULL,
	id_user uuid NOT NULL,
	description varchar NULL,
	id_category int4 NULL,
	total money NOT NULL,
	id_wallet int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT expense_user_pk PRIMARY KEY (id_expense),
	CONSTRAINT expense_user_fk FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT expense_user_fk_1 FOREIGN KEY (id_expense) REFERENCES category_expense(id_category) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT expense_user_fk_2 FOREIGN KEY (id_wallet) REFERENCES wallet_user(id_wallet) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.income_family definition

-- Drop table

-- DROP TABLE income_family;

CREATE TABLE income_family (
	id int4 NOT NULL,
	id_family int4 NOT NULL,
	description varchar NULL,
	id_category int4 NOT NULL,
	total money NOT NULL,
	id_wallet int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT income_family_pk PRIMARY KEY (id),
	CONSTRAINT income_family_fk FOREIGN KEY (id_family) REFERENCES "family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT income_family_fk2 FOREIGN KEY (id_wallet) REFERENCES wallet_family(id_wallet) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT income_family_fk_1 FOREIGN KEY (id_category) REFERENCES category_income(id_income) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.income_user definition

-- Drop table

-- DROP TABLE income_user;

CREATE TABLE income_user (
	id int4 NOT NULL,
	id_user uuid NOT NULL,
	description varchar NULL,
	id_category int4 NOT NULL,
	total money NOT NULL,
	id_wallet int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT income_user_pk PRIMARY KEY (id),
	CONSTRAINT income_user_fk FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT income_user_fk_1 FOREIGN KEY (id_category) REFERENCES category_income(id_income) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT income_user_fk_2 FOREIGN KEY (id_wallet) REFERENCES wallet_user(id_wallet) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.member_family definition

-- Drop table

-- DROP TABLE member_family;

CREATE TABLE member_family (
	id_user uuid NOT NULL,
	id_family int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	id serial4 NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT member_family_pk PRIMARY KEY (id),
	CONSTRAINT member_family_un UNIQUE (id_user, id_family),
	CONSTRAINT member_family_fk FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT member_family_fk_1 FOREIGN KEY (id_family) REFERENCES "family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED
);

-- Table Triggers

create trigger decrease_family_quantity_trigger after
delete
    on
    public.member_family for each row execute function decrease_family_quantity();
create trigger update_family_quantity_trigger after
insert
    or
update
    on
    public.member_family for each row execute function update_family_quantity();


-- public.otp definition

-- Drop table

-- DROP TABLE otp;

CREATE TABLE otp (
	otp_id serial4 NOT NULL,
	id_user uuid NULL,
	code varchar NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	expired_at timestamp NULL,
	email varchar(255) NULL,
	CONSTRAINT otp_pk PRIMARY KEY (otp_id),
	CONSTRAINT "FK_5b899a36a6177f5c582dbfaeaad" FOREIGN KEY (id_user) REFERENCES users(id_user)
);


-- public.refresh_token definition

-- Drop table

-- DROP TABLE refresh_token;

CREATE TABLE refresh_token (
	refresh_token varchar NULL,
	id_user uuid NULL,
	created_at timestamp NULL,
	expired_at timestamp NULL,
	id serial4 NOT NULL,
	CONSTRAINT refresh_token_pk PRIMARY KEY (id),
	CONSTRAINT refreshtoken_fk FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.total_category_family definition

-- Drop table

-- DROP TABLE total_category_family;

CREATE TABLE total_category_family (
	id int4 NOT NULL,
	id_family int4 NOT NULL,
	id_category int4 NOT NULL,
	total money NULL,
	"percent" float4 NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT total_category_family_pk PRIMARY KEY (id),
	CONSTRAINT total_category_family_fk FOREIGN KEY (id_family) REFERENCES "family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT total_category_family_fk_1 FOREIGN KEY (id_category) REFERENCES category_expense(id_category) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.total_category_user definition

-- Drop table

-- DROP TABLE total_category_user;

CREATE TABLE total_category_user (
	id int4 NOT NULL,
	id_user uuid NOT NULL,
	description varchar NULL,
	id_cateory int4 NOT NULL,
	total money NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	"percent" float4 NULL,
	CONSTRAINT total_category_user_pk PRIMARY KEY (id),
	CONSTRAINT total_category_user_fk FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT total_category_user_fk_1 FOREIGN KEY (id_cateory) REFERENCES category_expense(id_category) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.user_info_view source

CREATE OR REPLACE VIEW public.user_info_view
AS SELECT users.email,
    users.phone,
    users.language,
    users.firstname,
    users.lastname
   FROM users;


-- public.view_users source

CREATE OR REPLACE VIEW public.view_users
AS SELECT users.id_user,
    users.email,
    users.phone,
    users.language,
    users.firstname,
    users.lastname
   FROM users;



CREATE OR REPLACE FUNCTION public.armor(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

CREATE OR REPLACE FUNCTION public.armor(bytea, text[], text[])
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

CREATE OR REPLACE FUNCTION public.compare_passwords(input_password character varying, hashed_password character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
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
$function$
;




CREATE OR REPLACE FUNCTION public.crypt(text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_crypt$function$
;

CREATE OR REPLACE FUNCTION public.dearmor(text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_dearmor$function$
;

CREATE OR REPLACE FUNCTION public.decrease_family_quantity()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE family SET quantity = quantity - 1 WHERE id_family = OLD.id_family;
    END IF;
    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.decrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt$function$
;

CREATE OR REPLACE FUNCTION public.decrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt_iv$function$
;

CREATE OR REPLACE FUNCTION public.decryption(ciphertext character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE 
	decryption_key VARCHAR;
    decrypted_bytea BYTEA;
BEGIN
	SELECT key INTO decryption_key 
    FROM key 
    ORDER BY created_at DESC 
    LIMIT 1;
    decrypted_bytea := pgp_sym_decrypt(ciphertext::BYTEA, decryption_key);
    RETURN decrypted_bytea::TEXT;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.decryption(ciphertext character varying, decryption_key character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
begin
	SELECT key INTO decryption_key 
    FROM key 
    ORDER BY created_at DESC 
    LIMIT 1;

    RETURN pgp_sym_decrypt(ciphertext, decryption_key);
END;
$function$
;

CREATE OR REPLACE FUNCTION public.digest(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

CREATE OR REPLACE FUNCTION public.digest(text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

CREATE OR REPLACE FUNCTION public.encrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt$function$
;

CREATE OR REPLACE FUNCTION public.encrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt_iv$function$
;

CREATE OR REPLACE FUNCTION public.encrypt_user_password()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    encryption_key VARCHAR;
BEGIN
    SELECT key INTO encryption_key 
    FROM key 
    ORDER BY created_at DESC 
    LIMIT 1;

   IF TG_OP = 'INSERT' then
        EXECUTE 'CREATE USER "' || NEW.id_user || '" WITH PASSWORD ' || quote_literal(NEW.password) || ';';
        NEW.password := encryption(NEW.password);
    ELSIF TG_OP = 'UPDATE' then
    	EXECUTE 'ALTER USER "' || NEW.id_user || '" WITH PASSWORD ' || quote_literal(NEW.password) || ';';
        NEW.password := encryption(NEW.password);

    END IF;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.encryption(plaintext character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE 
	encryption_key VARCHAR;
BEGIN
    SELECT key INTO encryption_key 
    FROM key 
    ORDER BY created_at DESC 
    LIMIT 1;
   RETURN pgp_sym_encrypt(plaintext, encryption_key);
END;
$function$
;



CREATE OR REPLACE FUNCTION public.f_change_firstname(user_id uuid, new_firstname text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE id_user = user_id) THEN
        UPDATE users SET firstname = new_firstname WHERE id_user = user_id;
		RAISE NOTICE 'Updated successfully.';
    ELSE
        RAISE EXCEPTION 'User does not exist';
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_change_firstname_lastname(user_id uuid, new_firstname text, new_lastname text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Kiểm tra xem người dùng có tồn tại không
    IF EXISTS (SELECT 1 FROM users WHERE id_user = user_id) THEN
        -- Cập nhật firstname và lastname nếu người dùng tồn tại
        UPDATE users
        SET firstname = new_firstname, lastname = new_lastname
        WHERE id_user = user_id;
		RAISE NOTICE 'Updated successfully.';
    ELSE
        -- Nếu người dùng không tồn tại, hiển thị thông báo lỗi
        RAISE EXCEPTION 'User does not exist';
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_change_lastname(user_id uuid, new_lastname text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE id_user = user_id) THEN
        UPDATE users SET lastname = new_lastname WHERE id_user = user_id;
		RAISE NOTICE 'Updated successfully.';
    ELSE
        RAISE EXCEPTION 'User does not exist';
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_change_password(p_user_id integer, p_new_password text)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Kiểm tra người dùng có tồn tại không
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'User does not exist.';
    END IF;
    
    -- Cập nhật mật khẩu mới cho người dùng
    UPDATE users SET password = p_new_password WHERE id = p_user_id;
    
    -- Trả về true nếu cập nhật thành công
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    -- Trả về false nếu có lỗi
    RETURN FALSE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_change_password(p_user_id text, p_new_password text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id_user = p_user_id::uuid) THEN
        RETURN 'User does not exist.';
    END IF;
    
    UPDATE users SET password = p_new_password WHERE id_user = p_user_id::uuid;
    
    RETURN 'Password changed successfully.';
EXCEPTION WHEN OTHERS THEN
    RETURN SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_change_password(p_user_id uuid, p_new_password text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id_user = p_user_id) THEN
        RETURN 'User does not exist.';
    END IF;
    
    UPDATE users SET password = p_new_password WHERE id_user = p_user_id;
    
    RETURN 'Password changed successfully.';
EXCEPTION WHEN OTHERS THEN
    RETURN SQLERRM;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_create_family(p_id_user uuid, p_description character varying, p_name character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_id INT;
BEGIN
    BEGIN
        INSERT INTO family (quantity,description, created_at, updated_at, "name", owner_id)
        VALUES (0, p_description, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, p_name, p_id_user)
        RETURNING id_family INTO new_id; 

        INSERT INTO member_family (id_user, id_family, created_at, updated_at, "role")
        VALUES (p_id_user, new_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'owner_package'); 
    RETURN new_id;

    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Failed to create family: %', SQLERRM;
    END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_create_order(p_id_user uuid, p_id_package integer, p_amount integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_exists BOOLEAN;
    package_valid BOOLEAN;
   	new_id int;
BEGIN
    SELECT EXISTS(SELECT 1 FROM users WHERE id_user = p_id_user) INTO user_exists;
    
	select 1 into package_valid from package where id_package = p_id_package and price=p_amount;

    IF NOT user_exists THEN
        RAISE EXCEPTION 'User with id % does not exist', p_id_user;
    ELSIF NOT package_valid THEN
        RAISE EXCEPTION 'Package with id % does not match the given amount', p_id_package;
    else
    	begin
        insert into "order"(id_user, id_package, amount, status, created_at) 
        values (p_id_user, p_id_package, p_amount, '1', now())
        RETURNING id_order INTO new_id;
        return new_id;

       EXCEPTION
            WHEN others THEN
                RAISE EXCEPTION 'Failed to create order: %', SQLERRM;
        END;
    end if;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_create_user(p_gmail character varying, p_phone character varying, p_password character varying, p_firstname character varying, p_lastname character varying, p_language character varying)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_id UUID;
    phone_exists BOOLEAN := FALSE;
    email_exists BOOLEAN := FALSE;
BEGIN


    IF p_phone IS NOT NULL THEN
        phone_exists := f_validate_user_phone(p_phone);
        IF phone_exists THEN
            RAISE EXCEPTION 'Phone number % already exists', p_phone;
        END IF;
    END IF;

    IF p_gmail IS NOT NULL THEN
        email_exists := f_validate_user_mail(p_gmail);
        IF email_exists THEN
            RAISE EXCEPTION 'Email % already exists', p_gmail;
        END IF;
    END IF;
	begin
		INSERT INTO users(id_user, email, phone, "password", "language", created_at,  firstname, lastname)
		VALUES (f_generate_unique_uuid(), p_gmail, p_phone, p_password, p_language, CURRENT_TIMESTAMP, p_firstname, p_lastname)
		RETURNING id_user INTO new_id;
	EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
    END;	
    RETURN new_id;
END;
$function$
;



CREATE OR REPLACE FUNCTION public.f_generate_otp(owner_id uuid)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    otp VARCHAR := '';
    i INT := 1;
BEGIN
    BEGIN
        LOOP
            otp := '';
            FOR i IN 1..6 LOOP
                otp := otp || (floor(random() * 10)::int)::varchar;
            END LOOP;

            PERFORM 1
            FROM otp
            WHERE code = otp
            LIMIT 1;

            EXIT WHEN NOT FOUND;
        END LOOP;

        CREATE TEMPORARY TABLE temp_expiry_time AS
            SELECT now() + interval '1 day' AS expiry_time;

        INSERT INTO otp (id_user, code, created_at, updated_at, expired_at )
        VALUES (
        	owner_id,
            otp,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            (SELECT expiry_time FROM temp_expiry_time)
            
        );

        DROP TABLE IF EXISTS temp_expiry_time;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE;
    END;

    RETURN otp;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_generate_otp(p_id_user character varying, p_email character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_code VARCHAR(6);
BEGIN
    DELETE FROM otp WHERE id_user = uuid(p_id_user);

    SELECT TO_CHAR(FLOOR(RANDOM() * 999999)::INT, 'FM000000') INTO v_code;

    INSERT INTO otp (id_user, email, code, created_at, updated_at, expired_at)
    VALUES (uuid(p_id_user), p_email, v_code, NOW(), NOW(), NOW() + INTERVAL '15 minutes');

    -- Return the generated code
    RETURN v_code;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_generate_otp(p_id_user uuid, p_email character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_code VARCHAR(6);
BEGIN
    -- Delete existing OTPs for the user
    DELETE FROM otp WHERE id_user = p_id_user;

    -- Generate random 6-digit code
    SELECT TO_CHAR(FLOOR(RANDOM() * 999999)::INT, 'FM000000') INTO v_code;

    -- Insert new OTP entry into the database
    INSERT INTO otp (id_user, email, code, created_at, updated_at, expired_at)
    VALUES (p_id_user, p_email, v_code, NOW(), NOW(), NOW() + INTERVAL '15 minutes');

    -- Return the generated code
    RETURN v_code;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_generate_refresh_token(id_user uuid)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_token VARCHAR;
BEGIN
    new_token := md5(random()::text || clock_timestamp()::text);

    INSERT INTO refresh_token (refresh_token, id_user, created_at, expired_at)
    VALUES (new_token,id_user, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours');
	return new_token;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_generate_refresh_token(id_user uuid, refresh_token character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
BEGIN
BEGIN
    INSERT INTO refresh_token (refresh_token, id_user, created_at, expired_at)
    VALUES (refresh_token, id_user, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '72 hours');
	return refresh_token;
END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_generate_unique_uuid()
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_uuid UUID;
BEGIN
    LOOP
        -- Tạo một UUID mới
        new_uuid := uuid_generate_v4();

        -- Kiểm tra xem UUID mới có tồn tại trong bảng hay không
        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM users WHERE id_user = new_uuid
        );
    END LOOP;

    -- Trả về UUID mới và không trùng lặp
    RETURN new_uuid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_get_all_member(p_id_user uuid, p_id_family integer)
 RETURNS SETOF view_users
 LANGUAGE plpgsql
AS $function$
DECLARE
    recordCount int;
    userRecord view_users%ROWTYPE;
BEGIN
    SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;

    IF recordCount > 0 THEN
        FOR userRecord IN 
            SELECT * FROM view_users WHERE id_user IN (SELECT id_user FROM member_family WHERE id_family = p_id_family)
        LOOP
            RETURN NEXT userRecord;
        END LOOP;
    END IF;

    RETURN;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_get_family(p_id_user uuid, p_id_family integer)
 RETURNS SETOF family
 LANGUAGE plpgsql
AS $function$
DECLARE
    recordCount int;
    familyRecord family%ROWTYPE;
BEGIN
    SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;

    IF recordCount > 0 THEN
        SELECT * INTO familyRecord FROM family WHERE id_family = p_id_family;
        RETURN NEXT familyRecord;
    ELSE
        RETURN;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_get_member(p_id_user uuid)
 RETURNS SETOF users
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT id_user, email, phone, language, firstname FROM users WHERE id_user = p_id_user;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_getfamily(p_id_user uuid, p_id_family integer)
 RETURNS SETOF family
 LANGUAGE plpgsql
AS $function$
DECLARE
    recordCount int;
    familyRecord family%ROWTYPE;
BEGIN
    SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;

    IF recordCount > 0 THEN
        SELECT * INTO familyRecord FROM family WHERE id_family = p_id_family;
        RETURN NEXT familyRecord;
    ELSE
        RETURN;
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_update_user_avatar(p_id_user uuid, p_new_avatar text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Cập nhật avatar
    IF NOT EXISTS (SELECT FROM users WHERE id_user = p_id_user) THEN
        RAISE EXCEPTION 'Update failed: No user found with id_user = %', p_id_user;
    END IF;

    UPDATE users
    SET avatar = p_new_avatar
    WHERE id_user = p_id_user;

    -- Trả về thông báo cập nhật thành công
    RETURN 'Update successful: User avatar updated for id_user = ' || p_id_user;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_validate_otp(p_id_user character varying, p_otp character varying, p_email character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    otp_valid BOOLEAN := FALSE;
BEGIN
    -- Check if the OTP is correct, belongs to the user, matches the email, and is not expired.
    SELECT EXISTS (
        SELECT 1
        FROM otp
        WHERE id_user = uuid(p_id_user)
          AND code = p_otp
          AND email = p_email
          AND expired_at > NOW()
    ) INTO otp_valid;

    -- If the OTP is valid, update the user's email verification status.
    IF otp_valid THEN
        UPDATE users
        SET isemailverified = TRUE
        WHERE id_user = uuid(p_id_user);

        -- Delete the OTP as it has been used.
        DELETE FROM otp
        WHERE id_user = uuid(p_id_user) AND code = p_otp;
    END IF;

    -- Return whether the OTP was valid.
    RETURN otp_valid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_validate_otp(p_id_user uuid, p_otp character varying, p_email character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    otp_valid BOOLEAN := FALSE;
BEGIN
    -- Check if the OTP is correct, belongs to the user, matches the email, and is not expired.
    SELECT EXISTS (
        SELECT 1
        FROM otp
        WHERE id_user = p_id_user
          AND code = p_otp
          AND email = p_email
          AND expired_at > NOW()
    ) INTO otp_valid;

    -- If the OTP is valid, update the user's email verification status.
    IF otp_valid THEN
        UPDATE users
        SET isemailverified = TRUE
        WHERE id_user = p_id_user;

        -- Delete the OTP as it has been used.
        DELETE FROM otp
        WHERE id_user = p_id_user AND code = p_otp;
    END IF;

    -- Return whether the OTP was valid.
    RETURN otp_valid;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_validate_user_mail(p_mail character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    mail_exists BOOLEAN;
BEGIN
    mail_exists := FALSE;
    SELECT TRUE INTO mail_exists
    FROM users
    where email = p_mail
    LIMIT 1;
    RETURN mail_exists;
END
$function$
;

CREATE OR REPLACE FUNCTION public.f_validate_user_phone(p_phone character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    phone_exists BOOLEAN;
BEGIN
    phone_exists := FALSE;
    SELECT TRUE INTO phone_exists
    from users
    WHERE phone = p_phone
    LIMIT 1;

    RETURN phone_exists;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.gen_random_bytes(integer)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_random_bytes$function$
;

CREATE OR REPLACE FUNCTION public.gen_random_uuid()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE
AS '$libdir/pgcrypto', $function$pg_random_uuid$function$
;

CREATE OR REPLACE FUNCTION public.gen_salt(text)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt$function$
;

CREATE OR REPLACE FUNCTION public.gen_salt(text, integer)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt_rounds$function$
;

CREATE OR REPLACE FUNCTION public.generate_key(length integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    random_key VARCHAR;
BEGIN
    SELECT gen_salt('md5') || substr(md5(random()::text), 0, length) INTO random_key;

    RETURN random_key;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_all_family(p_id_user uuid)
 RETURNS SETOF family
 LANGUAGE plpgsql
AS $function$
DECLARE
    familyRecord RECORD;
BEGIN
    FOR familyRecord IN 
        SELECT id_family FROM member_family WHERE id_user = p_id_user
    LOOP
        RETURN QUERY SELECT * FROM family WHERE id_family = familyRecord.id_family;
    END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.hmac(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

CREATE OR REPLACE FUNCTION public.hmac(text, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

CREATE OR REPLACE PROCEDURE public.p_add_member(IN p_id_family integer, IN p_phone character varying, IN p_email character varying, IN p_role integer)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_user_id UUID;
BEGIN 

    SELECT id_user INTO v_user_id FROM Users WHERE phone = p_phone OR email = p_email;

    IF v_user_id IS NOT NULL THEN
        BEGIN
            INSERT INTO member_family (id_user, id_family, created_at, updated_at, role)
            VALUES (v_user_id, p_id_family, NOW(), NOW(), p_role);
                EXCEPTION
            WHEN others THEN
                RAISE EXCEPTION 'Failed to add member: %', SQLERRM;
        END;
    ELSE
        RAISE EXCEPTION 'Invalid family ID or user ID provided';
    END IF;
END;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.p_add_member(IN p_id_user uuid, IN p_id_family integer, IN p_phone character varying, IN p_email character varying, IN p_role integer)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_user_id UUID;
    recordCount int;
BEGIN 
    SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;

    SELECT id_user INTO v_user_id FROM Users WHERE phone = p_phone OR email = p_email;

    IF v_user_id IS NOT null and recordCount>0 THEN
        BEGIN
            INSERT INTO member_family (id_user, id_family, created_at, updated_at, role)
            VALUES (v_user_id, p_id_family, NOW(), NOW(), p_role);
                EXCEPTION
            WHEN others THEN
                RAISE EXCEPTION 'Failed to add member: %', SQLERRM;
        END;
    ELSE
        RAISE EXCEPTION 'Invalid family ID or user ID provided';
    END IF;
END;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.p_add_member(IN p_id_user uuid, IN p_id_family integer, IN p_phone character varying, IN p_email character varying, IN p_role character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_user_id UUID;
    recordCount int;
BEGIN 
    SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;

    SELECT id_user INTO v_user_id FROM Users WHERE phone = p_phone OR email = p_email;

    IF v_user_id IS NOT null and recordCount>0 THEN
        BEGIN
            INSERT INTO member_family (id_user, id_family, created_at, updated_at, role)
            VALUES (v_user_id, p_id_family, NOW(), NOW(), p_role);
                EXCEPTION
            WHEN others THEN
                RAISE EXCEPTION 'Failed to add member: %', SQLERRM;
        END;
    ELSE
        RAISE EXCEPTION 'Invalid family ID or user ID provided';
    END IF;
END;
$procedure$
;

CREATE OR REPLACE FUNCTION public.p_create_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN 
    EXECUTE 'CREATE ROLE ' || NEW.role;
    EXECUTE 'GRANT CONNECT ON DATABASE famfund_i2wq_a3fq TO ' || NEW.role;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE PROCEDURE public.p_delete_family(IN p_id_family integer)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    BEGIN
		delete from "family" where id_family=p_id_family;
	    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Fail to delete family: %', SQLERRM;
    END;
END;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.p_delete_family(IN p_id_user uuid, IN p_id_family integer)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    recordCount int;
begin
	SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
	if recordCount> 0 then 
	    begin
		    delete from family where id_family=p_id_family;
	    EXCEPTION
	        WHEN others THEN
	            RAISE EXCEPTION 'Failed to delete family: %', SQLERRM;
	    END;
	 end if;
END;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.p_delete_member(IN p_id_user uuid, IN p_id_family integer)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    IF EXISTS (SELECT 1 FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family) THEN
        DELETE FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
    END IF;
END;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.p_delete_member(IN p_id_current_user uuid, IN p_id_user uuid, IN p_id_family integer)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    recordCount int;
BEGIN 
    SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
	if recordCount> 0 then
        BEGIN
            delete from member_family where id_family=p_id_family and p_id_user=id_user;
        EXCEPTION
		    WHEN others THEN
		        RAISE EXCEPTION 'Failed to delete member: %', SQLERRM;
        END;
    ELSE
        RAISE EXCEPTION 'Invalid family ID or user ID provided';
    END IF;
END;
$procedure$
;

CREATE OR REPLACE FUNCTION public.p_delete_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN 

	EXECUTE 'DROP ROLE IF EXISTS ' || OLD.role;

    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE PROCEDURE public.p_update_family(IN p_id uuid, IN p_name character varying, IN p_description character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    recordCount int;
begin
	SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
	if recordCount> 0 then 
	    BEGIN
	        UPDATE family SET description = p_description, "name" = p_name, updated_at=now() WHERE id_family = (select id_family from users where id_user=p_id);
	    EXCEPTION
	        WHEN others THEN
	            RAISE EXCEPTION 'Failed to update family: %', SQLERRM;
	    END;
	 end if;
END;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.p_update_family(IN p_id_user uuid, IN p_id_family integer, IN p_name character varying, IN p_description character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    recordCount int;
begin
	SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
	if recordCount> 0 then 
	    BEGIN
	        UPDATE family SET description = p_description, "name" = p_name, updated_at=now() WHERE id_family = p_id_family;
	    EXCEPTION
	        WHEN others THEN
	            RAISE EXCEPTION 'Failed to update family: %', SQLERRM;
	    END;
	 end if;
END;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.p_update_payment(IN p_id_order integer)
 LANGUAGE plpgsql
AS $procedure$
begin 
	update "order" set status='0' where id_order=p_id_order;
end
$procedure$
;

CREATE OR REPLACE PROCEDURE public.p_validate_otp(IN code character varying, IN id_user uuid)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    IF EXISTS (SELECT 1 FROM otp WHERE code = code and id_user=id_user) THEN
        UPDATE users
        SET twofa = TRUE
        WHERE id_user = id_user;

        DELETE FROM otp
        WHERE code = code and id_user=id_user ;
    ELSE
        RAISE EXCEPTION 'Invalid OTP code';
    END IF;
END;
$procedure$
;

CREATE OR REPLACE FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text)
 RETURNS SETOF record
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_armor_headers$function$
;

CREATE OR REPLACE FUNCTION public.pgp_key_id(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_key_id_w$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

CREATE OR REPLACE FUNCTION public.update_family_quantity()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE family SET quantity = (SELECT COUNT(*) FROM member_family WHERE id_family = NEW.id_family) WHERE id_family = NEW.id_family;
    END IF;
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE PROCEDURE public.update_key_value()
 LANGUAGE plpgsql
AS $procedure$
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
$procedure$
;

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;