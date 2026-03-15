# Hostinger hPanel Deployment Guide - Farvez Fashion Store

This guide explains how to set up your MySQL database and PHP backend on Hostinger to handle orders from your website.

## 1. Database Setup (MySQL)

1. Log in to your **Hostinger hPanel**.
2. Go to **Databases** -> **MySQL Databases**.
3. Create a new database (e.g., `u123456789_farvez_store`).
4. Create a new user and password for this database.
5. Open **phpMyAdmin** for your new database.
6. Click the **SQL** tab and run the following query to create the `orders` table:

```sql
CREATE TABLE `orders` (
  `order_id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_id` INT(11) DEFAULT NULL,
  `customer_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT NOT NULL,
  `product_name` VARCHAR(100) NOT NULL,
  `size` VARCHAR(10) DEFAULT NULL,
  `color` VARCHAR(20) DEFAULT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Pending', 'Delivered') DEFAULT 'Pending',
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 2. Backend Files (PHP)

Upload these files to your `public_html` folder using the **File Manager**.

### `db_config.php`
Create this file to store your database credentials.

```php
<?php
$host = "localhost";
$db_name = "YOUR_DATABASE_NAME";
$username = "YOUR_USERNAME";
$password = "YOUR_PASSWORD";

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
```

### `submit_order.php`
This endpoint saves orders from your website into the database.

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'db_config.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->customer_name) && !empty($data->phone)) {
    $query = "INSERT INTO orders (customer_id, customer_name, phone, address, product_name, size, color, total_amount) 
              VALUES (:customer_id, :customer_name, :phone, :address, :product_name, :size, :color, :total_amount)";
    
    $stmt = $conn->prepare($query);

    $stmt->bindParam(":customer_id", $data->customer_id);
    $stmt->bindParam(":customer_name", $data->customer_name);
    $stmt->bindParam(":phone", $data->phone);
    $stmt->bindParam(":address", $data->address);
    $stmt->bindParam(":product_name", $data->product_name);
    $stmt->bindParam(":size", $data->size);
    $stmt->bindParam(":color", $data->color);
    $stmt->bindParam(":total_amount", $data->total_amount);

    if($stmt->execute()) {
        echo json_encode(array("message" => "Order placed successfully.", "order_id" => $conn->lastInsertId()));
    } else {
        echo json_encode(array("message" => "Unable to place order."));
    }
} else {
    echo json_encode(array("message" => "Incomplete data."));
}
?>
```

### `get_orders.php`
This endpoint allows the Admin Panel to fetch all orders.

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once 'db_config.php';

$query = "SELECT * FROM orders ORDER BY order_date DESC";
$stmt = $conn->prepare($query);
$stmt->execute();

$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($orders);
?>
```

### `update_status.php`
This endpoint allows the Admin to update order status.

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once 'db_config.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->order_id) && !empty($data->status)) {
    $query = "UPDATE orders SET status = :status WHERE order_id = :order_id";
    $stmt = $conn->prepare($query);

    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":order_id", $data->order_id);

    if($stmt->execute()) {
        echo json_encode(array("message" => "Status updated."));
    } else {
        echo json_encode(array("message" => "Update failed."));
    }
}
?>
```

---

## 3. Integration with Frontend

To submit an order from your website to this PHP backend, use the following JavaScript:

```javascript
const placeOrder = async (orderData) => {
    const response = await fetch('https://yourdomain.com/submit_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    const result = await response.json();
    console.log(result.message);
};
```

---

## 4. Security Notes
- Ensure your PHP files are in a secure directory.
- Use HTTPS for all requests.
- Add authentication checks to `get_orders.php` and `update_status.php` to prevent unauthorized access.
