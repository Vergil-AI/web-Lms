# filepath: auth.py
from flask import Blueprint, request, jsonify, redirect, render_template, url_for, session
from flask_login import login_user, logout_user, current_user
from models.user import User
from extensions import db
from werkzeug.security import check_password_hash, generate_password_hash
from authlib.integrations.flask_client import OAuth
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

auth_bp = Blueprint('auth', __name__)

# Initialize OAuth
oauth = OAuth()

def init_oauth(app):
    oauth.init_app(app)
    
    # Google OAuth configuration
    google = oauth.register(
        name='google',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid_connect_configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )
    return google

# LOGIN (POST) - AJAX
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('username')
    password = data.get('password')
    remember = data.get('remember', False)
    
    if not username_or_email or not password:
        return jsonify({'success': False, 'message': 'Username dan password wajib diisi'}), 400
    
    user = User.query.filter(
        (User.username == username_or_email) | (User.email == username_or_email)
    ).first()
    
    if user and user.password and check_password_hash(user.password, password):
        login_user(user, remember=remember)
        return jsonify({'success': True, 'redirect': '/dashboard'})
    else:
        return jsonify({'success': False, 'message': 'Username atau password salah'}), 401

# GOOGLE LOGIN
@auth_bp.route('/login/google')
def google_login():
    google = oauth.google
    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

# GOOGLE REGISTER
@auth_bp.route('/register/google')
def google_register():
    # Set flag to indicate this is registration flow
    session['google_flow'] = 'register'
    google = oauth.google
    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

# GOOGLE CALLBACK
@auth_bp.route('/callback/google')
def google_callback():
    try:
        google = oauth.google
        token = google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            return redirect('/login?error=google_auth_failed')
        
        email = user_info.get('email')
        name = user_info.get('name')
        avatar_url = user_info.get('picture')
        
        if not email:
            return redirect('/login?error=no_email_from_google')
        
        # Check if user exists
        existing_user = User.query.filter_by(email=email).first()
        
        # Get flow type (login or register)
        flow_type = session.pop('google_flow', 'login')
        
        if existing_user:
            if flow_type == 'register':
                # User trying to register with existing email
                return redirect('/register?error=email_already_exists')
            else:
                # Login existing user
                login_user(existing_user, remember=True)
                return redirect('/dashboard')
        else:
            if flow_type == 'login':
                # User trying to login but account doesn't exist
                return redirect('/login?error=account_not_found')
            else:
                # Create new user for registration
                # Generate unique username from email
                base_username = email.split('@')[0]
                username = base_username
                counter = 1
                
                while User.query.filter_by(username=username).first():
                    username = f"{base_username}{counter}"
                    counter += 1
                
                new_user = User(
                    username=username,
                    email=email,
                    password=None,  # No password for Google users
                    avatar_url=avatar_url
                )
                
                db.session.add(new_user)
                db.session.commit()
                
                login_user(new_user, remember=True)
                return redirect('/dashboard?welcome=true')
                
    except Exception as e:
        print(f"Google OAuth error: {e}")
        return redirect('/login?error=oauth_error')

# LOGOUT
@auth_bp.route('/logout')
def logout():
    logout_user()
    return redirect('/')

# REGISTER (POST) - AJAX
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'success': False, 'message': 'Semua field wajib diisi'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email sudah terdaftar'}), 400
    
    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'message': 'Username sudah terdaftar'}), 400
    
    hashed_pw = generate_password_hash(password)
    user = User(username=username, email=email, password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    
    login_user(user)
    return jsonify({'success': True, 'redirect': '/dashboard'})

# LUPA PASSWORD (GET & POST)
@auth_bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'GET':
        return render_template('forgot_password.html')
    # POST: proses permintaan reset password (belum diimplementasikan)
    return jsonify({'success': False, 'message': 'Fitur belum tersedia.'}), 501