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
) RETURNS varchar AS $$
DECLARE
    new_id INT;
    result_message varchar;
	recordCount int;
begin
	SELECT COUNT(*) INTO recordCount FROM users WHERE id_user = p_id_user;
	if recordCount >0 then
	    BEGIN
	        INSERT INTO family (quantity,description, created_at, updated_at, "name", owner_id)
	        VALUES (0, p_description, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, p_name, p_id_user)
	        RETURNING id_family INTO new_id; 
	
	        INSERT INTO member_family (id_user, id_family, created_at, updated_at, "role")
	        VALUES (p_id_user, new_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'owner'); 
	       
	        result_message := 'Successfully created family: ' || p_name;
	    EXCEPTION
	        WHEN others THEN
	            result_message:= 'Failed to create family';
	    END;
	 else
        	result_message:= 'Invalid user provided';
	 end if;
    RETURN result_message;
END;
$$ LANGUAGE plpgsql;


--select f_create_family('bd94ba3a-b046-4a05-a260-890913e09df9','abc', 'family1') as family;



CREATE OR REPLACE function f_update_family(
    p_id uuid,
    p_id_family int,
    p_name VARCHAR,
    p_description VARCHAR
) RETURNS varchar AS $$
DECLARE
    recordCount int;
   	result_message varchar;
begin
	SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
	if recordCount> 0 then 
	    BEGIN
	        UPDATE family SET description = p_description, "name" = p_name, updated_at=now() WHERE id_family = p_id_family;
	       	result_message:='Successfully updated family';
	    EXCEPTION
	        WHEN others THEN
	           result_message:= 'Failed to update family';
	    END;
	 else 
       	 result_message:= 'Not in the same family';

	 end if;
end;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE function f_delete_family(
    p_id_user uuid, 
    p_id_family int
) RETURNS varchar AS $$
declare 
	result_message varchar;
	recordCount int;
begin
	SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family and role='owner';
	if recordCount> 0 then 
	    BEGIN
	        DELETE FROM family WHERE id_family = p_id_family;
	       	result_message := 'Successfully deleted family';
	    EXCEPTION
	        WHEN others THEN
	            result_message:= 'Fail to delete family';
 		end;
	else 
       	result_message:= 'Not in the same family or not the owner of the family';

    end if;
   return result_message;
END;
$$ LANGUAGE plpgsql;
--CALL p_update_family('da7354cf-f526-4df8-9d91-0fbd4a43d196', 'New Family Name', 'New Family Description');
select * from  f_delete_family('bd94ba3a-b046-4a05-a260-890913e09df9', 18) 
--select id_family from users where id_user='da7354cf-f526-4df8-9d91-0fbd4a43d196';
CREATE OR REPLACE FUNCTION f_add_member(
    p_id_user UUID,
    p_id_family int,
    p_phone VARCHAR,
    p_email VARCHAR, 
    p_role varchar
) RETURNS VARCHAR AS $$
DECLARE
    v_user_id UUID;
    recordCount int;
   result_message varchar;
BEGIN 
	sELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;

    SELECT id_user INTO v_user_id FROM Users WHERE phone = p_phone OR email = p_email;

    IF v_user_id IS NOT null and recordCount>0 THEN
        BEGIN
            INSERT INTO member_family (id_user, id_family, created_at, updated_at, role)
            VALUES (v_user_id, p_id_family, NOW(), NOW(), p_role);
           
            result_message := 'Successfully added a member to the family';
        EXCEPTION
            WHEN others THEN
                result_message := 'Failed to add member';
        END;
    ELSE
        result_message :=  'Invalid family or user provided';
    END IF;

    RETURN result_message;
END;
$$ LANGUAGE plpgsql;



INSERT INTO member_family (id_user, id_family, created_at, updated_at, role) values('bd94ba3a-b046-4a05-a260-890913e09df9', 21, now(), now(), 'member')
 
select * from  f_add_member('bd94ba3a-b046-4a05-a260-890913e09df9',24 ,null, 'duongthanhgiang.0108@gmail.com', 'member');
--select id_family from users where id_user='da7354cf-f526-4df8-9d91-0fbd4a43d196'
--select id_user from users where email='Teest3@gmail.com' or phone = ''
--insert into role values(1, 'Member', null, now(), now());


CREATE OR REPLACE function public.f_delete_member(IN p_id_current_user uuid, IN p_id_user uuid, IN p_id_family integer)
RETURNS VARCHAR AS $$
DECLARE
    recordCount int;
   	result_message varchar;
BEGIN 
    SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
	if recordCount> 0 then
        BEGIN
            delete from member_family where id_family=p_id_family and p_id_user=id_user;
           	   	result_message:= 'Successfully deleted member';

        EXCEPTION
		    WHEN others THEN
		        result_message:= 'Failed to delete member';
        END;
    ELSE
        result_message:= 'Invalid family or user provided';
    END IF;
   return result_message;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION public.get_all_family(p_id_user uuid, p_id_family)
 RETURNS SETOF family
 LANGUAGE plpgsql
AS $function$
DECLARE
    familyRecord RECORD;
begin
	SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
	if recordCount> 0 then
		begin
		    FOR familyRecord IN 
		        SELECT id_family FROM member_family WHERE id_user = p_id_user
		    LOOP
		        RETURN QUERY SELECT * FROM family WHERE id_family = familyRecord.id_family;
		    END LOOP;
		 end if;
		
END;
$function$
;

select * from get_all_family('bd94ba3a-b046-4a05-a260-890913e09df9')
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



CREATE OR REPLACE FUNCTION p_update_role(
    p_id_user uuid,
    p_id_family int,
    p_role varchar
) RETURNS varchar AS $$
DECLARE
    error_message varchar;
BEGIN
    BEGIN
        UPDATE member_family
        SET "role" = p_role
        WHERE id_family = p_id_family AND id_user = p_id_user;

        IF NOT FOUND THEN
            error_message := 'Failed to update role for the user.';
        END IF;
    EXCEPTION
        WHEN others THEN
            error_message := 'Failed to update role for the user.';
    END;

    RETURN error_message;
END;
$$ LANGUAGE plpgsql;































