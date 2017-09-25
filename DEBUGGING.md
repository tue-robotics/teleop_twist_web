teleop_twist_web
===============
Remote debugging guide
----------------------

First make sure you have both npm and nodejs installed

`npm -v`
`node -v`

Install weinre on the computer you want to run the debugger on
`sudo npm -g install weinre`

Run weinre on the computer that also runs the webserver
`weinre --boundHost -all-`

Go to your mobile website and add `?debug` to the URL. This will
connect your phone to the weinre debugging service.

Visit the debugger in your browser e.g. http://localhost:8080
