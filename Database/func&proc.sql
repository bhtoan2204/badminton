CREATE OR REPLACE FUNCTION f_generate_unique_uuid()
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION f_validate_user_phone(
    p_phone VARCHAR
)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION f_validate_user_mail(
    p_mail VARCHAR
)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION f_create_user(
    p_gmail VARCHAR,
    p_phone VARCHAR,
    p_password VARCHAR,
    p_firstname VARCHAR,
    p_lastname  VARCHAR,
    p_language VARCHAR,
   	login_type varchar
)
RETURNS UUID AS $$
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
$$ LANGUAGE plpgsql;



--select f_create_user('thuhien21052004@gmail.com', '0886725035', 'abc', 'Hien', 'Tran' , 'Vietnam', 'null' ,'local' ) as a;
-- tạo mã OTP 

CREATE OR REPLACE FUNCTION f_generate_otp(owner_id UUID)
RETURNS VARCHAR AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE p_validate_otp(
    IN code VARCHAR,
    IN id_user UUID
)
LANGUAGE plpgsql
AS $$
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
$$;

--select f_generate_otp('da7354cf-f526-4df8-9d91-0fbd4a43d196') as otp;
-- tạo token

CREATE OR REPLACE FUNCTION f_generate_refresh_token(id_user uuid)
RETURNS VARCHAR AS $$
DECLARE
    new_token VARCHAR;
BEGIN
    new_token := md5(random()::text || clock_timestamp()::text);

    INSERT INTO refresh_token (refresh_token, id_user, created_at, expired_at)
    VALUES (new_token,id_user, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours');
	return new_token;
END;
$$ LANGUAGE plpgsql;

--select f_generate_refresh_token('da7354cf-f526-4df8-9d91-0fbd4a43d196') as token;


----------------------FAMILY-----------------------------------------

CREATE OR REPLACE FUNCTION f_create_family(
	p_id_user uuid,
    p_description VARCHAR,
    p_name VARCHAR
) RETURNS INT AS $$
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
$$ LANGUAGE plpgsql;


--select f_create_family('da7354cf-f526-4df8-9d91-0fbd4a43d196','abc', 'family1') as family;



CREATE OR REPLACE PROCEDURE p_update_family(
    p_id uuid,
    p_name VARCHAR,
    p_description VARCHAR
) AS $$
BEGIN
    BEGIN
        UPDATE family SET description = p_description, "name" = p_name, updated_at=now() WHERE id_family = (select id_family from users where id_user=p_id);
    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Failed to update family: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE p_delete_family(
    p_id uuid
) AS $$
BEGIN
    BEGIN
        DELETE FROM family WHERE id_family = (select id_family from users where id_user=p_id);
    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Fail to delete family: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
--CALL p_update_family('da7354cf-f526-4df8-9d91-0fbd4a43d196', 'New Family Name', 'New Family Description');
--call p_delete_family('da7354cf-f526-4df8-9d91-0fbd4a43d196') 
--select id_family from users where id_user='da7354cf-f526-4df8-9d91-0fbd4a43d196';
CREATE OR REPLACE PROCEDURE p_add_member(
    p_id UUID,
    p_phone VARCHAR,
    p_email VARCHAR, 
    p_role INT
) AS $$
DECLARE
    v_family_id INT;
    v_user_id UUID;
    v_name_family varchar;
BEGIN 
    SELECT id_family, "name" INTO v_family_id, v_name_family FROM Users WHERE id_user = p_id;

    SELECT id_user INTO v_user_id FROM Users WHERE phone = p_phone OR email = p_email;

    IF v_family_id IS NOT NULL AND v_user_id IS NOT NULL THEN
        BEGIN
            INSERT INTO member_family (id_user, id_family, created_at, updated_at, role)
            VALUES (v_user_id, v_family_id, NOW(), NOW(), p_role);
        
            UPDATE Users SET id_family = v_family_id WHERE id_user = v_user_id;
            RAISE EXCEPTION 'Successfully added a member to the % family', v_name_family;

        EXCEPTION
            WHEN others THEN
                RAISE EXCEPTION 'Failed to add member: %', SQLERRM;
        END;
    ELSE
        RAISE EXCEPTION 'Invalid family ID or user ID provided';
    END IF;
END;
$$ LANGUAGE plpgsql;



--call p_add_member('53b87106-d15a-4aa2-b6be-3223433614b7',null, 'Test2@gmail.com', null);
--select id_family from users where id_user='da7354cf-f526-4df8-9d91-0fbd4a43d196'
--select id_user from users where email='Teest3@gmail.com' or phone = ''
--insert into role values(1, 'Member', null, now(), now());


-------------ROLE-------------------------

CREATE OR REPLACE VIEW v_get_role AS
SELECT role, name, description FROM "role";


--select * from v_get_role 

CREATE OR REPLACE FUNCTION f_get_role_member( 
    p_id_user uuid,
    p_id_family int
) RETURNS varchar AS $$
DECLARE 	
    v_role varchar;
    v_name varchar;
BEGIN 	
    SELECT "role" INTO v_role FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
    
    SELECT "name" INTO v_name FROM "role" WHERE "role" = v_role;
    
    RETURN v_name;
END
$$ LANGUAGE plpgsql;


































