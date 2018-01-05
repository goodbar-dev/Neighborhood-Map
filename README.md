# Neighborhood-Map

## How To Run

This website is meant to run in any modern browser with internet access.

###### To run the site, navigate to the 'dist' folder and open index.html in any modern browser.

For development purposes, the website utilizes gulp:

- Production code is located in 'dist' folder (DO NOT change manually)
- Development code is located in 'src' folder (make any edits here and let gulp deploy to 'dist' folder)

To setup development workstation:

1. Ensure Node Package Manager (NPM) is installed.
2. Ensure gulp is installed.
3. Clone/download the Neighborhood-Map git project.
4. On the command line, navigate to the location of the Neighborhood-Map project.
5. On the command line type 'gulp'.  This will populate the 'dist' folder and launch the website.  Leave this running.  If you make any changes to the files in the 'src' directory, the site will automatically reload with the latest content.  

Note:  To stop gulp without closing the command window, press 'CTRL+C' and enter 'Y'

## Attributions:

This application utilizes the below libraries (retrieved via Bower):

- KnockoutJS 3.4.2
- JQuery 3.2.1
- Bootstrap v4

This application utilizes the below API's:

- Google Maps API (for the map)
- Google Places API (for the detail pop-up window)
- Wikipedia API (for the detail pop-up window)
