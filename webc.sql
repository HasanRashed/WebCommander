CREATE TABLE `users` (
  `user_id` int(11) NOT NULL COMMENT 'auto incrementing user_id of each user, unique index',
  `user_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s name, unique',
  `user_password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s password in salted and hashed format',
  `user_access` varchar(128) COLLATE utf8_unicode_ci NOT NULL COMMENT 'user''s access folder'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user data';

INSERT INTO `users` (`user_id`, `user_name`, `user_password_hash`, `user_access`) VALUES
(1, 'admin', '$2y$10$pDRJEot8pYzxYYkZ5XKDTeIsMAr33fPa3/W8nNQlo.0FNEckeYQQe', 'localhost');

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'auto incrementing user_id of each user, unique index', AUTO_INCREMENT=2;
COMMIT;
