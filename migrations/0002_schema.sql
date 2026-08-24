-- LS GRID — public unowned board (auth off)
create table if not exists gangs (
  id           text primary key,
  name         text not null,
  tag          text not null default '',
  color        text not null,
  status       text not null default 'active',
  leader       text not null default '',
  description  text not null default '',
  members      text not null default '',
  notes        text not null default '',
  logo         text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists territories (
  id           text primary key,
  gang_id      text,
  name         text not null,
  kind         text not null default 'turf',
  color        text,
  polygon      text not null,
  notes        text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists pins (
  id           text primary key,
  gang_id      text,
  name         text not null,
  kind         text not null default 'graffiti',
  color        text,
  lat          double precision not null,
  lng          double precision not null,
  notes        text not null default '',
  date_found   text not null default '',
  image        text not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists territories_gang_id_idx on territories (gang_id);
create index if not exists pins_gang_id_idx on pins (gang_id);
