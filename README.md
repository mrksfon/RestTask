# RestTask

## Instalation process

git clone https://github.com/mrksfon/RestTask.git

## Front end part

navigate to frontend folder - on ubuntu cd frontend

run : npm i && npm start - and you are all done with frontend

## Back end part

navigate to backend folder - on ubuntu cd backend

run : composer install

copy the .env.example file - on ubuntu cp .env.example > .env

configure the .env file

APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE={your_database_name}
DB_USERNAME={your_user}
DB_PASSWORD={your_password_if_you_have_one}

BROADCAST_DRIVER=pusher
CACHE_DRIVER=file
FILESYSTEM_DRIVER=local
QUEUE_CONNECTION=database
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=null
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=1372177
PUSHER_APP_KEY=7d6ecbfcd70311ae6027
PUSHER_APP_SECRET=c7759449a3af21cca751
PUSHER_APP_CLUSTER=eu

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"

run : php artisan key:generate - to generate application key

run : php artisan migrate --seed

open your terminal in root of backend folder

run : php artisan serve - to start api

run : php artisan queue:work - to start queue
