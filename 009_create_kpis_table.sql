-- Create the KPIs table
CREATE TABLE IF NOT EXISTS kpis (
    kpi_id INT AUTO_INCREMENT PRIMARY KEY,           -- Unique identifier for each KPI
    kpi_name VARCHAR(255) NOT NULL,                   -- Name of the KPI (e.g., Stock Turnover Rate)
    value DECIMAL(15, 2) NOT NULL,                    -- Value of the KPI
    time_period DATE NOT NULL,                        -- Time period for the KPI (e.g., monthly, yearly)
    category VARCHAR(100),                            -- Category of the KPI (e.g., Inventory, Sales)
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Last updated timestamp
);
