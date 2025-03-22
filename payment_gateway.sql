-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 22, 2025 at 09:17 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `payment_gateway`
--

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Brand name',
  `description` text DEFAULT NULL COMMENT 'Brand description',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'Brand status',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL COMMENT 'Category description',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'Category status',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `colors`
--

CREATE TABLE `colors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Color name',
  `code` varchar(255) NOT NULL COMMENT 'Color hex code',
  `description` text DEFAULT NULL COMMENT 'Color description',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'Color status',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `type` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
  `value` decimal(10,2) NOT NULL COMMENT 'Discount amount or percentage',
  `maxUses` int(11) NOT NULL DEFAULT 1,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `minPurchaseAmount` decimal(10,2) DEFAULT NULL,
  `maxDiscountAmount` decimal(10,2) DEFAULT NULL,
  `status` enum('active','inactive','expired') DEFAULT 'active',
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `purchasePrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subtotal` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `OrderId` int(11) DEFAULT NULL,
  `ProductId` int(11) DEFAULT NULL,
  `ProductVariantId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `orderNumber` varchar(255) NOT NULL COMMENT 'Unique order reference number',
  `customerName` varchar(255) NOT NULL,
  `customerPhone` varchar(255) DEFAULT NULL,
  `customerEmail` varchar(255) DEFAULT NULL,
  `orderDate` datetime NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `paymentMethod` enum('cash','card','mobile_banking') NOT NULL,
  `paymentStatus` enum('pending','completed','failed') DEFAULT 'pending',
  `orderStatus` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymentaccounts`
--

CREATE TABLE `paymentaccounts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `paymentDetailId` int(11) NOT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `maxLimit` decimal(15,2) DEFAULT 0.00,
  `currentUsage` decimal(15,2) DEFAULT 0.00,
  `isActive` tinyint(1) DEFAULT 1,
  `status` enum('active','inactive','blocked') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `paymentaccounts`
--

INSERT INTO `paymentaccounts` (`id`, `userId`, `paymentDetailId`, `accountNumber`, `maxLimit`, `currentUsage`, `isActive`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '01854107699', 12000.00, 0.00, 1, 'active', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 1, 1, '01854107694', 12000.00, 0.00, 1, 'active', '2025-03-15 11:49:44', '2025-03-15 11:50:56'),
(3, 1, 3, '01854107688', 25454.00, 0.00, 1, 'active', '2025-03-15 11:53:39', '2025-03-15 14:08:22'),
(4, 1, 5, '01854107692', 100000.00, 0.00, 1, 'active', '2025-03-15 14:10:19', '2025-03-15 14:12:31');

-- --------------------------------------------------------

--
-- Table structure for table `payment_accounts`
--

CREATE TABLE `payment_accounts` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `paymentDetailId` int(11) DEFAULT NULL,
  `paymentTypeId` int(11) DEFAULT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `accountName` varchar(255) DEFAULT '',
  `routingNumber` varchar(255) DEFAULT '',
  `branchName` varchar(255) DEFAULT '',
  `maxLimit` decimal(10,2) DEFAULT 0.00,
  `currentUsage` decimal(10,2) DEFAULT 0.00,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_accounts`
--

INSERT INTO `payment_accounts` (`id`, `userId`, `paymentDetailId`, `paymentTypeId`, `accountNumber`, `accountName`, `routingNumber`, `branchName`, `maxLimit`, `currentUsage`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, NULL, '01854107699', '', '', '', 3000.00, 2499.00, 'active', '2025-03-22 07:10:45', '2025-03-22 07:16:42'),
(2, 1, 1, NULL, '0185410769877', '', '', '', 1500.00, 1000.00, 'active', '2025-03-22 07:16:06', '2025-03-22 07:28:09'),
(3, 1, NULL, 2, '877878787', '', '5487878', 'dhaka', 0.00, 2000.00, 'active', '2025-03-22 07:24:23', '2025-03-22 07:32:36'),
(4, 1, 3, NULL, '01854107694', '', '', '', 2000.00, 0.00, 'active', '2025-03-22 07:56:27', '2025-03-22 07:58:04');

-- --------------------------------------------------------

--
-- Table structure for table `payment_details`
--

CREATE TABLE `payment_details` (
  `id` int(11) NOT NULL,
  `paymentTypeId` int(11) NOT NULL,
  `value` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `charge` decimal(10,2) DEFAULT 0.00,
  `maxLimit` decimal(10,2) DEFAULT 0.00,
  `currentUsage` decimal(10,2) DEFAULT 0.00,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_details`
--

INSERT INTO `payment_details` (`id`, `paymentTypeId`, `value`, `description`, `charge`, `maxLimit`, `currentUsage`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Send Money', '', 1.97, 25000.00, 0.00, 1, '2025-03-22 07:08:46', '2025-03-22 07:08:46'),
(2, 1, 'Agent', 'Charge 18.50 BDT', 1.85, 0.00, 0.00, 1, '2025-03-22 07:08:46', '2025-03-22 07:08:46'),
(3, 3, 'Send Money', 'adfasdfasdfas', 1.85, 25000.00, 0.00, 1, '2025-03-22 07:50:49', '2025-03-22 07:50:49'),
(4, 3, 'Cash out', 'eastas', 1.85, 25000.00, 0.00, 1, '2025-03-22 07:50:49', '2025-03-22 07:50:49');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `name` enum('MOBILE_BANKING','VISA','BANK','MASTERCARD','CREDIT_CARD','USDT') NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `userId`, `name`, `image`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'MOBILE_BANKING', 'http://localhost:3000/uploads/2/2_a27376d6-0e7c-428e-9bd9-2cb54cbddccb.png', 'active', '2025-03-22 07:05:28', '2025-03-22 07:49:37'),
(2, 2, 'BANK', 'http://localhost:3000/uploads/2/2_858e7c8a-3338-48ac-8e28-a264b7048c18.png', 'active', '2025-03-22 07:06:38', '2025-03-22 07:06:38'),
(3, 2, 'USDT', 'http://localhost:3000/uploads/2/2_218081dd-a888-4d38-9ed0-ed6f8cb91f53.png', 'active', '2025-03-22 07:06:50', '2025-03-22 07:23:07');

-- --------------------------------------------------------

--
-- Table structure for table `payment_types`
--

CREATE TABLE `payment_types` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `paymentMethodId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_types`
--

INSERT INTO `payment_types` (`id`, `userId`, `paymentMethodId`, `name`, `image`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'Bkash', 'http://localhost:3000/uploads/1/1_ca1dd349-4262-44df-8690-a5df3729604a.png', 'active', '2025-03-22 07:08:46', '2025-03-22 07:08:46'),
(2, 2, 2, 'City Bank', 'http://localhost:3000/uploads/2/2_d97ea1a4-cc4e-42b2-b0d9-d00575cbf2f7.png', 'active', '2025-03-22 07:22:29', '2025-03-22 07:22:29'),
(3, 2, 1, 'Nagad', 'http://localhost:3000/uploads/2/2_702afb4d-1642-4d76-816e-01c0a6b32f39.png', 'active', '2025-03-22 07:50:49', '2025-03-22 07:50:49');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `code` varchar(255) DEFAULT NULL COMMENT 'Barcode or unique code for the product',
  `sku` varchar(255) NOT NULL COMMENT 'unique code for the product',
  `name` varchar(255) NOT NULL COMMENT 'Name of the product',
  `description` text DEFAULT NULL COMMENT 'Product description',
  `alertQuantity` int(11) NOT NULL DEFAULT 10 COMMENT 'Quantity at which to alert for low stock',
  `productImage` varchar(255) DEFAULT NULL COMMENT 'Path or URL of the product image',
  `discountType` enum('percentage','amount') DEFAULT NULL COMMENT 'Type of discount applied to the product',
  `discountAmount` decimal(10,2) DEFAULT NULL COMMENT 'Discount amount based on the discount type',
  `purchasePrice` decimal(10,2) NOT NULL COMMENT 'Purchase price of the product',
  `salesPrice` decimal(10,2) NOT NULL COMMENT 'Sales price of the product',
  `vat` decimal(5,2) DEFAULT 0.00 COMMENT 'VAT percentage on the product',
  `price` decimal(10,2) NOT NULL COMMENT 'Maximum retail price of the product',
  `stock` int(11) NOT NULL DEFAULT 0 COMMENT 'Current stock quantity',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'Product status',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  `BrandId` int(11) DEFAULT NULL,
  `UnitId` int(11) DEFAULT NULL,
  `SizeId` int(11) DEFAULT NULL,
  `ColorId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productvariants`
--

CREATE TABLE `productvariants` (
  `id` int(11) NOT NULL,
  `sku` varchar(255) NOT NULL COMMENT 'Variant SKU',
  `quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Stock quantity',
  `alertQuantity` int(11) NOT NULL DEFAULT 5 COMMENT 'Alert when stock reaches this quantity',
  `imageUrl` varchar(255) DEFAULT NULL COMMENT 'Variant image URL',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'Variant status',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ProductId` int(11) DEFAULT NULL,
  `ColorId` int(11) DEFAULT NULL,
  `SizeId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT 'Size name',
  `description` text DEFAULT NULL COMMENT 'Size description',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'Size status',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stockhistories`
--

CREATE TABLE `stockhistories` (
  `id` int(11) NOT NULL,
  `type` enum('order','adjustment','return') NOT NULL,
  `quantity` int(11) NOT NULL,
  `previousStock` int(11) NOT NULL,
  `newStock` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ProductId` int(11) DEFAULT NULL,
  `ProductVariantId` int(11) DEFAULT NULL,
  `OrderId` int(11) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptionplans`
--

CREATE TABLE `subscriptionplans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'Duration in days',
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `maxProducts` int(11) NOT NULL DEFAULT 0,
  `maxStorage` varchar(255) DEFAULT '1 GB',
  `maxUsers` int(11) NOT NULL DEFAULT 1,
  `status` enum('active','inactive') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `paymentMethodId` int(11) NOT NULL,
  `paymentTypeId` int(11) DEFAULT NULL,
  `paymentDetailId` int(11) DEFAULT NULL,
  `paymentAccountId` int(11) NOT NULL,
  `transactionId` varchar(255) NOT NULL,
  `givenTransactionId` varchar(255) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `paymentSource` enum('player','agent','product') NOT NULL,
  `paymentSourceId` int(11) NOT NULL,
  `type` enum('credit','debit') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `remarks` text DEFAULT NULL,
  `approvedBy` int(11) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `userId`, `paymentMethodId`, `paymentTypeId`, `paymentDetailId`, `paymentAccountId`, `transactionId`, `givenTransactionId`, `attachment`, `paymentSource`, `paymentSourceId`, `type`, `amount`, `status`, `remarks`, `approvedBy`, `approvedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 1, 1, '324cdf51-a5d4-48c9-9919-8ddf8e0bdf32', '12255887', 'http://localhost:3000/uploads/1/1_6a5150c1-e3b3-4c81-b5e6-e83980588295.png', 'agent', 125547, 'credit', 2499.00, 'APPROVED', 'sffasdfasdf', 1, '2025-03-22 07:14:44', '2025-03-22 07:12:52', '2025-03-22 07:14:44'),
(2, 1, 1, 1, 1, 2, '02eef3dd-a915-4358-8e2f-9625388fd062', '1545454', 'http://localhost:3000/uploads/1/1_02a0fb74-38fa-4bec-a507-acdb1006f4fc.png', 'player', 12545587, 'credit', 1000.00, 'PENDING', NULL, NULL, NULL, '2025-03-22 07:17:44', '2025-03-22 07:17:44'),
(3, 1, 1, 1, 1, 2, '214d4b31-e51c-47b3-a72d-1f54989d0f68', '4587887', 'http://localhost:3000/uploads/1/1_86e632b6-8370-49e4-ba02-8c29d684e810.png', 'player', 10015, 'credit', 1500.00, 'REJECTED', '56548', 1, '2025-03-22 07:28:09', '2025-03-22 07:21:28', '2025-03-22 07:28:09'),
(4, 1, 2, 2, NULL, 3, '0e728f57-673f-4fd5-8d9f-676e84073128', '12312312', 'http://localhost:3000/uploads/1/1_f1591680-30b2-4ac2-81ef-759d6aa8f642.png', 'player', 112312, 'credit', 2000.00, 'APPROVED', 'good it is approved', 1, '2025-03-22 07:41:05', '2025-03-22 07:32:36', '2025-03-22 07:41:05'),
(5, 1, 1, 3, 3, 4, '5c81fc6b-291d-432b-ae1d-7f91f70d3021', '56456', '', 'player', 1232, 'credit', 2000.00, 'REJECTED', 'pls provide attachment', 1, '2025-03-22 07:58:04', '2025-03-22 07:57:16', '2025-03-22 07:58:04');

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Unit name (e.g., kg, piece, dozen)',
  `shortName` varchar(255) NOT NULL COMMENT 'Short form of unit (e.g., kg, pcs, dz)',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT 'Unit status',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE `userroles` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('manager','staff','cashier') NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Store role-specific permissions' CHECK (json_valid(`permissions`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `parentUserId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL COMMENT 'Name of the user or shop owner',
  `email` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(50) NOT NULL COMMENT 'Phone number of the user',
  `location` varchar(255) DEFAULT NULL COMMENT 'User''s location',
  `businessName` varchar(255) DEFAULT NULL COMMENT 'Name of the user''s business',
  `businessType` varchar(255) DEFAULT NULL COMMENT 'Type of business the user runs',
  `password` varchar(255) NOT NULL COMMENT 'Hashed password of the user',
  `accountStatus` enum('active','inactive') NOT NULL DEFAULT 'active' COMMENT 'Status of the user account',
  `accountType` enum('super admin','agent') DEFAULT 'agent',
  `isVerified` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Indicates if the user is email verified',
  `verificationToken` varchar(255) DEFAULT NULL COMMENT 'Token for email verification',
  `agentId` varchar(255) DEFAULT NULL COMMENT 'custom agent id',
  `resetTokenExpiry` datetime DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `isLoggedIn` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Tracks if the user is currently logged in',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `image`, `phoneNumber`, `location`, `businessName`, `businessType`, `password`, `accountStatus`, `accountType`, `isVerified`, `verificationToken`, `agentId`, `resetTokenExpiry`, `resetToken`, `isLoggedIn`, `createdAt`, `updatedAt`) VALUES
(1, 'Sohidul Islam', 'sishufol.sim@gmail.com', NULL, '015445455454', 'Dhaka', NULL, NULL, '$2b$10$rKMSyyIbdDb55DeSFslXe.wXEY2XtF6cb7A0HPSejdvqDGQLWddbi', 'inactive', 'agent', 0, '4c8b313e000d49a4aadc064d7a75966b5560fc43dca3dabce1f223da7a88a809', 'bappirockstar', NULL, NULL, 0, '2025-03-22 06:51:44', '2025-03-22 08:06:11'),
(2, 'Test admin', 'shufol.cse@gmail.com', NULL, '01683135885', 'Bangladesh', NULL, NULL, '$2b$10$HZlJczmg2Exyt9yZBWBmmOgY4gz9O6X0/6G6w3MIT17khrDaL92M2', 'inactive', 'super admin', 0, '34be4dd175eb287c4f408bf637921578a1060571a12bb9f7581d5de86b5f132b', 'm8jwx9yhh5w', NULL, NULL, 0, '2025-03-22 06:53:18', '2025-03-22 07:53:46');

-- --------------------------------------------------------

--
-- Table structure for table `usersubscriptions`
--

CREATE TABLE `usersubscriptions` (
  `id` int(11) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `paymentStatus` enum('pending','completed','failed') DEFAULT 'pending',
  `paymentMethod` enum('cash','card','mobile_banking') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `coupon` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(11) DEFAULT NULL,
  `SubscriptionPlanId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brand_name` (`name`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `color_name` (`name`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `coupon_code` (`code`);

--
-- Indexes for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderId` (`OrderId`),
  ADD KEY `ProductId` (`ProductId`),
  ADD KEY `ProductVariantId` (`ProductVariantId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderNumber` (`orderNumber`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `paymentaccounts`
--
ALTER TABLE `paymentaccounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_accounts`
--
ALTER TABLE `payment_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `paymentDetailId` (`paymentDetailId`),
  ADD KEY `paymentTypeId` (`paymentTypeId`);

--
-- Indexes for table `payment_details`
--
ALTER TABLE `payment_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paymentTypeId` (`paymentTypeId`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `payment_types`
--
ALTER TABLE `payment_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `paymentMethodId` (`paymentMethodId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku_code` (`sku`),
  ADD UNIQUE KEY `product_code` (`code`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `CategoryId` (`CategoryId`),
  ADD KEY `BrandId` (`BrandId`),
  ADD KEY `UnitId` (`UnitId`),
  ADD KEY `SizeId` (`SizeId`),
  ADD KEY `ColorId` (`ColorId`);

--
-- Indexes for table `productvariants`
--
ALTER TABLE `productvariants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `variant_sku` (`sku`),
  ADD KEY `ProductId` (`ProductId`),
  ADD KEY `ColorId` (`ColorId`),
  ADD KEY `SizeId` (`SizeId`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `size_name` (`name`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `stockhistories`
--
ALTER TABLE `stockhistories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductId` (`ProductId`),
  ADD KEY `ProductVariantId` (`ProductVariantId`),
  ADD KEY `OrderId` (`OrderId`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `subscriptionplans`
--
ALTER TABLE `subscriptionplans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plan_name` (`name`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paymentTypeId` (`paymentTypeId`),
  ADD KEY `paymentDetailId` (`paymentDetailId`),
  ADD KEY `paymentAccountId` (`paymentAccountId`),
  ADD KEY `approvedBy` (`approvedBy`),
  ADD KEY `userId` (`userId`),
  ADD KEY `paymentMethodId` (`paymentMethodId`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unit_name` (`name`),
  ADD UNIQUE KEY `unit_shortName` (`shortName`),
  ADD KEY `UserId` (`UserId`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user-role-email` (`email`),
  ADD KEY `parentUserId` (`parentUserId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phoneNumber` (`phoneNumber`),
  ADD UNIQUE KEY `ageintId` (`agentId`);

--
-- Indexes for table `usersubscriptions`
--
ALTER TABLE `usersubscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`UserId`),
  ADD KEY `SubscriptionPlanId` (`SubscriptionPlanId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `colors`
--
ALTER TABLE `colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paymentaccounts`
--
ALTER TABLE `paymentaccounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_accounts`
--
ALTER TABLE `payment_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_details`
--
ALTER TABLE `payment_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payment_types`
--
ALTER TABLE `payment_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `productvariants`
--
ALTER TABLE `productvariants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stockhistories`
--
ALTER TABLE `stockhistories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscriptionplans`
--
ALTER TABLE `subscriptionplans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userroles`
--
ALTER TABLE `userroles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `usersubscriptions`
--
ALTER TABLE `usersubscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `banners`
--
ALTER TABLE `banners`
  ADD CONSTRAINT `banners_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `banners_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `banners_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `banners_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `brands`
--
ALTER TABLE `brands`
  ADD CONSTRAINT `brands_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `brands_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `brands_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `brands_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `colors`
--
ALTER TABLE `colors`
  ADD CONSTRAINT `colors_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `colors_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `colors_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `colors_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_10` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_11` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_12` FOREIGN KEY (`ProductVariantId`) REFERENCES `productvariants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_3` FOREIGN KEY (`ProductVariantId`) REFERENCES `productvariants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_4` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_5` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_6` FOREIGN KEY (`ProductVariantId`) REFERENCES `productvariants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_7` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_8` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitems_ibfk_9` FOREIGN KEY (`ProductVariantId`) REFERENCES `productvariants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `payment_accounts`
--
ALTER TABLE `payment_accounts`
  ADD CONSTRAINT `payment_accounts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payment_accounts_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payment_accounts_ibfk_11` FOREIGN KEY (`paymentDetailId`) REFERENCES `payment_details` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_accounts_ibfk_12` FOREIGN KEY (`paymentTypeId`) REFERENCES `payment_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_accounts_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `payment_accounts_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `payment_details`
--
ALTER TABLE `payment_details`
  ADD CONSTRAINT `payment_details_ibfk_1` FOREIGN KEY (`paymentTypeId`) REFERENCES `payment_types` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_methods_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_methods_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_methods_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `payment_types`
--
ALTER TABLE `payment_types`
  ADD CONSTRAINT `payment_types_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_types_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_types_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_types_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_types_ibfk_8` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_methods` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_10` FOREIGN KEY (`UnitId`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_11` FOREIGN KEY (`SizeId`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_12` FOREIGN KEY (`ColorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_13` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_14` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_15` FOREIGN KEY (`BrandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_16` FOREIGN KEY (`UnitId`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_17` FOREIGN KEY (`SizeId`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_18` FOREIGN KEY (`ColorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_19` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_20` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_21` FOREIGN KEY (`BrandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_22` FOREIGN KEY (`UnitId`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_23` FOREIGN KEY (`SizeId`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_24` FOREIGN KEY (`ColorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`BrandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`UnitId`) REFERENCES `units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_5` FOREIGN KEY (`SizeId`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_6` FOREIGN KEY (`ColorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_8` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_9` FOREIGN KEY (`BrandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `productvariants`
--
ALTER TABLE `productvariants`
  ADD CONSTRAINT `productvariants_ibfk_1` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_10` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_11` FOREIGN KEY (`ColorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_12` FOREIGN KEY (`SizeId`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_2` FOREIGN KEY (`ColorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_3` FOREIGN KEY (`SizeId`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_4` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_5` FOREIGN KEY (`ColorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_6` FOREIGN KEY (`SizeId`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_7` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_8` FOREIGN KEY (`ColorId`) REFERENCES `colors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productvariants_ibfk_9` FOREIGN KEY (`SizeId`) REFERENCES `sizes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sizes`
--
ALTER TABLE `sizes`
  ADD CONSTRAINT `sizes_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sizes_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sizes_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sizes_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stockhistories`
--
ALTER TABLE `stockhistories`
  ADD CONSTRAINT `stockhistories_ibfk_1` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_10` FOREIGN KEY (`ProductVariantId`) REFERENCES `productvariants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_11` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_12` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_13` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_14` FOREIGN KEY (`ProductVariantId`) REFERENCES `productvariants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_15` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_16` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_2` FOREIGN KEY (`ProductVariantId`) REFERENCES `productvariants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_3` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_5` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_6` FOREIGN KEY (`ProductVariantId`) REFERENCES `productvariants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_7` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_8` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `stockhistories_ibfk_9` FOREIGN KEY (`ProductId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_12` FOREIGN KEY (`approvedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_16` FOREIGN KEY (`paymentDetailId`) REFERENCES `payment_details` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_17` FOREIGN KEY (`paymentAccountId`) REFERENCES `payment_accounts` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_18` FOREIGN KEY (`approvedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_20` FOREIGN KEY (`paymentMethodId`) REFERENCES `payment_methods` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_6` FOREIGN KEY (`approvedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `transactions_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `units`
--
ALTER TABLE `units`
  ADD CONSTRAINT `units_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `units_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `units_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `units_ibfk_4` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`parentUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_3` FOREIGN KEY (`parentUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_5` FOREIGN KEY (`parentUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_7` FOREIGN KEY (`parentUserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `usersubscriptions`
--
ALTER TABLE `usersubscriptions`
  ADD CONSTRAINT `usersubscriptions_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersubscriptions_ibfk_2` FOREIGN KEY (`SubscriptionPlanId`) REFERENCES `subscriptionplans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersubscriptions_ibfk_3` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersubscriptions_ibfk_4` FOREIGN KEY (`SubscriptionPlanId`) REFERENCES `subscriptionplans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersubscriptions_ibfk_5` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersubscriptions_ibfk_6` FOREIGN KEY (`SubscriptionPlanId`) REFERENCES `subscriptionplans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersubscriptions_ibfk_7` FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `usersubscriptions_ibfk_8` FOREIGN KEY (`SubscriptionPlanId`) REFERENCES `subscriptionplans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
