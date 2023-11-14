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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-13 22:28:12
