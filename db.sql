
CREATE DATABASE IF NOT EXISTS community_volunteer_system;

USE community_volunteer_system;


CREATE TABLE volunteer_areas (
    area_id INT AUTO_INCREMENT PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL
);

INSERT INTO volunteer_areas (area_name)
VALUES
('Environment'),
('Education'),
('Health & Wellness'),
('Elderly Support'),
('Event Support');


CREATE TABLE volunteers (
    volunteer_id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL UNIQUE,

    phone VARCHAR(20) NOT NULL,

    date_of_birth DATE NOT NULL,

    area_id INT NOT NULL,

    preferred_time ENUM('Morning','Afternoon','Evening') NOT NULL,

    certification_details VARCHAR(255),

    hours_per_week INT NOT NULL,

    volunteered_before ENUM('Yes','No') NOT NULL,

    previous_organization VARCHAR(150),

    message TEXT,

    agree_terms BOOLEAN NOT NULL,

    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (area_id)
    REFERENCES volunteer_areas(area_id)
);


CREATE TABLE volunteer_skills (

    skill_id INT AUTO_INCREMENT PRIMARY KEY,

    volunteer_id INT NOT NULL,

    skill_name VARCHAR(100) NOT NULL,

    FOREIGN KEY (volunteer_id)
    REFERENCES volunteers(volunteer_id)
    ON DELETE CASCADE

);


INSERT INTO volunteers
(
full_name,
email,
phone,
date_of_birth,
area_id,
preferred_time,
certification_details,
hours_per_week,
volunteered_before,
previous_organization,
message,
agree_terms
)

VALUES

(
'John Kamau',
'john@gmail.com',
'0712345678',
'2003-04-18',
1,
'Morning',
NULL,
8,
'No',
NULL,
'I enjoy helping my community.',
1
),

(
'Mary Achieng',
'mary@gmail.com',
'0723456789',
'2002-11-25',
2,
'Afternoon',
NULL,
10,
'Yes',
'Red Cross',
'I love teaching children.',
1
);

INSERT INTO volunteer_skills
(volunteer_id, skill_name)

VALUES
(1,'Driving'),
(1,'IT Support'),
(2,'Teaching / Mentoring'),
(2,'Event Planning');


SELECT
v.volunteer_id,
v.full_name,
v.email,
v.phone,
a.area_name,
v.preferred_time,
v.hours_per_week
FROM volunteers v
JOIN volunteer_areas a
ON v.area_id = a.area_id;
