<?php
// Enable error reporting during development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Database configuration
$host     = 'localhost';
$dbname   = 'community_volunteer_system';
$username = 'root'; // Adjust to your MySQL user
$password = '';     // Adjust to your MySQL password

// 1. Establish Database Connection using PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    die("Database Connection Failed: " . htmlspecialchars($e->getMessage()));
}

// 2. Map form HTML option values to Database area_id Primary Keys
$areaMap = [
    'environment'     => 1,
    'education'       => 2,
    'health'          => 3,
    'elderly-support' => 4,
    'event-support'   => 5
];

// 3. Map raw skill check values to clean DB display labels
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
    $full_name             = trim($_POST['full_name'] ?? '');
    $email                 = trim($_POST['email'] ?? '');
    $phone                 = trim($_POST['phone'] ?? '');
    $date_of_birth         = $_POST['date_of_birth'] ?? '';
    $raw_area              = $_POST['volunteer_area'] ?? '';
    $raw_time              = $_POST['preferred_time'] ?? '';
    $certification_details = trim($_POST['certification_details'] ?? '');
    $hours_per_week        = (int)($_POST['hours_per_week'] ?? 0);
    $raw_volunteered       = $_POST['volunteered_before'] ?? 'no';
    $previous_organization = trim($_POST['previous_organization'] ?? '');
    $user_message          = trim($_POST['message'] ?? '');
    $agree_terms           = isset($_POST['agree_terms']) ? 1 : 0;
    $raw_skills            = $_POST['skills'] ?? []; // Array from HTML checkboxes

    // Transform HTML values to match database schema constraints
    $area_id = $areaMap[$raw_area] ?? null;
    $preferred_time = ucfirst(strtolower($raw_time)); // e.g., 'morning' -> 'Morning'
    $volunteered_before = ucfirst(strtolower($raw_volunteered)); // e.g., 'yes' -> 'Yes'

    // Server-side validation check
    if (empty($full_name) || empty($email) || empty($phone) || empty($date_of_birth) || !$area_id || !$agree_terms) {
        die("<p style='color: red;'>Error: Please fill out all required fields.</p><a href='javascript:history.back()'>Go back</a>");
    }

    try {
        // Begin Transaction for relational insertions
        $pdo->beginTransaction();

        // Query 1: Insert Main Volunteer Record
        $sqlVolunteer = "
            INSERT INTO volunteers (
                full_name, email, phone, date_of_birth, area_id, 
                preferred_time, certification_details, hours_per_week, 
                volunteered_before, previous_organization, message, agree_terms
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";

        $stmt = $pdo->prepare($sqlVolunteer);
        $stmt->execute([
            $full_name,
            $email,
            $phone,
            $date_of_birth,
            $area_id,
            $preferred_time,
            !empty($certification_details) ? $certification_details : null,
            $hours_per_week,
            $volunteered_before,
            !empty($previous_organization) ? $previous_organization : null,
            !empty($user_message) ? $user_message : null,
            $agree_terms
        ]);

        // Get AUTO_INCREMENT primary key generated for this user
        $volunteer_id = $pdo->lastInsertId();

        // Query 2: Insert Selected Skills into `volunteer_skills` table
        if (!empty($raw_skills) && is_array($raw_skills)) {
            $skillStmt = $pdo->prepare("INSERT INTO volunteer_skills (volunteer_id, skill_name) VALUES (?, ?)");
            
            foreach ($raw_skills as $skillKey) {
                if (array_key_exists($skillKey, $skillLabels)) {
                    $skillStmt->execute([$volunteer_id, $skillLabels[$skillKey]]);
                }
            }
        }

        // Commit execution if all statements succeeded
        $pdo->commit();

    } catch (PDOException $e) {
        // Rollback transaction if any error occurred
        $pdo->rollBack();

        if ($e->getCode() == 23000) { // Unique key constraint violation (Duplicate Email)
            die("<p style='color: red;'>Error: The email address '{$email}' is already registered.</p><a href='javascript:history.back()'>Go back</a>");
        } else {
            die("<p style='color: red;'>Database error: " . htmlspecialchars($e->getMessage()) . "</p>");
        }
    }
} else {
    // Redirect if user attempts to access process.php directly via URL
    header('Location: index.html');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful</title>
    <link rel="stylesheet" href="style_Migi.css">
    <style>
        .success-card {
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            background: #f4fbf7;
            border: 1px solid #28a745;
            border-radius: 8px;
            text-align: center;
        }
        .btn-home {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #28a745;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
</head>
<body>

<main>
    <div class="success-card">
        <h2>Thank You, <?= htmlspecialchars($full_name) ?>!</h2>
        <p>Your volunteer application has been submitted successfully.</p>
        <p>We will review your details and reach out via email (<strong><?= htmlspecialchars($email) ?></strong>) shorty.</p>
        <a href="index.html" class="btn-home">Return to Home Page</a>
    </div>
</main>

</body>
</html>
