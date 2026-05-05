create extension if not exists pgcrypto;

create table if not exists movies (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  genre text not null,
  duration_min integer not null check (duration_min > 0),
  status text not null default 'Coming Soon',
  rating text not null default 'PG-13',
  poster_tone text not null default 'void',
  poster_url text not null default '',
  director text not null default '',
  cast_members text not null default '',
  trailer_url text not null default '',
  imdb_rank integer,
  release_date date not null default current_date,
  synopsis text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table movies add column if not exists poster_url text not null default '';
alter table movies add column if not exists director text not null default '';
alter table movies add column if not exists cast_members text not null default '';
alter table movies add column if not exists trailer_url text not null default '';
alter table movies add column if not exists imdb_rank integer;

create table if not exists cinemas (
  id text primary key default gen_random_uuid()::text,
  name text not null unique,
  location text not null,
  address text not null,
  created_at timestamptz not null default now()
);

create table if not exists studios (
  id text primary key default gen_random_uuid()::text,
  name text not null unique,
  cinema_id text references cinemas(id) on delete set null,
  capacity integer not null default 100,
  format text not null default 'Regular 2D',
  created_at timestamptz not null default now()
);

alter table studios add column if not exists cinema_id text references cinemas(id) on delete set null;

create table if not exists schedules (
  id text primary key default gen_random_uuid()::text,
  movie_id text not null references movies(id) on delete cascade,
  studio_id text not null references studios(id) on delete cascade,
  cinema_id text references cinemas(id) on delete set null,
  starts_at time not null,
  ends_at time not null,
  show_date date not null default current_date,
  format text not null default 'Regular 2D',
  occupancy integer not null default 0 check (occupancy >= 0 and occupancy <= 100),
  price numeric(14, 2) not null default 65000,
  created_at timestamptz not null default now()
);

alter table schedules add column if not exists cinema_id text references cinemas(id) on delete set null;
alter table schedules add column if not exists price numeric(14, 2) not null default 65000;

create table if not exists sales (
  id text primary key default gen_random_uuid()::text,
  movie_id text not null references movies(id) on delete cascade,
  schedule_id text references schedules(id) on delete set null,
  sale_date date not null default current_date,
  tickets_sold integer not null default 0,
  revenue numeric(14, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists admin_users (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null unique,
  role text not null,
  status text not null default 'Active',
  system_access boolean not null default true,
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists studio_seats (
  id text primary key default gen_random_uuid()::text,
  studio_name text not null,
  seat_code text not null,
  is_occupied boolean not null default false,
  unique (studio_name, seat_code)
);

create table if not exists bookings (
  id text primary key default gen_random_uuid()::text,
  booking_code text not null default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  schedule_id text not null references schedules(id) on delete cascade,
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null default '',
  payment_method text not null default 'QRIS',
  total_amount numeric(14, 2) not null,
  status text not null default 'CONFIRMED',
  expires_at timestamptz not null default now() + interval '10 minutes',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table bookings add column if not exists booking_code text not null default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
alter table bookings add column if not exists customer_email text not null default '';
alter table bookings add column if not exists customer_phone text not null default '';
alter table bookings add column if not exists payment_method text not null default 'QRIS';
alter table bookings add column if not exists expires_at timestamptz not null default now() + interval '10 minutes';
alter table bookings add column if not exists paid_at timestamptz;
create unique index if not exists bookings_booking_code_key on bookings(booking_code);

create table if not exists booking_seats (
  id text primary key default gen_random_uuid()::text,
  booking_id text not null references bookings(id) on delete cascade,
  seat_code text not null,
  price numeric(14, 2) not null,
  unique (booking_id, seat_code)
);
