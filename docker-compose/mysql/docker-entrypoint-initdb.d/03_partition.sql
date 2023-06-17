use chat_rp_db;

alter table messages partition by hash (game_id) partitions 100;
alter table direct_messages partition by hash (game_id) partitions 100;