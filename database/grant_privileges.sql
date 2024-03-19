
CREATE OR REPLACE FUNCTION p_create_role() 
RETURNS TRIGGER 
AS $$
BEGIN 
    EXECUTE 'CREATE ROLE ' || NEW.role;
    EXECUTE 'GRANT CONNECT ON DATABASE famfund_i2wq_a3fq TO ' || NEW.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_insert_role
AFTER INSERT ON "role"
FOR EACH ROW
EXECUTE FUNCTION p_create_role();

----------------------------------------INSERT---------------------------------------------------

insert into "role" values('Family member', null, now(), now(), 'member');
insert into "role" values('Mommy', null, now(), now(), 'mom');
insert into "role" values('Daddy', null, now(), now(), 'dad');
insert into "role" values('Owner package', null, now(), now(), 'owner');






--update role sẽ được cấp quyền của role mới
CREATE OR REPLACE FUNCTION update_role_on_member_family()
RETURNS TRIGGER 
AS $$
declare 
	old_role_name varchar;
	new_role_name varchar;
BEGIN
    SELECT OLD.role_name, NEW.role_name INTO old_role_name, new_role_name;

    IF OLD.role <> NEW.role THEN
        EXECUTE 'REVOKE ALL ON DATABASE famfund_i2wq_a3fq FROM ' || id_user;

        EXECUTE 'GRANT ' || NEW.role || ' TO ' || id_user;

    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_role_on_member_family
AFTER INSERT OR UPDATE ON member_family
FOR EACH ROW
EXECUTE FUNCTION update_role_on_member_family();








































