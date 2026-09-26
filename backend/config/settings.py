# Django settings for the backend project.
#path and os modules are used to handle file paths and environment variables in a platform-independent way.
#in simple words, the path module helps you work with file paths, and the os module allows you to access environment variables 
# and perform operating system-related tasks.
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent # BASE_DIR is a variable that represents the base directory of the Django project. 
#It is used to construct file paths relative to the project's root directory. This is useful for referencing files and directories within 
# the project without hardcoding absolute paths, making the code more portable and easier to maintain.
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'development-only-secret-key-change-me-32')
DEBUG = os.getenv('DJANGO_DEBUG', '1') == '1'
ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1,testserver').split(',')

# apps in here are the components of your Django project that provide specific functionality. Each app is a self-contained module that can be reused across different projects. For example, you might have an app for user authentication, another for managing blog posts, and so on. By organizing your project into apps, you can keep your code modular and maintainable.
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'accounts',
    'departments',
    'employees',
    'leaves',
    'attendance',
    'announcements',
    'payroll',
    'dashboard',
]
# what and why is middle ware? in simple terms, middleware is a way to process requests globally before they reach 
# the view or after the view has processed them. It acts as a bridge between the request and response, allowing you 
# to modify or handle requests and responses in a centralized manner. For example, middleware can be used for authentication, 
# logging, session management, and more.
#for example, the 'corsheaders.middleware.CorsMiddleware' middleware is used to handle Cross-Origin Resource Sharing (CORS)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
# what is template in simple terms, a template is a file that defines the structure and layout of a web page. 
# It contains placeholders for dynamic content, which can be filled in with data from the server. In Django, 
# templates are used to generate HTML pages that are sent to the user's browser. They allow you to separate the 
# presentation layer (HTML) from the business logic (Python code), making it easier to manage and maintain your web application.
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [], 
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]
WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.getenv('DB_NAME', BASE_DIR / 'db.sqlite3'),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', ''),
    }
}

AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
# Files used by Django itself, including the Django Admin CSS and JavaScript.
# `collectstatic` copies them here; Nginx serves this directory in Docker.
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'accounts.User'
CORS_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}
