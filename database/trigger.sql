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
   
------------------------------------------

CREATE OR REPLACE FUNCTION insert_income_sources()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO finance_income_source (id_family, income_details)
    VALUES (
        NEW.id_family, 
        '[
            {"id_income_source": 1, "category": "Salary"},
            {"id_income_source": 2, "category": "Business"},
            {"id_income_source": 3, "category": "Investments"},
            {"id_income_source": 4, "category": "Freelance"},
            {"id_income_source": 5, "category": "Rental"},
            {"id_income_source": 6, "category": "Other"},
            {"id_income_source": 7, "category": "Pension"},
            {"id_income_source": 8, "category": "Gifts"},
            {"id_income_source": 9, "category": "Royalties"}
        ]'::jsonb
    );

    RETURN NEW;
END;
$$;


   
 CREATE TRIGGER after_insert_family
AFTER INSERT ON family
FOR EACH ROW
EXECUTE FUNCTION insert_income_sources();

   
   
   
   
   
   
   
   