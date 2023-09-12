use chat_rp_db;


create table players (
    id   int unsigned not null auto_increment comment 'ID',
    player_name varchar(255) not null comment 'プレイヤー名',
    created_at  datetime     not null comment '作成日時',
    updated_at  datetime     not null comment '更新日時',
    primary key (id)
);

create table player_accounts (
    id         int unsigned not null auto_increment comment 'ID',
    player_id  int unsigned not null,
    user_name  varchar(255) not null unique comment 'ユーザー名',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

alter table player_accounts
    add constraint fk_player_accounts_players foreign key (player_id)
    references players (id)
    on update restrict
    on delete restrict
;

create table player_authorities (
    id                  int unsigned not null auto_increment comment 'ID',
    player_id           int unsigned not null,
    authority_code      varchar(255) not null comment '権限コード',
    created_at datetime not null comment '作成日時',
    updated_at datetime not null comment '更新日時',
    primary key (id),
    constraint uq_player_authority unique (player_id, authority_code)
);

alter table player_authorities
    add constraint fk_player_authorities_players foreign key (player_id)
    references players (id)
    on update restrict
    on delete restrict
;

create table player_profiles (
    player_id         int unsigned not null auto_increment comment 'プレイヤーID',
    profile_image_url varchar(1000) comment 'アイコンURL',
    introduction      text comment '自己紹介',
    created_at datetime not null comment '作成日時',
    updated_at datetime not null comment '更新日時',
    primary key (player_id)
);

alter table player_profiles
    add constraint fk_player_profiles_players foreign key (player_id)
    references players (id)
    on update restrict
    on delete restrict
;

create table player_sns_accounts (
    id            int unsigned not null auto_increment comment 'ID',
    player_id     int unsigned not null comment 'プレイヤーID',
    sns_type_code varchar(255) not null comment 'SNS種別',
    account_name  varchar(255) not null comment 'アカウント名',
    account_url   varchar(1000) not null comment 'SNS URL',   
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

alter table player_sns_accounts
    add constraint fk_player_sns_accounts_players foreign key (player_id)
    references players (id)
    on update restrict
    on delete restrict
;

create table designers (
    id            int unsigned not null auto_increment comment 'ID',
    designer_name varchar(255) not null comment 'デザイナー名',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

create table charachips (
    id              int unsigned not null auto_increment comment 'ID',
    charachip_name  varchar(255) not null comment 'キャラチップ名',
    designer_id     int unsigned not null comment 'デザイナーID',
    description_url text         not null comment 'url',
    can_change_name boolean      not null comment '名前変更可能か',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

alter table charachips
    add constraint fk_charachips_designers foreign key (designer_id)
    references designers (id)
    on update restrict
    on delete restrict
;

create table charas (
    id            int unsigned not null auto_increment comment 'ID',
    chara_name    varchar(255) not null comment 'キャラクター名',
    charachip_id  int unsigned          comment 'キャラチップID',
    width         int unsigned not null comment '幅',
    height        int unsigned not null comment '高さ',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

alter table charas
    add constraint fk_charas_charachips foreign key (charachip_id)
    references charachips (id)
    on update restrict
    on delete restrict
;

create table chara_images (
    id               int unsigned not null auto_increment comment 'ID',
    chara_id         int unsigned not null comment 'キャラクターID',
    chara_image_type varchar(255) not null comment 'キャラクター画像種別',
    chara_image_url  varchar(1000) not null comment '画像url',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

alter table chara_images
    add constraint fk_chara_images_charas foreign key (chara_id)
    references charas (id)
    on update restrict
    on delete restrict
;

create table games (
    id               int unsigned not null auto_increment comment 'ID',
    game_name        varchar(255) not null comment 'ゲーム名',
    game_status_code varchar(255) not null comment 'ゲームステータスコード',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

create table game_labels (
    id          int unsigned not null auto_increment comment 'ID',
    game_id     int unsigned not null comment 'ゲームID',
    label_name  varchar(255) not null comment 'ラベル名',
    label_type  varchar(255) not null comment 'ラベル色',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)    
);

alter table game_labels
    add constraint fk_game_labels_games foreign key (game_id)
    references games (id)
    on update restrict
    on delete restrict
;

create table game_master_players (
    id          int unsigned not null auto_increment comment 'ID',
    game_id     int unsigned not null comment 'ゲームID',
    player_id   int unsigned not null comment 'プレイヤーID',
    is_producer boolean      not null comment 'プロデューサーか',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id),
    unique (game_id, player_id)
);

alter table game_master_players
    add constraint fk_game_master_players_games foreign key (game_id)
    references games (id)
    on update restrict
    on delete restrict
;

alter table game_master_players
    add constraint fk_game_master_players_players foreign key (player_id)
    references players (id)
    on update restrict
    on delete restrict
;

create table game_participants (
    id                    int unsigned not null auto_increment comment 'ID',
    game_id               int unsigned not null comment 'ゲームID',
    player_id             int unsigned not null comment 'プレイヤーID',
    chara_id              int unsigned          comment 'キャラクターID',
    game_participant_name varchar(255) not null comment 'ゲーム参加者名',
    entry_number          int unsigned not null comment '参加番号',
    memo                  varchar(1000)         comment 'メモ',
    profile_icon_id       int unsigned          comment 'プロフィールアイコンID',
    last_accessed_at      datetime     not null comment '最終アクセス日時',
    is_gone               boolean      not null comment 'ゲームから退出したか',
    can_change_name       boolean      not null comment '名前変更可能か',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id),
    unique (game_id, entry_number)
);

alter table game_participants
    add constraint fk_game_participants_games foreign key (game_id)
    references games (id)
    on update restrict
    on delete restrict
;

alter table game_participants
    add constraint fk_game_participants_players foreign key (player_id)
    references players (id)
    on update restrict
    on delete restrict
;

alter table game_participants
    add constraint fk_game_participants_charas foreign key (chara_id)
    references charas (id)
    on update restrict
    on delete restrict
;

create table game_participant_profiles (
    game_participant_id   int unsigned not null auto_increment comment 'ゲーム参加者ID',
    profile_image_url     varchar(1000) comment 'プロフィール画像URL',
    introduction          text comment '自己紹介',
    created_at datetime not null comment '作成日時',
    updated_at datetime not null comment '更新日時',
    primary key (game_participant_id)
);

alter table game_participant_profiles
    add constraint fk_game_participant_profiles_game_participants foreign key (game_participant_id)
    references game_participants (id)
    on update restrict
    on delete restrict
;

create table game_participant_icons (
    id                  int unsigned not null auto_increment comment 'ID',
    game_participant_id int unsigned not null comment 'ゲーム参加者ID',
    icon_image_url      varchar(1000) not null comment '画像url',
    width               int unsigned not null comment '幅',
    height              int unsigned not null comment '高さ',
    display_order       int unsigned not null comment '表示順',
    is_deleted          boolean      not null comment '削除済みか',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

alter table game_participants
    add constraint fk_game_participants_icons foreign key (profile_icon_id)
    references game_participant_icons (id)
    on update restrict
    on delete restrict
;

alter table game_participant_icons
    add constraint fk_game_participant_icons_game_participants foreign key (game_participant_id)
    references game_participants (id)
    on update restrict
    on delete restrict
;

create table game_participant_notifications (
    game_participant_id  int unsigned not null auto_increment comment 'ゲーム参加者ID',
    discord_webhook_url  varchar(1000)    comment 'Discord Webhook URL',
    game_participate     boolean not null comment '参加を通知するか',
    game_start           boolean not null comment '開始を通知するか',
    message_reply        boolean not null comment 'リプライを通知するか',
    direct_message       boolean not null comment 'ダイレクトメッセージを通知するか',
    keywords             varchar(1000)    comment '通知キーワード（カンマ区切り）',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (game_participant_id)
);

alter table game_participant_notifications
    add constraint fk_game_participant_notifications_game_participants foreign key (game_participant_id)
    references game_participants (id)
    on update restrict
    on delete restrict
;

create table game_participant_follows (
    id                    int unsigned not null auto_increment comment 'ID',
    game_participant_id   int unsigned not null comment 'ゲーム参加者ID',
    follow_game_participant_id int unsigned not null comment 'フォローするゲーム参加者ID',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id),
    unique (game_participant_id, follow_game_participant_id)
);

alter table game_participant_follows
    add constraint fk_game_participant_follows_game_participants foreign key (game_participant_id)
    references game_participants (id)
    on update restrict
    on delete restrict
;

alter table game_participant_follows
    add constraint fk_game_participant_follows_follow_game_participants foreign key (follow_game_participant_id)
    references game_participants (id)
    on update restrict
    on delete restrict
;

create table game_periods (
    id               int unsigned not null auto_increment comment 'ID',
    game_id          int unsigned not null comment 'ゲームID',
    count            int unsigned not null comment 'ピリオド数',
    game_period_name varchar(255) not null comment 'ピリオド名',
    start_at         datetime     not null comment '開始日時',
    end_at           datetime     not null comment '終了日時',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id),
    unique (game_id, count)
);

alter table game_periods
    add constraint fk_game_periods_games foreign key (game_id)
    references games (id)
    on update restrict
    on delete restrict
;

create table game_participant_diaries (
    id                   int unsigned not null auto_increment comment 'ID',
    game_id              int unsigned not null comment 'ゲームID',
    game_participant_id  int unsigned not null comment 'ゲーム参加者ID',
    game_period_id       int unsigned not null comment 'ゲームピリオドID',
    diary_title          varchar(255) not null comment '日記タイトル',
    diary_body           text         not null comment '日記本文',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id),
    unique (game_id, game_participant_id, game_period_id)
);

alter table game_participant_diaries
    add constraint fk_game_participant_diaries_games foreign key (game_id)
    references games (id)
    on update restrict
    on delete restrict
;

alter table game_participant_diaries
    add constraint fk_game_participant_diaries_game_participants foreign key (game_participant_id)
    references game_participants (id)
    on update restrict
    on delete restrict
;

alter table game_participant_diaries
    add constraint fk_game_participant_diaries_game_periods foreign key (game_period_id)
    references game_periods (id)
    on update restrict
    on delete restrict
;

create table game_settings (
    id                 int unsigned not null auto_increment comment 'ID',
    game_id            int unsigned not null comment 'ゲームID',
    game_setting_key   varchar(255) not null comment '設定キー',
    game_setting_value text         not null comment '設定値',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id),
    unique (game_id, game_setting_key)
);

alter table game_settings
    add constraint fk_game_settings_games foreign key (game_id)
    references games (id)
    on update restrict
    on delete restrict
;

create table game_charachips (
    id               int unsigned not null auto_increment comment 'ID',
    game_id          int unsigned not null comment 'ゲームID',
    charachip_id     int unsigned not null comment 'キャラチップID',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id),
    unique (game_id, charachip_id)
);

alter table game_charachips
    add constraint fk_game_charachips_games foreign key (game_id)
    references games (id)
    on update restrict
    on delete restrict
;

alter table game_charachips
    add constraint fk_game_charachips_charachips foreign key (charachip_id)
    references charachips (id)
    on update restrict
    on delete restrict
;

create table game_participant_groups (
    id                          int unsigned not null auto_increment comment 'ID',
    game_id                     int unsigned not null comment 'ゲームID',
    game_participant_group_name varchar(255) not null comment 'ゲーム参加者グループ名',
    created_at datetime     not null comment '作成日時',
    updated_at datetime     not null comment '更新日時',
    primary key (id)
);

alter table game_participant_groups
    add constraint fk_game_participant_groups_games foreign key (game_id)
    references games (id)
    on update restrict
    on delete restrict
;

create table game_participant_group_members (
    id                        int unsigned not null auto_increment comment 'ID',
    game_participant_group_id int unsigned not null comment 'ゲーム参加者グループID',
    game_participant_id       int unsigned not null comment 'ゲーム参加者ID',
    created_at datetime           not null comment '作成日時',
    updated_at datetime           not null comment '更新日時',
    primary key (id),
    unique (game_participant_group_id, game_participant_id)
);

alter table game_participant_group_members
    add constraint fk_game_participant_group_members_game_participants foreign key (game_participant_id)
    references game_participants (id)
    on update restrict
    on delete restrict
;

create table messages (
    id                           bigint unsigned not null auto_increment comment 'ID',
    game_id                      int unsigned not null comment 'ゲームID',
    game_period_id               int unsigned not null comment 'ゲームピリオドID',
    sender_game_participant_id   int unsigned          comment '送信者ゲーム参加者ID',
    sender_icon_id               int unsigned          comment '送信者アイコンID',
    sender_name                  varchar(255)          comment '送信者キャラクター名',
    sender_entry_number          int unsigned          comment '送信者参加番号',
    reply_to_message_id          bigint unsigned       comment '返信先メッセージID',
    reply_to_game_participant_id int unsigned          comment '返信先ゲーム参加者ID',
    message_type_code            varchar(255) not null comment 'メッセージ種別コード',
    message_number               int unsigned not null comment 'メッセージ番号',
    message_content              text         not null comment 'メッセージ内容',
    send_at                      datetime     not null comment 'メッセージ日時',
    send_unixtime_milli          bigint unsigned not null comment 'メッセージunixtime（ミリ秒）',
    is_convert_disabled          boolean      not null comment '変換無効か',
    reply_count                  int unsigned not null comment '返信数',
    favorite_count               int unsigned not null comment 'ふぁぼ数',
    created_at datetime          not null comment '作成日時',
    updated_at datetime          not null comment '更新日時',
    primary key (id, game_id),
    unique (game_id, message_type_code, message_number)
);

create table message_replies (
    id                bigint unsigned not null auto_increment comment 'ID',
    game_id           int unsigned not null comment 'ゲームID',
    message_id        bigint unsigned not null comment 'メッセージID',
    reply_message_id  bigint unsigned not null comment '返信メッセージID',
    created_at datetime          not null comment '作成日時',
    updated_at datetime          not null comment '更新日時',
    primary key (id),
    unique (message_id, reply_message_id)
);

create table message_favorites (
    id                bigint unsigned not null auto_increment comment 'ID',
    game_id           int unsigned not null comment 'ゲームID',
    message_id        bigint unsigned not null comment 'メッセージID',
    game_participant_id int unsigned not null comment 'ゲーム参加者ID',
    created_at datetime          not null comment '作成日時',
    updated_at datetime          not null comment '更新日時',
    primary key (id),
    unique (message_id, game_participant_id)
);

create table direct_messages (
    id                           bigint unsigned not null auto_increment comment 'ID',
    game_id                      int unsigned not null comment 'ゲームID',
    game_participant_group_id    int unsigned not null comment 'ゲーム参加者グループID',
    game_period_id               int unsigned not null comment 'ゲームピリオドID',
    sender_game_participant_id   int unsigned          comment '送信者ゲーム参加者ID',
    sender_icon_id               int unsigned          comment '送信者アイコンID',
    sender_name                  varchar(255)          comment '送信者キャラクター名',
    sender_entry_number          int unsigned          comment '送信者参加番号',
    message_type_code            varchar(255) not null comment 'メッセージ種別コード',
    message_number               int unsigned not null comment 'メッセージ番号',
    message_content              text         not null comment 'メッセージ内容',
    send_at                      datetime     not null comment 'メッセージ日時',
    send_unixtime_milli          bigint unsigned not null comment 'メッセージunixtime（ミリ秒）',
    is_convert_disabled          boolean      not null comment '変換無効か',
    favorite_count               int unsigned not null comment 'ふぁぼ数',
    created_at datetime          not null comment '作成日時',
    updated_at datetime          not null comment '更新日時',
    primary key (id, game_id),
    unique (game_id, game_participant_group_id, message_type_code, message_number)
);

create table direct_message_favorites (
    id                  bigint unsigned not null auto_increment comment 'ID',
    game_id             int unsigned not null comment 'ゲームID',
    direct_message_id   bigint unsigned not null comment 'ダイレクトメッセージID',
    game_participant_id int unsigned not null comment 'ゲーム参加者ID',
    created_at datetime          not null comment '作成日時',
    updated_at datetime          not null comment '更新日時',
    primary key (id),
    unique (direct_message_id, game_participant_id)
);

