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
    p_name VARCHAR, 
    p_id_order int
) RETURNS varchar AS $$
DECLARE
    new_id INT;
    result_message varchar;
    recordCount int;
    p_expired_at timestamp;
BEGIN
    SELECT expired_at INTO p_expired_at 
    FROM "order" 
    WHERE id_user = p_id_user AND id_order = p_id_order AND status ='Succeeded' AND id_family IS NULL; 
    
    IF p_expired_at > NOW() THEN
        SELECT COUNT(*) INTO recordCount FROM users WHERE id_user = p_id_user;
        
        IF recordCount > 0 THEN
            BEGIN
                INSERT INTO family (quantity, description, created_at, updated_at, "name", owner_id, expired_at)
                VALUES (0, p_description, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, p_name, p_id_user, p_expired_at)
                RETURNING id_family INTO new_id; 
            
                INSERT INTO member_family (id_user, id_family, created_at, updated_at, "role")
                VALUES (p_id_user, new_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'owner'); 
                
                UPDATE "order" SET id_family = new_id, updated_at = NOW() WHERE id_order = p_id_order;
                
                result_message := 'Successfully created family: ' || p_name;
            EXCEPTION
                WHEN others THEN
                    result_message := 'Failed to create family';
            END;
        ELSE
            result_message := 'Invalid user provided';
        END IF;
    ELSE 
        result_message := 'Invalid order';
    END IF;
    
    RETURN result_message;
END;
$$ LANGUAGE plpgsql;



--select f_create_family('bd94ba3a-b046-4a05-a260-890913e09df9','abc', 'family1', 28) as family;



CREATE OR REPLACE function f_update_family(
    p_id_user uuid,
    p_id_family int,
    p_name VARCHAR,
    p_description VARCHAR
) RETURNS varchar AS $$
DECLARE
    recordCount int;
   	result_message varchar;
    recordCount_user int;
   	recordCount_family int;

begin
	select count(*) into recordCount_user from users where id_user=p_id_user; 
	select count(*) into recordCount_family from family where id_family = p_id_family; 
	SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
	if recordCount_user then 
		if recordCount_family >0 then
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
		else 
	       	 result_message:= 'Invalid family provided';
	    end if;

	else 
       	 result_message:= 'Invalid user provided';
    end if; 

	return result_message;
end;
$$ LANGUAGE plpgsql;

select * from f_update_family('bd94ba3a-b046-4a05-a260-890913e09df9', 96, 'vdbfvj', 'fnjdf')


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
       	result_message:= 'Not the owner of the family';

    end if;
   return result_message;
END;
$$ LANGUAGE plpgsql;
--CALL p_update_family('da7354cf-f526-4df8-9d91-0fbd4a43d196', 'New Family Name', 'New Family Description');
--select * from  f_delete_family('bd94ba3a-b046-4a05-a260-890913e09df9', 45) 
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
        result_message :=  'Invalid user provided';
    END IF;

    RETURN result_message;
END;
$$ LANGUAGE plpgsql;



--INSERT INTO member_family (id_user, id_family, created_at, updated_at, role) values('bd94ba3a-b046-4a05-a260-890913e09df9', 21, now(), now(), 'member')
 
--select * from  f_add_member('bd94ba3a-b046-4a05-a260-890913e09df9',24 ,null, 'duongthanhgiang.0108@gmail.com', 'member');
--select id_family from users where id_user='da7354cf-f526-4df8-9d91-0fbd4a43d196'
--select id_user from users where email='Teest3@gmail.com' or phone = ''
--insert into role values(1, 'Member', null, now(), now());


CREATE OR REPLACE function public.f_delete_member(IN p_id_current_user uuid, IN p_id_user uuid, IN p_id_family integer)
RETURNS VARCHAR AS $$
DECLARE
    recordCount_member int;
   	result_message varchar;
   	recordCount_owner int;
BEGIN 
	select count(*) into recordCount_owner from member_family where id_user=p_id_current_user and id_family = p_id_family and role='owner';

    SELECT COUNT(*) INTO recordCount_member FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
    if recordCount_owner>0 then
   	begin
		if recordCount_member> 0 then
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
	 end;
	else 
		result_message := 'The current user is not the owner of this family';
	end if;
   return result_message;
END;
$$ LANGUAGE plpgsql;

--select * from f_delete_member('75531187-fa7c-4bff-8b2c-db9b515b8f63', '75531187-fa7c-4bff-8b2c-db9b515b8f63', 43)

CREATE OR REPLACE FUNCTION f_get_all_member(p_id_user uuid, p_id_family integer)
 RETURNS SETOF view_users_role
 LANGUAGE plpgsql
AS $function$
DECLARE
    recordCount int;
    userRecord view_users_role%ROWTYPE;
BEGIN
    SELECT COUNT(*) INTO recordCount FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;

    IF recordCount > 0 THEN
        FOR userRecord IN 
            SELECT * FROM view_users_role WHERE  id_family=p_id_family
        LOOP
            RETURN NEXT userRecord;
        END LOOP;
    END IF;

    
END;
$function$

select* from f_get_all_member('bd94ba3a-b046-4a05-a260-890913e09df9', 98)

CREATE OR REPLACE VIEW view_users_role
AS 
SELECT 
    users.id_user,
    users.email,
    users.phone,
    users.language,
    users.firstname,
    users.lastname,
    m.id_family,
    m.,
    users.avatar
FROM 
    users 
JOIN 
    member_family m ON users.id_user = m.id_user;



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

--select * from f_getfamily('bd94ba3a-b046-4a05-a260-890913e09df9', 98)


--select * from f_get_all_member('bd94ba3a-b046-4a05-a260-890913e09df9', 44)
-------------ROLE-------------------------

CREATE OR REPLACE VIEW v_get_role AS
SELECT role, name, description FROM "role";

select * from v_get_role
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




---------------PAYMENT------------------------
CREATE OR REPLACE FUNCTION f_create_order(p_id_user uuid, p_id_package integer, p_amount int, p_method varchar, p_id_family int)
RETURNS int AS $$
DECLARE
    user_exists BOOLEAN;
    new_id int;
    p_price int;
    p_expired int;
BEGIN
    IF p_id_family = 0 THEN
        SELECT EXISTS(SELECT 1 FROM users WHERE id_user = p_id_user) INTO user_exists;
        
        SELECT price, expired INTO p_price, p_expired 
        FROM package 
        WHERE id_package = p_id_package AND price = p_amount;

        IF NOT user_exists THEN
            RAISE EXCEPTION 'User does not exist';
        ELSIF p_price IS NULL THEN
            RAISE EXCEPTION 'Package does not match';
        ELSE
            BEGIN
                INSERT INTO "order"(id_user, id_package, status, created_at, expired_at, id_family, method) 
                VALUES (p_id_user, p_id_package, 'Pending', NOW(), NOW() + INTERVAL '1 month' * p_expired, null, p_method)
                RETURNING id_order INTO new_id;
                RETURN new_id;
            EXCEPTION
                WHEN others THEN
                    RAISE EXCEPTION 'Failed to create order: %', SQLERRM;
            END;
        END IF;
    ELSE 
        BEGIN
            INSERT INTO "order"(id_user, id_package, status, created_at, expired_at, id_family, method) 
            VALUES (p_id_user, p_id_package, 'Pending', NOW(), NOW() + INTERVAL '1 month' * p_expired, p_id_family, p_method)
            RETURNING id_order INTO new_id;
           	RETURN new_id;

        END;
    END IF;
END;
$$ LANGUAGE plpgsql;




insert into package values (1, 'Basic' , 100000 , null, now() , now() , 3)
insert into package values (2, 'Premium' , 500000 , null, now() , now() , 10)

select * from f_create_order('bd94ba3a-b046-4a05-a260-890913e09df9', 1, 100000, 'vnpay', null)

CREATE OR REPLACE VIEW v_package AS
SELECT
    id_package,
    name ,
    price,
    description,
    expired
FROM
    package;

CREATE OR REPLACE FUNCTION f_check_order(
    p_id_user uuid,
    p_id_order int,
    p_amount int, 
    p_ResponseCode varchar,
    p_TransactionStatus varchar
) RETURNS JSON AS $$
DECLARE 
    returnData JSON;
    valid_user int;
    valid_package int;
    valid_order int;
    status_payment varchar;
   	p_id_family int; 
    p_expired int;
BEGIN 
    SELECT id_package, status, id_family INTO valid_order, status_payment, p_id_family FROM "order" WHERE id_order = p_id_order and id_user=p_id_user; 
    SELECT expired INTO p_expired FROM package WHERE id_package = valid_order AND price = p_amount / 100;
    SELECT expired INTO p_expired FROM package WHERE id_package = valid_order AND price*100 = p_amount;

    IF status_payment = 'Pending' THEN
        IF p_expired is not null THEN
                IF valid_order > 0 THEN 
                    IF p_ResponseCode = '00' THEN
                        UPDATE "order" SET status = 'Succeeded' WHERE id_order = p_id_order;
                        returnData := json_build_object('RspCode', '00', 'Message', 'Success');

                        if p_id_family is not null then 
                        	update family set expired_at = now() + INTERVAL '1 month' * p_expired where id_family = p_id_family;
                        end if;
                        
                    ELSE 
                        UPDATE "order" SET status = 'Failed' WHERE id_order = p_id_order;
                        returnData := json_build_object('RspCode', '00', 'Message', 'Success');
                    END IF;
                ELSE
                    UPDATE "order" SET status = 'Failed' WHERE id_order = p_id_order;
                    returnData := json_build_object('RspCode', '01', 'Message', 'Order not found');
                END IF;
            ELSE 
                UPDATE "order" SET status = 'Failed' WHERE id_order = p_id_order;
                returnData := json_build_object('RspCode', '97', 'Message', 'Checksum failed');
            END IF;
        else
        	UPDATE "order" SET status = 'Failed' WHERE id_order = p_id_order;
            returnData := json_build_object('RspCode', '02', 'Message', 'This order has been updated to the payment status');
        END IF;
    

    RETURN returnData;
END;
$$ LANGUAGE plpgsql;


select * from f_check_order('bd94ba3a-b046-4a05-a260-890913e09df9', 129, 10000000, '00','00')

select * from f_check_order('bd94ba3a-b046-4a05-a260-890913e09df9', 64, 10000000, '00','00')
--CREATE TYPE status_e AS ENUM ('Failed', 'Succeeded', 'Pending', 'Refunded');

--CREATE TYPE type_otp AS ENUM ('verify', 'register', 'forgot_password');
CREATE VIEW order_and_family_view AS
SELECT o.id_order, o.id_package, p.name AS package_name, p.price AS package_price, p.description AS package_description, 
       o.id_family AS order_family_id, o.expired_at AS order_expired_at,
       f.name AS family_name, f.quantity AS family_quantity
FROM "order" o
JOIN package p ON o.id_package = p.id_package
LEFT JOIN family f ON o.id_family = f.id_family;

-- Define a composite type
CREATE TYPE order_info_type AS (
    id_order INT, 
    id_package INT, 
    package_name VARCHAR,
    package_price INT,
    package_description VARCHAR,
    order_family_id INT,
    order_expired_at TIMESTAMP,
    family_name VARCHAR,
    family_quantity INT
);

-- Create the function using the composite type
CREATE OR REPLACE FUNCTION f_get_order_info(p_id_user uuid)
RETURNS SETOF order_info_type AS
$$
DECLARE
    order_record order_info_type;
BEGIN
    FOR order_record IN
        SELECT o.id_order, o.id_package, p.name AS package_name, p.price AS package_price, p.description AS package_description, 
               o.id_family AS order_family_id, o.expired_at AS order_expired_at,
               f.name AS family_name, f.quantity AS family_quantity
        FROM "order" o
        JOIN package p ON o.id_package = p.id_package
        LEFT JOIN family f ON o.id_family = f.id_family
        WHERE o.status = 'Succeeded' AND o.id_user = p_id_user
    LOOP
        RETURN NEXT order_record;
    END LOOP;

    RETURN;
END;
$$
LANGUAGE plpgsql;



select * from f_get_order_info('bd94ba3a-b046-4a05-a260-890913e09df9')

insert into payment_method(name, code) values('VNPAY', 'vnpay');
insert into payment_method(name, code) values('ZaloPay', 'zalopay');


CREATE OR REPLACE FUNCTION "public".generate_unique_invite_code()
RETURNS varchar AS
DECLARE
    characters VARCHAR := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    invite_code VARCHAR := '';
    i INT := 0;
BEGIN
    FOR i IN 1..10 LOOP -- Độ dài mã mời mong muốn (10 ký tự)
        invite_code := invite_code || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
    END LOOP;
    
    RETURN invite_code;
END;
LANGUAGE plpgsql;

select generate_unique_invite_code();

CREATE OR REPLACE FUNCTION f_generate_link_invite(p_id_family INT)
RETURNS VARCHAR AS $$
DECLARE 
    invite_code VARCHAR;
BEGIN 
    -- Kiểm tra xem mã mời đã tồn tại cho family hay chưa
    SELECT code_invite INTO invite_code FROM family WHERE id_family = p_id_family;

    IF invite_code IS NULL THEN
        invite_code := generate_unique_invite_code();
        UPDATE family SET code_invite = invite_code WHERE id_family = p_id_family;
    END IF;

    RETURN 'http://localhost:8080/invite/' || invite_code;
END;
$$ LANGUAGE plpgsql;

------------CALENDAR-----------------
CREATE OR REPLACE FUNCTION f_get_events_for_family(p_id_user uuid, p_id_family int, selected_date varchar) 
RETURNS TABLE (
    id_calendar INT,
    event_datetime TIMESTAMP,
    event_description varchar,
    event_id_family int,
    event_title varchar,
    count_record int
) AS $$
BEGIN
    PERFORM COUNT(*) FROM member_family WHERE id_family = p_id_family AND id_user = p_id_user;

    IF FOUND THEN
        RETURN QUERY
        SELECT c.id_calendar, c.datetime, c.description, c.id_family, c.title, count_record
        FROM calendar c
        WHERE c.id_family = p_id_family
        AND DATE(c.datetime) = selected_date::DATE; 
    END IF;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;



-- DROP FUNCTION public.f_delete_calendar_event(uuid, int4);

CREATE OR REPLACE FUNCTION public.f_delete_calendar_event(p_id_user uuid, p_id_calendar integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_role VARCHAR;
BEGIN
    SELECT role INTO v_role
    FROM member_family mf
    JOIN calendar c ON mf.id_family = c.id_family
    WHERE mf.id_user = p_id_user AND c.id_calendar = p_id_calendar;

    IF v_role IS NULL THEN
        RAISE EXCEPTION 'User is not associated with the specified event or does not exist.';
    ELSE
        DELETE FROM calendar
        WHERE id_calendar = p_id_calendar;
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$function$
;

-- DROP FUNCTION public.f_get_finance_expenditure_type(uuid, int4);

CREATE OR REPLACE FUNCTION public.f_get_finance_expenditure_type(p_id_user uuid, p_id_family integer)
RETURNS SETOF jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_exists;

    IF NOT v_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    RETURN QUERY
    SELECT expenditure_details
    FROM finance_expenditure_type
    WHERE id_family = p_id_family; 
END;
$function$
;

CREATE OR REPLACE FUNCTION public.f_get_finance_income_source(p_id_user uuid, p_id_family integer)
RETURNS SETOF jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_exists;

    IF NOT v_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    RETURN QUERY
    SELECT income_details
    FROM finance_income_source
    WHERE id_family = p_id_family; 
END;
$function$
;

select * from f_get_finance_income_source('28905675-858b-4a93-a283-205899779622', 96)
-- Permissions

ALTER FUNCTION public.f_get_finance_expenditure_type(uuid, int4) OWNER TO avnadmin;
GRANT ALL ON FUNCTION public.f_get_finance_expenditure_type(uuid, int4) TO avnadmin;


CREATE OR REPLACE FUNCTION public.f_create_expenditure_category(p_id_user uuid, p_id_family integer, p_category character varying)
RETURNS VOID
LANGUAGE plpgsql
AS $function$
DECLARE
    v_exists BOOLEAN;
    v_expenditure_details JSONB;
    v_max_id INTEGER;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_exists;

    IF NOT v_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    SELECT expenditure_details INTO v_expenditure_details
    FROM finance_expenditure_type
    WHERE id_family = p_id_family;

    IF v_expenditure_details IS NULL THEN
        v_expenditure_details := '[]';
    END IF;

    SELECT MAX((category->>'id_expense_type')::INTEGER) INTO v_max_id FROM jsonb_array_elements(v_expenditure_details) AS category;

    IF v_max_id IS NULL THEN
        v_max_id := 0;
    END IF;

    v_expenditure_details := v_expenditure_details || jsonb_build_array(jsonb_build_object('category', p_category, 'id_expense_type', v_max_id + 1));

    UPDATE finance_expenditure_type
    SET expenditure_details = v_expenditure_details
    WHERE id_family = p_id_family;
END;
$function$;

CREATE OR REPLACE FUNCTION public.f_create_finance_income_source(p_id_user uuid, p_id_family integer, p_category character varying)
RETURNS VOID
LANGUAGE plpgsql
AS $function$
DECLARE
    v_exists BOOLEAN;
    v_income_details JSONB;
    v_max_id INTEGER;
BEGIN
    -- Kiểm tra xem người dùng có thuộc gia đình không
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_exists;

    IF NOT v_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    -- Lấy thông tin về nguồn thu nhập hiện có
    SELECT income_details INTO v_income_details
    FROM finance_income_source
    WHERE id_family = p_id_family;

    -- Nếu không có nguồn thu nhập nào, khởi tạo nguồn thu nhập là một mảng JSON rỗng
    IF v_income_details IS NULL THEN
        v_income_details := '[]';
    END IF;

    -- Tìm id lớn nhất của nguồn thu nhập hiện có
    SELECT MAX((source->>'id_income_source')::INTEGER) INTO v_max_id FROM jsonb_array_elements(v_income_details) AS source;

    -- Nếu không có nguồn thu nhập nào, thiết lập id mới là 1
    IF v_max_id IS NULL THEN
        v_max_id := 0;
    END IF;

    -- Thêm nguồn thu nhập mới vào mảng JSON nguồn thu nhập
    v_income_details := v_income_details || jsonb_build_array(jsonb_build_object('id_income_source', v_max_id + 1, 'category', p_category));

    -- Cập nhật thông tin nguồn thu nhập vào bảng
    UPDATE finance_income_source
    SET income_details = v_income_details
    WHERE id_family = p_id_family;
END;
$function$;
select * from f_create_finance_income_source('28905675-858b-4a93-a283-205899779622', 96, 'Savings')


select * from f_delete_expenditure_type('28905675-858b-4a93-a283-205899779622', 96, 8)
select * from f_delete_finance_income_source('28905675-858b-4a93-a283-205899779622', 96, 10)

CREATE OR REPLACE FUNCTION public.f_delete_expenditure_type(p_id_user uuid, p_id_family integer, p_id_expenditure_type integer)
RETURNS VOID
LANGUAGE plpgsql
AS $function$
DECLARE
    v_exists BOOLEAN;
    v_expenditure_details JSONB;
BEGIN
    -- Kiểm tra sự tồn tại của người dùng trong gia đình
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_exists;

    -- Nếu user không thuộc family, raise exception
    IF NOT v_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    -- Truy vấn expenditure_details từ bảng finance_expenditure_type
    SELECT expenditure_details INTO v_expenditure_details
    FROM finance_expenditure_type
    WHERE id_family = p_id_family;

    -- Nếu expenditure_details không tồn tại hoặc không chứa id_expenditure_type, không có gì để xóa
    IF v_expenditure_details IS NULL OR NOT EXISTS (SELECT * FROM jsonb_array_elements(v_expenditure_details) AS category WHERE (category->>'id_expense_type')::INTEGER = p_id_expenditure_type) THEN
        RAISE EXCEPTION 'Expenditure type with specified ID does not exist.';
    END IF;

    -- Xóa loại chi tiêu từ expenditure_details
    v_expenditure_details := (SELECT jsonb_agg(category) FROM jsonb_array_elements(v_expenditure_details) AS category WHERE (category->>'id_expense_type')::INTEGER <> p_id_expenditure_type);

    -- Cập nhật lại expenditure_details trong bảng finance_expenditure_type
    UPDATE finance_expenditure_type
    SET expenditure_details = v_expenditure_details
    WHERE id_family = p_id_family;
END;
$function$;

CREATE OR REPLACE FUNCTION public.f_delete_finance_income_source(p_id_user uuid, p_id_family integer, p_id_income_source integer)
RETURNS VOID
LANGUAGE plpgsql
AS $function$
DECLARE
    v_exists BOOLEAN;
    v_income_details JSONB;
BEGIN
    -- Kiểm tra sự tồn tại của người dùng trong gia đình
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_exists;

    -- Nếu user không thuộc family, raise exception
    IF NOT v_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    -- Truy vấn income_details từ bảng finance_income_source
    SELECT income_details INTO v_income_details
    FROM finance_income_source
    WHERE id_family = p_id_family;

    -- Nếu income_details không tồn tại hoặc không chứa id_income_source, không có gì để xóa
    IF v_income_details IS NULL OR NOT EXISTS (SELECT * FROM jsonb_array_elements(v_income_details) AS source WHERE (source->>'id_income_source')::INTEGER = p_id_income_source) THEN
        RAISE EXCEPTION 'Income source with specified ID does not exist.';
    END IF;

    -- Xóa nguồn thu nhập từ income_details
    v_income_details := (SELECT jsonb_agg(source) FROM jsonb_array_elements(v_income_details) AS source WHERE (source->>'id_income_source')::INTEGER <> p_id_income_source);

    -- Cập nhật lại income_details trong bảng finance_income_source
    UPDATE finance_income_source
    SET income_details = v_income_details
    WHERE id_family = p_id_family;
END;
$function$;

-- DROP FUNCTION public.f_get_expenditure(text, int4, int4, int4);

CREATE OR REPLACE FUNCTION public.f_get_expenditure(p_id_user text, p_id_family integer, p_page integer, p_items_per_page integer)
 RETURNS TABLE(id_expenditure integer, id_family integer, id_created_by uuid, expense_name character varying, amount numeric, expenditure_date date, description text)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_offset INTEGER;
BEGIN
    v_offset := (p_page - 1) * p_items_per_page;

    IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE member_family.id_user = p_id_user::uuid AND member_family.id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    RETURN QUERY
    SELECT e.id_expenditure, e.id_family, e.id_created_by, et.expense_name, e.amount, e.expenditure_date, e.description
    FROM finance_expenditure e
    INNER JOIN finance_expenditure_type et ON e.id_expense_type = et.id_expense_type
    WHERE e.id_family = p_id_family
    ORDER BY e.expenditure_date DESC, e.id_expenditure
    LIMIT p_items_per_page OFFSET v_offset;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_expenditure(text, int4, int4, int4) OWNER TO avnadmin;
GRANT ALL ON FUNCTION public.f_get_expenditure(text, int4, int4, int4) TO avnadmin;


CREATE OR REPLACE FUNCTION public.f_get_category_name(p_id_family integer, p_id_expense_type integer)
RETURNS TEXT
LANGUAGE plpgsql
AS $function$
DECLARE
    v_category_name TEXT;
BEGIN
    -- Lấy tên của category dựa trên id_expense_type và id_family
   SELECT category->>'category' into v_category_name
	FROM (
	    SELECT jsonb_array_elements(finance_expenditure_type.expenditure_details) AS category
	    FROM finance_expenditure_type 
	    WHERE id_family = p_id_family
	) AS subquery
	WHERE (category->>'id_expense_type')::integer = p_id_expense_type;

    -- Kiểm tra xem có tìm thấy category không
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Expense type with specified ID and family does not exist.';
    END IF;

    RETURN v_category_name;
END;
$function$;

CREATE OR REPLACE FUNCTION public.f_get_income_name(p_id_family integer, p_id_income_type integer)
RETURNS TEXT
LANGUAGE plpgsql
AS $function$
DECLARE
    v_category_name TEXT;
BEGIN
    -- Lấy tên của category dựa trên id_expense_type và id_family
   SELECT category->>'category' into v_category_name
	FROM (
	    SELECT jsonb_array_elements(finance_income_source.income_details) AS category
	    FROM finance_income_source 
	    WHERE id_family = p_id_family
	) AS subquery
	WHERE (category->>'id_income_source')::integer = p_id_income_type;

    -- Kiểm tra xem có tìm thấy category không
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Expense type with specified ID and family does not exist.';
    END IF;

    RETURN v_category_name;
END;
$function$;
select * from f_get_income_name(101, 1)



CREATE OR REPLACE FUNCTION public.f_get_expense_by_date(p_id_user uuid, p_id_family integer, p_expense_date date)
RETURNS TABLE (
    id_expense_type integer,
    expense_category text,
    expense_amount numeric
)
LANGUAGE plpgsql
AS $function$
DECLARE
    v_user_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    RETURN QUERY
    SELECT 
        fe.id_expense_type,
        f_get_category_name(p_id_family, fe.id_expense_type) AS expense_category,
        fe.amount
    FROM 
        finance_expenditure fe
    WHERE 
        fe.id_family = p_id_family 
        AND fe.expenditure_date = p_expense_date;
END;
$function$;

------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.f_get_income_by_date(p_id_user uuid, p_id_family integer, p_income_date date)
RETURNS TABLE (
    id_income_source integer,
    income_category text,
    income_amount numeric
)
LANGUAGE plpgsql
AS $function$
DECLARE
    v_user_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    RETURN QUERY
    SELECT 
        fi.id_income_source,
        f_get_income_name(p_id_family, fi.id_income_source),
        fi.amount
    FROM 
        finance_income fi 
    WHERE 
        fi.id_family = p_id_family 
        AND fi.income_date = p_income_date;
END;
$function$;

select * from f_get_expense_by_date('28905675-858b-4a93-a283-205899779622', 96, '2024-05-02')
select * from f_get_income_by_date('28905675-858b-4a93-a283-205899779622', 96, '2024-05-02')

select * from f_get_expense_by_month('28905675-858b-4a93-a283-205899779622', 96, 5, 2024)
select * from f_get_income_by_month('28905675-858b-4a93-a283-205899779622', 96, 5, 2024)

select * from f_get_expense_by_year('28905675-858b-4a93-a283-205899779622', 96,  2024)
select * from f_get_income_by_year('28905675-858b-4a93-a283-205899779622', 96,  2024)

---------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.f_get_expense_by_month(
    p_id_user uuid, 
    p_id_family integer, 
    p_month integer, 
    p_year integer
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
    v_user_exists BOOLEAN;
    v_result jsonb := '[]'::jsonb;
    v_current_date date;
    v_total numeric;
    v_categories jsonb;
    v_category jsonb;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    FOR v_current_date IN
        SELECT DISTINCT expenditure_date::date
        FROM finance_expenditure
        WHERE id_family = p_id_family 
          AND EXTRACT(MONTH FROM expenditure_date) = p_month
          AND EXTRACT(YEAR FROM expenditure_date) = p_year
    LOOP
        SELECT COALESCE(SUM(amount), 0)
        INTO v_total
        FROM finance_expenditure
        WHERE id_family = p_id_family 
          AND expenditure_date::date = v_current_date;

        v_categories := '[]'::jsonb;
        FOR v_category IN
            SELECT jsonb_build_object(
                       'name', f_get_category_name(p_id_family, fe.id_expense_type),
                       'amount', COALESCE(SUM(fe.amount), 0)
                   ) AS category
            FROM finance_expenditure fe
            WHERE fe.id_family = p_id_family 
              AND fe.expenditure_date::date = v_current_date
            GROUP BY fe.id_expense_type
        LOOP
            v_categories := v_categories || v_category;
        END LOOP;

        -- Thêm kết quả vào JSON chính
        v_result := v_result || jsonb_build_object(
            'date', v_current_date,
            'total', v_total,
            'categories', v_categories
        )::jsonb;
    END LOOP;

    RETURN v_result;
END;
$function$;


CREATE OR REPLACE FUNCTION public.f_get_income_by_month(
    p_id_user uuid, 
    p_id_family integer, 
    p_month integer, 
    p_year integer
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
    v_user_exists BOOLEAN;
    v_result jsonb := '[]'::jsonb;
    v_current_date date;
    v_total numeric;
    v_categories jsonb;
    v_category jsonb;
BEGIN
    -- Kiểm tra xem người dùng có thuộc gia đình không
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    -- Lặp qua từng ngày trong tháng
    FOR v_current_date IN
        SELECT DISTINCT income_date::date
        FROM finance_income
        WHERE id_family = p_id_family 
          AND EXTRACT(MONTH FROM income_date) = p_month
          AND EXTRACT(YEAR FROM income_date) = p_year
    LOOP
        -- Tính tổng thu nhập của ngày hiện tại
        SELECT COALESCE(SUM(amount), 0)
        INTO v_total
        FROM finance_income
        WHERE id_family = p_id_family 
          AND income_date::date = v_current_date;

        v_categories := '[]'::jsonb;
        
        -- Lặp qua từng loại thu nhập trong ngày hiện tại
        FOR v_category IN
            SELECT jsonb_build_object(
                       'name', f_get_income_name(p_id_family, fi.id_income_source),
                       'amount', COALESCE(SUM(fi.amount), 0)
                   ) AS category
            FROM finance_income fi
            WHERE fi.id_family = p_id_family 
              AND fi.income_date::date = v_current_date
            GROUP BY fi.id_income_source
        LOOP
            v_categories := v_categories || v_category;
        END LOOP;

        -- Thêm kết quả vào JSON chính
        v_result := v_result || jsonb_build_object(
            'date', v_current_date,
            'total', v_total,
            'categories', v_categories
        )::jsonb;
    END LOOP;

    RETURN v_result;
END;
$function$;


--------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.f_get_expense_by_year(
    p_id_user uuid, 
    p_id_family integer, 
    p_year integer
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
    v_user_exists BOOLEAN;
    v_result jsonb := '[]'::jsonb;
    v_current_month integer;
    v_total numeric;
    v_categories jsonb;
    v_category jsonb;
BEGIN
    -- Kiểm tra xem người dùng có thuộc gia đình không
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    -- Duyệt qua các tháng trong năm
    FOR v_current_month IN 1..12 LOOP
        -- Tính tổng chi tiêu cho tháng hiện tại
        SELECT COALESCE(SUM(amount), 0)
        INTO v_total
        FROM finance_expenditure
        WHERE id_family = p_id_family 
          AND EXTRACT(MONTH FROM expenditure_date) = v_current_month
          AND EXTRACT(YEAR FROM expenditure_date) = p_year;

        -- Lấy danh sách các loại chi tiêu cho tháng hiện tại
        v_categories := '[]'::jsonb;
        FOR v_category IN
            SELECT jsonb_build_object(
                       'name', f_get_category_name(p_id_family, fe.id_expense_type),
                       'amount', COALESCE(SUM(fe.amount), 0)
                   ) AS category
            FROM finance_expenditure fe
            WHERE fe.id_family = p_id_family 
              AND EXTRACT(MONTH FROM fe.expenditure_date) = v_current_month
              AND EXTRACT(YEAR FROM fe.expenditure_date) = p_year
            GROUP BY fe.id_expense_type
        LOOP
            v_categories := v_categories || v_category;
        END LOOP;

        -- Thêm kết quả vào JSON chính nếu có chi tiêu trong tháng
        IF v_total > 0 THEN
            v_result := v_result || jsonb_build_object(
                'month', v_current_month,
                'total', v_total,
                'categories', v_categories
            )::jsonb;
        END IF;
    END LOOP;

    RETURN v_result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.f_get_income_by_year(
    p_id_user uuid, 
    p_id_family integer, 
    p_year integer
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
    v_user_exists BOOLEAN;
    v_result jsonb := '[]'::jsonb;
    v_current_month integer;
    v_total_income numeric;
    v_income_sources jsonb;
    v_income_source jsonb;
BEGIN
    -- Kiểm tra xem người dùng có thuộc gia đình không
    SELECT EXISTS (
        SELECT 1
        FROM member_family
        WHERE id_user = p_id_user AND id_family = p_id_family
    ) INTO v_user_exists;

    IF NOT v_user_exists THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    END IF;

    -- Duyệt qua các tháng trong năm
    FOR v_current_month IN 1..12 LOOP
        -- Tính tổng thu nhập cho tháng hiện tại
        SELECT COALESCE(SUM(amount), 0)
        INTO v_total_income
        FROM finance_income
        WHERE id_family = p_id_family 
          AND EXTRACT(MONTH FROM income_date) = v_current_month
          AND EXTRACT(YEAR FROM income_date) = p_year;

        -- Lấy danh sách các nguồn thu nhập cho tháng hiện tại
        v_income_sources := '[]'::jsonb;
        FOR v_income_source IN
            SELECT jsonb_build_object(
                       'name', f_get_income_name(p_id_family, fi.id_income_source),
                       'amount', COALESCE(SUM(fi.amount), 0)
                   ) AS income_source
            FROM finance_income fi
            WHERE fi.id_family = p_id_family 
              AND EXTRACT(MONTH FROM fi.income_date) = v_current_month
              AND EXTRACT(YEAR FROM fi.income_date) = p_year
            GROUP BY fi.id_income_source
        LOOP
            v_income_sources := v_income_sources || v_income_source;
        END LOOP;

        -- Thêm kết quả vào JSON chính nếu có thu nhập trong tháng
        IF v_total_income > 0 THEN
            v_result := v_result || jsonb_build_object(
                'month', v_current_month,
                'total_income', v_total_income,
                'income_sources', v_income_sources
            )::jsonb;
        END IF;
    END LOOP;

    RETURN v_result;
END;
$function$;
