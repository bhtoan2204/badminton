
CREATE OR REPLACE FUNCTION p_create_role() 
RETURNS TRIGGER 
AS $$
BEGIN 
    EXECUTE 'CREATE ROLE ' || NEW.role;
    EXECUTE 'GRANT CONNECT ON DATABASE famfund_i2wq TO ' || NEW.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_insert_role
AFTER INSERT ON "role"
FOR EACH ROW
EXECUTE FUNCTION p_create_role();

insert into "role" values('User common', null, now(), now() , 'user_common');
insert into "role" values('Owner package', null, now(), now() , 'owner_package');
insert into "role" values('Family members', null, now(), now() , 'member');
insert into "role" values('Mommy', null, now(), now() , 'mommy');
insert into "role" values('Daddy', null, now(), now() , 'daddy');







--update role sẽ được cấp quyền của role mới
CREATE OR REPLACE FUNCTION update_role_on_member_family()
RETURNS TRIGGER 
AS $$
    BEGIN
        SELECT OLD.role_name, NEW.role_name INTO old_role_name, new_role_name;

        IF OLD.role <> NEW.role THEN
            EXECUTE 'REVOKE ALL ON DATABASE famfund_i2wq FROM ' || id_user;

            EXECUTE 'GRANT ' || NEW.role || ' TO ' || id_user;

        END IF;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_role_on_member_family
AFTER INSERT OR UPDATE ON member_family
FOR EACH ROW
EXECUTE FUNCTION update_role_on_member_family();

