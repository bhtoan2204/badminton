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
