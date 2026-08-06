<?php
// Enable error reporting during development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set header so browser expects plain text responses
header('Content-Type: text/plain; charset=utf-8');

// 1. Database Configuration
$host     = 'localhost';
$dbname   = 'community_volunteer_system';
$username = 'root'; // Adjust to your MySQL user
$password = '';     // Adjust to your MySQL password

// 2. Establish Database Connection using PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo "Database Connection Failed: " . $e->getMessage();
    exit;
}

// 3. Mapping tables
$areaMap = [
    'environment'     => 1,
    'education'       => 2,
    'health'          => 3,
    'elderly-support' => 4,
    'event-support'   => 5
];

$skillLabels = [
    'teaching'       => 'Teaching / Mentoring',
    'first-aid'      => 'First Aid / Medical',
    'driving'        => 'Driving',
    'event-planning' => 'Event Planning',
    'it-support'     => 'IT Support'
];

// 4. Handle POST Request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Extract & sanitize core text inputs
    $full_name          = trim($_POST['full_name'] ?? '');
    $email              = trim($_POST['email'] ?? '');
    $phone              = trim($_POST['phone'] ?? '');
    $date_of_birth      = trim($_POST['date_of_birth'] ?? '');
    $volunteer_area     = trim($_POST['volunteer_area'] ?? '');
    $preferred_time     = trim($_POST['preferred_time'] ?? '');
    $hours_per_week     = trim($_POST['hours_per_week'] ?? '');
    $volunteered_before = trim($_POST['volunteered_before'] ?? '');
    $certification      = trim($_POST['certification_details'] ?? '');
    $previous_org       = trim($_POST['previous_organization'] ?? '');
    $message            = trim($_POST['message'] ?? '');
    $agree_terms        = isset($_POST['agree_terms']) ? 1 : 0;

    // Process skills array
    $raw_skills = $_POST['skills'] ?? [];
    $mapped_skills = [];
    if (is_array($raw_skills)) {
        foreach ($raw_skills as $skill) {
            if (isset($skillLabels[$skill])) {
                $mapped_skills[] = $skillLabels[$skill];
            }
        }
    }
    $skills_string = !empty($mapped_skills) ? implode(', ', $mapped_skills) : null;

    // Backend Validation Checks
    if (empty($full_name) || empty($email) || empty($phone) || empty($date_of_birth) || empty($volunteer_area) || empty($preferred_time) || empty($hours_per_week) || empty($volunteered_before)) {
        http_response_code(400);
        echo "Error: Please fill in all required fields marked with an asterisk (*).";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Error: Please enter a valid email address.";
        exit;
    }

    if (!$agree_terms) {
        http_response_code(400);
        echo "Error: You must agree to be contacted to continue.";
        exit;
    }

    // Map volunteer_area slug (e.g., 'environment') to numerical area_id
    $area_id = $areaMap[$volunteer_area] ?? null;

    // Set empty optional fields to null for database Insertion
    $certification = !empty($certification) ? $certification : null;
    $previous_org  = !empty($previous_org) ? $previous_org : null;
    $message       = !empty($message) ? $message : null;

    // 5. Insert Record into Database
    try {
        $sql = "INSERT INTO volunteers (
                    full_name, 
                    email, 
                    phone, 
                    date_of_birth, 
                    volunteer_area,
                    area_id, 
                    preferred_time, 
                    skills, 
                    certification_details, 
                    hours_per_week, 
                    volunteered_before, 
                    previous_organization, 
                    message,
                    agree_terms
                ) VALUES (
                    :full_name, 
                    :email, 
                    :phone, 
                    :date_of_birth, 
                    :volunteer_area,
                    :area_id, 
                    :preferred_time, 
                    :skills, 
                    :certification_details, 
                    :hours_per_week, 
                    :volunteered_before, 
                    :previous_organization, 
                    :message,
                    :agree_terms
                )";

        $stmt = $pdo->prepare($sql);
        $executed = $stmt->execute([
            ':full_name'             => $full_name,
            ':email'                 => $email,
            ':phone'                 => $phone,
            ':date_of_birth'         => $date_of_birth,
            ':volunteer_area'        => $volunteer_area,
            ':area_id'               => $area_id,
            ':preferred_time'        => $preferred_time,
            ':skills'                => $skills_string,
            ':certification_details' => $certification,
            ':hours_per_week'        => $hours_per_week,
            ':volunteered_before'    => $volunteered_before,
            ':previous_organization' => $previous_org,
            ':message'               => $message,
            ':agree_terms'           => $agree_terms
        ]);

        if ($executed) {
            http_response_code(200);
            echo "Success: Thank you! Your registration has been received.";
        } else {
            http_response_code(500);
            echo "Error: Unable to save registration. Please try again.";
        }

    } catch (PDOException $e) {
        http_response_code(500);
        if ($e->getCode() == 23000) {
            echo "Error: A registration with this email already exists.";
        } else {
            echo "Database Error: " . $e->getMessage();
        }
        exit;
    }
} else {
    http_response_code(405);
    echo "Error: Invalid request method.";
}