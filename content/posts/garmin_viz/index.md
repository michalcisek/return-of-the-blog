---
date: '2025-08-27T14:56:34+02:00'
draft: true
title: 'Can you turn your running data into home decor?'
ShowToc: false
ShowReadingTime: true
ShowBreadCrumbs: false
cover:
  image: "cover2.webp"
  #alt: "<alt text>"
  #caption: "Captiooon"
  relative: true # To use relative path for cover image, used in hugo Page-bundles
---


Inspiracja

I have a few posters in my home representing cities that for different reasons are important to me. Those are pretty popular posters, that looks like below:

*zdjecie plakatu oryginalnego*

I started to wonder how such posters could be customized. And picked up an idea that I could use data about my running, so that you could see road segments on which I ran.

Obviously I have some standard tracks, but also do some „running exploration” around the neighbiurhood and I moved out few times, so with different color gradient I would like to distinguish between heavily and lightly traveled segments.

Dane

Since 7 years now I own Garmin watch (actually I have two) that I wear everyday. Although I’m not a marathoner, I run pretty frequently since I was a teenager. This means there should be quite a lot of data to display.
Garmin watches store .fit files that include all details about your activities, including GPS coordinates. The issue is that you probably won’t be able to retrieve all the files from the watches directly - there is some data deletion policy, based either on storage limit or activity age. Fortunately you can access Garmin Connect website and there you can find your whole activity history.
But here arises another challenge - you can’t download all these activities at once . You can only download some summary for all activities, but this doesn’t include GPS data. What you need to to is to go to each activity and click few places to get ZIP file containing all needed data. Pretty time-consuming for few hundreds activities to process. But you can write a simple script using Selenium to automate this - and that’s what I did.
I ended up with around 800 running activities, ready to be used for further analysis and investigation.

Wstawka o transformacji danych garminowych:
To load the data for further analysis I used fitparse Python package.
In FIT files, latitude and longitude are typically stored as signed 32-bit integers in “semicircles.” Convert to decimal degrees with:
(and the inverse for writing). This applies to both latitudes and longitudes; valid ranges will naturally clip to ±90° and ±180° when converted. Garmin developer forum and GIS StackExchange discussions confirm this conversion and explain the semicircle storage rationale. 

Wizualizacja surowych punktow GPS

For this analysis, I’m focusing only on activities from Warsaw, as I have poster for this city since I live here and that obviously implies majority of running activities are there.

For interested reader: how to take into consideration only Warsaw activities?
warsaw = ox.geocode_to_gdf(WARSZAWA_QUERY)
# Some OSM places come back with multi-polygons; dissolve to single unified polygon
warsaw = warsaw.to_crs("EPSG:4326")  # ensure lat/lon
warsaw_poly = warsaw.unary_union
# filter lines that intersect Warsaw
in_warsaw_mask = gdf_lines.geometry.intersects(warsaw_poly)
gdf_warsaw_lines = gdf_lines[in_warsaw_mask].copy()

Using packages like folium, you can easily create visualization that will present all running activities as interactive map: 


This is already impressive and informative, but for our purpose, i.e. displaying those activities on paper poster, wouldn’t work visually. Why? Mostly because of GPS inaccuracies. Take a look at the map segment near my old apartment:


And it’s not like for this wide lines I ran slightly differently each time. Actually for this segment, the running route was the same: on the narrow walkway, near the tall building - probably causing most of the inaccuracies in this place (though there are many more reasons behind possible GPS inaccuracies).

Still, having such visualization is very fun and quite nostalgic. I’m surprised how accurately I’m able to recall given running session by looking at them.

Below few of them. The first one is from around 6-7 years ago, when I started to run after a longer break, it was cold January and I wanted to do short tracks while exploring beautiful Bielany district streets



The second one is when I lived near beautiful park and had quite constant track around it.

There are also few segments not connected to “main network”. Those are mainly some running races I took part in, like the example below:


And here are two interesting things: visible as zig-zags. The first one looks like I was running inside a shopping mall and is actually right, because it is related to the time when I started “outdoor training” on my watch when running on a treadmill.
The second zig-zag is related to the only time when I noticed my watch going crazy and the GPS readings were very off of my actually run (but hey, at least my watch said it was my PB 5km),


As I said, that’s actually very cool visualization, showing a lot of different stories and showing most of the runs taking place in north of Warsaw, rather than south (although that should change in the future). And almost none on the right side of Vistula river (that will probably not change in the future).

Matchowanie punktow GPS do sieci drog

I want to have a neat and tidy graphic, without “noodles” around certain places. I want to map GPS points to road segments that were used by me.

There are many approaches to achieve such mapping. I’m gonna describe two that I used:
Trivial that quickly becomes overwhelming
Complicated that quickly ends up trivial 

1st approach
The important thing to start with is to know that road networks are represented as graphs.
Graph is a collection of edges and nodes, and is a natural way to model/represent a fact that some objects are related.
For example a graph might represent a group of people with certain relationships (family connections, friendships, owing a money :D). In this example people are represented as edges, and those relationships are nodes. Here is how such graph could look like visually:

….

So getting back to road network - it obviously can be represented as a graph. Road segments are edges and intersections are nodes (that’s a bit of simplification but we can live with it).

Now, the simplest idea to match GPS points to road network is to match each GPS point to closest map edge.
So for each GPS point we:
select candidate edges close to the GPS point (obviously we don’t want to do it for all edges in road network)
calculate closest distance (in terms of Euclidean distance) to each candidate edge
return edge with minimal distance


Sounds easy and it is easy to implement with few lines of codes.

> For interested reader: which libraries you can use for it

Unfortunately there is an issue. Because of a nature of GPS points (they are noisy) and the high density of roads in city, you will end up with very weird mapping.
Almost as if you were exploring Witcher map instead of running a certain track.
Or if you would be using some kind of portal to teleport between two sides of the same road. 
Below you can find a bunch of examples: first two show you a general idea what kind of visualization we’d end up with; and the other ones show you a close look-up how such mapping compares to raw points.






This is of course unacceptable. And of course you can improve it greatly. Here are few of my ideas:
preprocess GPS points to a) remove outliers (e.g. one bad reading in a sequence) b) decrease number of points if many are close to each other c) increase number of points, by interpolation, in areas where they are far from each other d) apply some kind of filter to reduce GPS jitter
if a edge for new point is different than for previous point, select k-nearest edges (instead of one) and choose the path that minimizes cumulative route length from previous edge through candidate edge to next edge
penalize excessive turns in a route
try matching certain points to closest node, instead of edge

I tried them all and I wasn’t satisfied with the results. The upside of this approach is that it's quite simple to implement, even including the above-mentioned improvements. But this doesn’t fully utilize all information available in graph representation and that causes imperfect outcomes.

2nd approach

So 1st approach was focused mostly on sequential matching of single GPS points. It would be best if we could solve this problem considering entire trajectory sequence - that should lead to more coherent and realistic paths.

Fortunately, there is a framework for that called Hidden Markov Models (HMM). Such models allow to elegantly handle the uncertainty and noise present in GPS positioning, while considering the constraints of road networks.

HMMs consist of following elements:
Hidden States: it defines what we want to find out: true road segments that I was during a run
Observations: those are the noisy GPS measurements we have
Emission Probabilities: this is likelihood of receiving particular GPS point given the true road segments. This captures GPS accuracy - road segments closer to GPS point have higher emission probabilities, while segments farther away have lower probabilities
Transition Probabilities: this is the likelihood of moving from one road segment to another between consecutive timestamps. This incorporates such things road network connectivity and running speed constraints (you can’t teleport between unconnected roads)

Now, Hidden Markov Model doesn’t tell you directly what is the most likely sequence of hidden states (road segments). Instead, it defines a probabilistic model (relationship between hidden, true road segments and observed GPS readings) and parameters (emission and transition probabilities).  
In order to extract best answer we need to provide the inference algorithm. For this problem the best option is to use Viterbi algorithm. It provides the optimal solution method for finding the most likely sequence of hidden states. Instead of selecting most likely road segment at each timestamp, it finds the single most likely path through the hidden state sequence (true road segments).

Ok, that’s enough of theory. I believe you believe me that this approach is much more sophisticated than the first one. 
As I’m too lazy to write this from scratch, I searched for ready-to-use solutions. And I found beautiful Valhalla library which is an open source swiss army knife to use with OpenStreetMap data. The module used for map matching is called Meili.

> For interested reader: how to set up Valhalla


The configuration is rather straightforward. I changed only 3 parameters of this algorithm:
specified search radius to 50 meters - this is radius within which road segments will be searched
specified GPS accuracy to 10 meters (based on Garmin claims regarding accuracy)
set turn penalty factor to 500, which was recommended by documentation to smooth out jittering of points

Below you can find comparisons between 1st and 2nd approach for random activities (red line is 1st and green is 2nd approach; blue dots are GPS readings just to prove you once again how inaccurate 1st approach could be).




As you can see, the results are exactly what we should expect. So now, we just add one more modification.
For each activity we:
run Valhalla to do the map matching
get unique road segments (for simplicity we assume given road segments could be used maximum once per activity)
Then we count used road segments across all activities, and get those less and more popular.

Now, the hardest part. Make a visualization as aesthetically pleasing as possible so my fiancée let me hang this on the wall :laughing:

I might be joking, but I’m also dead serious. I think the code I generated for this visualization was most complex I ever did to present some data.
That’s because I wanted to have very similar poster to the one I currently have on the wall - but with my personal data and some minor improvements.

By minor improvements, aside from the data about used road segments, I mean:
less dark road network
More life by adding colors for parks, forests, river and other water areas

Plus I categorized road segments used for running into 5 buckets (depending on the usage) and picked up color opacity accordingly (the more used road segment the darker color).

So here you can find the version after this improvements, which is almost final:


I hope you can agree it looks astonishing and delightful! No more zig-zags and clearly marked my favorite running places.

On top of that, in order to make it similar to current poster I:
created two rectangles around the map, and the inner rectangle has to fully include the map
Added this gradually shading effect on the bottom of the map. You can see on original poster that since certain level on the bottom of the map, the road network is less and less visible (and boy, that was surprisingly difficult to achieve)
Added the same caption at the bottom of map

Now all you need to do is to go to your local printing house and have it printed in 50x70 cm size.

All that effort just to see this beauty on the wall:



I’m really pleased with the result.
As stated before - this brings me back a few funny memories from past running activities.
Plus, it actually motivates me to explore new tracks, to have an updated version of this poster in a few years ;)
