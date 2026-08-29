-- ==============================================================================
-- CTARTech-AIControlPlane (ITCowboy Guard) - PostgreSQL Schema (Vercel Postgres / Neon)
-- ==============================================================================

-- 1. Table: Tenants / Organizations
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'STARTER', -- STARTER, PROFESSIONAL, ENTERPRISE, GOVERNMENT
    delivery_mode VARCHAR(50) NOT NULL DEFAULT 'CLOUD', -- CLOUD, AIRGAP
    license_key TEXT,
    max_quota BIGINT NOT NULL DEFAULT 100000,
    used_quota BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: AI Agents Registry
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    task_description TEXT,
    max_limit NUMERIC(15, 2) NOT NULL DEFAULT 500000.00, -- Default Rp 500.000
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, KILLED, SUSPENDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table: Human-in-the-Loop Approvals (HELD Queue)
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_id VARCHAR(100) UNIQUE NOT NULL,
    agent_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_system VARCHAR(255) NOT NULL,
    amount NUMERIC(15, 2),
    context JSONB NOT NULL DEFAULT '{}'::jsonb,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    resolved_by VARCHAR(255),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: Immutable Audit Trail Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id VARCHAR(100) UNIQUE NOT NULL,
    agent_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    decision VARCHAR(50) NOT NULL, -- ALLOW, REQUIRE_APPROVAL, BLOCK
    reason TEXT NOT NULL,
    merkle_hash VARCHAR(128) NOT NULL,
    context JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: Notification & Gateway Settings
CREATE TABLE IF NOT EXISTS notification_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'default',
    whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
    whatsapp_phone VARCHAR(50),
    whatsapp_api_key VARCHAR(255),
    sms_enabled BOOLEAN NOT NULL DEFAULT false,
    sms_phone VARCHAR(50),
    email_enabled BOOLEAN NOT NULL DEFAULT false,
    email_address VARCHAR(255),
    smtp_host VARCHAR(255),
    smtp_port INT DEFAULT 587,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Default Agent
INSERT INTO agents (agent_id, name, owner, task_description, max_limit, status)
VALUES (
    'agent_finance_01',
    'Finance Payment Agent',
    'Finance Department',
    'Default seeded autonomous refund and payment agent',
    500000.00,
    'ACTIVE'
) ON CONFLICT (agent_id) DO NOTHING;

-- Seed Initial Default Tenant
INSERT INTO tenants (name, slug, tier, max_quota, delivery_mode)
VALUES (
    'PT Bank Central Enterprise Tbk',
    'pt_bank_central_enterprise',
    'ENTERPRISE',
    1000000,
    'CLOUD'
) ON CONFLICT (slug) DO NOTHING;
