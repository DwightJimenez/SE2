<?php
require_once 'db.php';
$pdo = getConnection();

// Get selected time period (default to 12 months)
$period = isset($_GET['period']) ? $_GET['period'] : '12';
$validPeriods = ['3', '6', '12'];
if (!in_array($period, $validPeriods)) {
    $period = '12';
}

try {
    // Query to get customer purchase frequency data with time period filter
    $query = "
        SELECT 
            c.customer_name,
            COUNT(s.sale_id) as purchase_count,
            MIN(s.sale_date) as first_purchase,
            MAX(s.sale_date) as last_purchase,
            SUM(s.revenue) as total_spent
        FROM customers c
        JOIN sales s ON c.customer_id = s.customer_id
        WHERE s.sale_date >= DATE_SUB(NOW(), INTERVAL ? MONTH)
        GROUP BY c.customer_id, c.customer_name
        ORDER BY purchase_count DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$period]);
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Customer Purchase Frequency</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100">
  <div class="flex">
    <!-- Sidebar -->
    <div class="fixed w-64 h-screen bg-gray-800">
      <div class="flex items-center justify-center h-20 border-b border-gray-700">
        <h2 class="text-white text-xl font-semibold">Sales Dashboard</h2>
      </div>
      <nav class="mt-5">
        <a href="dashboard.php" class="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700">
          <i class="fas fa-chart-line w-5 mr-3"></i>
          Dashboard
        </a>
        <a href="#" class="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700">
          <i class="fas fa-shopping-cart w-5 mr-3"></i>
          Products
        </a>
        <a href="customer_frequency.php" class="flex items-center px-6 py-4 text-white bg-blue-600">
          <i class="fas fa-users w-5 mr-3"></i>
          Customers
        </a>
        <a href="salesrepRev.php" class="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700">
          <i class="fas fa-user-tie w-5 mr-3"></i>
          Sales Reps
        </a>
        <a href="regions.php" class="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700">
          <i class="fas fa-map-marker-alt w-5 mr-3"></i>
          Regions
        </a>
        <a href="top_products.php" class="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700">
          <i class="fas fa-trophy w-5 mr-3"></i>
          Top Products
        </a>
        <a href="#" class="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700">
          <i class="fas fa-cog w-5 mr-3"></i>
          Settings
        </a>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64 flex-1 p-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Customer Purchase Frequency Analysis</h1>
          
          <!-- Time Period Filter -->
          <div class="flex space-x-2">
            <a href="?period=3" 
               class="px-4 py-2 rounded <?php echo $period === '3' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'; ?>">
              3 Months
            </a>
            <a href="?period=6" 
               class="px-4 py-2 rounded <?php echo $period === '6' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'; ?>">
              6 Months
            </a>
            <a href="?period=12" 
               class="px-4 py-2 rounded <?php echo $period === '12' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'; ?>">
              12 Months
            </a>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-700 text-lg font-medium mb-2">Average Purchases per Customer</h3>
            <p class="text-3xl text-blue-600 font-bold">
              <?php 
                            $avgPurchases = array_sum(array_column($customers, 'purchase_count')) / count($customers);
                            echo number_format($avgPurchases, 1);
                            ?>
            </p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-700 text-lg font-medium mb-2">Average Spend per Customer</h3>
            <p class="text-3xl text-blue-600 font-bold">
              $<?php 
                            $avgSpend = array_sum(array_column($customers, 'total_spent')) / count($customers);
                            echo number_format($avgSpend, 2);
                            ?>
            </p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-700 text-lg font-medium mb-2">Total Customers</h3>
            <p class="text-3xl text-blue-600 font-bold"><?php echo count($customers); ?></p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-700 text-lg font-medium mb-2">Total Revenue</h3>
            <p class="text-3xl text-blue-600 font-bold">
              $<?php echo number_format(array_sum(array_column($customers, 'total_spent')), 2); ?>
            </p>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Purchase Frequency Distribution Chart -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Purchase Frequency Distribution</h2>
            <div class="relative h-[400px]">
              <canvas id="frequencyChart"></canvas>
            </div>
          </div>

          <!-- Customer Spending Distribution Chart -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Customer Spending Distribution</h2>
            <div class="relative h-[400px]">
              <canvas id="spendingChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Customer Frequency Table -->
        <div class="overflow-x-auto bg-white rounded-lg shadow">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Count</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Purchase</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Purchase</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Purchase Value</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <?php foreach ($customers as $customer): ?>
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap"><?php echo htmlspecialchars($customer['customer_name']); ?></td>
                <td class="px-6 py-4 whitespace-nowrap"><?php echo $customer['purchase_count']; ?></td>
                <td class="px-6 py-4 whitespace-nowrap"><?php echo date('M d, Y', strtotime($customer['first_purchase'])); ?></td>
                <td class="px-6 py-4 whitespace-nowrap"><?php echo date('M d, Y', strtotime($customer['last_purchase'])); ?></td>
                <td class="px-6 py-4 whitespace-nowrap">$<?php echo number_format($customer['total_spent'], 2); ?></td>
                <td class="px-6 py-4 whitespace-nowrap">$<?php echo number_format($customer['total_spent'] / $customer['purchase_count'], 2); ?></td>
              </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Prepare data for the frequency distribution chart
    const frequencyData = <?php 
      $frequencies = array_count_values(array_column($customers, 'purchase_count'));
      ksort($frequencies);
      echo json_encode([
        'labels' => array_keys($frequencies),
        'data' => array_values($frequencies)
      ]);
    ?>;

    // Prepare data for the spending distribution chart
    const spendingData = <?php 
      $spending_ranges = [
        '0-100' => 0, '101-500' => 0, '501-1000' => 0,
        '1001-2000' => 0, '2001-5000' => 0, '5000+' => 0
      ];
      foreach ($customers as $customer) {
        $spent = $customer['total_spent'];
        if ($spent <= 100) $spending_ranges['0-100']++;
        elseif ($spent <= 500) $spending_ranges['101-500']++;
        elseif ($spent <= 1000) $spending_ranges['501-1000']++;
        elseif ($spent <= 2000) $spending_ranges['1001-2000']++;
        elseif ($spent <= 5000) $spending_ranges['2001-5000']++;
        else $spending_ranges['5000+']++;
      }
      echo json_encode([
        'labels' => array_keys($spending_ranges),
        'data' => array_values($spending_ranges)
      ]);
    ?>;

    // Create the frequency distribution chart
    new Chart(document.getElementById('frequencyChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: frequencyData.labels,
        datasets: [{
          label: 'Number of Customers',
          data: frequencyData.data,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Customers'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Number of Purchases'
            }
          }
        }
      }
    });

    // Create the spending distribution chart
    new Chart(document.getElementById('spendingChart').getContext('2d'), {
      type: 'bar',
      data: {
        labels: spendingData.labels,
        datasets: [{
          label: 'Number of Customers',
          data: spendingData.data,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Customers'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Spending Range ($)'
            }
          }
        }
      }
    });
  </script>
</body>

</html>