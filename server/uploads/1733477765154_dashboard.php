<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Dashboard</title>
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
                <a href="#" class="flex items-center px-6 py-4 text-white bg-blue-600">
                    <i class="fas fa-chart-line w-5 mr-3"></i>
                    Dashboard
                </a>
                <a href="#" class="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700">
                    <i class="fas fa-shopping-cart w-5 mr-3"></i>
                    Products
                </a>
                <a href="customer_frequency.php" class="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700">
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
                <!-- Dashboard Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-gray-700 text-lg font-medium mb-2">Total Revenue</h3>
                        <p id="totalRevenue" class="text-3xl text-blue-600 font-bold">$0</p>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-gray-700 text-lg font-medium mb-2">Total Products</h3>
                        <p id="totalProducts" class="text-3xl text-blue-600 font-bold">0</p>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-gray-700 text-lg font-medium mb-2">Total Sales</h3>
                        <p id="totalSales" class="text-3xl text-blue-600 font-bold">0</p>
                    </div>
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-gray-700 text-lg font-medium mb-2">Average Sale</h3>
                        <p id="avgSale" class="text-3xl text-blue-600 font-bold">$0</p>
                    </div>
                </div>

                <!-- Chart -->
                <h1 class="text-2xl font-bold text-gray-800 mb-6">Monthly Sales Revenue by Product</h1>
                <div class="relative h-[600px] w-full">
                    <canvas id="salesChart"></canvas>
                </div>

                
            </div>
        </div>
    </div>

    <script>
        async function fetchChartData() {
            try {
                const response = await fetch('get_chart_data.php');
                const data = await response.json();
                
                // Update dashboard cards
                updateDashboardCards(data);
                
                const ctx = document.getElementById('salesChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Monthly Sales Revenue by Product'
                            },
                            legend: {
                                position: 'right',
                                labels: {
                                    boxWidth: 12
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Revenue ($)'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Month'
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        }

        function updateDashboardCards(data) {
            const totalRevenue = data.datasets.reduce((sum, dataset) => {
                return sum + dataset.data.reduce((a, b) => a + b, 0);
            }, 0);

            document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
            document.getElementById('totalProducts').textContent = data.datasets.length;
            document.getElementById('totalSales').textContent = data.labels.length * data.datasets.length;
            document.getElementById('avgSale').textContent = `$${(totalRevenue / (data.labels.length * data.datasets.length)).toFixed(2)}`;
        }

        fetchChartData();
    </script>
</body>
</html> 