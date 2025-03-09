<?php
require_once 'db.php';

try {
    $query = "SELECT 1";
    $stmt = $pdo->query($query);
    echo "Database connection successful!";
} catch(PDOException $e) {
    echo "Connection test failed: " . $e->getMessage();
}
?>