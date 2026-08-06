-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2026 at 02:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `community_volunteer_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `volunteers`
--

CREATE TABLE `volunteers` (
  `volunteer_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `date_of_birth` date NOT NULL,
  `volunteer_area` varchar(50) DEFAULT NULL,
  `area_id` int(11) NOT NULL,
  `preferred_time` enum('Morning','Afternoon','Evening') NOT NULL,
  `skills` text DEFAULT NULL,
  `certification_details` varchar(255) DEFAULT NULL,
  `hours_per_week` int(11) NOT NULL,
  `volunteered_before` enum('Yes','No') NOT NULL,
  `previous_organization` varchar(150) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `agree_terms` tinyint(1) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `volunteers`
--

INSERT INTO `volunteers` (`volunteer_id`, `full_name`, `email`, `phone`, `date_of_birth`, `volunteer_area`, `area_id`, `preferred_time`, `skills`, `certification_details`, `hours_per_week`, `volunteered_before`, `previous_organization`, `message`, `agree_terms`, `registration_date`) VALUES
(1, 'John Kamau', 'john@gmail.com', '0712345678', '2003-04-18', NULL, 1, 'Morning', NULL, NULL, 8, 'No', NULL, 'I enjoy helping my community.', 1, '2026-08-06 09:07:08'),
(2, 'Mary Achieng', 'mary@gmail.com', '0723456789', '2002-11-25', NULL, 2, 'Afternoon', NULL, NULL, 10, 'Yes', 'Red Cross', 'I love teaching children.', 1, '2026-08-06 09:07:08'),
(3, 'Jesse p', 'admin@strathmore.edu', '0791774884', '2003-08-12', NULL, 1, 'Morning', NULL, NULL, 4, 'Yes', NULL, 'idk', 1, '2026-08-06 09:19:34'),
(6, 'Migi Atinga', 'migiatinga@gmail.com', '0712345678', '2007-08-08', 'health', 3, 'Afternoon', 'Teaching / Mentoring', NULL, 6, 'No', NULL, 'i am pregnant', 1, '2026-08-06 12:23:08');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer_areas`
--

CREATE TABLE `volunteer_areas` (
  `area_id` int(11) NOT NULL,
  `area_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `volunteer_areas`
--

INSERT INTO `volunteer_areas` (`area_id`, `area_name`) VALUES
(1, 'Environment'),
(2, 'Education'),
(3, 'Health & Wellness'),
(4, 'Elderly Support'),
(5, 'Event Support');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer_skills`
--

CREATE TABLE `volunteer_skills` (
  `skill_id` int(11) NOT NULL,
  `volunteer_id` int(11) NOT NULL,
  `skill_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `volunteer_skills`
--

INSERT INTO `volunteer_skills` (`skill_id`, `volunteer_id`, `skill_name`) VALUES
(1, 1, 'Driving'),
(2, 1, 'IT Support'),
(3, 2, 'Teaching / Mentoring'),
(4, 2, 'Event Planning'),
(5, 3, 'Teaching / Mentoring');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `volunteers`
--
ALTER TABLE `volunteers`
  ADD PRIMARY KEY (`volunteer_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `area_id` (`area_id`);

--
-- Indexes for table `volunteer_areas`
--
ALTER TABLE `volunteer_areas`
  ADD PRIMARY KEY (`area_id`);

--
-- Indexes for table `volunteer_skills`
--
ALTER TABLE `volunteer_skills`
  ADD PRIMARY KEY (`skill_id`),
  ADD KEY `volunteer_id` (`volunteer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `volunteers`
--
ALTER TABLE `volunteers`
  MODIFY `volunteer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `volunteer_areas`
--
ALTER TABLE `volunteer_areas`
  MODIFY `area_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `volunteer_skills`
--
ALTER TABLE `volunteer_skills`
  MODIFY `skill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `volunteers`
--
ALTER TABLE `volunteers`
  ADD CONSTRAINT `volunteers_ibfk_1` FOREIGN KEY (`area_id`) REFERENCES `volunteer_areas` (`area_id`);

--
-- Constraints for table `volunteer_skills`
--
ALTER TABLE `volunteer_skills`
  ADD CONSTRAINT `volunteer_skills_ibfk_1` FOREIGN KEY (`volunteer_id`) REFERENCES `volunteers` (`volunteer_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
