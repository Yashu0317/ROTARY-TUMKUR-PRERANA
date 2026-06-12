-- Rotary Club Database Schema - Updated for Specific Requirements
CREATE DATABASE IF NOT EXISTS rotary_club_db;
USE rotary_club_db;

-- 1. Users/Admins table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Calendar Events - Updated for specific requirements
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Common fields
    event_type ENUM('Birthday', 'Anniversary', 'Event') NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    
    -- Birthday specific fields
    person_name VARCHAR(255),
    date_of_birth DATE,
    
    -- Anniversary specific fields
    couple_name VARCHAR(255),
    anniversary_date DATE,
    
    -- Event specific fields
    event_name VARCHAR(255),
    
    -- Common admin fields
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Club Newsletters - Updated for specific requirements
CREATE TABLE club_newsletters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    published_date DATE NOT NULL,
    location VARCHAR(255),
    description TEXT,
    uploaded_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE governors_newsletters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    published_date DATE NOT NULL,
    location VARCHAR(255),
    description TEXT,
    uploaded_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);
select * from governors_newsletters;
ALTER TABLE club_newsletters ADD COLUMN newsletter_type ENUM('club', 'governor') DEFAULT 'club';
ALTER TABLE governors_newsletters ADD COLUMN newsletter_type ENUM('club', 'governor') DEFAULT 'governor';

-- 4. Club Services/Community Projects - Updated for specific requirements
CREATE TABLE community_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    heading VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(255),
    service_date DATE,
    category VARCHAR(100),
    status ENUM('completed', 'ongoing', 'upcoming') DEFAULT 'upcoming',
    volunteers_count INT DEFAULT 0,
    impact_description TEXT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
CREATE TABLE ClubService (
    id INT PRIMARY KEY AUTO_INCREMENT,
    heading VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(255),
    service_date DATE,
    category VARCHAR(100),
    status ENUM('completed', 'ongoing', 'upcoming') DEFAULT 'upcoming',
    volunteers_count INT DEFAULT 0,
    impact_description TEXT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE VocationalService (
    id INT PRIMARY KEY AUTO_INCREMENT,
    heading VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(255),
    service_date DATE,
    category VARCHAR(100),
    status ENUM('completed', 'ongoing', 'upcoming') DEFAULT 'upcoming',
    volunteers_count INT DEFAULT 0,
    impact_description TEXT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE NewGenerationService (
    id INT PRIMARY KEY AUTO_INCREMENT,
    heading VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(255),
    service_date DATE,
    category VARCHAR(100),
    status ENUM('completed', 'ongoing', 'upcoming') DEFAULT 'upcoming',
    volunteers_count INT DEFAULT 0,
    impact_description TEXT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE InternationalService (
    id INT PRIMARY KEY AUTO_INCREMENT,
    heading VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(255),
    service_date DATE,
    category VARCHAR(100),
    status ENUM('completed', 'ongoing', 'upcoming') DEFAULT 'upcoming',
    volunteers_count INT DEFAULT 0,
    impact_description TEXT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE PublicImageInitiative (
    id INT PRIMARY KEY AUTO_INCREMENT,
    heading VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(255),
    service_date DATE,
    category VARCHAR(100),
    status ENUM('completed', 'ongoing', 'upcoming') DEFAULT 'upcoming',
    volunteers_count INT DEFAULT 0,
    impact_description TEXT,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);


-- 5. Committee Members - Updated for specific requirements
CREATE TABLE committee_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    category ENUM('board_of_directors', 'chairmans', 'avenues_of_service') NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    bio TEXT,
    position_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
select * from committee_members;



-- 6. Join Requests - Updated for specific requirements
CREATE TABLE join_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Role and Interests
    role ENUM('Volunteer', 'Member', 'Partner') NOT NULL,
    focus_areas TEXT,
    
    -- Personal Details
    gender ENUM('Male', 'Female', 'Non-binary', 'Prefer not to say'),
    age_range VARCHAR(50),
    
    -- Address
    street VARCHAR(255),
    zip VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    
    -- Professional Information
    occupation VARCHAR(255),
    hear_about VARCHAR(255),
    reason TEXT,
    comments TEXT,
    
    -- Organization Details (for Partners)
    organisation_name VARCHAR(255),
    organisation_type ENUM('Government', 'Corporate', 'NGO'),
    organisation_reason TEXT,
    
    -- Admin Fields
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    assigned_to INT,
    admin_notes TEXT,
    processed_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Clubs table (for reference)
CREATE TABLE clubs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    meeting_day VARCHAR(50),
    meeting_time TIME,
    meeting_venue VARCHAR(255),
    president_name VARCHAR(255),
    secretary_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. Activity Log table
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_events_date_type ON events(event_date, event_type);
CREATE INDEX idx_events_person_name ON events(person_name);
CREATE INDEX idx_events_couple_name ON events(couple_name);
CREATE INDEX idx_newsletters_published_date ON club_newsletters(published_date);
CREATE INDEX idx_community_services_date ON community_services(service_date);
CREATE INDEX idx_committee_members_category ON committee_members(category);
CREATE INDEX idx_join_requests_status ON join_requests(status);
CREATE INDEX idx_join_requests_created_at ON join_requests(created_at);