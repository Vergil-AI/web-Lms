from extensions import db
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    # Identitas dasar
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=True)  # Kosong jika OAuth
    avatar_url = db.Column(db.String(256), nullable=True)

    # Data untuk dashboard
    level = db.Column(db.Integer, default=1)
    xp = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)
    ranking = db.Column(db.Integer, default=0)
    progress = db.Column(db.Integer, default=0)  # Persentase total belajar
    last_module = db.Column(db.String(100), nullable=True)
    active_quests = db.Column(db.Integer, default=0)  # 🔜 bisa jadi relasi ke UserQuest

    # Reset password
    reset_token = db.Column(db.String(128), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)

    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relasi ke progress modul
    moduls = db.relationship('UserModul', backref='user', lazy=True)

    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return f'<User {self.username}>'


class UserModul(db.Model):
    __tablename__ = 'user_moduls'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Strukturnya sekarang topik + submodul
    topik = db.Column(db.String(100), nullable=False)     # e.g. "javascript"
    submodul = db.Column(db.String(100), nullable=False)  # e.g. "variabel"

    progress = db.Column(db.Integer, default=100)  # default dianggap selesai jika langsung dicatat
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.CheckConstraint('progress >= 0 AND progress <= 100', name='check_progress_range'),
    )

    def __repr__(self):
        return f'<UserModul {self.topik}/{self.submodul} ({self.progress}%)>'
