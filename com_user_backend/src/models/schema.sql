
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    designation VARCHAR(100),
    dob DATE,
    active BOOLEAN DEFAULT TRUE,
    company_id VARCHAR(100) REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS countries (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS states (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id VARCHAR(10) REFERENCES countries(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_id VARCHAR(10) REFERENCES states(id) ON DELETE CASCADE
);

INSERT INTO countries (id, name) VALUES
('us','United States'),
('in','India'),
('uk','United Kingdom'),
('ca','Canada'),
('au','Australia'),
('sg','Singapore')
ON CONFLICT (id) DO NOTHING;


INSERT INTO states (id, name, country_id) VALUES
-- USA
('ca','California','us'),
('ny','New York','us'),
('tx','Texas','us'),
('fl','Florida','us'),
('il','Illinois','us'),

-- INDIA
('mh','Maharashtra','in'),
('ka','Karnataka','in'),
('dl','Delhi','in'),
('tn','Tamil Nadu','in'),
('wb','West Bengal','in'),

-- UK
('eng','England','uk'),
('sct','Scotland','uk'),
('wls','Wales','uk'),
('nir','Northern Ireland','uk'),

-- CANADA
('on','Ontario','ca'),
('qc','Quebec','ca'),
('bc','British Columbia','ca'),
('ab','Alberta','ca'),

-- AUSTRALIA
('nsw','New South Wales','au'),
('vic','Victoria','au'),
('qld','Queensland','au'),
('wa','Western Australia','au'),

-- SINGAPORE
('sgc','Singapore Central','sg'),
('sge','Singapore East','sg'),
('sgw','Singapore West','sg'),
('sgn','Singapore North','sg'),
('sgs','Singapore South','sg')
ON CONFLICT (id) DO NOTHING;


INSERT INTO cities (id, name, state_id) VALUES
-- California
('la','Los Angeles','ca'),
('sf','San Francisco','ca'),
('sd','San Diego','ca'),
('sj','San Jose','ca'),

-- New York
('nyc','New York City','ny'),
('buf','Buffalo','ny'),
('roc','Rochester','ny'),

-- Texas
('hou','Houston','tx'),
('dal','Dallas','tx'),
('aus','Austin','tx'),
('sa','San Antonio','tx'),

-- Tamil Nadu
('che','Chennai','tn'),
('coi','Coimbatore','tn'),
('mad','Madurai','tn'),

-- Karnataka
('blr','Bangalore','ka'),
('mys','Mysore','ka'),
('man','Mangalore','ka'),

-- Maharashtra
('mum','Mumbai','mh'),
('pun','Pune','mh'),
('nag','Nagpur','mh'),

-- Singapore Central
('orc','Orchard','sgc'),
('mar','Marina Bay','sgc'),
('bug','Bugis','sgc')
ON CONFLICT (id) DO NOTHING;
