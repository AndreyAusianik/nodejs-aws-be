
create extension if not exists "uuid-ossp";

CREATE TABLE products (
	product_id uuid primary key default uuid_generate_v4(),
	product_title text NOT NULL,
	product_description text,
	product_price INTEGER
);

--drop table products

insert into products (product_title, product_description, product_price) values
('Happy', 'smile that shows happiness', 100),
('Sad', 'smile that shows sadness', 80),
('Angry', 'smile that shows angryness', 90),
('Shy', 'smile that shows shyness', 380);

create table stocks (
	stock_id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	stock_count INTEGER,
	foreign key ("product_id") references "products" ("product_id")
);

insert into stocks (product_id, stock_count) values
('cdd530ce-c1a6-436e-8e28-6790241c8230', 29),
('00c16980-d5ff-438f-9fe7-006c31092371', 48),
('2c3b4c28-b896-44e5-8728-99cee5bc3aa6', 22),
('ccbaf75e-3809-4cdf-bdf9-56644eaea366', 6);

--drop table stocks;

select 
    products.product_id as product_id,
    products.product_title as title,
    products.product_description as description,
    products.product_price as price,
	stocks.stock_count as count from products inner join stocks on (products.product_id=stocks.product_id)

