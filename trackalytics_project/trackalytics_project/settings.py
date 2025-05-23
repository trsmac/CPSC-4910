from pathlib import Path
import os

# ─────────────────────────────────────────────
#               Base Directory
# ─────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent.parent


# ─────────────────────────────────────────────
#               Security Settings
# ─────────────────────────────────────────────

SECRET_KEY = 'django-insecure-please-replace-this-with-a-secure-key'
DEBUG = True
ALLOWED_HOSTS = ['*', '.app.github.dev']


# ─────────────────────────────────────────────
#               Installed Applications
# ─────────────────────────────────────────────

INSTALLED_APPS = [
    # Django core apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Project app
    'trackalytics.apps.TrackalyticsConfig',

    # Real-time support
    'channels',
]


# ─────────────────────────────────────────────
#                   Middleware
# ─────────────────────────────────────────────

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # For serving static files in production
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ─────────────────────────────────────────────
#               URL Configuration
# ─────────────────────────────────────────────

ROOT_URLCONF = 'trackalytics_project.urls'


# ─────────────────────────────────────────────
#                   Templates
# ─────────────────────────────────────────────

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'trackalytics/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# ─────────────────────────────────────────────
#               WSGI / ASGI Config
# ─────────────────────────────────────────────

WSGI_APPLICATION = 'trackalytics_project.wsgi.application'
ASGI_APPLICATION = 'trackalytics_project.asgi.application'


# ─────────────────────────────────────────────
#              Channels Layer (Realtime)
# ─────────────────────────────────────────────

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    }
}


# ─────────────────────────────────────────────
#                  Database
# ─────────────────────────────────────────────

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ─────────────────────────────────────────────
#           Password Validation
# ─────────────────────────────────────────────

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ─────────────────────────────────────────────
#             Internationalization
# ─────────────────────────────────────────────

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
USE_L10N = True

# ─────────────────────────────────────────────
#                Static Files
# ─────────────────────────────────────────────

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'trackalytics/static']
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
STATIC_ROOT = BASE_DIR / 'staticfiles'


# ─────────────────────────────────────────────
#        Default Primary Key Field Type
# ─────────────────────────────────────────────

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ─────────────────────────────────────────────
#           Custom User Authentication
# ─────────────────────────────────────────────

AUTH_USER_MODEL = 'trackalytics.CustomUser'

LOGIN_URL = 'trackalytics:login'
LOGIN_REDIRECT_URL = 'trackalytics:main_dashboard'
LOGOUT_REDIRECT_URL = 'trackalytics:login'


# ─────────────────────────────────────────────
#                Email Backend
# ─────────────────────────────────────────────

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = 'localhost'
EMAIL_PORT = 25
EMAIL_USE_TLS = False
DEFAULT_FROM_EMAIL = 'noreply@trackalytics.com'


# ─────────────────────────────────────────────
#             CSRF Trusted Origins
# ─────────────────────────────────────────────

CSRF_TRUSTED_ORIGINS = [
    'https://*.app.github.dev',
    'http://localhost:8000',
    'https://localhost:8000',
]


# ─────────────────────────────────────────────
#                Session Settings
# ─────────────────────────────────────────────

SESSION_COOKIE_AGE = 7200  # 2 hours
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
