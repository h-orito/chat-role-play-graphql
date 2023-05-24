create database if not exists chat_rp_db;
create user chatrp@'%' identified by 'password';
grant all on chat_rp_db.* to chatrp@'%';
