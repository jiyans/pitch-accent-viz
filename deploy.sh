REMOTE_HOST="jiyanjs"
APP_DIR="/home/ubuntu/websites/pitch-accent-viz"

echo "Starting deployment..."

ssh -t $REMOTE_HOST "
    cd $APP_DIR || exit 1;
    echo 'Current directory:' \$(pwd);

    echo 'Setting build permissions...';
    sudo chown -R ubuntu:ubuntu .;

    echo 'Pulling latest changes...';
    git pull;

    echo 'Installing dependencies...';
    \$HOME/.bun/bin/bun install;

    echo 'Removing old build...';
    [ -d dist ] && sudo rm -rf dist;

    echo 'Building application...';
    \$HOME/.bun/bin/bun run build;

    echo 'Setting nginx permissions...';
    sudo chown -R www-data:www-data dist/;
    sudo chmod -R 755 dist/;

    echo 'Done!';
"
