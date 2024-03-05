-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION root;

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

-- Permissions

ALTER SEQUENCE public.family_id_family_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.family_id_family_seq TO root;

-- DROP SEQUENCE public.family_id_sequence;

CREATE SEQUENCE public.family_id_sequence
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.family_id_sequence OWNER TO root;
GRANT ALL ON SEQUENCE public.family_id_sequence TO root;

-- DROP SEQUENCE public.member_family_id_seq;

CREATE SEQUENCE public.member_family_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.member_family_id_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.member_family_id_seq TO root;

-- DROP SEQUENCE public.order_id_order_seq;

CREATE SEQUENCE public.order_id_order_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.order_id_order_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.order_id_order_seq TO root;

-- DROP SEQUENCE public.otp_otp_id_seq;

CREATE SEQUENCE public.otp_otp_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.otp_otp_id_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.otp_otp_id_seq TO root;

-- DROP SEQUENCE public.refresh_token_id_seq;

CREATE SEQUENCE public.refresh_token_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.refresh_token_id_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.refresh_token_id_seq TO root;
-- public.category_expense definition

-- Drop table

-- DROP TABLE public.category_expense;

CREATE TABLE public.category_expense (
	id_category int4 NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT category_expense_pk PRIMARY KEY (id_category)
);

-- Permissions

ALTER TABLE public.category_expense OWNER TO root;
GRANT ALL ON TABLE public.category_expense TO root;


-- public.category_income definition

-- Drop table

-- DROP TABLE public.category_income;

CREATE TABLE public.category_income (
	id_income int4 NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT cateory_income_pk PRIMARY KEY (id_income)
);

-- Permissions

ALTER TABLE public.category_income OWNER TO root;
GRANT ALL ON TABLE public.category_income TO root;


-- public.coupon definition

-- Drop table

-- DROP TABLE public.coupon;

CREATE TABLE public.coupon (
	id_coupon int4 NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	quantity int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT coupon_pk PRIMARY KEY (id_coupon)
);

-- Permissions

ALTER TABLE public.coupon OWNER TO root;
GRANT ALL ON TABLE public.coupon TO root;


-- public."family" definition

-- Drop table

-- DROP TABLE public."family";

CREATE TABLE public."family" (
	id_family serial4 NOT NULL,
	quantity int4 NOT NULL,
	description varchar NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	"name" varchar NULL,
	CONSTRAINT family_pk PRIMARY KEY (id_family)
);

-- Permissions

ALTER TABLE public."family" OWNER TO root;
GRANT ALL ON TABLE public."family" TO root;


-- public."order" definition

-- Drop table

-- DROP TABLE public."order";

CREATE TABLE public."order" (
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

-- Permissions

ALTER TABLE public."order" OWNER TO root;
GRANT ALL ON TABLE public."order" TO root;


-- public.package definition

-- Drop table

-- DROP TABLE public.package;

CREATE TABLE public.package (
	id_package int4 NOT NULL,
	"name" varchar NOT NULL,
	price int4 NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT package_pk PRIMARY KEY (id_package)
);

-- Permissions

ALTER TABLE public.package OWNER TO root;
GRANT ALL ON TABLE public.package TO root;


-- public."role" definition

-- Drop table

-- DROP TABLE public."role";

CREATE TABLE public."role" (
	id_role int4 NOT NULL,
	"name" varchar NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT role_pk PRIMARY KEY (id_role)
);

-- Permissions

ALTER TABLE public."role" OWNER TO root;
GRANT ALL ON TABLE public."role" TO root;


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
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
	avatar varchar NULL,
	CONSTRAINT user_pk PRIMARY KEY (id_user)
);

-- Permissions

ALTER TABLE public.users OWNER TO root;
GRANT ALL ON TABLE public.users TO root;


-- public.wallet_family definition

-- Drop table

-- DROP TABLE public.wallet_family;

CREATE TABLE public.wallet_family (
	id_wallet int4 NOT NULL,
	"name" varchar NULL,
	"money" money NULL,
	updated_at timestamp NULL,
	created_at timestamp NULL,
	CONSTRAINT wallet_family_pk PRIMARY KEY (id_wallet)
);

-- Permissions

ALTER TABLE public.wallet_family OWNER TO root;
GRANT ALL ON TABLE public.wallet_family TO root;


-- public.wallet_user definition

-- Drop table

-- DROP TABLE public.wallet_user;

CREATE TABLE public.wallet_user (
	id_wallet int4 NOT NULL,
	"name" varchar NULL,
	"money" money NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT wallet_user_pk PRIMARY KEY (id_wallet)
);

-- Permissions

ALTER TABLE public.wallet_user OWNER TO root;
GRANT ALL ON TABLE public.wallet_user TO root;


-- public.calendar definition

-- Drop table

-- DROP TABLE public.calendar;

CREATE TABLE public.calendar (
	id_calendar int4 NOT NULL,
	datetime timestamp NOT NULL,
	description varchar NULL,
	id_family int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT calendar_pk PRIMARY KEY (id_calendar),
	CONSTRAINT calendar_fk FOREIGN KEY (id_family) REFERENCES public."family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED
);

-- Permissions

ALTER TABLE public.calendar OWNER TO root;
GRANT ALL ON TABLE public.calendar TO root;


-- public.expense_family definition

-- Drop table

-- DROP TABLE public.expense_family;

CREATE TABLE public.expense_family (
	id_expense int4 NOT NULL,
	id_family int4 NULL,
	description varchar NULL,
	id_category int4 NULL,
	id_wallet int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT expense_family_pk PRIMARY KEY (id_expense),
	CONSTRAINT expense_family_fk FOREIGN KEY (id_family) REFERENCES public."family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT expense_family_fk2 FOREIGN KEY (id_expense) REFERENCES public.category_expense(id_category) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT expense_family_fk_1 FOREIGN KEY (id_wallet) REFERENCES public.wallet_family(id_wallet) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.expense_family OWNER TO root;
GRANT ALL ON TABLE public.expense_family TO root;


-- public.expense_user definition

-- Drop table

-- DROP TABLE public.expense_user;

CREATE TABLE public.expense_user (
	id_expense int4 NOT NULL,
	id_user uuid NOT NULL,
	description varchar NULL,
	id_category int4 NULL,
	total money NOT NULL,
	id_wallet int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT expense_user_pk PRIMARY KEY (id_expense),
	CONSTRAINT expense_user_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT expense_user_fk_1 FOREIGN KEY (id_expense) REFERENCES public.category_expense(id_category) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT expense_user_fk_2 FOREIGN KEY (id_wallet) REFERENCES public.wallet_user(id_wallet) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.expense_user OWNER TO root;
GRANT ALL ON TABLE public.expense_user TO root;


-- public.income_family definition

-- Drop table

-- DROP TABLE public.income_family;

CREATE TABLE public.income_family (
	id int4 NOT NULL,
	id_family int4 NOT NULL,
	description varchar NULL,
	id_category int4 NOT NULL,
	total money NOT NULL,
	id_wallet int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT income_family_pk PRIMARY KEY (id),
	CONSTRAINT income_family_fk FOREIGN KEY (id_family) REFERENCES public."family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT income_family_fk2 FOREIGN KEY (id_wallet) REFERENCES public.wallet_family(id_wallet) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT income_family_fk_1 FOREIGN KEY (id_category) REFERENCES public.category_income(id_income) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.income_family OWNER TO root;
GRANT ALL ON TABLE public.income_family TO root;


-- public.income_user definition

-- Drop table

-- DROP TABLE public.income_user;

CREATE TABLE public.income_user (
	id int4 NOT NULL,
	id_user uuid NOT NULL,
	description varchar NULL,
	id_category int4 NOT NULL,
	total money NOT NULL,
	id_wallet int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT income_user_pk PRIMARY KEY (id),
	CONSTRAINT income_user_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT income_user_fk_1 FOREIGN KEY (id_category) REFERENCES public.category_income(id_income) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT income_user_fk_2 FOREIGN KEY (id_wallet) REFERENCES public.wallet_user(id_wallet) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.income_user OWNER TO root;
GRANT ALL ON TABLE public.income_user TO root;


-- public.member_family definition

-- Drop table

-- DROP TABLE public.member_family;

CREATE TABLE public.member_family (
	id_user uuid NOT NULL,
	id_family int4 NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	"role" int4 NULL,
	id serial4 NOT NULL,
	CONSTRAINT member_family_pk PRIMARY KEY (id),
	CONSTRAINT member_family_un UNIQUE (id_user, id_family),
	CONSTRAINT member_family_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT member_family_fk0 FOREIGN KEY ("role") REFERENCES public."role"(id_role) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT member_family_fk_1 FOREIGN KEY (id_family) REFERENCES public."family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED
);

-- Permissions

ALTER TABLE public.member_family OWNER TO root;
GRANT ALL ON TABLE public.member_family TO root;


-- public.otp definition

-- Drop table

-- DROP TABLE public.otp;

CREATE TABLE public.otp (
	otp_id serial4 NOT NULL,
	id_user uuid NULL,
	code varchar NOT NULL,
	created_at timestamp NOT NULL DEFAULT now(),
	updated_at timestamp NOT NULL DEFAULT now(),
	expired_at timestamp NULL,
	CONSTRAINT otp_pk PRIMARY KEY (otp_id),
	CONSTRAINT "FK_5b899a36a6177f5c582dbfaeaad" FOREIGN KEY (id_user) REFERENCES public.users(id_user)
);

-- Permissions

ALTER TABLE public.otp OWNER TO root;
GRANT ALL ON TABLE public.otp TO root;


-- public.refresh_token definition

-- Drop table

-- DROP TABLE public.refresh_token;

CREATE TABLE public.refresh_token (
	refresh_token varchar NULL,
	id_user uuid NULL,
	created_at timestamp NULL,
	expired_at timestamp NULL,
	id serial4 NOT NULL,
	CONSTRAINT refresh_token_pk PRIMARY KEY (id),
	CONSTRAINT refreshtoken_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.refresh_token OWNER TO root;
GRANT ALL ON TABLE public.refresh_token TO root;


-- public.total_category_family definition

-- Drop table

-- DROP TABLE public.total_category_family;

CREATE TABLE public.total_category_family (
	id int4 NOT NULL,
	id_family int4 NOT NULL,
	id_category int4 NOT NULL,
	total money NULL,
	"percent" float4 NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	CONSTRAINT total_category_family_pk PRIMARY KEY (id),
	CONSTRAINT total_category_family_fk FOREIGN KEY (id_family) REFERENCES public."family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT total_category_family_fk_1 FOREIGN KEY (id_category) REFERENCES public.category_expense(id_category) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.total_category_family OWNER TO root;
GRANT ALL ON TABLE public.total_category_family TO root;


-- public.total_category_user definition

-- Drop table

-- DROP TABLE public.total_category_user;

CREATE TABLE public.total_category_user (
	id int4 NOT NULL,
	id_user uuid NOT NULL,
	description varchar NULL,
	id_cateory int4 NOT NULL,
	total money NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	"percent" float4 NULL,
	CONSTRAINT total_category_user_pk PRIMARY KEY (id),
	CONSTRAINT total_category_user_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT total_category_user_fk_1 FOREIGN KEY (id_cateory) REFERENCES public.category_expense(id_category) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Permissions

ALTER TABLE public.total_category_user OWNER TO root;
GRANT ALL ON TABLE public.total_category_user TO root;



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

-- Permissions

ALTER FUNCTION public.f_change_firstname(uuid, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_change_firstname(uuid, text) TO root;

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

-- Permissions

ALTER FUNCTION public.f_change_firstname_lastname(uuid, text, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_change_firstname_lastname(uuid, text, text) TO root;

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

-- Permissions

ALTER FUNCTION public.f_change_lastname(uuid, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_change_lastname(uuid, text) TO root;

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

-- Permissions

ALTER FUNCTION public.f_change_password(int4, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_change_password(int4, text) TO root;

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

-- Permissions

ALTER FUNCTION public.f_change_password(text, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_change_password(text, text) TO root;

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

-- Permissions

ALTER FUNCTION public.f_change_password(uuid, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_change_password(uuid, text) TO root;

CREATE OR REPLACE FUNCTION public.f_create_family(p_id_user uuid, p_description character varying, p_name character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_id INT;
BEGIN
    BEGIN
        INSERT INTO family (quantity, description, created_at, updated_at, "name")
        VALUES (1, p_description, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, p_name)
        RETURNING id_family INTO new_id;
       
        update Users set id_family=new_id where id_user=p_id_user;

        insert into member_family(id_user,id_family, created_at, updated_at, role) values (p_id_user, new_id, now(), now(), null );
    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Failed to create family: %', SQLERRM;
    END;
    RETURN new_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_create_family(uuid, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_family(uuid, varchar, varchar) TO root;

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

-- Permissions

ALTER FUNCTION public.f_create_order(uuid, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_order(uuid, int4, int4) TO root;

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

-- Permissions

ALTER FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar) TO root;

CREATE OR REPLACE FUNCTION public.f_create_user(p_gmail character varying, p_phone character varying, p_password character varying, p_firstname character varying, p_lastname character varying, p_language character varying, login_type character varying)
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
		INSERT INTO users(id_user, email, phone, "password", "language", created_at,login_type,  firstname, lastname)
		VALUES (f_generate_unique_uuid(), p_gmail, p_phone, p_password, p_language, CURRENT_TIMESTAMP,login_type, p_firstname, p_lastname)
		RETURNING id_user INTO new_id;
	EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
    END;	
    RETURN new_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar, varchar) TO root;

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

-- Permissions

ALTER FUNCTION public.f_generate_otp(uuid) OWNER TO root;
GRANT ALL ON FUNCTION public.f_generate_otp(uuid) TO root;

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

-- Permissions

ALTER FUNCTION public.f_generate_refresh_token(uuid) OWNER TO root;
GRANT ALL ON FUNCTION public.f_generate_refresh_token(uuid) TO root;

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

-- Permissions

ALTER FUNCTION public.f_generate_refresh_token(uuid, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_generate_refresh_token(uuid, varchar) TO root;

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

-- Permissions

ALTER FUNCTION public.f_generate_unique_uuid() OWNER TO root;
GRANT ALL ON FUNCTION public.f_generate_unique_uuid() TO root;

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

-- Permissions

ALTER FUNCTION public.f_update_user_avatar(uuid, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_update_user_avatar(uuid, text) TO root;

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

-- Permissions

ALTER FUNCTION public.f_validate_user_mail(varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_validate_user_mail(varchar) TO root;

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

-- Permissions

ALTER FUNCTION public.f_validate_user_phone(varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_validate_user_phone(varchar) TO root;

CREATE OR REPLACE PROCEDURE public.p_add_member(IN p_id uuid, IN p_phone character varying, IN p_email character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    family_id INT;
    user_id UUID;
BEGIN 
    BEGIN
        SELECT id_family INTO family_id FROM Users WHERE id_user = p_id;

        SELECT id_user INTO user_id FROM Users WHERE phone = p_phone OR email = p_email;

        INSERT INTO member_family (id_user, id_family, created_at, updated_at, role)
        VALUES (user_id, family_id, NOW(), NOW(), null);

        UPDATE users SET id_family = family_id WHERE id_user = p_id;
        
    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Fail to add member: %', SQLERRM;
    END;
END;
$procedure$
;

-- Permissions

ALTER PROCEDURE public.p_add_member(uuid, varchar, varchar) OWNER TO root;
GRANT ALL ON PROCEDURE public.p_add_member(uuid, varchar, varchar) TO root;

CREATE OR REPLACE PROCEDURE public.p_add_member(IN p_id uuid, IN p_phone character varying, IN p_email character varying, IN p_role integer)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_family_id INT;
    v_user_id UUID;
BEGIN 
    SELECT id_family INTO v_family_id FROM Users WHERE id_user = p_id;

    SELECT id_user INTO v_user_id FROM Users WHERE phone = p_phone OR email = p_email;

    IF v_family_id IS NOT NULL AND v_user_id IS NOT NULL THEN
        BEGIN
            INSERT INTO member_family (id_user, id_family, created_at, updated_at, role)
            VALUES (v_user_id, v_family_id, NOW(), NOW(), p_role);
        
            UPDATE Users SET id_family = v_family_id WHERE id_user = v_user_id;
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

-- Permissions

ALTER PROCEDURE public.p_add_member(uuid, varchar, varchar, int4) OWNER TO root;
GRANT ALL ON PROCEDURE public.p_add_member(uuid, varchar, varchar, int4) TO root;

CREATE OR REPLACE PROCEDURE public.p_delete_family(IN p_id uuid)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    BEGIN
        DELETE FROM family WHERE id_family = (select id_family from users where id_user=p_id);
    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Fail to delete family: %', SQLERRM;
    END;
END;
$procedure$
;

-- Permissions

ALTER PROCEDURE public.p_delete_family(uuid) OWNER TO root;
GRANT ALL ON PROCEDURE public.p_delete_family(uuid) TO root;

CREATE OR REPLACE PROCEDURE public.p_update_family(IN p_id uuid, IN p_name character varying, IN p_description character varying)
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    BEGIN
        UPDATE family SET description = p_description, "name" = p_name, updated_at=now() WHERE id_family = (select id_family from users where id_user=p_id);
    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Failed to update family: %', SQLERRM;
    END;
END;
$procedure$
;

-- Permissions

ALTER PROCEDURE public.p_update_family(uuid, varchar, varchar) OWNER TO root;
GRANT ALL ON PROCEDURE public.p_update_family(uuid, varchar, varchar) TO root;

CREATE OR REPLACE PROCEDURE public.p_update_payment(IN p_id_order integer)
 LANGUAGE plpgsql
AS $procedure$
begin 
	update "order" set status='0' where id_order=p_id_order;
end
$procedure$
;

-- Permissions

ALTER PROCEDURE public.p_update_payment(int4) OWNER TO root;
GRANT ALL ON PROCEDURE public.p_update_payment(int4) TO root;

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

-- Permissions

ALTER PROCEDURE public.p_validate_otp(varchar, uuid) OWNER TO root;
GRANT ALL ON PROCEDURE public.p_validate_otp(varchar, uuid) TO root;

CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v1() OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v1() TO public;
GRANT ALL ON FUNCTION public.uuid_generate_v1() TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v1() TO root;

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v1mc() OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v1mc() TO public;
GRANT ALL ON FUNCTION public.uuid_generate_v1mc() TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v1mc() TO root;

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v3(uuid, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v3(uuid, text) TO public;
GRANT ALL ON FUNCTION public.uuid_generate_v3(uuid, text) TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v3(uuid, text) TO root;

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v4() OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v4() TO public;
GRANT ALL ON FUNCTION public.uuid_generate_v4() TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v4() TO root;

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v5(uuid, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v5(uuid, text) TO public;
GRANT ALL ON FUNCTION public.uuid_generate_v5(uuid, text) TO postgres;
GRANT ALL ON FUNCTION public.uuid_generate_v5(uuid, text) TO root;

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

-- Permissions

ALTER FUNCTION public.uuid_nil() OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_nil() TO public;
GRANT ALL ON FUNCTION public.uuid_nil() TO postgres;
GRANT ALL ON FUNCTION public.uuid_nil() TO root;

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

-- Permissions

ALTER FUNCTION public.uuid_ns_dns() OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_ns_dns() TO public;
GRANT ALL ON FUNCTION public.uuid_ns_dns() TO postgres;
GRANT ALL ON FUNCTION public.uuid_ns_dns() TO root;

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

-- Permissions

ALTER FUNCTION public.uuid_ns_oid() OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_ns_oid() TO public;
GRANT ALL ON FUNCTION public.uuid_ns_oid() TO postgres;
GRANT ALL ON FUNCTION public.uuid_ns_oid() TO root;

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

-- Permissions

ALTER FUNCTION public.uuid_ns_url() OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_ns_url() TO public;
GRANT ALL ON FUNCTION public.uuid_ns_url() TO postgres;
GRANT ALL ON FUNCTION public.uuid_ns_url() TO root;

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;

-- Permissions

ALTER FUNCTION public.uuid_ns_x500() OWNER TO postgres;
GRANT ALL ON FUNCTION public.uuid_ns_x500() TO public;
GRANT ALL ON FUNCTION public.uuid_ns_x500() TO postgres;
GRANT ALL ON FUNCTION public.uuid_ns_x500() TO root;


-- Permissions

GRANT ALL ON SCHEMA public TO root;
GRANT USAGE ON SCHEMA public TO public;