use chat_rp_db;

INSERT INTO players VALUES (NULL, 'player name 1', NOW(), NOW());
INSERT INTO players VALUES (NULL, 'player name 2', NOW(), NOW());

INSERT INTO player_accounts VALUES (NULL, 1, 'user name 1', NOW(), NOW());
INSERT INTO player_accounts VALUES (NULL, 2, 'user name 2', NOW(), NOW());

INSERT INTO player_authorities VALUES (NULL, 1, 'AuthorityPlayer', NOW(), NOW());
INSERT INTO player_authorities VALUES (NULL, 2, 'AuthorityPlayer', NOW(), NOW());

INSERT INTO player_profiles VALUES (1, 'https://placehold.jp/120x120.png', 'introduction', NOW(), NOW());
INSERT INTO player_profiles VALUES (2, 'https://placehold.jp/120x120.png', 'introduction', NOW(), NOW());

INSERT INTO player_sns_accounts VALUES (NULL, 1, 'Twitter', 'accountname', 'https://twitter.com', NOW(), NOW());
INSERT INTO player_sns_accounts VALUES (NULL, 2, 'Twitter', 'accountname', 'https://twitter.com', NOW(), NOW());

INSERT INTO designers VALUES (NULL, 'designer name', NOW(), NOW());

INSERT INTO charachips VALUES (NULL, 'charachip name', 1, NOW(), NOW());

INSERT INTO charas VALUES (NULL, 'chara name 1', 1, NOW(), NOW());

INSERT INTO chara_images VALUES (NULL, 1, '通常', 'https://placehold.jp/120x120.png', 60, 60, NOW(), NOW());

INSERT INTO games VALUES (NULL, 'game name', 'Closed', NOW(), NOW());

INSERT INTO game_master_players VALUES (NULL, 1, 1, false, NOW(), NOW());

INSERT INTO game_participants VALUES (NULL, 1, 1, 'participant name 1', 1, 'memo', NULL, NOW(), false, NOW(), NOW());
INSERT INTO game_participants VALUES (NULL, 1, 2, 'participant name 2', 2, NULL, NULL, NOW(), false, NOW(), NOW());

INSERT INTO game_participant_profiles VALUES (1, 'https://placehold.jp/400x600.png', 'introduction', NOW(), NOW());
INSERT INTO game_participant_profiles VALUES (2, 'https://placehold.jp/400x600.png', 'introduction', NOW(), NOW());

INSERT INTO game_participant_icons VALUES (1, 1, 'https://placehold.jp/120x120.png', 60, 60, 1, false, NOW(), NOW());
UPDATE game_participants SET profile_icon_id = 1 where id = 1;

INSERT INTO game_participant_notifications VALUES (1, 'webhook url', TRUE, TRUE, TRUE, TRUE, 'keyword', NOW(), NOW());
INSERT INTO game_participant_notifications VALUES (2, 'webhook url', TRUE, TRUE, TRUE, TRUE, 'keyword', NOW(), NOW());

INSERT INTO game_participant_follows VALUES (NULL, 1, 2, NOW(), NOW());

INSERT INTO game_periods VALUES (NULL, 1, 0, 'プロローグ', NOW(), NOW(), NOW(), NOW());

INSERT INTO game_participant_diaries VALUES (NULL, 1, 1, 1, 'diary title', 'diary content', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'CanOriginalCharacter', 'true', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'CapacityMin', '2', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'CapacityMax', '10', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'PeriodPrefix', '', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'PeriodSuffix', '日目', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'PeriodIntervalSeconds', '86400', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'OpenAt', '2023-12-31T23:59:59+09:00', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'StartParticipateAt', '2024-01-31T23:59:59+09:00', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'StartGameAt', '2024-02-28T23:59:59+09:00', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'CanShorten', 'true', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'CanSendDirectMessage', 'true', NOW(), NOW());
INSERT INTO game_settings VALUES (NULL, 1, 'Password', 'password', NOW(), NOW());

INSERT INTO game_charachips VALUES (NULL, 1, 1, NOW(), NOW());

INSERT INTO game_participant_groups VALUES (null, 1, 'group name', NOW(), NOW());

INSERT INTO game_participant_group_members VALUES (NULL, 1, 1, NOW(), NOW());

INSERT INTO messages VALUES (NULL, 1, 1, 1, 1, 'chara name', 1, NULL, NULL, 'TalkNormal', 1, 'message content', NOW(), 12345, FALSE, 1, 1, NOW(), NOW());
INSERT INTO messages VALUES (NULL, 1, 1, 1, 1, 'chara name', 1, 1, 1, 'TalkNormal', 2, 'message content', NOW(), 12346, FALSE, 0, 0, NOW(), NOW());

INSERT INTO message_replies VALUES (NULL, 1, 1, 2, NOW(), NOW());

INSERT INTO message_favorites VALUES (null, 1, 1, 1, NOW(), NOW());

INSERT INTO direct_messages VALUES (NULL, 1, 1, 1, 1, 1, 'chara name', 1, 'TalkNormal', 1, 'message content', NOW(), 12345, FALSE, 1, NOW(), NOW());

INSERT INTO direct_message_favorites VALUES (NULL, 1, 1, 1, NOW(), NOW());