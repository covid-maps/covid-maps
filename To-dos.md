Update form fields on Submit Page - Sanjeev 

UI Clean up - Sanjeev

Integrate with DB - Google Sheets/Airtable - Arjun 

For v1 we can skip search bar and just have a Map where the list of pins update as you move the map. These pins correspond to geohashes from the DB. There is only one location card shown by default, which is the pin closest to your current location. If a user cliks on a differnet pin, it opens up the corresponding location card. If user moves the map, the list of pins updates on the map. If we decide to go with this approach - 

a) Pull relevant geohash data from database and show it as Pins on the Map. Pins update as maps move

b) Show a location card on Home Screen corresponding to the chosen pin on map (or closest pin if no pin is chosen)

c) Pull relevant information fields on location card from G Maps (Timings, distance, etc.)

d) Pull relevant information fields on location card from DB (category, review responses organized by time)

e) Add an 'Update' action on the location card that takes you to the Submit page with location pre-filled 
