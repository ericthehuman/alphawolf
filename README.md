# alphawolf


# Install instructions 

Do the normal clone git instructions. When in the correct directory, type "meteor" into the terminal. This is the general build command you'll use to start up the app. 

The first time you do this you'll get a whole bunch of errors because you don't have the right packages installed. You should get instructions on what packages to install in the terminal. 

# Known Issues

Some people are having trouble displaying API information, i.e. when you click Go with something selected, the average return should show up in the below tile. It works on my copy, so it's most likely to do with a package that enables reactivity. 

Otherwise, right now data is stored in server-side collection, which all stats and graphs use as the source of information. This temporary data will be moved to a "reactive" variable instead of a collection, but it should be fine for now.

# How the App is arranged


### server/main.js

* Has the http call, as this can only happen server-side. 

### client/main.css

* All of the css for the web app.

### imports/api/data.js

* creating server-side data collections

### imports/ui/App.jsx

* the top level UI component. This UI component gets all its data from the monogoDB, which is initially defined in imports/api/data.js. 

### imports/ui/Tile.jsx

* lower level UI component 
