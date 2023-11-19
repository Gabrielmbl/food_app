CREATE DATABASE  IF NOT EXISTS `food` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `food`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: food
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `meal_plans`
--

DROP TABLE IF EXISTS `meal_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal_plans` (
  `mealid` int NOT NULL AUTO_INCREMENT,
  `pname` varchar(45) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `num_meals_day` varchar(10) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`mealid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_plans`
--

LOCK TABLES `meal_plans` WRITE;
/*!40000 ALTER TABLE `meal_plans` DISABLE KEYS */;
INSERT INTO `meal_plans` VALUES (2,'exampleplan2',NULL,'5',558,'description2'),(3,'exampleplan3',NULL,'5',552,'description3'),(4,'Basic Plan',1,'3',1200,'A simple meal plan with 3 meals a day.'),(5,'Standard Plan',1,'4',1500,'A balanced meal plan with 4 meals a day.'),(6,'Premium Plan',1,'7',1700,'Our top-tier plan with 7 meals a day for the ultimate dining experience.');
/*!40000 ALTER TABLE `meal_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `menuid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `meal` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`menuid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,'Spaghetti Carbonara','Creamy pasta with bacon',12.99,'lunch'),(2,'Grilled Chicken Salad','Fresh greens with grilled chicken',8.49,'lunch'),(3,'Margarita Pizza','Classic tomato and mozzarella',10.99,'dinner'),(4,'Cheeseburger','Juicy beef patty with cheese',7.99,'dinner'),(5,'Vegetable Stir-Fry','Mixed vegetables with tofu',9.49,'dinner');
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus_orders`
--

DROP TABLE IF EXISTS `menus_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus_orders` (
  `moid` int NOT NULL AUTO_INCREMENT,
  `orderid` int DEFAULT NULL,
  `menuid` int DEFAULT NULL,
  `userid` int DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`moid`),
  KEY `orderid` (`orderid`),
  KEY `menuid` (`menuid`),
  KEY `userid` (`userid`),
  CONSTRAINT `menus_orders_ibfk_1` FOREIGN KEY (`orderid`) REFERENCES `orders` (`orderid`),
  CONSTRAINT `menus_orders_ibfk_2` FOREIGN KEY (`menuid`) REFERENCES `menus` (`menuid`),
  CONSTRAINT `menus_orders_ibfk_3` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus_orders`
--

LOCK TABLES `menus_orders` WRITE;
/*!40000 ALTER TABLE `menus_orders` DISABLE KEYS */;
INSERT INTO `menus_orders` VALUES (12,11,5,6,'2023-11-12 21:34:10'),(13,11,4,6,'2023-11-12 21:34:26'),(14,11,4,6,'2023-11-12 22:25:22'),(15,11,5,6,'2023-11-12 22:26:15'),(16,11,1,6,'2023-11-12 22:27:00'),(17,11,5,6,'2023-11-12 22:27:29'),(18,11,4,6,'2023-11-12 22:28:21'),(19,11,1,6,'2023-11-12 22:29:14'),(20,11,4,6,'2023-11-12 22:29:43'),(21,12,4,11,'2023-11-12 22:41:44'),(22,12,1,11,'2023-11-12 22:42:36'),(23,12,5,11,'2023-11-12 22:43:02'),(24,12,4,11,'2023-11-12 22:43:18');
/*!40000 ALTER TABLE `menus_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `orderid` int NOT NULL AUTO_INCREMENT,
  `userid` int DEFAULT NULL,
  `price` double DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`orderid`),
  KEY `userid` (`userid`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (11,6,20.98,'2023-11-12 21:34:10'),(12,11,7.99,'2023-11-12 22:41:44');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_histories`
--

DROP TABLE IF EXISTS `plan_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_histories` (
  `phid` int NOT NULL AUTO_INCREMENT,
  `mealid` int DEFAULT NULL,
  `userid` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  PRIMARY KEY (`phid`),
  KEY `mealid` (`mealid`),
  KEY `fk_user` (`userid`),
  CONSTRAINT `fk_user` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`),
  CONSTRAINT `plan_histories_ibfk_1` FOREIGN KEY (`mealid`) REFERENCES `meal_plans` (`mealid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_histories`
--

LOCK TABLES `plan_histories` WRITE;
/*!40000 ALTER TABLE `plan_histories` DISABLE KEYS */;
INSERT INTO `plan_histories` VALUES (4,6,6,'2023-01-01','2024-05-31',1700,'2023-01-01'),(5,4,1,'2023-02-01','2023-02-28',1200,'2023-02-01'),(6,5,5,'2023-03-01','2023-03-31',99.99,'2023-03-01'),(7,4,11,'2023-11-12','2024-07-31',1200,'2023-11-12');
/*!40000 ALTER TABLE `plan_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `fname` varchar(45) DEFAULT NULL,
  `lname` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'lucas','lucena','1234567'),(4,'someone','lstname','4321'),(5,'Michael','Jordan','pwd2'),(6,'Gabriel','Lucena','ps2dw'),(7,'someone','someonelast','$2b$10$wtoCt2Y.ICXPUWxzu0Bd0u1BflJmpCuSKUzx7ICuIhnEt1Hme9Epa'),(8,'someone','someonelast','$2b$10$dlB2OkYhBZvRJRm5XVkNJ.FAVAUUOmT3N.uF27srd7tL3vAWkqxhW'),(9,'someone','someonelast','$2b$10$nFO1HXBYv5NZBvGN7O5hnurIQzUn9H9AU11dh5K22/35.IBIQfuA2'),(10,'someone','someonelast','$2b$10$W56mI4lgdwYArmG8w9iff.PjvQAp5Q2FE6/HQ4FMy1IAR0/zSmxwW'),(11,'Mauricio','Neto','12345'),(12,'Riley','Van Heukelum','password');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-19  1:03:58
