"""add phone and status columns to users

Revision ID: 9f9e8cbc113f
Revises: 6e2a49bf1afa
Create Date: 2025-09-04 21:02:03.510185
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9f9e8cbc113f'
down_revision: Union[str, Sequence[str], None] = '6e2a49bf1afa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add phone column
    op.add_column(
        "users",
        sa.Column("phone", sa.String(length=20), nullable=True)
    )
    # Add status column with default 'active'
    op.add_column(
        "users",
        sa.Column("status", sa.String(length=50), nullable=True, server_default="active")
    )


def downgrade() -> None:
    op.drop_column("users", "status")
    op.drop_column("users", "phone")
