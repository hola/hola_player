# Hola Player - Enhanced HTML5 Video Player
Hola Player is a web video player based on the popular video.js open source project world. It supports HTML5 and Flash video. It supports video playback on desktops and mobile devices. Hola Player integrates advanced features from [holaspark.com](http://www.holaspark.com)

## Features

- Commercial grade video player
- Integrated Hola analytics module
- Integrated bandwidth saver module
- All the features of the original video.js
  - Custom branding (no watermark)
  - HLS/HDS streaming
  - HTML/CSS skin system
  - Plugin support
  - Multi platform (desktop and mobile devices)
  - Player API

## Quick start

To start using Hola Player, follow these steps:

1. Register for an account on [holaspark.com](http://holaspark.com/cp)

2. Add this script to your document's `<head>`, including your CustomerID as follows:

  ```html
  <script src="//player2.h-cdn.com/hola_player.js?customer=xxx"></script>
  ```

3. Add a `<video>` tag on your page:

  ```html
  <video class="video-js vjs-default-skin" poster="//player.h-cdn.org/static/mp4/tears_of_steel_1080p_MP4.jpg" width="640" height="360" controls>
      <source src="//player.h-cdn.org/static/mp4/tears_of_steel_360p_MP4.mp4" type="video/mp4">
  </video>
  ```

4. Initialize player:

  ```html
  <script>
      window.hola_player();
  </script>
  ```

5. Done!

## Self hosting

You can also [Download](https://github.com/hola/hola_player/raw/v1.0.121/dist/hola-player-1.0.121.zip) prebuilt package and host it on your website.
You will also need to update the location of the swf files `videojs.swf` and `videojs-osmf.swf`.

Important: If you are using HolaSpark or HolaCDN features you must retain the 'customer=<id>' param of the url even after moving Hola player to your servers.
  
```html
<script src="//www.example.com/path/to/hola_player/hola_player.js?customer=xxx"></script>
```
Otherwise no param is required

```html
<script src="//www.example.com/path/to/hola_player/hola_player.js"></script>
```

Also you MUST specify new swf locations explicitly. Copy our swf files to a location on your site and setup the paths as follows:

```html
<script>
    window.hola_player({
        swf: "//www.example2.com/other/path/to/swf/videojs.swf",
        osmf_swf: "//www.example3.com/another/path/videojs-osmf.swf"
    });
</script>
```

## Integrated video analytics

Hola Player comes integrated with the free hola video analytics module. To open your free account and have access to the analytics dashboard, check out holaspark.
Hola analytics module provides the following information using the free dashboard:
- Start buffering times
- Total views
- Total minutes viewed
- Seek events
- Bandwidth saved using Bandwidth Saver
- And more..

The use of this feature requires a free hola account. To learn more about the hola analytics dashboard and to create your free account, visit [www.holaspark.com](http://www.holaspark.com).

## Integrated bandwidth saver for progressive http

Hola Player comes integrated with the free hola bandwidth saver module. The bandwidth saver module uses progressive download methods to reduce buffer overhead while keeping the video loading time to a minimum and the player responsive.
Bandwidth saver works with MP4/FLV streams.

## Examples

* [MP4](http://hola.github.io/examples/cdn/#hola_player)
* [HLS](http://hola.github.io/examples/cdn/#hola_player_hls)
* [HDS](http://hola.github.io/examples/cdn/#hola_player_hds)
* [IMA ads](http://hola.github.io/examples/cdn/#hola_player_ima)

## Building your own copy of Hola Player

If you want to build your own copy of Hola Player and receive the latest updates follow these instructions:

First, [fork](http://help.github.com/fork-a-repo/) the hola/hola_player git repository. At the top of every github page, there is a Fork button. Click it, and the forking process will copy Hola Player into your own GitHub account.

Clone your fork of the repo into your code directory

```bash
git clone https://github.com/<your-username>/hola_player.git
```

Navigate to the newly cloned directory

```bash
cd hola_player
```

Assign the original repo to a remote called "upstream"

```
git remote add upstream https://github.com/hola/hola_player.git
```

>In the future, if you want to pull in updates to Hola Player that happened after you cloned the main repo, you can run:
>
> ```bash
> git checkout master
> git pull upstream master
> ```

Install the required node.js modules using node package manager

```bash
npm install
```

> A note to Windows developers: If you run npm commands, and you find that your command prompt colors have suddenly reversed, you can configure npm to set color to false to prevent this from happening.
> `npm config set color false`
> Note that this change takes effect when a new command prompt window is opened; the current window will not be affected.

Build a local copy of Hola Player

```bash
grunt
```

## License

Hola Player is licensed under the ISC License. [View the license file](LICENSE)

Copyright 2017 Hola Networks ltd

