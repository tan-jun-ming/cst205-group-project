web: hypercorn -b 0.0.0.0:80 --error-logfile - --log-level error main:app
heroku ps:scale worker=1
