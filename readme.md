# Avishay Final test for guesty.com

What I was asked to do is to create a demand heat map of a major city that has more than 4,000 Airbnb listing.
I decided to build Express Rest server that can execute the following commands:

[Generate Complete List of all city listing](http://localohost:3000/generateListingsList) - This will connect to a MongoDB DB and inserting listing to DB (Paris have 4952 Listings) 
[Calculate the occupation of each Listing](http://localohost:3000/calculateOccupation) - Once all listing was uploaded to the Db this will calculate occupation score and set it to the DB
[You can get Back all The listing in the DB](http://localohost:3000/getAllListings) - This lets the UI show the supply heatmap.
[You can get Back The listings that pass the demand test](http://localohost:3000/getOnlyDemandedListings) - This lets the UI show the demand heatmap. (In Paris out of 4952 it gives back 942 results)
[You can see a map with both supply and demand heatmap](http://localohost:3000/showMap) - This lets you see the final results.

## The demand algorithm 

The demand is calculated by showing only listings that follow the next condition:
* It has at least 5 reviews with a total score of at least 4.
* The price for a night is above city average (Paris is 88 USD).
* It's future occupation is at least 75%.


# A small note
I am sorry but my code has not been unit tested. It's not my best work and best practice but I think it's OK for a test.
I worked on this test after my main job on late hours when the brain is not fully functional. 