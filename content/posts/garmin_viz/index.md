---
date: '2025-09-08T10:56:34+02:00'
draft: false
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

*I have a few posters in my home showcasing cities that for different reasons are important to me. Those are pretty popular posters - take a look at Figure 1.*

*For some time I wondered how such posters could be customized. One idea was to mark important places on those maps - places where I lived, places important from relationship point of view or favourite drinking places...*

*But that wouldn't be interesting as a blog post material, right? And as a wannabe content creator I feel obliged to deliver something engaging.* 

*So I figured it would be really cool to display personal data that I gather using my smartwatch - data about my running activities.*

*The idea is simple - I want to pimp up poster with Warsaw map. Why Warsaw? Because that's where I live and where majority of my running sessions take place.*

*I want to keep the road network as it is. But on top of that I want to distinguish those road segments that I used for running. So majority of the road segments will have a default black color, meaning I didn't run through them. But some of them will have different color, meaning I was running there. And it won't be a single color, but some color gradient (e.g. different shades of blue color) - the darker color the more frequent I ran through it.*

*Let's make this poster great again.*

{{< centered-image src="pic1.jpg" alt="image" maxWidth="600px" description="Figure 1: my poster with Warsaw map" >}}

# Data

For over 7 years now I own a Garmin watch that I wear every day. Although I’m not a marathoner, I run pretty frequently since I was a teenager. This means there should be quite a lot of data to display.
Garmin watches produce `.fit` files that include all details about your activities, including raw GPS coordinates gathered at regular intervals. The issue is that you probably won’t be able to retrieve all the files from the watch directly - there is some data retention policy on the watch, either based on storage limit or activity age. Fortunately you can access Garmin Connect website and there you can find your whole activity history.
Here arises another challenge - you can’t download all these activities at once. You can only download only summary for all activities, but this doesn’t include GPS data. 
What you need to do is go through all activities and for each of them click few buttons to get `.zip` file containing all needed data. Pretty time-consuming for few hundreds activities to retrieve if you ask me. But you can write a simple script to automate this process - and that’s what I did. I ended up with around 800 running activities, ready to be used for further analysis and investigation.

> [!TIP]- More for curious reader
> There is one quirk about Garmin data.
> 
> When you load it (I used `fitparse` package in Python) the GPS points are not directly ready to use.
> Garmin uses special format for storing geographic coordinates that is memory-efficient. Instead of storing longitude and latitude as decimal degrees, they store it as smaller integers.
> This unit is called "semicircles". In order to use it for standard geo analysis you need to convert it to degrees.
>
> Here is the formula: `semidegrees = degrees * (2^31 / 180)`

# Raw GPS points visualization

Once we load the data, we need to filter only activities that took place in Warsaw.
Then, to check what we are dealing with here we can take the raw GPS points and connect them to form a line (well, actually a polygon) - one line per activity.
In *Figure 2* you can see such visualization.

> [!TIP]- More for curious reader
> How can you transform raw GPS points to polygons representing running path?
> You can use combination of `geopandas` and `shapely` libraries.
> Let's assume you have `pandas` data frame with information about activity ("activity_id" column) and GPS points ("lat" and "lon" columns).
> To properly represent this GPS points you can run:
> ```python
> import geopandas as gpd
> from shapely.geometry import LineString
> 
> gdf_points = gpd.GeoDataFrame(
>    points_df,
>    geometry=gpd.points_from_xy(points_df["lon"], points_df["lat"]),
>    crs="EPSG:4326"
> )
> ```
> Then, in order to create polygons per acitity, you can use `LineString` class:
> ```python
> lines = []
> for act_id, group in gdf_points.groupby("activity_id"):
>    line_geom = LineString(list(group.geometry))
>    lines.append({"activity_id": act_id,
>                  "n_points": len(group),
>                  "geometry": line_geom})
> gdf_lines = gpd.GeoDataFrame(lines, crs="EPSG:4326")
> ```
> From this point you can make similar visualization to *Figure 2* for example using `folium` package.

{{< centered-image src="raw_gps_points.png" alt="image" maxWidth="600px" description="Figure 2: map with all GPS points" >}}

This is already really impressive, but for our purpose it's not enough. Why? Mostly because of GPS inaccuracies. Take a look at area near my old apartment in *Figure 3*.

{{< centered-image src="issue_raw_points.png" alt="image" maxWidth="600px" description="Figure 3: main issue with displaying raw points" >}}

Did I really run such differently each time on this road segment? Definitely not.
Actually for this segment the running route was the same, because it was a narrow walkway. And it was near pretty tall building - probably causing most of the inaccuracies in this place (though there could be many more reasons behind possible GPS inaccuracies).

So how such "noodles" would look like hanging on my wall as a poster? Not very well. 

We will soon get to how we can improve, but still, having such visualization is very fun and quite nostalgic. I'm surprised how accurately I'm able to recall given running session by looking at such map.

Below you can find few of them. *Figure 4* show activities from around 6-7 years ago, when I started to run after a longer break. It was a cold January and I was able to do only short tracks. But I remember it well, because that allowed me to explore beautiful Bielany district streets in snowy scenery.

{{< centered-image src="story1.png" alt="image" maxWidth="600px" description="Figure 4: exploring Bielany district" >}}

*Figure 5* shows activities when I lived near awesome park and had been very consistent when it comes to running tracks around it.

{{< centered-image src="story2.png" alt="image" maxWidth="600px" description="Figure 5: going for Local Legend status in this park" >}}


When you look at the map you can see that all the activities are somehow connected into one large network. But there are also few segments not connected to it. 
Those represent mainly running races I took part in, like in *Figure 6*.

{{< centered-image src="story3.png" alt="image" maxWidth="600px" description="Figure 6: some 5km running race" >}}

And here are two interesting things: visible as strange zig-zags. 

The first one looks like I was running inside a shopping mall and that is right, because once I accidently started "outdoor training" on my watch when actually running on a treadmill. 

The second zig-zag is the only time my watch went crazy and thought I was teleporting through this roundabout (but hey, at least it reported this activity as my best 5 km!).

{{< centered-image src="story4.png" alt="image" maxWidth="600px" description="Figure 7: forced and unforced watch errors" >}}

As I said, that’s a very cool visualization, showing a lot of different stories. Take a look that most of the runs took place in north of Warsaw, rather than south (although that should change in the future). And almost none on the right side of Vistula river (that will probably not change in the future). 

But it's clear it needs improvements - let's move to them.

# Matching GPS points to road network

In order to have a neat and tidy graphic, without "noodles" around certain places, we need to map GPS points to to road segments that were actually used.

There are many approaches to achieve such mapping. I'm gonna describe two that I used:
- trivial that quickly becomes overwhelming
- complicated that quickly ends up trivial 

## 1st approach - snap points to closest edge

The important thing to start with is to know that road networks are represented as graphs.
Graph is a collection of edges and nodes, and is a natural way to model/represent a fact that some objects are related.
For example a graph might represent a group of people with certain relationships (family connections, friendships, etc.). For such example people are represented as nodes, and those relationships are edges. 
For road network, road segments are edges and intersections are nodes. In *Figure 8* you can find a real-work example of road network - nodes are red points, and edges are black lines (polygons). For simplicity only drivable public streets for motor vehicles are included.

{{< centered-image src="road_network_example.png" alt="image" maxWidth="600px" description="Figure 8: Example of road network graph" >}}

Now, the simplest idea to match GPS points to road network is to match each GPS point to closest edge.
So for each GPS point we want to:
- select candidate edges close to the GPS point (obviously we don’t want include all edges available in road network)
- calculate closest distance (in terms of Euclidean distance) to each candidate edge
- return edge with minimal distance

Sounds easy and it is easy to implement with few lines of codes.

> [!TIP]- More for curious reader
> How can you achieve it? Fully using `osmnx` package that is python library for working with OpenStreetMap data.
> 
> First, you need to get graph representing road network using `osmnx.geocode_to_gdf("Warsaw, Poland")`.
> 
> Then for each point you run `osmnx.nearest_edges()` method. All you need to do is to pass a road network, and GPS coordinates.

Unfortunately there is an issue. Because of the nature of GPS points (they are noisy) and the high density of roads in city, you will end up with very weird mapping.
Almost as if you were exploring map in Witcher. Or if you would be using some kind of portal to teleport between two sides of the same road.

*Figure 9* and *Figure 10* show these issues precisely: weird wandering around different places and discontinuity between road segments. To emphasize how inaccurate such mapping can be, *Figure 10* shows additionally raw GPS points (as blue points). 


{{< centered-image src="issue1.png" alt="image" maxWidth="600px" description="Figure 9: running through a park based on snapping to closest edge" >}}

{{< centered-image src="issue4.png" alt="image" maxWidth="600px" description="Figure 10: running close to the bridge based on snapping to closest edge " >}}


This is of course unacceptable. And of course you can improve it greatly. Here are few of my ideas:
- preprocess GPS points to **a)** remove outliers (e.g. one bad reading in a sequence) **b)** decrease number of points if many are close to each other **c)** increase number of points, by interpolation, in areas where they are far from each other **d)** apply some kind of filter to reduce GPS jitter
- if a edge for new point is different than for previous point, select k-nearest edges (instead of one) and choose the path that minimizes cumulative route length from previous edge through candidate edge to next edge
- penalize excessive turns in a route
- try matching certain points to closest node, instead of edge
- if there is a discontinuity between road segments, find closes route between them to close the gap

I tried them all and I wasn’t satisfied with the results. Still, the upside of this approach is that it's quite simple to implement, even including the above-mentioned improvements. But this doesn’t fully utilize all information available in graph representation and that causes imperfect outcome.

## 2nd approach - use Hidden Markov Models

So 1st approach was focused mostly on sequential matching of single GPS points. It would be best if we could solve this problem considering entire trajectory sequence - that should lead to more coherent and realistic paths.

Fortunately, there is a framework for that called Hidden Markov Models (HMM). Such models allow to elegantly handle the uncertainty and noise present in GPS positioning, while considering the constraints of road networks.

HMMs consist of following elements:
- **Hidden States**: they define what we want to find out: true road segments that I used during a run
- **Observations**: those are the noisy GPS measurements we have
- **Emission Probabilities**: this is the likelihood of receiving particular GPS point given the true road segments. This captures GPS accuracy - road segments closer to GPS point have higher emission probabilities, while segments farther away have lower probabilities
- **Transition Probabilities**: this is the likelihood of moving from one road segment to another between consecutive timestamps. This incorporates such things as road network connectivity and running speed constraints (you can’t teleport between unconnected roads)

Now, Hidden Markov Model doesn’t tell you directly what is the most likely sequence of hidden states (road segments). Instead, it defines a probabilistic model (relationship between hidden, true road segments and observed GPS readings) and parameters (emission and transition probabilities).  
In order to extract best answer we need to provide the inference algorithm. For this problem the best option is to use Viterbi algorithm. It provides the optimal solution method for finding the most likely sequence of hidden states. Instead of selecting most likely road segment at each timestamp, it finds the single most likely path through the hidden state sequence (true road segments).

Ok, that’s enough of theory. I hope you believe me that this approach is much more sophisticated than the first one. 
As I'm too lazy to write this from scratch, I searched for ready-to-use solutions. And I found beautiful [Valhalla](https://github.com/valhalla/valhalla) library which is an open source swiss army knife to use with OpenStreetMap data. The module used for our purpose (map matching) is called Meili.

> [!TIP]- More for curious reader
> You can set up Valhalla engine locally (which might cause some problems for certain platforms) or you can use `docker` for it:
> ```bash
> docker pull ghcr.io/gis-ops/docker-valhalla/valhalla:latest
>
>docker run -dt \
>    --name "valhalla" \
>    -p 8002:8002 \
>    -e server_threads=8 \
>    -v $(pwd)/custom_files:/custom_files \  # you need to get OSM data locally. This is path to it
>    ghcr.io/gis-ops/docker-valhalla/valhalla:latest
> ```


The configuration is rather straightforward. I changed only 3 parameters of this algorithm:
- specified search radius to 50 meters - this is a radius within which road segments will be searched
- specified GPS accuracy to 10 meters (based on Garmin claims regarding accuracy)
- set turn penalty factor to 500, which was recommended by documentation to smooth out jittering of points

Below you can find comparisons between 1st and 2nd approach for random activities (red line is 1st and green is 2nd approach; blue dots are GPS readings just to prove you once again how inaccurate 1st approach could be).

*Figure 11* and *Figure 12* show routes selected by Valhalla engine.

{{< centered-image src="valhalla1.png" alt="image" maxWidth="600px" description="Figure 11: running through a park according to Valhalla" >}}

{{< centered-image src="valhalla2.png" alt="image" maxWidth="600px" description="Figure 12: running close to the bridge according to Valhalla " >}}

As you can see, the results are exactly what we should expect, espacially comparing to first approach (*Figure 9* and *Figure 10*).

# Putting it all together

Obviously I choose 2nd approach. So now we just need to run this algorithm for all activities. Specifically, for each running activity we:
- run Valhalla engine to do the map matching
- get unique road segments (for simplicity we assume given road segments could be used maximum once per activity)

After that, we count used road segments across all activities to get those less and more popular.

Now, the hardest part - make a visualization aesthetically pleasing enough so my fiancée let me hang this on the wall :laughing:.

I might be joking, but I'm also dead serious. I think the code I generated for this visualization was most complex I ever did to present some data.
That’s because I wanted to roughly reproduce poster presented in *Figure 1* - but with my personal data and some minor improvements.

I wanted it to be more vivid, that is why I added colors for parks, forests, river and other water areas. Original road network color would make the used road segments hard to see, that is why I changed it's color to grey.
Plus I categorized road segments used for running into 5 buckets (depending on the usage) and picked up color opacity accordingly (the more used road segment the darker color).
All that changes translate to a map presented in *Figure 13*.

{{< centered-image src="valhalla_all_segments2.png" alt="image" maxWidth="600px" description="Figure 13: draft of final visualization " >}}

I hope you can agree it looks delightful! No more zig-zags and clearly marked my favorite running places.

On top of that, in order to make it similar to *Figure 1* I did following adjustments:
- created two rectangles around the map so that inner rectangle fully includes the map
- added this gradual shading effect on the bottom of the map. In *Figure 1* you can see that since certain level on the bottom of the map, the road network is less and less visible (and boy, that was surprisingly difficult to achieve)
- added the same caption at the bottom of map (with better font)

Now all you need to do is to go to your local printing house and have it printed in 50x70 cm format (well, I actually visited 2 places. It turns out it's not that straightforward to print a map with that many elements.).
Finally, *Figure 14* presents the new poster on my wall.

{{< centered-image src="IMG_2140_1.jpg" alt="image" maxWidth="600px" description="Figure 14: final poster hanging proudly on the wall ">}}

I'm really pleased with the result.

As stated before - this brings me back a few funny memories from past running activities.

Plus, it actually motivates me to explore new tracks - to have an updated version of this poster in a few years ;)
