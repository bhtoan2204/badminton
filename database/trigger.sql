CREATE OR REPLACE FUNCTION update_family_quantity() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE family SET quantity = (SELECT COUNT(*) FROM member_family WHERE id_family = NEW.id_family) WHERE id_family = NEW.id_family;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_family_quantity_trigger
AFTER INSERT OR UPDATE ON member_family
FOR EACH ROW
EXECUTE FUNCTION update_family_quantity();


CREATE OR REPLACE FUNCTION decrease_family_quantity() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE family SET quantity = quantity - 1 WHERE id_family = OLD.id_family;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER decrease_family_quantity_trigger
AFTER DELETE ON member_family
FOR EACH ROW
EXECUTE FUNCTION decrease_family_quantity();


CREATE OR REPLACE FUNCTION public.p_delete_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN 

	EXECUTE 'DROP ROLE IF EXISTS ' || OLD.role;

    RETURN OLD;
END;
$function$

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

create trigger tr_insert_role after
insert
    on
    public.role for each row execute function p_create_role();
   
   
create trigger tr_delete_role before
delete
    on
    public.role for each row execute function p_delete_role();
   
   
   
   
 
   
   
   
   
   
   
   
   