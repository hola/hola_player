# Hola Player - Enhanced HTML5 Video Player
Hola Player is a web video player based on the popular video.js open source project world. It supports HTML5 and Flash video. It supports video playback on desktops and mobile devices. Hola Player integrates advanced features from [holacdn.com](http://www.holacdn.com)

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

1. Add this script to your document's `<head>`:

  ```html
  <script src="//cdn.jsdelivr.net/hola_player/1.0.28/hola_player.js"></script>
  ```
  
  Note: If you would like to use the integrated Hola Video Analytics module, register for an account on [holacdn.com](http://holacdn.com/cp) and include your CustomerID when loading the player as follows:
  
  ```html
  <script src="//cdn.jsdelivr.net/hola_player/1.0.28/hola_player.js?customer=xxx"></script>
  ```
  
2. Add a `<video>` tag on your page:

  ```html
  <video class="video-js vjs-default-skin" poster="http://player.h-cdn.org/static/mp4/tears_of_steel_1080p_MP4.jpg" width="640" height="360" controls>
      <source src="http://player.h-cdn.org/static/mp4/tears_of_steel_360p_MP4.mp4" type="video/mp4">
  </video>
  ```

3. Initialize player:

  ```html
  <script>
      window.hola_player();
  </script>
  ```

4. Done!

## Self hosting

You can also [Download](https://github.com/hola/hola_player/raw/v1.0.28/dist/hola-player-1.0.28.zip) prebuilt package and host it on your website.
You will also need to to update the location of the swf files `videojs.swf` and `videojs-osmf.swf`.

```html
<script src="//www.example.com/path/to/hola_player/hola_player.js"></script>
<script>
    window.hola_player({base_url: "//www.example.com/path/to/hola_player"});
</script>
```

or alternatively, specify swf locations explicitly

```html
<script src="//www.example.com/path/to/hola_player/hola_player.js"></script>
<script>
    window.hola_player({
        swf: "//www.example2.com/other/path/to/swf/videojs.swf",
        osmf_swf: "//www.example3.com/another/path/videojs-osmf.swf"
    });
</script>
```


## Integrated video analytics

Hola Player comes integrated with the free hola video analytics module. To open your free account and have access to the analytics dashboard, check out holacdn.
Hola analytics module provides the following information using the free dashboard:
- Start buffering times
- Total views
- Total minutes viewed
- Seek events
- Bandwidth saved using Bandwidth Saver
- And more..

The use of this feature requires a free hola account. To learn more about the hola analytics dashboard and to create your free account, visit [www.holacdn.com](http://www.holacdn.com).

## Integrated bandwidth saver for progressive http

Hola Player comes integrated with the free hola bandwidth saver module. The bandwidth saver module uses progressive download methods to reduce buffer overhead while keeping the video loading time to a minimum and the player responsive.
Bandwidth saver works with MP4/FLV streams.

## Examples

* Without HolaCDN: [MP4](http://hola.github.io/examples/cdn/#hola_player) | [HLS](http://hola.github.io/examples/cdn/#hola_player_hls) | [HDS](http://hola.github.io/examples/cdn/#hola_player_hds)

* With HolaCDN: [MP4](http://hola.github.io/examples/cdn/#hola_player_cdn) | [HLS](http://hola.github.io/examples/cdn/#hola_player_hls_cdn) | [HDS](http://hola.github.io/examples/cdn/#hola_player_hds_cdn)

* [HolaCDN + IMA ads](http://hola.github.io/examples/cdn/#hola_player_ima)

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

