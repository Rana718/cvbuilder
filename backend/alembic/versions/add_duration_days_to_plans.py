"""Add duration_days to plans table

Revision ID: add_duration_days
Revises: 15f84c9a9af9
Create Date: 2025-01-15 04:15:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

# revision identifiers
revision = 'add_duration_days'
down_revision = '15f84c9a9af9'  # Latest revision
branch_labels = None
depends_on = None

def upgrade():
    # Check if column exists before adding
    connection = op.get_bind()
    result = connection.execute(text("""
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_name = 'plans' 
        AND column_name = 'duration_days'
        AND table_schema = DATABASE()
    """))
    
    column_exists = result.fetchone()[0] > 0
    
    if not column_exists:
        # Add duration_days column with default value
        op.add_column('plans', sa.Column('duration_days', sa.Integer(), nullable=False, server_default='30'))
        
        # Update existing data based on interval (using backticks for reserved keyword)
        op.execute("""
            UPDATE plans 
            SET duration_days = CASE 
                WHEN `interval` = 'monthly' THEN 30
                WHEN `interval` = 'yearly' THEN 365
                WHEN `interval` = 'weekly' THEN 7
                ELSE 30
            END
        """)
    else:
        # Column exists, just update values if needed
        op.execute("""
            UPDATE plans 
            SET duration_days = CASE 
                WHEN `interval` = 'monthly' THEN 30
                WHEN `interval` = 'yearly' THEN 365
                WHEN `interval` = 'weekly' THEN 7
                ELSE 30
            END
            WHERE duration_days IS NULL OR duration_days = 0
        """)

def downgrade():
    # Remove the column if needed to rollback
    op.drop_column('plans', 'duration_days')
