# challenge

We already believe that you know how to code. This code challenge is to let us know if you can jump into a code base and make some sense of everything. We're not looking for the most complete solution, just simple, clean code that gets the job done. We want to see you _shine_, so please spend your time on the parts you can improve the most in the limited time frame.

Please do not spend more than 3 hours total (including research and setup). We really want to respect your time.

## Setting up (approx 15 minutes)

Please install [postgres](https://wiki.postgresql.org/wiki/Homebrew) and postgis locally.

Then create your local db

`createdb logistimatics`

and

`psql -f schema/init.sql logistimatics`

and

`psql -f schema/seed.sql logistimatics`

## Logging in and poking around (approx 20 minutes)

In separate terminals, do

`yarn start:server`

and

`yarn start:client`

You should be able to see the GraphQL schema at [http://localhost:5002/graphiql](http://localhost:5002/graphiql)

You should also see a login page at [http://localhost:3000/](http://localhost:3000/). You can log in with the username `demo@logistimatics.com` and password `demo`.

Once logged in, you should see the location of one GPS tracker. The JWT login token can be fetched via `localStorage.getItem('token')`. You can set the Authorization header in GraphIQL to `Bearer _token_here_` to play with the API.

## What to do (approx 2-3 hours)

1. The map is blank, change it to display marker positions
2. After that, adjust it so that it shows the whole track from the logistimatics.position table.
3. The track is pretty messy since it covers multiple days of travel. Please find a way for the user to page through the tracking history 1 day at a time. Note that the auto-generated API does not allow for bounded queries (i.e. between two timestamps), so you need to figure out a way (either server side or client side) to sort through locations based on time.

## Wrapping up

Please email ricardo@gpx.co with a link to your cloned repo when you finish
