INSERT OR IGNORE INTO statuses (id, name) VALUES (1, 'Pending'), (2, 'Approved'), (3, 'Rejected');
INSERT OR IGNORE INTO access_types (id, name) VALUES (1, 'Temporary'), (2, 'Full Access'), (3, 'Admin'), (4, 'Read Only');

INSERT OR IGNORE INTO users (id, name) VALUES 
(1, 'Олександр Коваленко'),
(2, 'Марія Петренко'),
(3, 'Дмитро Шевченко'),
(4, 'Артем Мазепа'),
(5, 'Олена Ячнік');

--Наповнення заявками
INSERT OR IGNORE INTO requests (id, userId, statusId, accessTypeId, details, createdAt) VALUES 
(1, 1, 2, 2, 'Запит на доступ до серверної для технічних робіт.', '2026-04-01 10:00:00'),
(2, 2, 1, 1, 'Тимчасовий доступ до лабораторії на час іспитів.', '2026-04-02 12:30:00'),
(3, 3, 2, 3, 'Надання адмін-прав для розробки Manager of Access Requests.', '2026-04-03 09:15:00'),
(4, 4, 3, 2, 'Запит на повний доступ (відхилено службою безпеки).', '2026-04-03 11:00:00'),
(5, 5, 1, 4, 'Запит на читання логів системи захисту.', '2026-04-03 15:45:00');