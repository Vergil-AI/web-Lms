from flask import Flask, render_template, redirect, url_for, abort, request
from flask_login import LoginManager, login_required, current_user, logout_user
from flask_migrate import Migrate
from extensions import db
from models.user import User, UserModul
from api.auth import auth_bp, init_oauth
from werkzeug.utils import safe_join
from dotenv import load_dotenv
from datetime import datetime
from collections import defaultdict
import os
import re

def create_app():
    load_dotenv()

    app = Flask(__name__, static_folder='assets', template_folder='templates')
    app.secret_key = os.getenv("SECRET_KEY", "fallbacksecretkey")
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///altair_edu.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate = Migrate(app, db)
    init_oauth(app)

    login_manager = LoginManager()
    login_manager.login_view = 'login_page'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    app.register_blueprint(auth_bp)

    # === UTILITY ===
    def get_topik_icon_kecil(topik):
        return {
            "javascript": url_for('static', filename='images/icon-small/javascript.png'),
            "python": url_for('static', filename='images/icon-small/python.png'),
            "html": url_for('static', filename='images/icon-small/html.png'),
            "css": url_for('static', filename='images/icon-small/css.png'),
            "php": url_for('static', filename='images/icon-small/php.png')
        }.get(topik, url_for('static', filename='images/icon-small/module-icon.png'))

    # ========== ROUTING ==========

    @app.route('/')
    def index():
        return redirect(url_for('dashboard')) if current_user.is_authenticated else render_template('index.html')

    @app.route('/login')
    def login_page():
        return render_template('login.html')

    @app.route('/register')
    def register_page():
        return render_template('register.html')

    @app.route('/dashboard', strict_slashes=False)
    @login_required
    def dashboard():
        TOPIK_MODUL = {
            "javascript": [
                "pengenalan-javascript", "sintaks-dasar", "tipe-data", "operator",
                "flowcontrol", "functions", "array-string", "objects",
                "dom-manipulation", "event-handling",
                "scope-closure", "asynchronous", "fitur-es6-plus", "oop",
                "error-handling", "modular-js", "browser-api",
                "advanced-functions", "event-loop", "advanced-oop", "memory-management",
                "advanced-async", "testing-debugging", "build-tools",
                "keamanan-js", "integrasi-framework"
            ],
            "python": ["pengenalan", "fungsi", "list", "looping"],
            "html": [],
            "css": [],
            "php": []
        }

        moduls = UserModul.query.filter_by(user_id=current_user.id).all()
        topik_progress = defaultdict(list)
        last_access = {}

        for m in moduls:
            topik_progress[m.topik].append(m.submodul)
            last_access[m.topik] = m.submodul

        current_modules = []
        for topik, semua_sub in TOPIK_MODUL.items():
            selesai = len(set(topik_progress.get(topik, [])))
            total = len(semua_sub)
            if total == 0:
                continue
            if selesai > 0 and selesai < total:
                percent = int((selesai / total) * 100)
                sub_last = last_access.get(topik, "?").replace("-", " ").capitalize()
                current_modules.append({
                    "title": topik.capitalize(),
                    "progress": percent,
                    "last": sub_last,
                    "link": f"/belajar/{topik}",
                    "icon": get_topik_icon_kecil(topik)
                })

        user_data = {
            "username": current_user.username,
            "xp": current_user.xp,
            "level": current_user.level,
            "streak": current_user.streak,
            "last_module": current_user.last_module,
            "active_quests": current_user.active_quests,
            "current_modules": current_modules
        }

        return render_template("dashboard.html", user=user_data)

    @app.route('/profile/')
    @login_required
    def profile():
        return render_template('profile.html', user=current_user)

    @app.route('/logout', methods=['POST'])
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('index'))

    # ========== MODUL BELAJAR ==========

    @app.route('/belajar/javascript/')
    @login_required
    def belajar_javascript():
        return render_template('belajar/javascript.html')

    @app.route('/belajar/math/')
    @login_required
    def belajar_math():
        return render_template('belajar/math.html')

    @app.route('/belajar/javascript_modul/<submodul>/', strict_slashes=False)
    @login_required
    def belajar_javascript_modul(submodul):
        if not re.fullmatch(r'[a-zA-Z0-9_-]+', submodul):
            abort(404)

        topik = "javascript"
        filename = f'{submodul}.html'
        path = safe_join('belajar/javascript_modul', filename)
        full_path = os.path.join(app.template_folder, path)

        if not os.path.exists(full_path):
            abort(404)

        entry = UserModul.query.filter_by(
            user_id=current_user.id,
            topik=topik,
            submodul=submodul
        ).first()

        if not entry:
            entry = UserModul(
                user_id=current_user.id,
                topik=topik,
                submodul=submodul,
                progress=0,
                last_accessed=datetime.utcnow()
            )
            db.session.add(entry)
        else:
            entry.last_accessed = datetime.utcnow()

        db.session.commit()
        return render_template(path)

    @app.route('/update_progress/<topik>/<submodul>', methods=['POST'])
    @login_required
    def update_submodul(topik, submodul):
        entry = UserModul.query.filter_by(
            user_id=current_user.id,
            topik=topik,
            submodul=submodul
        ).first()

        if not entry:
            entry = UserModul(
                user_id=current_user.id,
                topik=topik,
                submodul=submodul,
                progress=100,
                last_accessed=datetime.utcnow()
            )
            db.session.add(entry)
        else:
            entry.progress = 100
            entry.last_accessed = datetime.utcnow()

        db.session.commit()
        return "OK", 200

    # SEO
    @app.route('/robots.txt')
    def robots_txt():
        return "User-agent: *\nDisallow:", 200, {'Content-Type': 'text/plain'}

    @app.route('/favicon.ico')
    def favicon():
        return "", 204

    # INIT DB
    with app.app_context():
        db.create_all()

    return app

# Start app
app = create_app()
