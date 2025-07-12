---
date: '2025-06-14T08:00:54+02:00'
draft: false
title: 'How far away is the nearest lightning bolt?'
ShowToc: false
cover:
  image: "cover1.png"
  #alt: "<alt text>"
  #caption: "Captiooon"
  relative: true # To use relative path for cover image, used in hugo Page-bundles
---

*Imagine a hot, summer day. You’re sitting at home, feeling the stuffy air. You start to wonder whether today is going to be a stormy day.*

*You could check on your favourite website where the lightning bolts are located and how far from you.*

*But no — instead, you want to know how far away the most recent lightning strike was. And you want to know it precisely, immediately and without moving your finger.*

*Sounds like a realistic scenario, right? Right?*

*Let’s do it!*

# Intro

For a few years in a row I was thinking about creating some application that would show me the distance to the closest lightning. You might ask: why? The answer is: I don’t know… for some reason it sounds very cool to me. 

Still, as with many of my side-project ideas, I didn’t have time to pursue this project. Until this year, when I finally sat down and worked out something fun (at least for me). 

# An easy, but expensive way

Obviously, the easiest idea would be to access some API that returns data about recent lightnings with geolocation and use such response to get the closest distance to your location. And then display this information on some kind of dashboard.

Such services do exist but are not free (actually they are damn expensive, but I imagine having accurate weather data might be desirable for many industries). Anyway, to get a glimpse of the data, I used free trial of Meteomatics API, that grants access to such data. You simply define the parameters of the query:
bounding box within which you want to search for lightning strikes and time period. As the result you get something like this:

```json
[{"stroke_time:sql":"2024-09-01T17:45:20Z","stroke_lat:d":"38.845","stroke_lon:d":"-80.8603","stroke_current:kA":"-18.2","lightning_type":"2"},
{"stroke_time:sql":"2024-09-01T17:45:33Z","stroke_lat:d":"35.7407","stroke_lon:d":"-86.8738","stroke_current:kA":"21.7","lightning_type":"2"}]}]
```

From this point it’s a piece of cake to get what I wanted.

# A hard, but fun way

But, for such pet project I don’t want to pay a shitload of money for data. So what are the alternatives? Well, I think a lot of people know blitzortung.org website. They display lightning map in real time. 

They also provide access to API, but unfortunately it's only available for members of their community, i.e. people who are part of lightning detectors network. To be such member, you need to possess specific hardware, which is currently unavailable to buy (at least that was some time ago when I requested access to such hardware).

> [!TIP]- More for curious reader
> If you are familiar with web scraping, you could easily find out how the website retrieves the data in real time about recent lightnings. They use WebSocket communication protocol, and it outputs data like this:
>
> {{< figure src="website_ws.png" align=center caption="Data retrieved by website">}}
>
> As it can be seen, there are definitely information about timestamp, longitude and latitude, but they are obfuscated. They obviously don't want you to steal their data.
> 
> So even if you could access the WebSocket, you would still need to decode this data.
> I guarantee you it's possible, but that's misuse of their API, so I'm not going to do it this way.


I hope by now you're convinced that is non-trivial (and non-free) to get access to this kind of data. Unless… you use what you already have. Fasten the seat belt. 

So we have access to the website that displays recent lightnings (thanks to blitzortung.org or any other similar website). The lightnings there are represented as little crosses - the center of the cross is the actual location of the lightning.

Thinking logically, there must be some mapping that website uses, to transform longitude and latitude of lightning retrieved by the browser from API to pixel position on the map. 


Given we know the mapping, we could:
1. take the screenshot of the map
2. extract crosses locations (as pixel position on map)
3. transform pixel positions to geo coordinates
4. calculate distance to your location

That sounds like a solid plan that would meet requirements defined at the beginning of post. Let’s implement it step by step.

### 1. Take the screenshot of the map

We want to automatically perform this task. Therefore we need a tool that automates the browser. Selenium works well for this purpose and the process is very simple. We want to:
- open the browser
- handle all cookies pop-ups and other advertisements 
- turn off strikes and detectors buttons (because otherwise our screenshot could contain too much noise)
- locate website element with the map and take the screenshot of it

All of those points are trivial to complete. 

For the first one you just need to define what browser you want to run with optional parameters, like running the browser in the headless mode (headless mode means running your browser without displaying it).

For the second and third point you just need to find how the buttons you want to click are defined (e.g. using CSS selector) - you can check the source of the website, or use "inspect element" functionality of your browser for that. Then you make Selenium find those buttons and click them.

I thought the last point is gonna be harder, but actually again, you just need to find the name of element that contains the map and use a command like this:

```python
map_element_name = "#map td:nth-child(1)"
img_element = driver.find_element(By.CSS_SELECTOR, map_element_name)
img_element.screenshot("/path/to/save/image")
```

This effectively solves this point and stores the map as PNG file.

### 2. Extract white crosses pixel locations

First what you need to do is to load the map in Python. You can achieve that using for example OpenCV library.

You end up with 3D matrix, that is `width` x `height` x `channels` size. Most frequently the number of channels will be 3, each one corresponding to intensity of blue, green and red color.

{{< figure src="output1.png" align=center caption="raw map loaded in Python">}}

As it can be seen, we have 6 colors of crosses, on white-to-red scale (white being the most recent, red being the oldest ones). We want to retrieve only the white ones.

At this stage, I had different thoughts on how to approach it. Mostly overcomplicated. 

I knew that for this map the lightning cross is 7x7 pixels. So potentially you could create a template for such lightning (7x7 matrix with ones on 4th row and 4th column, 0 in all other elements), slide through the image and check how this templates fits every 7x7 part of image (some form of convolutional operation known in computer vision). There is already available method in OpenCV package called `cv2.matchTemplate`. And it was working pretty well, but only for separate lightnings. If there were 2 or more lightnings in close area (meaning the crosses would overlay each other), the template approach wouldn’t work.

Fortunately there is a better way to achieve it. First, we can simplify the image. Instead of having 3 channels, let’s have one. That would help us to select the color threshold to pick white crosses. In order to do this we can transform the image from RGB scale to grayscale (black-and-white). As you can see below, now the image is easier to work with. Each pixel is encoded as value from 0 to 255. The higher, the more white pixel is.

{{< figure src="output2.png" align=center caption="map after transforming to grayscale">}}

Now you just need to select a threshold above which you state that the pixel is “white enough” (:D) to represent a cross. If you'd check image values, it turns out that the threshold should be 240. So again, we transform image, this time to binary form. The pixel value can be either 0 (non-white) or 1 (white).

{{< figure src="output3.png" align=center caption="map with white pixels selected">}}

At this stage, again, you could reach the goal in many ways. I chose the most trivial one. In order to detect white cross you simply iterate over all pixels. For each pixel you check its neighbours - pixel on the left, right, below and above. If all of them are 1 (meaning they are white) - you got a pixel representing a lightning!

> [!TIP]- More for curious reader
> You probably see that not only crosses were extracted but also some additional information provided by the website, visible in top-left, top-right and bottom-right corners. Those data would generate fake lightnings that we don't want to detect.
>
> Fortunately, position of this metadata doesn't change, so you can pretty confidently define rectangles that contain those metadata and exclude them from further analysis.


### 3. Transform pixel positions to geo coordinates

So we have pixel coordinates corresponding to the lightnings. We wish to transform them to geo coordinates.

If you would be really really lazy, and you would know the coordinates of map corners (left top, bottom, right top, bottom) you could THEORETICALLY assume that each pixel represents a constant distance, and based on that translate pixel position to geo location. 

This is of course huge oversimplification, but hey, you could do it, and the results for such map as ours wouldn’t be that much imprecise. At this stage I didn’t know the coordinates of map corners. But you can always compare our map to google maps to determine approximate locations of four corners. I did this exercise so you don’t have to. It worked, but the results compared to official data source (Meteomatics API that I mentioned earlier) were off even by several dozen kilometers.

That is of course not “good enough” for such important project as this one. The most problematic issue is that we don’t know how to translate pixel to geo coordinates. Basically we don’t know what map projection was used. If you paid attention to geography classes you probably could guess or estimate which projection was used (there is not that many frequently used). I’m actually in the group of people who paid attention to geography classes, because I took secondary school-leaving examination in geography (and passed it with decent score!).
But this knowledge is long forgotten.

Fortunately, there is a phrase: "if you torture the data long enough, it will confess to anything". I know it's used mostly in a negative way (to describe bad statistical practice), but fits the situation pretty well. 
My thinking was that the logic for this pixel->geo coordinates transformation should be somewhere incorporated on the website. When I first went through the website origin, I didn’t find such piece of code. But then I digged more and also checked attached JavaScript files. And there I found gold! 

It turns out that there were the definitions of each map available on the website, with map projections used for each of them. Plus, I found the definitions of the functions that do the transformation: they take as input longitude and latitude and transform them to pixel coordinates, depending on the map projection.

From this point, all you need to do is take those functions and convert them in such way, that pixel coordinates are input, and the output is longitude and latitude. That’s not hard math to perform. You end up with functions that look like this:

```python
def pixel_to_lon(x, west, east, width):
    """Invert projection_x: pixel → longitude."""
    return west + (x * (east - west) / width)

def mercator_proj(lat):
    return math.log(math.tan(lat / 2 + math.pi / 4))

def inv_mercator_proj(v):
    return 2 * math.atan(math.exp(v)) - math.pi / 2

def pixel_to_lat(y, west, east, north, height):
    """Invert projection_y: pixel → latitude."""
    west_rad = math.radians(west)
    east_rad = math.radians(east)
    north_rad = math.radians(north)
    span = east_rad - west_rad

    delta = (y * span) / height

    t = mercator_proj(north_rad) - delta
    lat_rad = inv_mercator_proj(t)
    return math.degrees(lat_rad)
```

- `x`, `y` variables are pixel locations
- `west`, `east`, `north` variables are coordinates of map boundaries I found in website scripts
- `width`, `height` variables represent image size

### 4. Calculate distance to your location

We are all set now. 

All we need to do is calculate distance between two points: your location and closest lightning bolt. To achieve it we can use Haversine formula. I’ll not try to outsmart you here - formula is formula, you can read more about how it works, but all that matters is that you pass two points (point defined as longitude and latitude) and get the distance as output. So you simply calculate this formula between your location and all the lightning bolts you discovered, get the minimum value, and voilà - you get your distance to closest lightning bolt.


Cool, all the tricky (from my perspective) work is done. Now we can get the toys out and have some fun.

# Connecting all the dots

As mentioned at the beginning of article: we want to have all the processes automated to present visually fresh data about closest lightning bolt. You can achieve it in many ways. I’m going to do it using hardware I bought a few years ago and tools that are popular and easy to configure.

Unlike preprocessing the data that I described above, which is pretty unstandard, I’m not gonna delve into the details here - you can find numerous articles about tools I’m gonna mention.

So, the plan is as follows:
- configure `cronjob` that cyclically, e.g. every 5 minutes runs the script that retrieves the data about recent lightning bolts and store it in `SQLite` database. I'm going to run it on a mini-cluster consisting of three Raspberry Pi Zeros that I use for some of my pet projects
- create an endpoint in `FastAPI` that retrieves from `SQLite` database details about most recent lightning bolts. Run `uvicorn` server to host this endpoint
- generate beautiful image in ChatGPT displaying city during a storm and use it in simple HTML dashboard that will display data about closest lightning bolt
- run the dashboard on a server
- prepare hardware for displaying dashboard. I’ve got an old Raspberry Pi 3B that I bought some time ago with 3.5 inch display. After connecting Raspberry Pi with the display, installing and configuring OS, you can simply run a browser, with address set to the dashboard hosted on a server, in a kiosk mode

Visually, we end up with an architecture like this:

{{< figure src="diagram4.png" align=center caption="architecture of our solution">}}

And the final effect is as follows. Below you can check the screenshot of the app looks like. Apart from the distance to closest lightning bolt, I also show its coordinates, total number of lightnings on map and datetime when the data was retrieved.

<!-- ![Alt text](dashboard1.png#center) -->
{{< figure src="dashboard1.png" align=center caption="screenshot from the app">}}

And this is how it presents on my desk:

{{< figure src="desk2_1.jpg" align=center caption="how does it present on my desk? I'd say pretty decent">}}

It's been working for about 2 months now. I compare the results from time to time with the original map and it seems to be working perfectly.

Satisfying my curiosity about recent lightning bolts was never easier :laughing:

I hope you found this at least partially as entertaining as I did.

Cheers! :v:

