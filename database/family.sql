-- DROP SCHEMA public;


-- DROP TYPE public."homework_status";

CREATE TYPE public."homework_status" AS ENUM (
	'pending',
	'completed');

-- DROP TYPE public."status";

CREATE TYPE public."status" AS ENUM (
	'failed',
	'successed',
	'pending',
	'refunded');

-- DROP TYPE public."status_e";

CREATE TYPE public."status_e" AS ENUM (
	'Failed',
	'Succeeded',
	'Pending',
	'Refunded');

-- DROP TYPE public."status_enum";

CREATE TYPE public."status_enum" AS ENUM (
	'Failed',
	'Successed',
	'Pending',
	'Refunded');

-- DROP TYPE public."subject_status";

CREATE TYPE public."subject_status" AS ENUM (
	'in_progress',
	'done');

-- DROP TYPE public."type_otp";

CREATE TYPE public."type_otp" AS ENUM (
	'verify',
	'register',
	'forgot_password');

-- DROP TYPE public."users_login_type_enum";

CREATE TYPE public."users_login_type_enum" AS ENUM (
	'local',
	'google',
	'facebook');

-- DROP SEQUENCE public.calendar_id_calendar_seq;

CREATE SEQUENCE public.calendar_id_calendar_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.calendar_id_calendar_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.calendar_id_calendar_seq TO root;

-- DROP SEQUENCE public.education_progress_id_education_progress_seq;

CREATE SEQUENCE public.education_progress_id_education_progress_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.education_progress_id_education_progress_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.education_progress_id_education_progress_seq TO root;

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

-- DROP SEQUENCE public.family_id_family_seq1;

CREATE SEQUENCE public.family_id_family_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.family_id_family_seq1 OWNER TO root;
GRANT ALL ON SEQUENCE public.family_id_family_seq1 TO root;

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

-- DROP SEQUENCE public.guide_items_id_item_seq;

CREATE SEQUENCE public.guide_items_id_item_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.guide_items_id_item_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.guide_items_id_item_seq TO root;

-- DROP SEQUENCE public.key_id_seq;

CREATE SEQUENCE public.key_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.key_id_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.key_id_seq TO root;

-- DROP SEQUENCE public.key_id_seq1;

CREATE SEQUENCE public.key_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.key_id_seq1 OWNER TO root;
GRANT ALL ON SEQUENCE public.key_id_seq1 TO root;

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

-- DROP SEQUENCE public.member_family_id_seq1;

CREATE SEQUENCE public.member_family_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.member_family_id_seq1 OWNER TO root;
GRANT ALL ON SEQUENCE public.member_family_id_seq1 TO root;

-- DROP SEQUENCE public.notification_id_notification_seq;

CREATE SEQUENCE public.notification_id_notification_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.notification_id_notification_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.notification_id_notification_seq TO root;

-- DROP SEQUENCE public.order_family_id_seq;

CREATE SEQUENCE public.order_family_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.order_family_id_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.order_family_id_seq TO root;

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

-- DROP SEQUENCE public.order_id_order_seq1;

CREATE SEQUENCE public.order_id_order_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.order_id_order_seq1 OWNER TO root;
GRANT ALL ON SEQUENCE public.order_id_order_seq1 TO root;

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

-- DROP SEQUENCE public.otp_otp_id_seq1;

CREATE SEQUENCE public.otp_otp_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.otp_otp_id_seq1 OWNER TO root;
GRANT ALL ON SEQUENCE public.otp_otp_id_seq1 TO root;

-- DROP SEQUENCE public.payment_method_id_seq;

CREATE SEQUENCE public.payment_method_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.payment_method_id_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.payment_method_id_seq TO root;

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

-- DROP SEQUENCE public.refresh_token_id_seq1;

CREATE SEQUENCE public.refresh_token_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.refresh_token_id_seq1 OWNER TO root;
GRANT ALL ON SEQUENCE public.refresh_token_id_seq1 TO root;

-- DROP SEQUENCE public.subjects_id_subject_seq;

CREATE SEQUENCE public.subjects_id_subject_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER SEQUENCE public.subjects_id_subject_seq OWNER TO root;
GRANT ALL ON SEQUENCE public.subjects_id_subject_seq TO root;
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
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	"name" varchar NULL,
	owner_id uuid NULL,
	expired_at timestamp NOT NULL,
	code_invite varchar NULL,
	avatar varchar NULL,
	CONSTRAINT family_pk PRIMARY KEY (id_family),
	CONSTRAINT family_unique UNIQUE (code_invite)
);

-- Permissions

ALTER TABLE public."family" OWNER TO root;
GRANT ALL ON TABLE public."family" TO root;


-- public.guide_items definition

-- Drop table

-- DROP TABLE public.guide_items;

CREATE TABLE public.guide_items (
	id_item serial4 NOT NULL,
	"name" varchar NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	id_family int4 NULL,
	step json NULL,
	is_shared bool NULL,
	description varchar(255) NULL,
	CONSTRAINT guide_items_unique UNIQUE (id_item)
);

-- Permissions

ALTER TABLE public.guide_items OWNER TO root;
GRANT ALL ON TABLE public.guide_items TO root;


-- public."key" definition

-- Drop table

-- DROP TABLE public."key";

CREATE TABLE public."key" (
	id serial4 NOT NULL,
	"key" varchar NOT NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NULL,
	CONSTRAINT key_pk PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE public."key" OWNER TO root;
GRANT ALL ON TABLE public."key" TO root;


-- public.notification definition

-- Drop table

-- DROP TABLE public.notification;

CREATE TABLE public.notification (
	id_notification serial4 NOT NULL,
	"content" varchar NOT NULL,
	"type" varchar NULL,
	id_family int4 NULL,
	id_user uuid NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	subject varchar NULL,
	CONSTRAINT notification_unique UNIQUE (id_notification)
);

-- Permissions

ALTER TABLE public.notification OWNER TO root;
GRANT ALL ON TABLE public.notification TO root;


-- public.order_family definition

-- Drop table

-- DROP TABLE public.order_family;

CREATE TABLE public.order_family (
	id serial4 NOT NULL,
	id_order int4 NOT NULL,
	id_family int4 NOT NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NULL,
	expried_at timestamp NOT NULL
);

-- Permissions

ALTER TABLE public.order_family OWNER TO root;
GRANT ALL ON TABLE public.order_family TO root;


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
	expired int4 NOT NULL,
	CONSTRAINT package_pk PRIMARY KEY (id_package)
);

-- Permissions

ALTER TABLE public.package OWNER TO root;
GRANT ALL ON TABLE public.package TO root;


-- public.payment_method definition

-- Drop table

-- DROP TABLE public.payment_method;

CREATE TABLE public.payment_method (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	code varchar NOT NULL,
	url_image varchar NULL
);

-- Permissions

ALTER TABLE public.payment_method OWNER TO root;
GRANT ALL ON TABLE public.payment_method TO root;


-- public.recordcount definition

-- Drop table

-- DROP TABLE public.recordcount;

CREATE TABLE public.recordcount (
	count int8 NULL
);

-- Permissions

ALTER TABLE public.recordcount OWNER TO root;
GRANT ALL ON TABLE public.recordcount TO root;


-- public."role" definition

-- Drop table

-- DROP TABLE public."role";

CREATE TABLE public."role" (
	"name" varchar NOT NULL,
	description varchar NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "name" UNIQUE (name)
);

-- Table Triggers

create trigger tr_delete_role before
delete
    on
    public.role for each row execute function p_delete_role();
create trigger tr_insert_role after
insert
    on
    public.role for each row execute function p_create_role();

-- Permissions

ALTER TABLE public."role" OWNER TO root;
GRANT ALL ON TABLE public."role" TO root;


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id_user uuid DEFAULT uuid_generate_v4() NOT NULL,
	email varchar NULL,
	phone varchar NULL,
	"password" varchar NULL,
	"language" varchar NULL,
	twofa bool DEFAULT false NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	isphoneverified bool DEFAULT false NOT NULL,
	isadmin bool DEFAULT false NOT NULL,
	firstname varchar NULL,
	lastname varchar NULL,
	isemailverified bool DEFAULT false NOT NULL,
	avatar varchar NULL,
	login_type public."users_login_type_enum" DEFAULT 'local'::users_login_type_enum NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id_user)
);

-- Table Triggers

create trigger encrypt_user_password_trigger before
insert
    or
update
    of password on
    public.users for each row execute function encrypt_user_password();

-- Permissions

ALTER TABLE public.users OWNER TO root;
GRANT ALL ON TABLE public.users TO root;


-- public.v_role definition

-- Drop table

-- DROP TABLE public.v_role;

CREATE TABLE public.v_role (
	"role" varchar NULL
);

-- Permissions

ALTER TABLE public.v_role OWNER TO root;
GRANT ALL ON TABLE public.v_role TO root;


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
	id_calendar serial4 NOT NULL,
	datetime timestamp NOT NULL,
	description varchar NULL,
	id_family int4 NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	title varchar NOT NULL,
	CONSTRAINT calendar_pk PRIMARY KEY (id_calendar),
	CONSTRAINT calendar_fk FOREIGN KEY (id_family) REFERENCES public."family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED
);

-- Table Triggers

create trigger update_updated_at_before_update before
update
    on
    public.calendar for each row execute function update_updated_at_column();

-- Permissions

ALTER TABLE public.calendar OWNER TO root;
GRANT ALL ON TABLE public.calendar TO root;


-- public.education_progress definition

-- Drop table

-- DROP TABLE public.education_progress;

CREATE TABLE public.education_progress (
	id_education_progress serial4 NOT NULL,
	id_family int4 NULL,
	id_user uuid NULL,
	title varchar(255) NULL,
	progress_notes text NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	school_info text NULL,
	CONSTRAINT education_progress_pkey PRIMARY KEY (id_education_progress),
	CONSTRAINT fk_educationprogress_family FOREIGN KEY (id_family) REFERENCES public."family"(id_family),
	CONSTRAINT fk_educationprogress_user FOREIGN KEY (id_user) REFERENCES public.users(id_user)
);

-- Table Triggers

create trigger update_education_progress_modtime before
update
    on
    public.education_progress for each row execute function update_modified_column();

-- Permissions

ALTER TABLE public.education_progress OWNER TO root;
GRANT ALL ON TABLE public.education_progress TO root;


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
	id serial4 NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT member_family_pk PRIMARY KEY (id),
	CONSTRAINT member_family_un UNIQUE (id_user, id_family),
	CONSTRAINT member_family_fk FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT member_family_fk_1 FOREIGN KEY (id_family) REFERENCES public."family"(id_family) ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED
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

-- Permissions

ALTER TABLE public.member_family OWNER TO root;
GRANT ALL ON TABLE public.member_family TO root;


-- public."order" definition

-- Drop table

-- DROP TABLE public."order";

CREATE TABLE public."order" (
	id_user uuid NOT NULL,
	id_package int4 NOT NULL,
	"status" public."status_e" NOT NULL,
	created_at timestamp NULL,
	updated_at timestamp NULL,
	id_order serial4 NOT NULL,
	expired_at timestamp NULL,
	id_family int4 NULL,
	"method" varchar NULL,
	CONSTRAINT order_pk PRIMARY KEY (id_order),
	CONSTRAINT order_fk FOREIGN KEY (id_family) REFERENCES public."family"(id_family) ON DELETE SET NULL ON UPDATE SET NULL
);

-- Permissions

ALTER TABLE public."order" OWNER TO root;
GRANT ALL ON TABLE public."order" TO root;


-- public.otp definition

-- Drop table

-- DROP TABLE public.otp;

CREATE TABLE public.otp (
	otp_id serial4 NOT NULL,
	id_user uuid NULL,
	code varchar NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	expired_at timestamp NULL,
	email varchar(255) NULL,
	"type" public."type_otp" NULL,
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


-- public.subjects definition

-- Drop table

-- DROP TABLE public.subjects;

CREATE TABLE public.subjects (
	id_subject serial4 NOT NULL,
	id_education_progress int4 NULL,
	subject_name varchar(255) NOT NULL,
	description text NULL,
	component_scores json NULL,
	midterm_score float8 NULL,
	final_score float8 NULL,
	bonus_score float8 NULL,
	"status" public."subject_status" NULL,
	CONSTRAINT subjects_pkey PRIMARY KEY (id_subject),
	CONSTRAINT fk_education_progress_subjects FOREIGN KEY (id_education_progress) REFERENCES public.education_progress(id_education_progress)
);

-- Permissions

ALTER TABLE public.subjects OWNER TO root;
GRANT ALL ON TABLE public.subjects TO root;


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


-- public.user_info_view source

CREATE OR REPLACE VIEW public.user_info_view
AS SELECT email,
    phone,
    language,
    firstname,
    lastname
   FROM users;

-- Permissions

ALTER TABLE public.user_info_view OWNER TO root;
GRANT ALL ON TABLE public.user_info_view TO root;


-- public.v_get_role source

CREATE OR REPLACE VIEW public.v_get_role
AS SELECT role,
    name,
    description
   FROM role;

-- Permissions

ALTER TABLE public.v_get_role OWNER TO root;
GRANT ALL ON TABLE public.v_get_role TO root;


-- public.v_package source

CREATE OR REPLACE VIEW public.v_package
AS SELECT id_package,
    name,
    price,
    description,
    expired
   FROM package;

-- Permissions

ALTER TABLE public.v_package OWNER TO root;
GRANT ALL ON TABLE public.v_package TO root;


-- public.view_users source

CREATE OR REPLACE VIEW public.view_users
AS SELECT id_user,
    email,
    phone,
    language,
    firstname,
    lastname,
    avatar
   FROM users;

-- Permissions

ALTER TABLE public.view_users OWNER TO root;
GRANT ALL ON TABLE public.view_users TO root;


-- public.view_users_role source

CREATE OR REPLACE VIEW public.view_users_role
AS SELECT users.id_user,
    users.email,
    users.phone,
    users.language,
    users.firstname,
    users.lastname,
    m.id_family,
    m.role,
    users.avatar
   FROM users
     JOIN member_family m ON users.id_user = m.id_user;

-- Permissions

ALTER TABLE public.view_users_role OWNER TO root;
GRANT ALL ON TABLE public.view_users_role TO root;



-- DROP FUNCTION public.armor(bytea);

CREATE OR REPLACE FUNCTION public.armor(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- Permissions

ALTER FUNCTION public.armor(bytea) OWNER TO postgres;
GRANT ALL ON FUNCTION public.armor(bytea) TO public;
GRANT ALL ON FUNCTION public.armor(bytea) TO postgres;
GRANT ALL ON FUNCTION public.armor(bytea) TO root;

-- DROP FUNCTION public.armor(bytea, _text, _text);

CREATE OR REPLACE FUNCTION public.armor(bytea, text[], text[])
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_armor$function$
;

-- Permissions

ALTER FUNCTION public.armor(bytea, _text, _text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.armor(bytea, _text, _text) TO public;
GRANT ALL ON FUNCTION public.armor(bytea, _text, _text) TO postgres;
GRANT ALL ON FUNCTION public.armor(bytea, _text, _text) TO root;

-- DROP FUNCTION public.check_phone_number_exists(varchar);

CREATE OR REPLACE FUNCTION public.check_phone_number_exists(p_phone character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    phone_exists BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM users WHERE phone = p_phone) INTO phone_exists;
    RETURN phone_exists;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.check_phone_number_exists(varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.check_phone_number_exists(varchar) TO root;

-- DROP FUNCTION public.compare_passwords(varchar, varchar);

CREATE OR REPLACE FUNCTION public.compare_passwords(input_password character varying, hashed_password character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    decryption_key VARCHAR;
    decrypted_password VARCHAR;
BEGIN
    -- Lấy key từ bảng key với id = 1
    SELECT key INTO decryption_key 
    FROM key 
    WHERE id = 1;

    -- Giải mã hashed_password để so sánh với input_password
    decrypted_password := pgp_sym_decrypt(hashed_password::BYTEA, decryption_key);

    -- So sánh mật khẩu đã giải mã với mật khẩu nhập vào
    if decrypted_password = input_password then
    	return true;
    else 
    	return false;
    end if;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.compare_passwords(varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.compare_passwords(varchar, varchar) TO root;

-- DROP PROCEDURE public.create_users_from_table();

CREATE OR REPLACE PROCEDURE public.create_users_from_table()
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    user_record RECORD;
    user_exists BOOLEAN;
BEGIN
    FOR user_record IN SELECT * FROM users LOOP
        BEGIN
            -- Kiểm tra xem người dùng đã tồn tại chưa
            EXECUTE 'SELECT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = ''' || user_record.id_user || ''')' INTO user_exists;
            
            -- Nếu người dùng chưa tồn tại, tạo người dùng mới
            IF NOT user_exists THEN
                EXECUTE 'CREATE USER "' || user_record.id_user || '" WITH PASSWORD ' || quote_literal(user_record.password) || ';';
                RAISE NOTICE 'User % created successfully', user_record.id_user;
            END IF;
        EXCEPTION
            WHEN others THEN
                RAISE EXCEPTION 'Failed to create user %: %', user_record.id_user, SQLERRM;
        END;
    END LOOP;
END;
$procedure$
;

-- Permissions

ALTER PROCEDURE public.create_users_from_table() OWNER TO root;
GRANT ALL ON PROCEDURE public.create_users_from_table() TO root;

-- DROP FUNCTION public.crypt(text, text);

CREATE OR REPLACE FUNCTION public.crypt(text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_crypt$function$
;

-- Permissions

ALTER FUNCTION public.crypt(text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.crypt(text, text) TO public;
GRANT ALL ON FUNCTION public.crypt(text, text) TO postgres;
GRANT ALL ON FUNCTION public.crypt(text, text) TO root;

-- DROP FUNCTION public.dearmor(text);

CREATE OR REPLACE FUNCTION public.dearmor(text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_dearmor$function$
;

-- Permissions

ALTER FUNCTION public.dearmor(text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.dearmor(text) TO public;
GRANT ALL ON FUNCTION public.dearmor(text) TO postgres;
GRANT ALL ON FUNCTION public.dearmor(text) TO root;

-- DROP FUNCTION public.decrease_family_quantity();

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

-- Permissions

ALTER FUNCTION public.decrease_family_quantity() OWNER TO root;
GRANT ALL ON FUNCTION public.decrease_family_quantity() TO root;

-- DROP FUNCTION public.decrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.decrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt$function$
;

-- Permissions

ALTER FUNCTION public.decrypt(bytea, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.decrypt(bytea, bytea, text) TO public;
GRANT ALL ON FUNCTION public.decrypt(bytea, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.decrypt(bytea, bytea, text) TO root;

-- DROP FUNCTION public.decrypt_iv(bytea, bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.decrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_decrypt_iv$function$
;

-- Permissions

ALTER FUNCTION public.decrypt_iv(bytea, bytea, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.decrypt_iv(bytea, bytea, bytea, text) TO public;
GRANT ALL ON FUNCTION public.decrypt_iv(bytea, bytea, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.decrypt_iv(bytea, bytea, bytea, text) TO root;

-- DROP FUNCTION public.decryption(text);

CREATE OR REPLACE FUNCTION public.decryption(encrypted_data text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    p_key TEXT;
BEGIN
    -- Lấy key từ bảng key với id = 1
    SELECT key INTO p_key FROM "key" WHERE id = 1;
    -- Giải mã dữ liệu với key đã lấy
    RETURN pgp_sym_decrypt(encrypted_data::BYTEA, p_key)::TEXT;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.decryption(text) OWNER TO root;
GRANT ALL ON FUNCTION public.decryption(text) TO root;

-- DROP FUNCTION public.digest(bytea, text);

CREATE OR REPLACE FUNCTION public.digest(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- Permissions

ALTER FUNCTION public.digest(bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.digest(bytea, text) TO public;
GRANT ALL ON FUNCTION public.digest(bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.digest(bytea, text) TO root;

-- DROP FUNCTION public.digest(text, text);

CREATE OR REPLACE FUNCTION public.digest(text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_digest$function$
;

-- Permissions

ALTER FUNCTION public.digest(text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.digest(text, text) TO public;
GRANT ALL ON FUNCTION public.digest(text, text) TO postgres;
GRANT ALL ON FUNCTION public.digest(text, text) TO root;

-- DROP FUNCTION public.encrypt(text);

CREATE OR REPLACE FUNCTION public.encrypt(data text)
 RETURNS bytea
 LANGUAGE plpgsql
AS $function$
DECLARE
    key_bytea bytea;
BEGIN
    SELECT key INTO key_bytea FROM key WHERE id = 1;
    RETURN pgp_sym_encrypt(data, key_bytea, 'compress-algo=1, cipher-algo=aes256');
END;
$function$
;

-- Permissions

ALTER FUNCTION public.encrypt(text) OWNER TO root;
GRANT ALL ON FUNCTION public.encrypt(text) TO root;

-- DROP FUNCTION public.encrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.encrypt(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt$function$
;

-- Permissions

ALTER FUNCTION public.encrypt(bytea, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.encrypt(bytea, bytea, text) TO public;
GRANT ALL ON FUNCTION public.encrypt(bytea, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.encrypt(bytea, bytea, text) TO root;

-- DROP FUNCTION public.encrypt_iv(bytea, bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.encrypt_iv(bytea, bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_encrypt_iv$function$
;

-- Permissions

ALTER FUNCTION public.encrypt_iv(bytea, bytea, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.encrypt_iv(bytea, bytea, bytea, text) TO public;
GRANT ALL ON FUNCTION public.encrypt_iv(bytea, bytea, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.encrypt_iv(bytea, bytea, bytea, text) TO root;

-- DROP FUNCTION public.encrypt_user_password();

CREATE OR REPLACE FUNCTION public.encrypt_user_password()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    encryption_key VARCHAR;
BEGIN
    SELECT key INTO encryption_key 
    FROM key 
    where id=1;

    IF TG_OP = 'INSERT' then
        EXECUTE 'CREATE USER "' || NEW.id_user || '" WITH PASSWORD ' || quote_literal(NEW.password) || ';';
        NEW.password := encryption(NEW.password);
       
        EXECUTE 'GRANT CONNECT ON DATABASE defaultdb TO "' || NEW.id_user || '";';

    ELSIF TG_OP = 'UPDATE' then
    	EXECUTE 'ALTER USER "' || NEW.id_user || '" WITH PASSWORD ' || quote_literal(NEW.password) || ';';
        NEW.password := encryption(NEW.password);

    END IF;

    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.encrypt_user_password() OWNER TO root;
GRANT ALL ON FUNCTION public.encrypt_user_password() TO root;

-- DROP FUNCTION public.encryption(text);

CREATE OR REPLACE FUNCTION public.encryption(data text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    p_key TEXT;
BEGIN
    -- Lấy key từ bảng key với id = 1
    SELECT key INTO p_key FROM "key" WHERE id = 1;
    -- Mã hóa dữ liệu với key đã lấy
    RETURN pgp_sym_encrypt(data, p_key, 'compress-algo=1, cipher-algo=aes256')::TEXT;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.encryption(text) OWNER TO root;
GRANT ALL ON FUNCTION public.encryption(text) TO root;

-- DROP FUNCTION public.f_add_guideline_step(varchar, int4, int4, varchar, varchar, text);

CREATE OR REPLACE FUNCTION public.f_add_guideline_step(p_id_user character varying, p_id_family integer, p_id_guideline integer, p_name character varying, p_description character varying, p_fileurl text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_step JSON;
    current_steps JSON;
    updated_steps JSON;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
    
    new_step := json_build_object(
        'name', p_name,
        'description', p_description,
        'imageUrl', p_fileUrl
    );
    
    SELECT step INTO current_steps FROM guide_items WHERE id_family = p_id_family AND id_item = p_id_guideline;
    
    IF current_steps IS NULL THEN
        updated_steps := json_build_object('steps', json_build_array(new_step));
    ELSE
        updated_steps := json_build_object(
            'steps', (SELECT json_agg(e) FROM (SELECT json_array_elements(current_steps->'steps') UNION ALL SELECT new_step) AS dt(e))
        );
    END IF;
    
    UPDATE guide_items
    SET step = updated_steps
    WHERE id_family = p_id_family AND id_item = p_id_guideline;
    
    RETURN new_step;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_add_guideline_step(varchar, int4, int4, varchar, varchar, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_add_guideline_step(varchar, int4, int4, varchar, varchar, text) TO root;

-- DROP FUNCTION public.f_add_member(uuid, varchar, varchar, int4);

CREATE OR REPLACE FUNCTION public.f_add_member(p_id uuid, p_phone character varying, p_email character varying, p_role integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_family_id INT;
    v_user_id UUID;
    v_name_family varchar;
    result_message varchar;
BEGIN 
    SELECT id_family, "name" INTO v_family_id, v_name_family FROM Users WHERE id_user = p_id;

    SELECT id_user INTO v_user_id FROM Users WHERE phone = p_phone OR email = p_email;

    IF v_family_id IS NOT NULL AND v_user_id IS NOT NULL THEN
        BEGIN
            INSERT INTO member_family (id_user, id_family, created_at, updated_at, role)
            VALUES (v_user_id, v_family_id, NOW(), NOW(), p_role);
        
            UPDATE Users SET id_family = v_family_id WHERE id_user = v_user_id;
            result_message := 'Successfully added a member to the ' || v_name_family || ' family';
        EXCEPTION
            WHEN others THEN
                result_message := 'Failed to add member';
        END;
    ELSE
        result_message :=  'Invalid family ID or user ID provided';
    END IF;

    RETURN result_message;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_add_member(uuid, varchar, varchar, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_add_member(uuid, varchar, varchar, int4) TO root;

-- DROP FUNCTION public.f_add_member(uuid, int4, varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.f_add_member(p_id_user uuid, p_id_family integer, p_phone character varying, p_email character varying, p_role character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_add_member(uuid, int4, varchar, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_add_member(uuid, int4, varchar, varchar, varchar) TO root;

-- DROP FUNCTION public.f_change_firstname(uuid, text);

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

-- DROP FUNCTION public.f_change_firstname_lastname(uuid, text, text);

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

-- DROP FUNCTION public.f_change_lastname(uuid, text);

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

-- DROP FUNCTION public.f_change_password(int4, text);

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

-- DROP FUNCTION public.f_change_password(text, text);

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

-- DROP FUNCTION public.f_change_password(uuid, text);

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

-- DROP FUNCTION public.f_check_order(uuid, int4, int4, varchar, varchar);

CREATE OR REPLACE FUNCTION public.f_check_order(p_id_user uuid, p_id_order integer, p_amount integer, p_responsecode character varying, p_transactionstatus character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
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
        ELSE
            returnData := json_build_object('RspCode', '02', 'Message', 'This order has been updated to the payment status');
        END IF;
    

    RETURN returnData;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_check_order(uuid, int4, int4, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_check_order(uuid, int4, int4, varchar, varchar) TO root;

-- DROP FUNCTION public.f_create_education_progress(text, int4, text, text, text, text);

CREATE OR REPLACE FUNCTION public.f_create_education_progress(p_owner_id_user text, p_id_family integer, p_id_user text, p_title text, p_progress_notes text, p_school_info text)
 RETURNS TABLE(message text, result_id_education_progress integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    l_message TEXT;
    l_id_education_progress INT;
begin
	IF NOT EXISTS (
        SELECT 1 FROM member_family WHERE id_user = p_owner_id_user::uuid AND id_family = p_id_family
    ) THEN
        RETURN QUERY SELECT 'You do not belong to the family', NULL;
    END IF;
	
	IF NOT EXISTS (
        SELECT 1 FROM member_family WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RETURN QUERY SELECT 'User you typed does not belong to the family', NULL;
    END IF;
	
	insert into education_progress(id_family, id_user, title, progress_notes, school_info)
	values (p_id_family, p_id_user::uuid, p_title, p_progress_notes, p_school_info)
	RETURNING 'Success' AS message, id_education_progress INTO l_message, l_id_education_progress;

	RETURN QUERY SELECT l_message AS message, l_id_education_progress AS result_id_education_progress;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_create_education_progress(text, int4, text, text, text, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_education_progress(text, int4, text, text, text, text) TO root;

-- DROP FUNCTION public.f_create_family(uuid, varchar, varchar, int4);

CREATE OR REPLACE FUNCTION public.f_create_family(p_id_user uuid, p_description character varying, p_name character varying, p_id_order integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_create_family(uuid, varchar, varchar, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_family(uuid, varchar, varchar, int4) TO root;

-- DROP FUNCTION public.f_create_guideline(varchar, int4, varchar, varchar);

CREATE OR REPLACE FUNCTION public.f_create_guideline(p_id_user character varying, p_id_family integer, p_name character varying, p_description character varying)
 RETURNS TABLE(id_item integer, name character varying, created_at timestamp without time zone, updated_at timestamp without time zone, id_family integer, step json, is_shared boolean, description character varying)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM member_family
        WHERE id_user = uuid(p_id_user) AND member_family.id_family = p_id_family
    ) INTO v_exists;
    
    IF v_exists THEN
        RETURN QUERY
        INSERT INTO guide_items(name, created_at, updated_at, id_family, step, is_shared, description)
        VALUES (p_name, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, p_id_family, null, false, p_description)
        RETURNING guide_items.id_item, guide_items.name, guide_items.created_at, guide_items.updated_at, guide_items.id_family, guide_items.step, guide_items.is_shared, guide_items.description;
    ELSE
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_create_guideline(varchar, int4, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_guideline(varchar, int4, varchar, varchar) TO root;

-- DROP FUNCTION public.f_create_order(uuid, int4, int4, varchar, int4);

CREATE OR REPLACE FUNCTION public.f_create_order(p_id_user uuid, p_id_package integer, p_amount integer, p_method character varying, p_id_family integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_create_order(uuid, int4, int4, varchar, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_order(uuid, int4, int4, varchar, int4) TO root;

-- DROP FUNCTION public.f_create_subject(text, int4, int4, text, text);

CREATE OR REPLACE FUNCTION public.f_create_subject(p_id_user text, p_id_education_progress integer, p_id_family integer, p_subject_name text, p_description text)
 RETURNS TABLE(id_subject integer, subject_name character varying, description text, component_scores json, midterm_score double precision, final_score double precision, bonus_score double precision, status subject_status)
 LANGUAGE plpgsql
AS $function$
begin
	IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
	
	IF NOT EXISTS (
        SELECT 1 FROM education_progress
        WHERE id_education_progress = p_id_education_progress
    ) THEN
        RAISE EXCEPTION 'Education Progress ID % not found.', p_id_education_progress;
    END IF;
	
	RETURN QUERY
	INSERT INTO subjects (
        id_education_progress,
        subject_name,
        description,
        component_scores,
        midterm_score,
        final_score,
        bonus_score,
        status
    )
    VALUES (p_id_education_progress, p_subject_name, p_description, '{}'::JSON, 0, 0, 0, 'in_progress')
	
	RETURNING subjects.id_subject, subjects.subject_name, subjects.description, 
	subjects.component_scores, subjects.midterm_score, subjects.final_score, subjects.bonus_score, subjects.status;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_create_subject(text, int4, int4, text, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_subject(text, int4, int4, text, text) TO root;

-- DROP FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar);

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

-- DROP FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar, varchar);

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

-- DROP FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.f_create_user(p_gmail character varying, p_phone character varying, p_password character varying, p_firstname character varying, p_lastname character varying, p_language character varying, p_login_type character varying, p_avatar character varying)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_id UUID;
	casted_login_type users_login_type_enum;
BEGIN
    -- Kiểm tra số điện thoại
    IF p_phone IS NOT NULL AND f_validate_user_phone(p_phone) THEN
        RAISE EXCEPTION 'Phone number % already exists', p_phone;
    END IF;

    -- Kiểm tra email
    IF p_gmail IS NOT NULL AND f_validate_user_mail(p_gmail) THEN
        RAISE EXCEPTION 'Email % already exists', p_gmail;
    END IF;

    casted_login_type := p_login_type::users_login_type_enum;

    BEGIN
        INSERT INTO users(
            id_user, email, phone, "password", "language", created_at, 
            login_type, firstname, lastname, avatar
        )
        VALUES (
            f_generate_unique_uuid(), p_gmail, p_phone, p_password, 
            p_language, CURRENT_TIMESTAMP, casted_login_type, p_firstname, p_lastname, p_avatar
        )
        RETURNING id_user INTO new_id;
    EXCEPTION WHEN others THEN
        RAISE EXCEPTION 'Failed to create user: %', SQLERRM;
    END; 

    RETURN new_id;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_create_user(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar) TO root;

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

-- Permissions

ALTER FUNCTION public.f_delete_calendar_event(uuid, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_delete_calendar_event(uuid, int4) TO root;

-- DROP FUNCTION public.f_delete_family(uuid, int4);

CREATE OR REPLACE FUNCTION public.f_delete_family(p_id_user uuid, p_id_family integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_delete_family(uuid, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_delete_family(uuid, int4) TO root;

-- DROP FUNCTION public.f_delete_guideline(varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.f_delete_guideline(p_id_user character varying, p_id_family integer, p_id_guideline integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
    
    DELETE FROM guide_items
    WHERE id_family = p_id_family AND id_item = p_id_guideline;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No guideline found with ID % in family ID %.', p_id_guideline, p_id_family;
    END IF;

    RETURN 'Guideline with ID ' || p_id_guideline || ' has been successfully deleted.';
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_delete_guideline(varchar, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_delete_guideline(varchar, int4, int4) TO root;

-- DROP FUNCTION public.f_delete_guideline_step(varchar, int4, int4, int4);

CREATE OR REPLACE FUNCTION public.f_delete_guideline_step(p_id_user character varying, p_id_family integer, p_id_guideline integer, p_step_index integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_steps JSONB;
    removed_step JSONB;
    updated_steps JSONB;
    image_url TEXT;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
    
    SELECT step INTO current_steps FROM guide_items WHERE id_family = p_id_family AND id_item = p_id_guideline;
    
    current_steps := current_steps::JSONB;
    
    SELECT (current_steps->'steps'->p_step_index) INTO removed_step;
    image_url := removed_step->>'imageUrl';
    
    updated_steps := (
        SELECT jsonb_agg(elem) 
        FROM jsonb_array_elements(current_steps->'steps') WITH ORDINALITY arr(elem, idx)
        WHERE idx - 1 <> p_step_index
    );
    
    UPDATE guide_items
    SET step = jsonb_set(current_steps, '{steps}', updated_steps)
    WHERE id_family = p_id_family AND id_item = p_id_guideline;
    
    RETURN image_url;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_delete_guideline_step(varchar, int4, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_delete_guideline_step(varchar, int4, int4, int4) TO root;

-- DROP FUNCTION public.f_delete_member(uuid, uuid, int4);

CREATE OR REPLACE FUNCTION public.f_delete_member(p_id_current_user uuid, p_id_user uuid, p_id_family integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_delete_member(uuid, uuid, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_delete_member(uuid, uuid, int4) TO root;

-- DROP FUNCTION public.f_delete_refresh_token(varchar);

CREATE OR REPLACE FUNCTION public.f_delete_refresh_token(refresh_token_value character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM refresh_token WHERE refresh_token = refresh_token_value;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_delete_refresh_token(varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_delete_refresh_token(varchar) TO root;

-- DROP FUNCTION public.f_generate_link_invite(int4);

CREATE OR REPLACE FUNCTION public.f_generate_link_invite(p_id_family integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_generate_link_invite(int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_generate_link_invite(int4) TO root;

-- DROP FUNCTION public.f_generate_otp(uuid);

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

-- DROP FUNCTION public.f_generate_otp(varchar, varchar);

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

-- Permissions

ALTER FUNCTION public.f_generate_otp(varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_generate_otp(varchar, varchar) TO root;

-- DROP FUNCTION public.f_generate_otp(uuid, varchar);

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

-- Permissions

ALTER FUNCTION public.f_generate_otp(uuid, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_generate_otp(uuid, varchar) TO root;

-- DROP FUNCTION public.f_generate_refresh_token(uuid);

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

-- DROP FUNCTION public.f_generate_refresh_token(uuid, varchar);

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

-- DROP FUNCTION public.f_generate_unique_uuid();

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

-- DROP FUNCTION public.f_get_all_education_progress(text, int4, int4, int4);

CREATE OR REPLACE FUNCTION public.f_get_all_education_progress(p_id_user text, p_skip_amount integer, p_items_per_page integer, p_id_family integer)
 RETURNS TABLE(id_education_progress integer, id_user uuid, title character varying, progress_notes text, school_info text, created_at timestamp without time zone, updated_at timestamp without time zone, avatar character varying, firstname character varying, lastname character varying)
 LANGUAGE plpgsql
AS $function$
begin
	IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE member_family.id_user = p_id_user::uuid AND member_family.id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
	
	return query
	select ep.id_education_progress, ep.id_user, ep.title, ep.progress_notes, ep.school_info, ep.created_at, ep.updated_at,
	u.avatar, u.firstname, u.lastname
	from education_progress ep
	join users u on ep.id_user = u.id_user
	where ep.id_family = p_id_family
	LIMIT p_items_per_page OFFSET p_skip_amount;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_all_education_progress(text, int4, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_all_education_progress(text, int4, int4, int4) TO root;

-- DROP FUNCTION public.f_get_all_member(uuid, int4);

CREATE OR REPLACE FUNCTION public.f_get_all_member(p_id_user uuid, p_id_family integer)
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
;

-- Permissions

ALTER FUNCTION public.f_get_all_member(uuid, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_all_member(uuid, int4) TO root;

-- DROP FUNCTION public.f_get_calendar_event_by_calendar(uuid, int4);

CREATE OR REPLACE FUNCTION public.f_get_calendar_event_by_calendar(p_id_user uuid, p_id_calendar integer)
 RETURNS TABLE(id_calendar integer, title character varying, description character varying, datetime timestamp without time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY 
    SELECT c.id_calendar, c.title, c.description, c.datetime
    FROM calendar c
    JOIN member_family mf ON c.id_family = mf.id_family
    WHERE mf.id_user = p_id_user AND c.id_calendar = p_id_calendar;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_calendar_event_by_calendar(uuid, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_calendar_event_by_calendar(uuid, int4) TO root;

-- DROP FUNCTION public.f_get_calendar_events(text, int4);

CREATE OR REPLACE FUNCTION public.f_get_calendar_events(p_id_user text, p_id_family integer)
 RETURNS TABLE(id_calendar integer, datetime timestamp without time zone, description character varying, id_family integer, title character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY 
    SELECT c.id_calendar, c.datetime, c.description, c.id_family, c.title
    FROM calendar c
    INNER JOIN member_family mf ON c.id_family = mf.id_family
    WHERE mf.id_family = p_id_family AND mf.id_user = uuid(p_id_user);
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_calendar_events(text, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_calendar_events(text, int4) TO root;

-- DROP FUNCTION public.f_get_detail_education_progress(text, int4, int4);

CREATE OR REPLACE FUNCTION public.f_get_detail_education_progress(p_id_user text, p_id_family integer, p_id_education_progress integer)
 RETURNS TABLE(id_education_progress integer, education_progress_info json, subjects_info json)
 LANGUAGE plpgsql
AS $function$
DECLARE
    subject_record RECORD;
    subjects_array JSON := '[]'::JSON;
begin
	IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
	
	IF NOT EXISTS (
        SELECT 1 FROM education_progress
        WHERE education_progress.id_education_progress = p_id_education_progress AND education_progress.id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'Education Progress ID % not found in family ID %.', p_id_education_progress, p_id_family;
    END IF;
	
	RETURN QUERY
    SELECT ep.id_education_progress, 
           row_to_json(ep.*),
           (SELECT json_agg(row_to_json(sub.*))
            FROM (SELECT id_subject, subject_name, description, status
                  FROM subjects
                  WHERE subjects.id_education_progress = p_id_education_progress) sub)
    FROM education_progress ep
    WHERE ep.id_education_progress = p_id_education_progress AND ep.id_family = p_id_family;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_detail_education_progress(text, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_detail_education_progress(text, int4, int4) TO root;

-- DROP FUNCTION public.f_get_detail_subject(text, int4, int4, int4);

CREATE OR REPLACE FUNCTION public.f_get_detail_subject(p_id_user text, p_id_family integer, p_id_education_progress integer, p_id_subject integer)
 RETURNS TABLE(id_subject integer, subject_name character varying, description text, component_scores json, midterm_score double precision, final_score double precision, bonus_score double precision, status subject_status)
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM education_progress
        WHERE id_education_progress = p_id_education_progress AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'Education Progress ID % not found in family ID %.', p_id_education_progress, p_id_family;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM subjects
        WHERE subjects.id_subject = p_id_subject AND subjects.id_education_progress = p_id_education_progress
    ) THEN
        RAISE EXCEPTION 'Subject ID % not found in education progress ID %.', p_id_subject, p_id_education_progress;
    END IF;
    
    RETURN QUERY
    SELECT subjects.id_subject, subjects.subject_name, 
	subjects.description, subjects.component_scores, 
	subjects.midterm_score, subjects.final_score, subjects.bonus_score, subjects.status
    FROM subjects
    WHERE subjects.id_subject = p_id_subject AND subjects.id_education_progress = p_id_education_progress;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_detail_subject(text, int4, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_detail_subject(text, int4, int4, int4) TO root;

-- DROP FUNCTION public.f_get_events_for_family(uuid, int4, varchar);

CREATE OR REPLACE FUNCTION public.f_get_events_for_family(p_id_user uuid, p_id_family integer, selected_date character varying)
 RETURNS TABLE(id_calendar integer, event_datetime timestamp without time zone, event_description character varying, event_id_family integer, event_title character varying, count_record integer)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_events_for_family(uuid, int4, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_events_for_family(uuid, int4, varchar) TO root;

-- DROP FUNCTION public.f_get_events_for_family(uuid, int4, date);

CREATE OR REPLACE FUNCTION public.f_get_events_for_family(p_id_user uuid, p_id_family integer, selected_date date)
 RETURNS TABLE(id_calendar integer, event_datetime timestamp without time zone, event_description character varying, event_id_family integer, event_title character varying, count_record integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Đếm số lượng thành viên trong gia đình
    PERFORM COUNT(*) FROM member_family WHERE id_family = p_id_family AND id_user = p_id_user;

    -- Nếu tồn tại ít nhất một thành viên trong gia đình
    IF FOUND THEN
        -- Trả về các sự kiện của gia đình trong ngày được chọn
        RETURN QUERY
        SELECT c.id_calendar, c.datetime, c.description, c.id_family, c.title, count_record
        FROM calendar c
        WHERE c.id_family = p_id_family
        AND DATE(c.datetime) = selected_date;
    END IF;
    
    -- Nếu không có thành viên nào trong gia đình, trả về null
    RETURN;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_events_for_family(uuid, int4, date) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_events_for_family(uuid, int4, date) TO root;

-- DROP FUNCTION public.f_get_family(uuid, int4);

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

-- Permissions

ALTER FUNCTION public.f_get_family(uuid, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_family(uuid, int4) TO root;

-- DROP FUNCTION public.f_get_guideline(varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.f_get_guideline(p_id_user character varying, p_id_family integer, p_id_guideline integer)
 RETURNS TABLE(id_item integer, name character varying, description character varying, id_family integer, step json, is_shared boolean, created_at timestamp without time zone, updated_at timestamp without time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if the user is a member of the family
    IF NOT EXISTS(
        SELECT 1 FROM member_family
        WHERE member_family.id_user = p_id_user::uuid AND member_family.id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
    
    -- Return guideline information
    RETURN QUERY
    SELECT 
        guide_items.id_item, 
        guide_items.name, 
        guide_items.description, 
        guide_items.id_family,
        guide_items.step::json, 
        guide_items.is_shared, 
        guide_items.created_at, 
        guide_items.updated_at
    FROM guide_items
    WHERE guide_items.id_family = p_id_family AND guide_items.id_item = p_id_guideline;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_guideline(varchar, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_guideline(varchar, int4, int4) TO root;

-- DROP FUNCTION public.f_get_guideline_step(varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.f_get_guideline_step(p_id_user character varying, p_id_family integer, p_id_guideline integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_step JSON;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
    
    SELECT step INTO v_step
    FROM guide_items
    WHERE id_family = p_id_family AND id_item = p_id_guideline;

    IF v_step IS NULL THEN
        RAISE EXCEPTION 'No step found for Guideline ID % in Family ID %.', p_id_guideline, p_id_family;
    END IF;

    RETURN v_step;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_guideline_step(varchar, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_guideline_step(varchar, int4, int4) TO root;

-- DROP FUNCTION public.f_get_guidelines(varchar, int4, int4, int4);

CREATE OR REPLACE FUNCTION public.f_get_guidelines(p_id_user character varying, p_id_family integer, p_page integer, p_limit integer)
 RETURNS TABLE(name character varying, description character varying, created_at timestamp without time zone, updated_at timestamp without time zone, total_items integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_offset INT := (p_page - 1) * p_limit;
BEGIN
    IF EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = uuid(p_id_user) AND id_family = p_id_family
    ) THEN
        SELECT COUNT(*) INTO total_items
        FROM guide_items
        WHERE id_family = p_id_family;

        RETURN QUERY
        SELECT guide_items.name, guide_items.description, guide_items.created_at, guide_items.updated_at, total_items
        FROM guide_items
        WHERE id_family = p_id_family
        ORDER BY created_at DESC
        LIMIT p_limit OFFSET v_offset;
    ELSE
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_guidelines(varchar, int4, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_guidelines(varchar, int4, int4, int4) TO root;

-- DROP FUNCTION public.f_get_ids_member(text, int4);

CREATE OR REPLACE FUNCTION public.f_get_ids_member(p_id_user text, p_id_family integer)
 RETURNS SETOF uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_exists INT;
BEGIN
    SELECT COUNT(*) INTO user_exists FROM member_family 
    WHERE id_user = p_id_user::uuid AND id_family = p_id_family;

    IF user_exists > 0 THEN
        RETURN QUERY 
        SELECT id_user FROM member_family WHERE id_family = p_id_family;
    END IF;

    RETURN;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_ids_member(text, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_ids_member(text, int4) TO root;

-- DROP FUNCTION public.f_get_member(uuid);

CREATE OR REPLACE FUNCTION public.f_get_member(p_id_user uuid)
 RETURNS SETOF users
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY SELECT id_user, email, phone, language, firstname FROM users WHERE id_user = p_id_user;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_member(uuid) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_member(uuid) TO root;

-- DROP FUNCTION public.f_get_order_info(uuid);

CREATE OR REPLACE FUNCTION public.f_get_order_info(p_id_user uuid)
 RETURNS SETOF order_info_type
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_order_info(uuid) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_order_info(uuid) TO root;

-- DROP FUNCTION public.f_get_role_member(uuid, int4);

CREATE OR REPLACE FUNCTION public.f_get_role_member(p_id_user uuid, p_id_family integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE 	
    v_role varchar;
    v_name varchar;
BEGIN 	
    SELECT "role" INTO v_role FROM member_family WHERE id_user = p_id_user AND id_family = p_id_family;
    
    SELECT "name" INTO v_name FROM "role" WHERE "role" = v_role;
    
    RETURN v_name;
END
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_role_member(uuid, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_role_member(uuid, int4) TO root;

-- DROP FUNCTION public.f_get_step_image_url(int4, int4, int4);

CREATE OR REPLACE FUNCTION public.f_get_step_image_url(p_id_family integer, p_id_guideline integer, p_index integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    image_url TEXT;
BEGIN
    SELECT step->'steps'->p_index->>'imageUrl' INTO image_url
    FROM guide_items
    WHERE id_family = p_id_family AND id_item = p_id_guideline;

    RETURN image_url;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_step_image_url(int4, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_step_image_url(int4, int4, int4) TO root;

-- DROP FUNCTION public.f_get_users_info(_text);

CREATE OR REPLACE FUNCTION public.f_get_users_info(ids text[])
 RETURNS TABLE(id_user uuid, firstname character varying, lastname character varying, avatar character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT u.id_user, u.firstname, u.lastname, u.avatar
    FROM users u
    WHERE u.id_user = ANY(ARRAY(SELECT UUID(unnest(ids))));
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_get_users_info(_text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_get_users_info(_text) TO root;

-- DROP FUNCTION public.f_getfamily(uuid, int4);

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

-- Permissions

ALTER FUNCTION public.f_getfamily(uuid, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_getfamily(uuid, int4) TO root;

-- DROP FUNCTION public.f_insert_calendar_event(text, int4, varchar, varchar, timestamp);

CREATE OR REPLACE FUNCTION public.f_insert_calendar_event(p_id_user text, p_id_family integer, p_title character varying, p_description character varying, p_datetime timestamp without time zone)
 RETURNS TABLE(id_calendar integer, title character varying, description character varying, id_family integer, datetime timestamp without time zone, created_at timestamp without time zone, updated_at timestamp without time zone)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_role VARCHAR;
BEGIN
    SELECT role INTO v_role
    FROM member_family
    WHERE member_family.id_user = uuid(p_id_user) AND member_family.id_family = p_id_family;

    IF v_role IS NULL THEN
        RAISE EXCEPTION 'User is not a member of the specified family.';
    ELSE
        RETURN QUERY INSERT INTO calendar (title, description, id_family, datetime)
        VALUES (p_title, p_description, p_id_family, p_datetime)
        RETURNING calendar.id_calendar, calendar.title, calendar.description, calendar.id_family, calendar.datetime, calendar.created_at, calendar.updated_at;
    END IF;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_insert_calendar_event(text, int4, varchar, varchar, timestamp) OWNER TO root;
GRANT ALL ON FUNCTION public.f_insert_calendar_event(text, int4, varchar, varchar, timestamp) TO root;

-- DROP FUNCTION public.f_is_user_member_of_family(varchar, int4);

CREATE OR REPLACE FUNCTION public.f_is_user_member_of_family(p_id_user character varying, p_id_family integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Kiểm tra xem người dùng có phải là thành viên của gia đình không
    IF EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_is_user_member_of_family(varchar, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_is_user_member_of_family(varchar, int4) TO root;

-- DROP FUNCTION public.f_mark_shared_guideline(varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.f_mark_shared_guideline(p_id_user character varying, p_id_family integer, p_id_guideline integer)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        UPDATE guide_items
        SET is_shared = NOT is_shared
        WHERE id_family = p_id_family AND id_item = p_id_guideline;

        RETURN 'Guideline shared status successfully toggled.';
    ELSE
        RETURN 'User ID does not have access to Family ID or Guideline ID does not exist.';
    END IF;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_mark_shared_guideline(varchar, int4, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.f_mark_shared_guideline(varchar, int4, int4) TO root;

-- DROP FUNCTION public.f_update_calendar_event(uuid, int4, varchar, varchar, timestamp);

CREATE OR REPLACE FUNCTION public.f_update_calendar_event(p_id_user uuid, p_id_calendar integer, p_title character varying, p_description character varying, p_datetime timestamp without time zone)
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
        RAISE EXCEPTION 'User is not associated with the specified event.';
    ELSE
        UPDATE calendar
        SET title = COALESCE(p_title, title),
            description = COALESCE(p_description, description),
            datetime = COALESCE(p_datetime, datetime)
        WHERE id_calendar = p_id_calendar;
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_update_calendar_event(uuid, int4, varchar, varchar, timestamp) OWNER TO root;
GRANT ALL ON FUNCTION public.f_update_calendar_event(uuid, int4, varchar, varchar, timestamp) TO root;

-- DROP FUNCTION public.f_update_family(uuid, int4, varchar, varchar);

CREATE OR REPLACE FUNCTION public.f_update_family(p_id_user uuid, p_id_family integer, p_name character varying, p_description character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.f_update_family(uuid, int4, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_update_family(uuid, int4, varchar, varchar) TO root;

-- DROP FUNCTION public.f_update_guideline(varchar, int4, int4, varchar, varchar);

CREATE OR REPLACE FUNCTION public.f_update_guideline(p_id_user character varying, p_id_family integer, p_id_item integer, p_name character varying, p_description character varying)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
    
    UPDATE guide_items
    SET name = p_name, description = p_description, updated_at = CURRENT_TIMESTAMP
    WHERE id_family = p_id_family AND id_item = p_id_item;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No guideline found with ID % in family ID % to update.', p_id_item, p_id_family;
    END IF;

    RETURN 'Guideline with ID ' || p_id_item || ' has been successfully updated.';
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_update_guideline(varchar, int4, int4, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_update_guideline(varchar, int4, int4, varchar, varchar) TO root;

-- DROP FUNCTION public.f_update_guideline_step(varchar, int4, int4, int4, varchar, varchar, text);

CREATE OR REPLACE FUNCTION public.f_update_guideline_step(p_id_user character varying, p_id_family integer, p_id_guideline integer, p_index integer, p_name character varying, p_description character varying, p_fileurl text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_step JSONB;
    updated_steps JSONB;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM member_family
        WHERE id_user = p_id_user::uuid AND id_family = p_id_family
    ) THEN
        RAISE EXCEPTION 'User ID % or Family ID % not found in member_family.', p_id_user, p_id_family;
    END IF;
    
    SELECT step->'steps'->p_index INTO current_step
    FROM guide_items
    WHERE id_family = p_id_family AND id_item = p_id_guideline;
    
    current_step := jsonb_build_object(
        'name', COALESCE(p_name, current_step->>'name'),
        'description', COALESCE(p_description, current_step->>'description'),
        'fileUrl', COALESCE(p_fileUrl, current_step->>'fileUrl')
    );
    
    UPDATE guide_items
    SET step = jsonb_set(step, ARRAY['steps', p_index::text], current_step, true)
    WHERE id_family = p_id_family AND id_item = p_id_guideline
    RETURNING step->'steps'->p_index INTO updated_steps;
    
    RETURN updated_steps;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.f_update_guideline_step(varchar, int4, int4, int4, varchar, varchar, text) OWNER TO root;
GRANT ALL ON FUNCTION public.f_update_guideline_step(varchar, int4, int4, int4, varchar, varchar, text) TO root;

-- DROP FUNCTION public.f_update_user_avatar(uuid, text);

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

-- DROP FUNCTION public.f_validate_otp(varchar, varchar, varchar);

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

-- Permissions

ALTER FUNCTION public.f_validate_otp(varchar, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_validate_otp(varchar, varchar, varchar) TO root;

-- DROP FUNCTION public.f_validate_otp(uuid, varchar, varchar);

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

-- Permissions

ALTER FUNCTION public.f_validate_otp(uuid, varchar, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.f_validate_otp(uuid, varchar, varchar) TO root;

-- DROP FUNCTION public.f_validate_user_mail(varchar);

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

-- DROP FUNCTION public.f_validate_user_phone(varchar);

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

-- DROP FUNCTION public.gen_random_bytes(int4);

CREATE OR REPLACE FUNCTION public.gen_random_bytes(integer)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_random_bytes$function$
;

-- Permissions

ALTER FUNCTION public.gen_random_bytes(int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.gen_random_bytes(int4) TO public;
GRANT ALL ON FUNCTION public.gen_random_bytes(int4) TO postgres;
GRANT ALL ON FUNCTION public.gen_random_bytes(int4) TO root;

-- DROP FUNCTION public.gen_random_uuid();

CREATE OR REPLACE FUNCTION public.gen_random_uuid()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE
AS '$libdir/pgcrypto', $function$pg_random_uuid$function$
;

-- Permissions

ALTER FUNCTION public.gen_random_uuid() OWNER TO postgres;
GRANT ALL ON FUNCTION public.gen_random_uuid() TO public;
GRANT ALL ON FUNCTION public.gen_random_uuid() TO postgres;
GRANT ALL ON FUNCTION public.gen_random_uuid() TO root;

-- DROP FUNCTION public.gen_salt(text);

CREATE OR REPLACE FUNCTION public.gen_salt(text)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt$function$
;

-- Permissions

ALTER FUNCTION public.gen_salt(text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.gen_salt(text) TO public;
GRANT ALL ON FUNCTION public.gen_salt(text) TO postgres;
GRANT ALL ON FUNCTION public.gen_salt(text) TO root;

-- DROP FUNCTION public.gen_salt(text, int4);

CREATE OR REPLACE FUNCTION public.gen_salt(text, integer)
 RETURNS text
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_gen_salt_rounds$function$
;

-- Permissions

ALTER FUNCTION public.gen_salt(text, int4) OWNER TO postgres;
GRANT ALL ON FUNCTION public.gen_salt(text, int4) TO public;
GRANT ALL ON FUNCTION public.gen_salt(text, int4) TO postgres;
GRANT ALL ON FUNCTION public.gen_salt(text, int4) TO root;

-- DROP FUNCTION public.generate_invite_code();

CREATE OR REPLACE FUNCTION public.generate_invite_code()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    chars VARCHAR := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result VARCHAR := '';
    i INTEGER;
BEGIN
    FOR i IN 1..1 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.generate_invite_code() OWNER TO root;
GRANT ALL ON FUNCTION public.generate_invite_code() TO root;

-- DROP FUNCTION public.generate_key(int4);

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

-- Permissions

ALTER FUNCTION public.generate_key(int4) OWNER TO root;
GRANT ALL ON FUNCTION public.generate_key(int4) TO root;

-- DROP FUNCTION public.generate_unique_invite_code();

CREATE OR REPLACE FUNCTION public.generate_unique_invite_code()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.generate_unique_invite_code() OWNER TO root;
GRANT ALL ON FUNCTION public.generate_unique_invite_code() TO root;

-- DROP FUNCTION public.generate_unique_invite_code(int4);

CREATE OR REPLACE FUNCTION public.generate_unique_invite_code(p_id_family integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    characters VARCHAR := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    invite_code VARCHAR := '';
    i INT := 0;
    result VARCHAR := '';
    
BEGIN
    -- Kiểm tra xem có mã mời tồn tại trong bảng family không
    SELECT code_invite INTO invite_code FROM family WHERE id_family=p_id_family;

    -- Nếu không có mã mời tồn tại, tạo mới một mã mời
    IF invite_code IS NULL THEN
        FOR i IN 1..10 LOOP -- Độ dài mã mời mong muốn (10 ký tự)
            invite_code := invite_code || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
        END LOOP;
        -- Cập nhật mã mời vào bảng family
        UPDATE family SET code_invite=invite_code where id_family=p_id_family;
    END IF;
          
    result:= 'http://localhost:8080/invite/' || invite_code;
    RETURN result;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.generate_unique_invite_code(int4) OWNER TO root;
GRANT ALL ON FUNCTION public.generate_unique_invite_code(int4) TO root;

-- DROP FUNCTION public.get_all_family(uuid);

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

-- Permissions

ALTER FUNCTION public.get_all_family(uuid) OWNER TO root;
GRANT ALL ON FUNCTION public.get_all_family(uuid) TO root;

-- DROP FUNCTION public.get_events_for_family_on_date(date, int4);

CREATE OR REPLACE FUNCTION public.get_events_for_family_on_date(selected_date date, family_id integer)
 RETURNS TABLE(id_calendar integer, datetime timestamp without time zone, description text, id_family integer, title text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT id_calendar, datetime, description, id_family, title
    FROM calendar
    WHERE id_family = family_id
    AND DATE(datetime) = selected_date;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.get_events_for_family_on_date(date, int4) OWNER TO root;
GRANT ALL ON FUNCTION public.get_events_for_family_on_date(date, int4) TO root;

-- DROP FUNCTION public.get_package_info_by_id_user(int4);

CREATE OR REPLACE FUNCTION public.get_package_info_by_id_user(id_user integer)
 RETURNS TABLE(id_package integer, expired_at timestamp without time zone, package_info jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY 
    SELECT o.id_package, p.name, p.price, p.description, o.expired_at
    FROM "order" o
    JOIN package p ON o.id_package = p.id
    WHERE o.status = 'Successed' AND o.id_user = id_user;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.get_package_info_by_id_user(int4) OWNER TO root;
GRANT ALL ON FUNCTION public.get_package_info_by_id_user(int4) TO root;

-- DROP FUNCTION public.hmac(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.hmac(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- Permissions

ALTER FUNCTION public.hmac(bytea, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.hmac(bytea, bytea, text) TO public;
GRANT ALL ON FUNCTION public.hmac(bytea, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.hmac(bytea, bytea, text) TO root;

-- DROP FUNCTION public.hmac(text, text, text);

CREATE OR REPLACE FUNCTION public.hmac(text, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pg_hmac$function$
;

-- Permissions

ALTER FUNCTION public.hmac(text, text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.hmac(text, text, text) TO public;
GRANT ALL ON FUNCTION public.hmac(text, text, text) TO postgres;
GRANT ALL ON FUNCTION public.hmac(text, text, text) TO root;

-- DROP FUNCTION public.p_create_role();

CREATE OR REPLACE FUNCTION public.p_create_role()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN 
    EXECUTE 'CREATE ROLE ' || NEW.role;
    EXECUTE 'GRANT CONNECT ON DATABASE defaultdb TO ' || NEW.role;
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.p_create_role() OWNER TO root;
GRANT ALL ON FUNCTION public.p_create_role() TO root;

-- DROP PROCEDURE public.p_delete_member(uuid, int4);

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

-- Permissions

ALTER PROCEDURE public.p_delete_member(uuid, int4) OWNER TO root;
GRANT ALL ON PROCEDURE public.p_delete_member(uuid, int4) TO root;

-- DROP PROCEDURE public.p_delete_member(uuid, uuid, int4);

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

-- Permissions

ALTER PROCEDURE public.p_delete_member(uuid, uuid, int4) OWNER TO root;
GRANT ALL ON PROCEDURE public.p_delete_member(uuid, uuid, int4) TO root;

-- DROP FUNCTION public.p_delete_role();

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

-- Permissions

ALTER FUNCTION public.p_delete_role() OWNER TO root;
GRANT ALL ON FUNCTION public.p_delete_role() TO root;

-- DROP FUNCTION public.p_update_role(uuid, int4, varchar);

CREATE OR REPLACE FUNCTION public.p_update_role(p_id_user uuid, p_id_family integer, p_role character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- Permissions

ALTER FUNCTION public.p_update_role(uuid, int4, varchar) OWNER TO root;
GRANT ALL ON FUNCTION public.p_update_role(uuid, int4, varchar) TO root;

-- DROP PROCEDURE public.p_validate_otp(varchar, uuid);

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

-- DROP FUNCTION public.pgp_armor_headers(in text, out text, out text);

CREATE OR REPLACE FUNCTION public.pgp_armor_headers(text, OUT key text, OUT value text)
 RETURNS SETOF record
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_armor_headers$function$
;

-- Permissions

ALTER FUNCTION public.pgp_armor_headers(in text, out text, out text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_armor_headers(in text, out text, out text) TO public;
GRANT ALL ON FUNCTION public.pgp_armor_headers(in text, out text, out text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_armor_headers(in text, out text, out text) TO root;

-- DROP FUNCTION public.pgp_key_id(bytea);

CREATE OR REPLACE FUNCTION public.pgp_key_id(bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_key_id_w$function$
;

-- Permissions

ALTER FUNCTION public.pgp_key_id(bytea) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_key_id(bytea) TO public;
GRANT ALL ON FUNCTION public.pgp_key_id(bytea) TO postgres;
GRANT ALL ON FUNCTION public.pgp_key_id(bytea) TO root;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_decrypt(bytea, bytea) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea) TO root;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_decrypt(bytea, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text) TO root;

-- DROP FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt(bytea, bytea, text, text) TO root;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea) TO root;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text) TO root;

-- DROP FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_decrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO root;

-- DROP FUNCTION public.pgp_pub_encrypt(text, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_encrypt(text, bytea) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea) TO root;

-- DROP FUNCTION public.pgp_pub_encrypt(text, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt(text, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_encrypt(text, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea, text) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt(text, bytea, text) TO root;

-- DROP FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea) TO root;

-- DROP FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_pub_encrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text) TO public;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_pub_encrypt_bytea(bytea, bytea, text) TO root;

-- DROP FUNCTION public.pgp_sym_decrypt(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_sym_decrypt(bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text) TO public;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text) TO root;

-- DROP FUNCTION public.pgp_sym_decrypt(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt(bytea, text, text)
 RETURNS text
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_sym_decrypt(bytea, text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text, text) TO public;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt(bytea, text, text) TO root;

-- DROP FUNCTION public.pgp_sym_decrypt_bytea(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_sym_decrypt_bytea(bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text) TO public;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text) TO root;

-- DROP FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_decrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text) TO public;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_decrypt_bytea(bytea, text, text) TO root;

-- DROP FUNCTION public.pgp_sym_encrypt(text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_sym_encrypt(text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text) TO public;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text) TO root;

-- DROP FUNCTION public.pgp_sym_encrypt(text, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt(text, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_text$function$
;

-- Permissions

ALTER FUNCTION public.pgp_sym_encrypt(text, text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text, text) TO public;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt(text, text, text) TO root;

-- DROP FUNCTION public.pgp_sym_encrypt_bytea(bytea, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_sym_encrypt_bytea(bytea, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text) TO public;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text) TO root;

-- DROP FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text);

CREATE OR REPLACE FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text)
 RETURNS bytea
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/pgcrypto', $function$pgp_sym_encrypt_bytea$function$
;

-- Permissions

ALTER FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text) OWNER TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text) TO public;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres;
GRANT ALL ON FUNCTION public.pgp_sym_encrypt_bytea(bytea, text, text) TO root;

-- DROP FUNCTION public.update_family_quantity();

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

-- Permissions

ALTER FUNCTION public.update_family_quantity() OWNER TO root;
GRANT ALL ON FUNCTION public.update_family_quantity() TO root;

-- DROP PROCEDURE public.update_key_value();

CREATE OR REPLACE PROCEDURE public.update_key_value()
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    new_key VARCHAR;
BEGIN
    UPDATE users SET password = decryption(password);

    new_key := generate_key(16);

    UPDATE key SET key = new_key, updated_at = NOW() WHERE id = 1;

    UPDATE users SET password = encryption(password), updated_at = NOW();
END;
$procedure$
;

-- Permissions

ALTER PROCEDURE public.update_key_value() OWNER TO root;
GRANT ALL ON PROCEDURE public.update_key_value() TO root;

-- DROP FUNCTION public.update_modified_column();

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_modified_column() OWNER TO root;
GRANT ALL ON FUNCTION public.update_modified_column() TO root;

-- DROP FUNCTION public.update_role_on_member_family();

CREATE OR REPLACE FUNCTION public.update_role_on_member_family()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare 
	old_role_name varchar;
	new_role_name varchar;
BEGIN
    SELECT OLD.role_name, NEW.role_name INTO old_role_name, new_role_name;

    IF OLD.role <> NEW.role THEN
        EXECUTE 'REVOKE ALL ON DATABASE defaultdb FROM ' || id_user;

        EXECUTE 'GRANT ' || NEW.role || ' TO ' || id_user;

    END IF;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_role_on_member_family() OWNER TO root;
GRANT ALL ON FUNCTION public.update_role_on_member_family() TO root;

-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

-- Permissions

ALTER FUNCTION public.update_updated_at_column() OWNER TO root;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO root;

-- DROP FUNCTION public.uuid_generate_v1();

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

-- DROP FUNCTION public.uuid_generate_v1mc();

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

-- DROP FUNCTION public.uuid_generate_v3(uuid, text);

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

-- DROP FUNCTION public.uuid_generate_v4();

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

-- DROP FUNCTION public.uuid_generate_v5(uuid, text);

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

-- DROP FUNCTION public.uuid_nil();

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

-- DROP FUNCTION public.uuid_ns_dns();

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

-- DROP FUNCTION public.uuid_ns_oid();

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

-- DROP FUNCTION public.uuid_ns_url();

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

-- DROP FUNCTION public.uuid_ns_x500();

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