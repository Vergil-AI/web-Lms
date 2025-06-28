<!-- STRUKTUR FOLDER V1 -->
Website-LMS-Altair-EDU/
├── app.py
├── config.py
├── extensions.py
├── create_db.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
├── run.py                    # Opsional: script startup
|
├── instance/
│   └── altair_edu.db        # Hanya satu file DB
|
├── migrations/              # Untuk Flask-Migrate
│   └── ...
|
├── models/
│   └── user.py
|
├── api/                     # Backend routing dan logic
│   ├── __init__.py
│   ├── auth.py
│   ├── badge.py
│   ├── dashboard.py
│   ├── guild.py
│   ├── leaderboard.py
│   ├── progress.py
│   ├── quest.py
│   └── services/            # Business logic jika dibutuhkan
│       └── progress_service.py
|
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── forgot_password.html
│   ├── includes/
│   │   ├── navbar.html
│   │   └── sidebar.html
│   ├── belajar/
│   │   ├── html/
│   │   ├── css/
│   │   ├── php/
│   │   └── javascript/
│   │       ├── pengenalan-javascript.html
│   │       ├── sintaks-dasar.html
│   │       └── ...
│   └── dashboard_user/
│       └── dashboard_section.html
|
├── assets/                  
│   ├── css/
│   │   ├── style.css
│   │   └── modul-js/
│   │       └── pengenalan.css
│   ├── js/
│   │   ├── gamifikasi.js
│   │   ├── dashboard.js
│   │   ├── auth.js
|   |   └── ...
│   │   └── ...
│   ├── images/
│   │   ├── icon-small/
│   │   └── ...
│   ├── gifs/
│   ├── fonts/
│   └── dist/                # Output dari bundling Vite
│       └── assets/
│           └── pengenalan-xxxx.js
|
├── frontend/                # Source bundler
│   └── js/
│       ├── pengenalan.js
│       └── utils/
│           └── validator.js
├── admin/                   # Khusus halaman admin
│   ├── add_modul.html
│   ├── add_quiz.html
│   └── admin_panel.html
├── ai_persona/             # AI asisten
│   ├── nova.html
│   ├── algoritmi.html
│   └── media/
├── list-progress/          # Dokumentasi perkembangan
│   └── 24-juni-2025.md
│   └── progress.md
|
├── references/             # Folder eksperimen
│   └── ...
├── node_modules/
├── package.json
├── package-lock.json
└── vite.config.js


<!-- STRUKTUR FOLDER V2 -->
/web-lms/
├── public/                    # static public assets (served directly)
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── login.html
│   ├── register.html
│   └── favicon.ico
│
├── src/                       # source code
│   ├── assets/                # images, fonts, videos
│   │   ├── images/
│   │   ├── fonts/
│   │   └── videos/
│   │
│   ├── components/            # reusable HTML or JS components
│   │   ├── Header.html
│   │   ├── Footer.html
│   │   └── ModuleCard.html
│   │
│   ├── data/                  # JSON data or mock data
│   │   ├── modules.json
│   │   ├── leaderboard.json
│   │   └── user_progress.json
│   │
│   ├── pages/                 # separate page layouts
│   │   ├── dashboard/
│   │   │   ├── Dashboard.html
│   │   │   ├── Profile.html
│   │   │   ├── Progress.html
│   │   │   └── Quests.html
│   │   │
│   │   ├── admin/
│   │   │   ├── Dashboard.html
│   │   │   ├── AddModule.html
│   │   │   └── Analytics.html
│   │   │
│   │   ├── klan/
│   │   │   ├── Klan.html
│   │   │   └── Leaderboard.html
│   │   │
│   │   ├── ai/
│   │   │   ├── Nova.html
│   │   │   └── Algorhizmi.html
│   │   │
│   │   └── gamification/
│   │       ├── Badges.html
│   │       └── Leaderboard.html
│   │
│   ├── scripts/               # JavaScript logic
│   │   ├── auth/
│   │   │   ├── login.js
│   │   │   └── register.js
│   │   ├── dashboard.js
│   │   ├── xpTracker.js
│   │   └── gamification.js
│   │
│   └── styles/                # CSS / SCSS
│       ├── base.css
│       ├── dashboard.css
│       ├── auth.css
│       └── gamification.css
│
├── server/                    # (future) backend code if you add Node/Flask
│   ├── app.js
│   └── routes/
│
├── package.json               # future npm project
├── vite.config.js             # (or webpack.config.js)
├── README.md
└── .gitignore
