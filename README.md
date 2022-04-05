# RestTask

## Instalation process

git clone https://github.com/mrksfon/RestTask.git

run : cd RestTask/

## Front end part

open terminal

navigate to frontend folder - on ubuntu cd frontend/

run : npm i && npm start - in root of your frontend folder and you are all done with frontend

## Back end part

open terminal

navigate to backend folder - on ubuntu cd backend/

run : composer install

copy the .env.example file - on ubuntu cp .env.example > .env

configure the .env file

APP_NAME=Laravel <br/>
APP_ENV=local <br/>
APP_KEY= <br/>
APP_DEBUG=true <br/>
APP_URL=http://localhost<br/>

LOG_CHANNEL=stack <br/>
LOG_DEPRECATIONS_CHANNEL=null <br/>
LOG_LEVEL=debug <br/>

DB_CONNECTION=mysql <br/>
DB_HOST=127.0.0.1 <br/>
DB_PORT=3306 <br/>
DB_DATABASE={your_database_name} <br/>
DB_USERNAME={your_user} <br/>
DB_PASSWORD={your_password_if_you_have_one} <br/>

BROADCAST_DRIVER=pusher <br/>
CACHE_DRIVER=file <br/>
FILESYSTEM_DRIVER=local <br/>
QUEUE_CONNECTION=database <br/>
SESSION_DRIVER=file <br/>
SESSION_LIFETIME=120<br/>

MEMCACHED_HOST=127.0.0.1<br/>

REDIS_HOST=127.0.0.1<br/>
REDIS_PASSWORD=null<br/>
REDIS_PORT=6379<br/>

MAIL_MAILER=smtp<br/>
MAIL_HOST=mailhog<br/>
MAIL_PORT=1025<br/>
MAIL_USERNAME=null<br/>
MAIL_PASSWORD=null<br/>
MAIL_ENCRYPTION=null<br/>
MAIL_FROM_ADDRESS=null<br/>
MAIL_FROM_NAME="${APP_NAME}"<br/>

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
