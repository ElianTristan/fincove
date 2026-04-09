-- Create tables
CREATE TABLE IF NOT EXISTS families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    invite_code VARCHAR(6) UNIQUE NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    type VARCHAR(20) DEFAULT 'expense',
    payment_method VARCHAR(20) DEFAULT 'cash',
    installments INTEGER DEFAULT 1,
    current_installment INTEGER DEFAULT 1,
    due_date DATE,
    receipt_url TEXT,
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tandas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    participants INTEGER NOT NULL,
    frequency VARCHAR(20) DEFAULT 'weekly',
    status VARCHAR(20) DEFAULT 'active',
    start_date DATE NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tanda_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanda_id UUID REFERENCES tandas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    turn_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    UNIQUE(tanda_id, user_id)
);

CREATE TABLE IF NOT EXISTS vault_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    extracted_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanda_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Families: Users can view families they belong to
CREATE POLICY "Users can view their families" ON families
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = id AND user_id = auth.uid()
        ) OR created_by = auth.uid()
    );

CREATE POLICY "Users can create families" ON families
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Family admins can update" ON families
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = id AND user_id = auth.uid() AND role = 'admin'
        ) OR created_by = auth.uid()
    );

-- Family Members
CREATE POLICY "Family members visible to family" ON family_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members fm
            WHERE fm.family_id = family_id AND fm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join with invite code" ON family_members
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Expenses
CREATE POLICY "Expenses visible to family" ON expenses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = expenses.family_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Family members can create expenses" ON expenses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = expenses.family_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Creators can update expenses" ON expenses
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Creators can delete expenses" ON expenses
    FOR DELETE USING (created_by = auth.uid());

-- Tandas
CREATE POLICY "Tandas visible to family" ON tandas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = tandas.family_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Family members can create tandas" ON tandas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = tandas.family_id AND user_id = auth.uid()
        )
    );

-- Vault Items
CREATE POLICY "Vault items visible to family" ON vault_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = vault_items.family_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Family members can upload" ON vault_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_id = vault_items.family_id AND user_id = auth.uid()
        ) AND uploaded_by = auth.uid()
    );

-- Notifications
CREATE POLICY "Users see own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS VARCHAR(6) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(6) := '';
    i INTEGER;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate invite code automatically
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invite_code IS NULL THEN
        NEW.invite_code := generate_invite_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invite_code
    BEFORE INSERT ON families
    FOR EACH ROW
    EXECUTE FUNCTION set_invite_code();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER families_updated_at
    BEFORE UPDATE ON families
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
