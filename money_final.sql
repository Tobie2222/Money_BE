-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: money
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account_types`
--

DROP TABLE IF EXISTS `account_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account_types` (
  `account_types_id` int NOT NULL AUTO_INCREMENT,
  `account_types_name` varchar(255) NOT NULL,
  `account_types_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`account_types_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account_types`
--

LOCK TABLES `account_types` WRITE;
/*!40000 ALTER TABLE `account_types` DISABLE KEYS */;
INSERT INTO `account_types` VALUES (2,'Savings','https://example.com/savings_image.png'),(3,'Checking','https://example.com/checking_image.png'),(4,'Investment','https://example.com/investment_image.png');
/*!40000 ALTER TABLE `account_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `account_name` varchar(255) NOT NULL,
  `desc_account` varchar(255) DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `account_types_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,1,'Main Account','Primary savings account',5049.98,1,'2024-09-28 07:53:46','2024-09-28 03:56:37'),(2,2,'Investment Account','Investment for stocks',9970.01,3,'2024-09-28 07:53:46','2024-09-28 03:49:44'),(3,3,'Checking Account','Everyday expenses',2000,2,'2024-09-28 07:53:46','2024-09-28 07:53:46');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `category_name` varchar(255) NOT NULL,
  `is_global` tinyint(1) DEFAULT '0',
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,1,'Groceries',0,'https://example.com/groceries.png','2024-09-28 07:53:49','2024-09-28 07:53:49'),(2,2,'Utilities',0,'https://example.com/utilities.png','2024-09-28 07:53:49','2024-09-28 07:53:49'),(3,3,'Entertainment',0,'https://example.com/entertainment.png','2024-09-28 07:53:49','2024-09-28 07:53:49'),(4,NULL,'Fuel',1,'https://example.com/test.png','2024-09-28 02:10:28','2024-09-28 02:10:28');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `income_type`
--

DROP TABLE IF EXISTS `income_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `income_type` (
  `income_type_id` int NOT NULL AUTO_INCREMENT,
  `income_type_name` varchar(255) NOT NULL,
  `income_type_image` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `is_global` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`income_type_id`),
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income_type`
--

LOCK TABLES `income_type` WRITE;
/*!40000 ALTER TABLE `income_type` DISABLE KEYS */;
INSERT INTO `income_type` VALUES (1,'Salary','https://example.com/salary.png',1,0),(2,'Business','https://example.com/business.png',2,0),(3,'Freelance','https://example.com/freelance.png',3,0),(4,'Salary2','https://example.com/test.png',NULL,1);
/*!40000 ALTER TABLE `income_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `notification_name` varchar(255) DEFAULT NULL,
  `desc_notification` varchar(255) DEFAULT NULL,
  `priority` varchar(50) DEFAULT 'low',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,1,'Low Balance','Your balance is below the threshold','high','2024-09-28 07:53:55','2024-09-28 07:53:55'),(2,2,'Payment Reminder','Upcoming payment is due','medium','2024-09-28 07:53:55','2024-09-28 07:53:55'),(3,3,'Investment Update','New stock market update','low','2024-09-28 07:53:55','2024-09-28 07:53:55');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_name` varchar(255) NOT NULL,
  `desc_notification` varchar(255) NOT NULL,
  `priority` varchar(255) NOT NULL DEFAULT 'low',
  `type` varchar(255) NOT NULL DEFAULT 'admin',
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'Security Alert','New login from unknown device','high','admin'),(2,'System Update','System maintenance scheduled','low','admin'),(3,'Test','Test','high','admin'),(4,'Test','Test','high','admin'),(5,'Test','Test','high','admin'),(6,'Test','Test','high','admin'),(7,'Test','Test','high','admin'),(8,'Test','Test','high','admin'),(9,'Test','Test','high','admin'),(10,'Test','Test','high','admin'),(11,'Test','Test','high','admin'),(12,'Test','Test','high','admin'),(13,'Test','Test','high','admin'),(14,'Test','Test','high','admin'),(15,'Test','Test','high','admin'),(16,'Test','Test','high','admin'),(17,'Test','Test','high','admin'),(18,'Test','Test','high','admin'),(19,'Test','Test','high','admin'),(20,'Test','Test','high','admin'),(21,'Test','Test','high','admin'),(22,'Test','Test','high','admin'),(23,'Test','Test','high','admin'),(24,'Test','Test','high','admin'),(25,'Test','Test','high','admin'),(26,'Test','Test','high','admin'),(27,'Test','Test','high','admin'),(28,'Test','Test','high','admin'),(29,'Test','Test','high','admin'),(30,'Test','Test','high','admin'),(31,'Test','Test','high','admin'),(32,'Test','Test','high','admin'),(33,'Test','Test','high','admin');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings`
--

DROP TABLE IF EXISTS `savings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings` (
  `saving_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `saving_name` varchar(255) NOT NULL,
  `desc_saving` varchar(255) DEFAULT NULL,
  `saving_image` varchar(255) DEFAULT NULL,
  `saving_date` datetime DEFAULT NULL,
  `goal_amount` double DEFAULT NULL,
  `current_amount` double DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`saving_id`),
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings`
--

LOCK TABLES `savings` WRITE;
/*!40000 ALTER TABLE `savings` DISABLE KEYS */;
INSERT INTO `savings` VALUES (1,1,'2024-12-31 00:00:00','Car Fund','Saving for a new car','https://example.com/car_fund.png','2024-01-01 00:00:00',20000,500010,'2024-09-28 07:54:02','2024-09-28 03:30:16'),(2,2,'2024-10-01 00:00:00','Vacation','Saving for a vacation trip','https://example.com/vacation.png','2023-11-01 00:00:00',3000,1000,'2024-09-28 07:54:02','2024-09-28 07:54:02'),(3,1,'2024-12-31 00:00:00','Emergency Fund','Save for unexpected expenses.','https://example.com/test.png','2024-01-01 00:00:00',5000,0,'2024-09-28 03:23:33','2024-09-28 03:23:33');
/*!40000 ALTER TABLE `savings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `savings_transactions`
--

DROP TABLE IF EXISTS `savings_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  `saving_id` int DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `name_tran` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `savings_transactions`
--

LOCK TABLES `savings_transactions` WRITE;
/*!40000 ALTER TABLE `savings_transactions` DISABLE KEYS */;
INSERT INTO `savings_transactions` VALUES (1,1,1,1,500,'2024-09-01 00:00:00','Car Saving','2024-09-28 07:54:05','2024-09-28 07:54:05'),(2,2,2,2,200,'2024-09-05 00:00:00','Vacation Saving','2024-09-28 07:54:05','2024-09-28 07:54:05');
/*!40000 ALTER TABLE `savings_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `income_type_id` int DEFAULT NULL,
  `transaction_name` varchar(255) DEFAULT NULL,
  `desc_transaction` varchar(255) DEFAULT NULL,
  `is_fixed` tinyint(1) DEFAULT '0',
  `amount` double DEFAULT NULL,
  `transactions_type` enum('income','expense') DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,1,1,1,'Grocery Shopping','Bought groceries for the week',0,100,'expense','2024-09-01 00:00:00','2024-09-28 07:54:08','2024-09-28 07:54:08'),(2,2,2,2,2,'Monthly Bill','Paid electricity bill',1,150,'expense','2024-09-02 00:00:00','2024-09-28 07:54:08','2024-09-28 07:54:08'),(3,3,3,3,3,'Freelance Payment','Received payment for project',0,500,'income','2024-09-03 00:00:00','2024-09-28 07:54:08','2024-09-28 07:54:08'),(4,1,2,NULL,NULL,'Monthly Subscription','Payment for the monthly subscription service.',0,29.99,'expense','2024-09-28 00:00:00','2024-09-28 03:49:44','2024-09-28 03:49:44'),(5,1,1,NULL,NULL,'Monthly Subscription','Payment for the monthly subscription service.',0,29.99,'income','2024-09-28 00:00:00','2024-09-28 03:52:32','2024-09-28 03:52:32'),(6,1,1,NULL,NULL,'Monthly Subscription','Payment for the monthly subscription service.',0,29.99,'income','2024-09-28 00:00:00','2024-09-28 03:56:37','2024-09-28 03:56:37');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usernotifications`
--

DROP TABLE IF EXISTS `usernotifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usernotifications` (
  `user_id` int NOT NULL,
  `notification_id` int NOT NULL,
  `status` varchar(50) DEFAULT 'low',
  PRIMARY KEY (`user_id`,`notification_id`),
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usernotifications`
--

LOCK TABLES `usernotifications` WRITE;
/*!40000 ALTER TABLE `usernotifications` DISABLE KEYS */;
INSERT INTO `usernotifications` VALUES (1,1,'unread'),(2,2,'read'),(3,3,'unread');
/*!40000 ALTER TABLE `usernotifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `gender` varchar(10) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expiration` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `slug_user` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'kien','$2b$10$EiUhCUMDCWnhzk4WtjMwEePkC4RmeYWwd/RduoLmcFi85AjVP/sH6','kienvanvo7777@gmail.com','https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg',1,'male',NULL,NULL,'2024-09-28 00:31:18','2024-09-28 07:39:28','kien'),(2,'Thai','$2b$10$RhbS/.mlqXsXU6IvjQjpGuEIha6QcZPUmCdqtcykSZaELOsSBSQxy','doanhthai604204@gmail.com',NULL,0,'male',NULL,NULL,'2024-09-28 07:22:55','2024-09-28 07:39:13','thai'),(3,'Khanh','$2b$10$RhbS/.mlqXsXU6IvjQjpGuEIha6QcZPUmCdqtcykSZaELOsSBSQxy','khanh9102004@gmail.com',NULL,1,'male',NULL,NULL,'2024-09-28 07:22:55','2024-09-28 07:39:13','khanh');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'money'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-28 11:47:28
