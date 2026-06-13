-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: rotary_club_db
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` int DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club_newsletters`
--

DROP TABLE IF EXISTS `club_newsletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club_newsletters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` int NOT NULL,
  `published_date` date NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `uploaded_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `newsletter_type` enum('club','governor') DEFAULT 'club',
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  KEY `idx_newsletters_published_date` (`published_date`),
  CONSTRAINT `club_newsletters_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club_newsletters`
--

LOCK TABLES `club_newsletters` WRITE;
/*!40000 ALTER TABLE `club_newsletters` DISABLE KEYS */;
INSERT INTO `club_newsletters` VALUES (3,'Birthday Celebration with Children with Speech and Hearing Impairments','/uploads/pdfs/file-1781285794911-614484791.pdf','WhatsApp Image 2026-06-09 at 5.56.41 PM.pdf',89759,'0205-09-02',NULL,NULL,NULL,1,'2026-06-12 17:36:34','2026-06-12 17:36:34','club'),(4,'Student life is precious','/uploads/pdfs/file-1781287360108-579209258.pdf','WhatsApp Image 2026-06-09 at 5.56.41 PM.pdf',89759,'2026-06-12','Tumakuru',NULL,NULL,1,'2026-06-12 18:02:40','2026-06-12 18:02:40','club'),(5,'Cleanliness, singing, crime awareness program','/uploads/pdfs/file-1781287523712-247469144.pdf','WhatsApp Image 2026-06-09 at 5.56.39 PM.pdf',152534,'2025-06-12','Tumakuru',NULL,NULL,1,'2026-06-12 18:05:23','2026-06-12 18:05:23','club'),(6,'Clarity is life, confusion is death, Swami Vivekananda','/uploads/pdfs/file-1781287636597-281538831.pdf','WhatsApp Image 2026-06-09 at 5.56.40 PM.pdf',119711,'2025-01-12',NULL,NULL,NULL,1,'2026-06-12 18:07:16','2026-06-12 18:07:16','club'),(7,'Rtn. Umamahesh Elected as the New President of Rotary Tumkur Prerana','/uploads/pdfs/file-1781287809620-97985319.pdf','WhatsApp Image 2026-06-09 at 5.56.40 PM (1) (1).pdf',131605,'2024-01-12','Tumkuru',NULL,NULL,1,'2026-06-12 18:10:09','2026-06-12 18:10:09','club'),(8,'\"Practice more and become a better artist.\" – Umamahesh','/uploads/pdfs/file-1781287966017-399600055.pdf','WhatsApp Image 2026-06-09 at 5.56.41 PM.pdf',154590,'2025-08-12','Tumakuru',NULL,NULL,1,'2026-06-12 18:12:46','2026-06-12 18:12:46','club'),(9,'Menstrual Health and Hygiene Awareness Campaign','/uploads/pdfs/file-1781288106528-99729109.pdf','WhatsApp Image 2026-06-09 at 5.56.42 PM.pdf',145687,'2025-09-12','Tumakuru',NULL,NULL,1,'2026-06-12 18:15:06','2026-06-12 18:15:06','club'),(10,'Instilling a Sense of Responsibility in Children','/uploads/pdfs/file-1781288243071-354646581.pdf','WhatsApp Image 2026-06-09 at 5.56.42 PM (1).pdf',177150,'2025-09-03','Tumkur',NULL,NULL,1,'2026-06-12 18:17:23','2026-06-12 18:17:23','club'),(11,'Eye Donation: Meaningful Even After Death','/uploads/pdfs/file-1781288352884-640215382.pdf','WhatsApp Image 2026-06-09 at 5.56.43 PM.pdf',70066,'2025-08-20','Tumakuru',NULL,NULL,1,'2026-06-12 18:19:12','2026-06-12 18:19:12','club'),(12,'Awareness on Menstrual Health and PCOS','/uploads/pdfs/file-1781288480515-375009846.pdf','WhatsApp Image 2026-06-09 at 5.56.43 PM (1).pdf',122098,'2025-10-21','Tumkuru',NULL,NULL,1,'2026-06-12 18:21:20','2026-06-12 18:21:20','club'),(13,'The Seed of Parenthood: Inspiring Responsible and Compassionate Parenting','/uploads/pdfs/file-1781288595395-358391833.pdf','WhatsApp Image 2026-06-09 at 5.56.43 PM (2).pdf',163134,'2025-10-27','Tumkur',NULL,NULL,1,'2026-06-12 18:23:15','2026-06-12 18:23:15','club'),(14,'Education Alone Does Not Guarantee Employment: Learn Skills','/uploads/pdfs/file-1781288720883-660011002.pdf','WhatsApp Image 2026-06-09 at 5.56.44 PM.pdf',58977,'2025-10-31','Tumakuru',NULL,NULL,1,'2026-06-12 18:25:20','2026-06-12 18:25:20','club'),(15,'Girls, know your rights: Shashidhar','/uploads/pdfs/file-1781288820332-957749966.pdf','WhatsApp Image 2026-06-09 at 5.56.44 PM (1).pdf',154072,'2025-08-12','Tumakuru',NULL,NULL,1,'2026-06-12 18:27:00','2026-06-12 18:27:00','club'),(16,'Teachers Play a Vital Role in Instilling Values in Students','/uploads/pdfs/file-1781288981817-789841246.pdf','WhatsApp Image 2026-06-09 at 5.56.44 PM (2).pdf',65163,'2025-11-08','Tumakuru',NULL,NULL,1,'2026-06-12 18:29:41','2026-06-12 18:29:41','club'),(17,'Work with Passion and Purpose – Nagendranath','/uploads/pdfs/file-1781289089602-689308472.pdf','WhatsApp Image 2026-06-09 at 5.56.45 PM.pdf',105304,'2026-06-12','Tumkur',NULL,NULL,1,'2026-06-12 18:31:29','2026-06-12 18:31:29','club'),(18,'It Takes Great Merit to Be Born in the Land of Kannada','/uploads/pdfs/file-1781289209374-899629666.pdf','WhatsApp Image 2026-06-09 at 5.56.45 PM (1).pdf',239543,'2025-11-12','Tumakuru',NULL,NULL,1,'2026-06-12 18:33:29','2026-06-12 18:33:29','club'),(19,'Plant Trees and Show Love for the Environment: A Call by Ro. Dr. Elizabeth Cherian','/uploads/pdfs/file-1781289361542-397450590.pdf','WhatsApp Image 2026-06-09 at 5.56.45 PM (2).pdf',131517,'2025-11-11','Tumkur',NULL,NULL,1,'2026-06-12 18:36:01','2026-06-12 18:36:01','club'),(20,'A Program to Plant 111 Trees at a Time','/uploads/pdfs/file-1781289456471-589141498.pdf','WhatsApp Image 2026-06-09 at 5.56.46 PM.pdf',119877,'2025-11-11','Tumkur',NULL,NULL,1,'2026-06-12 18:37:36','2026-06-12 18:37:36','club'),(21,'Apply Your Student Skills to Build a Successful Career','/uploads/pdfs/file-1781289584177-703366074.pdf','WhatsApp Image 2026-06-09 at 5.56.46 PM (1).pdf',119986,'2026-04-12','Tumkur',NULL,NULL,1,'2026-06-12 18:39:44','2026-06-12 18:39:44','club');
/*!40000 ALTER TABLE `club_newsletters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `meeting_day` varchar(50) DEFAULT NULL,
  `meeting_time` time DEFAULT NULL,
  `meeting_venue` varchar(255) DEFAULT NULL,
  `president_name` varchar(255) DEFAULT NULL,
  `secretary_name` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `description` text,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubs`
--

LOCK TABLES `clubs` WRITE;
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubservice`
--

DROP TABLE IF EXISTS `clubservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubservice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('completed','ongoing','upcoming') DEFAULT 'upcoming',
  `volunteers_count` int DEFAULT '0',
  `impact_description` text,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `clubservice_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubservice`
--

LOCK TABLES `clubservice` WRITE;
/*!40000 ALTER TABLE `clubservice` DISABLE KEYS */;
INSERT INTO `clubservice` VALUES (1,'Self-Defense and Skill Development Awareness Program for Students','A large-scale student awareness and self-defense program was organized to empower young minds with confidence, discipline, and essential life skills. The event featured martial arts demonstrations and interactive sessions that highlighted the importance of physical fitness, self-protection, and personal development. Students actively participated and gained valuable insights into building self-confidence, leadership qualities, and resilience for a successful future.\n\n\"Empowering students through self-defense, discipline, and skill development for a stronger tomorrow.\" ??✨','/uploads/images/file-1781289671876-163836604.jpeg','Tumkur','0001-01-01','club_service','completed',0,NULL,NULL,1,'2026-06-12 18:41:11','2026-06-12 18:41:11');
/*!40000 ALTER TABLE `clubservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `committee_members`
--

DROP TABLE IF EXISTS `committee_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `committee_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `category` enum('board_of_directors','chairmans','avenues_of_service') NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `bio` text,
  `position_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `committee_members`
--

LOCK TABLES `committee_members` WRITE;
/*!40000 ALTER TABLE `committee_members` DISABLE KEYS */;
INSERT INTO `committee_members` VALUES (1,'pre','sec','/uploads/images/file-1763353046569-632739924.jpg','board_of_directors','hwj@gmail.com','9874561232','bdsiygfilb',1,0,'2025-11-17 04:17:26','2025-11-17 04:18:52'),(2,'Rtn Umamahesha A','President','/uploads/images/file-1763561503496-961768723.jpg','board_of_directors','maheshsanvith2015@gmail.com','9886740771',NULL,1,1,'2025-11-19 14:11:43','2025-11-19 14:37:44'),(3,'Vijayakumari N','Club Secretary','/uploads/images/file-1781109569514-560000388.jpeg','board_of_directors','vijayakumari.num@gmail.com','9739133389',NULL,11716401,1,'2026-06-10 16:39:29','2026-06-10 16:39:29'),(4,'Ajith N','_____','/uploads/images/file-1781110187141-958513048.jpeg','avenues_of_service','ajithnataraj@gmail.com','9945031388',NULL,12424860,1,'2026-06-10 16:49:47','2026-06-10 16:49:47'),(5,'Anandkumar M.S','_________','/uploads/images/file-1781110464416-363897699.jpeg','avenues_of_service','anandkumarmsdbv@gmail.com','8095850640',NULL,12424856,1,'2026-06-10 16:54:24','2026-06-10 16:54:24'),(6,'Srinivasa Murthy  G','Club Treasurer','/uploads/images/file-1781110756896-536602284.jpeg','board_of_directors','s.v.sign_display@live.com','9741599553',NULL,11275079,1,'2026-06-10 16:57:33','2026-06-10 16:59:16'),(7,'Janardhan  G.N.','Club Executive Secretary/Director','/uploads/images/file-1781110883615-796914059.jpeg','board_of_directors','janu.gn@gmail.com','9986608878',NULL,10254979,1,'2026-06-10 17:01:23','2026-06-10 17:01:23'),(8,'Prakash  M.S.','Club Foundation Chair',NULL,'board_of_directors','msprakash.rtrtmk@gmail.com','9844172366',NULL,9621317,1,'2026-06-10 17:04:25','2026-06-10 17:04:25'),(9,'Nandish  N','Club Public Image Chair','/uploads/images/file-1781111218710-72190564.jpeg','board_of_directors','rnsenterprises88@gmail.com','9740057516',NULL,11716158,1,'2026-06-10 17:06:58','2026-06-10 17:06:58'),(10,'Siddagangamma  G.','Club Service Projects Chair','/uploads/images/file-1781111313417-499547199.jpeg','board_of_directors','siddagangamallik@gmail.com','8971951285',NULL,11275078,1,'2026-06-10 17:08:33','2026-06-10 17:08:33'),(11,'Muddukrishna  P T','Club Vice President',NULL,'board_of_directors','krishnamud@yahoo.co.in','9590276453',NULL,11482039,1,'2026-06-10 17:12:00','2026-06-10 17:12:00'),(12,'Suresh  G N','Club Young Leaders Contact','/uploads/images/file-1781111735956-265746017.jpeg','board_of_directors','sureshthogataveer@gmail.com','9538121531',NULL,11658215,1,'2026-06-10 17:15:35','2026-06-10 17:15:35'),(13,'Rajashekhar  Narasaiah','Club Learning Facilitator','/uploads/images/file-1781111913110-655618264.jpeg','board_of_directors','rajashekhar.narasaiah@gmail.com','7760088866',NULL,10881530,1,'2026-06-10 17:18:33','2026-06-10 17:18:33'),(14,'Arpana  Kumar','____________','/uploads/images/file-1781112278946-201825716.jpeg','avenues_of_service','preranaarpana@gmail.com','9535499887',NULL,11716439,1,'2026-06-10 17:24:38','2026-06-10 17:24:38'),(15,'Dhanalaskshmamma M S','__________','/uploads/images/file-1781112363556-454015598.jpeg','avenues_of_service','dhanalakshmims79@gmail.com',NULL,NULL,12628237,1,'2026-06-10 17:26:03','2026-06-10 17:26:03'),(16,'Dhanraj P K','____________',NULL,'avenues_of_service','dhanrajappu24@gmail.com','9916420970',NULL,12459760,1,'2026-06-10 17:29:00','2026-06-10 17:29:00'),(17,'Ganga CN','_________','/uploads/images/file-1781112636434-835274288.jpeg','avenues_of_service','gangacnc97@gmail.com','9071037807',NULL,12002051,1,'2026-06-10 17:30:36','2026-06-10 17:30:36'),(18,'Girish  Babu H','_________','/uploads/images/file-1781112728697-107084600.jpeg','avenues_of_service','hgirish20071977@gmail.com','9844777255',NULL,11875075,1,'2026-06-10 17:32:08','2026-06-10 17:32:08'),(19,'Gowrishankar  B S','_________','/uploads/images/file-1781112833724-778880720.jpeg','board_of_directors','gowrishankarbs@gmail.com','9886991565',NULL,11658218,1,'2026-06-10 17:33:53','2026-06-10 17:33:53'),(20,'Hemanthraj A.P','__________','/uploads/images/file-1781112960004-808218130.jpeg','avenues_of_service','hemanthrajap@gmail.com','9742166547',NULL,12111750,1,'2026-06-10 17:36:00','2026-06-10 17:36:00'),(21,'Jyothi M Raghu','__________','/uploads/images/file-1781113053718-972292178.jpeg','avenues_of_service','jyothiraghu52432@gmail.com','8951449247',NULL,12117920,1,'2026-06-10 17:37:33','2026-06-10 17:37:33'),(22,'K.G.  Shivakumar','___________','/uploads/images/file-1781113132873-548985330.jpeg','avenues_of_service','shiva.tmk@gmail.com','9886520465',NULL,8051762,1,'2026-06-10 17:38:52','2026-06-10 17:38:52'),(23,'Kantharaju A.S','___________',NULL,'avenues_of_service','kantharajuarakere@gmail.com','9480537399',NULL,8051762,1,'2026-06-10 17:40:30','2026-06-10 17:40:30'),(24,'Madhusudhan B','___________','/uploads/images/file-1781113320333-53780851.jpeg','avenues_of_service','madhuvins88@gmail.com','7892751616',NULL,12424858,1,'2026-06-10 17:42:00','2026-06-10 17:42:00'),(25,'Mahantesh  K.','__________','/uploads/images/file-1781113422521-931752495.jpeg','avenues_of_service','manumahantesh.hcb@gmail.com',NULL,NULL,11275978,1,'2026-06-10 17:43:42','2026-06-10 17:43:42'),(26,'Mallikarjuna Swamy M G','__________','/uploads/images/file-1781113531194-393359844.jpeg','avenues_of_service','malli.bhoomi@gmail.com',NULL,NULL,10845154,1,'2026-06-10 17:45:31','2026-06-10 17:45:31'),(27,'Mamatha Raj','________','/uploads/images/file-1781113642541-595176586.jpeg','avenues_of_service','mammuseema576@gmail.com','9035438576',NULL,12424847,1,'2026-06-10 17:47:22','2026-06-10 17:47:22'),(28,'Manjunath Ms','_____________','/uploads/images/file-1781279184529-866911924.jpeg','avenues_of_service','manjukgr123@gmil.com','9686315689',NULL,12111114,1,'2026-06-12 15:46:24','2026-06-12 15:46:24'),(29,'Muddukrishna  P T','____________',NULL,'avenues_of_service','krishnamud@yahoo.co.in','9590276453',NULL,11482042,1,'2026-06-12 15:49:08','2026-06-12 15:49:08'),(30,'Murulidhara C C','__________','/uploads/images/file-1781280205694-663467222.jpeg','avenues_of_service','muruli.deepu@gmail.com','8892969725',NULL,12111131,1,'2026-06-12 16:03:25','2026-06-12 16:03:25'),(31,'Nagabhushan S','_________','/uploads/images/file-1781280398365-72626519.jpeg','avenues_of_service','bushanfocas@gmail.com','9342933027',NULL,12628898,1,'2026-06-12 16:06:38','2026-06-12 16:06:38'),(32,'Nagendranath Y R','____________','/uploads/images/file-1781280644375-184298704.jpeg','avenues_of_service','Nagendranathyr@gmail.com','7680871769',NULL,12636188,1,'2026-06-12 16:10:44','2026-06-12 16:10:44'),(33,'Narasimha Murthy GK','__________',NULL,'avenues_of_service','murthycmc1975@gmail.com','9945719995',NULL,12327318,1,'2026-06-12 16:17:05','2026-06-12 16:17:05'),(34,'Narasimharaju H.A','___________','/uploads/images/file-1781281128658-841120114.jpeg','avenues_of_service','narasimharaju2011@gmail.com','9886388329',NULL,11874501,1,'2026-06-12 16:18:48','2026-06-12 16:18:48'),(35,'Nayana  N','_________','/uploads/images/file-1781281423972-225532145.jpeg','avenues_of_service','nayanajanardhan566@gmail.com','9620016216',NULL,11716448,1,'2026-06-12 16:23:43','2026-06-12 16:23:43'),(36,'Paramesh P.','______','/uploads/images/file-1781281553730-835629610.jpeg','avenues_of_service','parmeshtmk@gmail.com','9481630591',NULL,12114941,1,'2026-06-12 16:25:53','2026-06-12 16:25:53'),(37,'Prajwal  G','______','/uploads/images/file-1781281816830-294600922.jpeg','avenues_of_service','prajwal.workk@gmail.com','8970972576',NULL,12031118,1,'2026-06-12 16:30:16','2026-06-12 16:30:16'),(38,'Prakash  M.S.','___________',NULL,'avenues_of_service','msprakash.rtrtmk@gmail.com','9844172366',NULL,9621320,1,'2026-06-12 16:34:43','2026-06-12 16:34:43'),(39,'Praveena Kumari  T N','___________','/uploads/images/file-1781282267311-384979127.jpeg','avenues_of_service','prabakrishnatn@gmail.com','8217550240',NULL,11874511,1,'2026-06-12 16:37:47','2026-06-12 16:37:47'),(40,'Pushpa R','_________','/uploads/images/file-1781282430586-916329117.jpeg','avenues_of_service','ssit.pushpar@gmail.com','9611477726',NULL,12127014,1,'2026-06-12 16:40:30','2026-06-12 16:40:30'),(41,'Raghu N G','_______','/uploads/images/file-1781282539667-158206180.jpeg','avenues_of_service','ngraghu@1985.gmail.com','8971304719',NULL,12327068,1,'2026-06-12 16:42:19','2026-06-12 16:42:19'),(42,'Raghu S','_________',NULL,'avenues_of_service','raghujyothi_11@gmail.com','9448540759',NULL,11658215,1,'2026-06-12 16:43:47','2026-06-12 16:43:47'),(43,'Ranganath T R','_______','/uploads/images/file-1781282965948-562011397.jpeg','avenues_of_service','trrsdl@gmail.com','9886855555',NULL,10881531,1,'2026-06-12 16:44:10','2026-06-12 16:49:25'),(44,'Rekha H','_____________','/uploads/images/file-1781283277542-861394105.jpeg','avenues_of_service','rekhacsessit@gmail.com','9844040350',NULL,12480689,1,'2026-06-12 16:54:37','2026-06-12 16:54:37'),(45,'Sanjay T.M.','____________','/uploads/images/file-1781283497337-404790056.jpeg','avenues_of_service','sanjaytm2024@gmail.com','8892297982',NULL,12114398,1,'2026-06-12 16:56:08','2026-06-12 16:58:17'),(46,'Senthil  Kumar','_________','/uploads/images/file-1781283475334-632150525.jpeg','avenues_of_service','ssspaceedge@gmail.com','9986011924',NULL,11716164,1,'2026-06-12 16:57:55','2026-06-12 16:57:55'),(47,'Shashidar  Ramalingappa','________',NULL,'avenues_of_service','mehakshashi@gmail.com',NULL,NULL,6751005,1,'2026-06-12 17:00:03','2026-06-12 17:00:03'),(48,'Srinivas  T R','_________','/uploads/images/file-1781283809369-183195461.jpeg','avenues_of_service','srinivasmyhome@gmail.com','9844769186',NULL,11716438,1,'2026-06-12 17:03:29','2026-06-12 17:03:29'),(49,'Suneeth R','___________',NULL,'avenues_of_service','rsuneethraj@gmail.com','9449770988',NULL,12424852,1,'2026-06-12 17:07:03','2026-06-12 17:07:03'),(50,'Suresh Kumar M. R.','__________','/uploads/images/file-1781284241289-275330908.jpeg','avenues_of_service','121sure@gmail.com','8105115526',NULL,11275988,1,'2026-06-12 17:10:41','2026-06-12 17:10:41'),(51,'Vidya Rani J','____________','/uploads/images/file-1781284356554-738573889.jpeg','avenues_of_service','vidyasrinivas111@gmail.com','9741777365',NULL,12481426,1,'2026-06-12 17:12:36','2026-06-12 17:12:36'),(52,'Yashodamma  N C','_______________','/uploads/images/file-1781284444191-196327661.jpeg','avenues_of_service','ncyashodaa@gmail.com','9591510555',NULL,11875073,1,'2026-06-12 17:14:04','2026-06-12 17:14:04');
/*!40000 ALTER TABLE `committee_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community_services`
--

DROP TABLE IF EXISTS `community_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('completed','ongoing','upcoming') DEFAULT 'upcoming',
  `volunteers_count` int DEFAULT '0',
  `impact_description` text,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `community_services_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community_services`
--

LOCK TABLES `community_services` WRITE;
/*!40000 ALTER TABLE `community_services` DISABLE KEYS */;
INSERT INTO `community_services` VALUES (1,'orinet','bmwdvfkryiqlhbfkvglihqkwen,mf',NULL,'bengluru','2025-11-14','community_service','upcoming',0,NULL,NULL,0,'2025-11-14 17:17:55','2025-11-14 19:04:00'),(2,'Health check-up camp','Rotary Tumkur Prerana proudly organized a Free Health Check-up Camp and a Doctors\' Day Felicitation Ceremony to promote community health and recognize the invaluable contributions of medical professionals. The event included free health screenings, blood pressure, blood sugar, and BMI checks for the public. Distinguished doctors were honored for their dedication, compassion, and outstanding service to society. The program highlighted Rotary\'s commitment to community welfare and healthcare awareness.','/uploads/images/file-1781286798895-31254024.jpeg','Devarayapattana','2025-07-01','community_service','completed',0,NULL,NULL,1,'2026-06-12 17:53:18','2026-06-12 17:53:18'),(3,'Eye Donation Awareness Campaign','Rotary Tumkur Prerana organized an Eye Donation Awareness Campaign to educate the community about the importance of eye donation and its life-changing impact. The initiative aimed to inspire individuals to pledge their eyes and help restore vision to those in need. Through awareness and community participation, the campaign promoted the message that even after death, one can continue to make a meaningful difference in the lives of others.  \"Eye Donation: A Gift of Sight, A Legacy of Hope.\" ?️✨?','/uploads/images/file-1781289950192-534850699.jpeg','Tumkur','0001-01-01','community_service','upcoming',0,NULL,NULL,1,'2026-06-12 18:45:50','2026-06-12 18:45:50');
/*!40000 ALTER TABLE `community_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_type` enum('Birthday','Anniversary','Event') NOT NULL,
  `event_date` date NOT NULL,
  `event_time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `person_name` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `couple_name` varchar(255) DEFAULT NULL,
  `anniversary_date` date DEFAULT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_events_date_type` (`event_date`,`event_type`),
  KEY `idx_events_person_name` (`person_name`),
  KEY `idx_events_couple_name` (`couple_name`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Birthday','2025-10-29',NULL,'','','','Deepu','2020-10-30',NULL,NULL,NULL,NULL,0,'2025-10-29 09:28:16','2025-11-14 19:03:36'),(2,'Anniversary','2025-10-29',NULL,'','','',NULL,NULL,'ABC','2021-10-31',NULL,NULL,0,'2025-10-29 09:36:33','2025-11-14 19:03:40'),(3,'Event','2025-10-29',NULL,'','','',NULL,NULL,NULL,NULL,'Public speech',NULL,0,'2025-10-29 09:38:04','2025-11-14 19:03:45'),(4,'Birthday','2025-10-30',NULL,'','','','xyz','2002-10-30',NULL,NULL,NULL,NULL,0,'2025-10-29 10:05:20','2025-11-14 19:03:50');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `governors_newsletters`
--

DROP TABLE IF EXISTS `governors_newsletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `governors_newsletters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_size` int NOT NULL,
  `published_date` date NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text,
  `uploaded_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `newsletter_type` enum('club','governor') DEFAULT 'governor',
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `governors_newsletters_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `governors_newsletters`
--

LOCK TABLES `governors_newsletters` WRITE;
/*!40000 ALTER TABLE `governors_newsletters` DISABLE KEYS */;
/*!40000 ALTER TABLE `governors_newsletters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `internationalservice`
--

DROP TABLE IF EXISTS `internationalservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `internationalservice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('completed','ongoing','upcoming') DEFAULT 'upcoming',
  `volunteers_count` int DEFAULT '0',
  `impact_description` text,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `internationalservice_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `internationalservice`
--

LOCK TABLES `internationalservice` WRITE;
/*!40000 ALTER TABLE `internationalservice` DISABLE KEYS */;
INSERT INTO `internationalservice` VALUES (1,'Leadership and Excellence Summit at SIT, Tumkur','A prestigious leadership and excellence program was organized at SIT, Tumkur, bringing together educators, professionals, community leaders, and distinguished guests. The event focused on promoting innovation, leadership, academic excellence, and collaborative growth. During the program, educational and development initiatives were unveiled, inspiring participants to contribute towards building a knowledgeable, skilled, and progressive society.\n\n\"Empowering minds, fostering leadership, and inspiring excellence for a brighter future.\" ???','/uploads/images/file-1781289809633-183770230.jpeg','Tumkur','0001-01-01','international_service','upcoming',0,NULL,NULL,1,'2026-06-12 18:43:29','2026-06-12 18:43:29');
/*!40000 ALTER TABLE `internationalservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `join_requests`
--

DROP TABLE IF EXISTS `join_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `join_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('Volunteer','Member','Partner') NOT NULL,
  `focus_areas` text,
  `gender` enum('Male','Female','Non-binary','Prefer not to say') DEFAULT NULL,
  `age_range` varchar(50) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `zip` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `hear_about` varchar(255) DEFAULT NULL,
  `reason` text,
  `comments` text,
  `organisation_name` varchar(255) DEFAULT NULL,
  `organisation_type` enum('Government','Corporate','NGO') DEFAULT NULL,
  `organisation_reason` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `assigned_to` int DEFAULT NULL,
  `admin_notes` text,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `idx_join_requests_status` (`status`),
  KEY `idx_join_requests_created_at` (`created_at`),
  CONSTRAINT `join_requests_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `join_requests`
--

LOCK TABLES `join_requests` WRITE;
/*!40000 ALTER TABLE `join_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `join_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newgenerationservice`
--

DROP TABLE IF EXISTS `newgenerationservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newgenerationservice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('completed','ongoing','upcoming') DEFAULT 'upcoming',
  `volunteers_count` int DEFAULT '0',
  `impact_description` text,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `newgenerationservice_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newgenerationservice`
--

LOCK TABLES `newgenerationservice` WRITE;
/*!40000 ALTER TABLE `newgenerationservice` DISABLE KEYS */;
INSERT INTO `newgenerationservice` VALUES (1,'Community Empowerment and Awareness Program','A successful community empowerment and awareness program was organized at Shridevi Institute of Medical Sciences and Research Hospital, bringing together community members, healthcare professionals, volunteers, and leaders. The event focused on promoting social welfare, health awareness, skill development, and community engagement. Participants actively took part in informative sessions aimed at improving quality of life, fostering self-reliance, and encouraging collective action for societal progress.\n\n\"Empowering communities through awareness, education, and collective action for a better tomorrow.\" ???','/uploads/images/file-1781289745487-427803390.jpeg','Tumkur','0001-01-01','new_generation_service','completed',0,NULL,NULL,1,'2026-06-12 18:42:25','2026-06-12 18:42:25');
/*!40000 ALTER TABLE `newgenerationservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicimageinitiative`
--

DROP TABLE IF EXISTS `publicimageinitiative`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicimageinitiative` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('completed','ongoing','upcoming') DEFAULT 'upcoming',
  `volunteers_count` int DEFAULT '0',
  `impact_description` text,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `publicimageinitiative_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicimageinitiative`
--

LOCK TABLES `publicimageinitiative` WRITE;
/*!40000 ALTER TABLE `publicimageinitiative` DISABLE KEYS */;
INSERT INTO `publicimageinitiative` VALUES (1,'Rotary Tumkur Prerana Honors Community Leaders and Distinguished Guests','Rotary Tumkur Prerana organized a special felicitation and recognition program to honor distinguished leaders, social contributors, and community members for their outstanding service and dedication. The event brought together Rotary members, guests, and well-wishers to celebrate achievements, strengthen community bonds, and promote the spirit of service above self. The gathering highlighted Rotary’s commitment to recognizing excellence and inspiring positive change in society.\n\n\"Celebrating leadership, honoring service, and inspiring communities through recognition and unity.\" ???','/uploads/images/file-1781289885114-494253663.jpeg','Tumkur','0001-01-01','public_image_initiative','completed',0,NULL,NULL,1,'2026-06-12 18:44:45','2026-06-12 18:44:45');
/*!40000 ALTER TABLE `publicimageinitiative` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','moderator') DEFAULT 'admin',
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vocationalservice`
--

DROP TABLE IF EXISTS `vocationalservice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vocationalservice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `heading` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('completed','ongoing','upcoming') DEFAULT 'upcoming',
  `volunteers_count` int DEFAULT '0',
  `impact_description` text,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `vocationalservice_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vocationalservice`
--

LOCK TABLES `vocationalservice` WRITE;
/*!40000 ALTER TABLE `vocationalservice` DISABLE KEYS */;
/*!40000 ALTER TABLE `vocationalservice` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-13  2:32:48
