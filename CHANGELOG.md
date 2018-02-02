CHANGELOG
=========

## HEAD (Unreleased)
_(none)_

---------------------

## 1.0.139 (2018-02-02)
* Add Skip 15sec buttons (back and forward)
* Add controls hiding for small player width
* Fixed Live mode for custom buttons
* Fixed Ads UI progress bar in inactive mode

## 1.0.138 (2018-02-01)
* Allow to use seekbar before metadata & duration is loaded
* Fixed Live mode for ios skin

## 1.0.137 (2018-01-31)
* Fixed large nonlinear ad triggers ima sdk error googleads/videojs-ima#476

## 1.0.136 (2018-01-31)
* Make seek bar handle more responsible for ios skin

## 1.0.135 (2018-01-30)
* Adjust Picker scrolling for zoomed UI

## 1.0.134 (2018-01-30)
* Dont hide Quality menu in picker mode
* Fix items skipping when scrolling Picker menu

## 1.0.133 (2018-01-29)
* disable native controls for Facebook Instant Articles
* update Picker menus
* update video example urls

## 1.0.132 (2018-01-26)
* Fix picker menu for old android

## 1.0.131 (2018-01-26)
* Add picker menu for ios skin

## 1.0.130 (2018-01-23)
* Fix getting current script on IE11

## 1.0.129 (2018-01-22)
* Update styles for ios-skin menus

## 1.0.128 (2018-01-22)
* Fix width & height when creating a new video element

## 1.0.127 (2018-01-22)
* Fix styles for vjs-setting menu in fullscreen

## 1.0.126 (2018-01-21)
* Fix scaling for the vjs-settings menu

## 1.0.125 (2018-01-21)
* Fix important urgent bug: hide menu scrollbar for touch UI

## 1.0.124 (2018-01-18)
* Add ios-like skin

## 1.0.123 (2018-01-02)
* Always show circle on progress bar on mobile

## 1.0.122 (2017-12-27)
* Show circle on progress bar during seeking on mobile

## 1.0.121 (2017-12-15)
* Added license_init request

## 1.0.120 (2017-12-13)
* Force muted autoplay on mobile when enable_autoplay_on_mobile=true

## 1.0.119 (2017-12-05)
* Fixed controlbar watermark style
* Fixed conflicts with third party css

## 1.0.118 (2017-11-27)
* Fixed wrong play button icon after ad error
* Fixed error on player dispose

## 1.0.117 (2017-11-24)
* Fixed getting stuck on ad error

## 1.0.116 (2017-11-14)
* Open share dialog in popup
* Change 'About Hola Player' link

## 1.0.115 (2017-11-13)
* Fixed playing hls on ios when source type is not specified
* Hide controls in case of videojs error

## 1.0.114 (2017-11-06)
* Fixed quality selection when sources are used without specifying protocol

## 1.0.113 (2017-11-01)
* Fixed looping ads on iPhone when has loop attribute
* Fixed ad progress bar on iPhone

## 1.0.112 (2017-10-31)
* Fixed wrong play button state when autoplaying an ad on Safari 11

## 1.0.111 (2017-10-30)
* Fixed duplicated ad countdown on Android

## 1.0.110 (2017-10-27)
* Fixed bug with duplicated controls on iOS
* Show mute button on iOS
* Pause the video on click on controlbar watermark
* Added controlbar watermark tooltip

## 1.0.109 (2017-10-19)
* Added initial commit of next button for video suggestions

## 1.0.108 (2017-10-18)
* Added better styling of videojs components when errors not displayed to user

## 1.0.107 (2017-10-17)
* Added conf option to prevent player errors from being displayed to the user

## 1.0.106 (2017-10-12)
* Fix initialization order

## 1.0.105 (2017-10-12)
* Add debug logs

## 1.0.104 (2017-10-09)
* Fix dispatching ad events

## 1.0.103 (2017-10-03)
* Fix handling ads in manual mode
* Don not toggle pause/play on click on ad close button

## 1.0.102 (2017-09-29)
* Fix handling clicks on the video when non-linear ad is active

## 1.0.101 (2017-09-28)
* Fix popup menu position when player container overflow is not visible
* Fix big play button and share button z-index

## 1.0.100 (2017-09-26)
* Do not enlarge controls if player width is more than 768px
* Fix popup menu title padding
* Fix handling share button options

## 1.0.99 (2017-09-19)
* Add social social share options
* Fix quality menu item style when scrolling
* Fix autoreplay when post-roll is non-linear
* Hide time controls when ad duration is unknown
* Hide big play button during post-roll

## 1.0.98 (2017-09-18)
* Fix conflicts with third party css

## 1.0.97 (2017-09-15)
* Add social sharing button

## 1.0.96 (2017-09-13)
* Take localization strings from spark.player.strings
* Add force_language option

## 1.0.95 (2017-09-08)
* Add 'Subtitles will look like this' message
* Add captions configuration hint
* Add 'Powered by Hola Player' popup menu title
* Hide controls on mouseleave
* Hide ad controls when user is inactive
* Improve subtitles style
* Ignore #t=<time> url param in case of multiple players on the page
* Do not load external vtt.js from cdn.rawgit.com

## 1.0.94 (2017-09-06)
* Fix mute button bug in flash mode

## 1.0.93 (2017-09-06)
* Fix mute button and ads bugs when there are multiple players on the page

## 1.0.92 (2017-09-06)
* Improve volume button behavior
* Improve fonts: add text-shadow and font-smoothing
* Do not hide controls when mouse is over the control bar
* Fix tooltips style
* Show pause/play tooltip
* Do not hide tooltips on timeout
* Fix thumbnails position

## 1.0.91 (2017-09-01)
* Add localization support
* Fix title style
* Fix settings menu zindex during non-linear ad

## 1.0.90 (2017-09-01)
* Fix poster opacity

## 1.0.89 (2017-09-01)
* Change big play button icon
* Configurable play button and seek bar colors
* Show poster after video ends
* Add video title
* Fix captions bug on IE11

## 1.0.88 (2017-08-31)
* merge all conf.spark.player options to hola_player opt

## 1.0.87 (2017-08-31)
* Add enable_autoplay_on_mobile option

## 1.0.86 (2017-08-30)
* Improved settings menu UI
* Changed replay button icon and tooltip
* Removed pause/play tooltips

## 1.0.85 (2017-08-29)
* videojs-ima: added an option to totally disable control bar during
  ads
* Improved thumbnails styles
* Added copy_url and copy_url_with_time player options
* Improved popup menu behaviour
* Fixed UI bugs on Safari and IE
* Fixed captions options button on mobile devices

## 1.0.84 (2017-08-25)
* Added captions options menu
* Save captions settings and speed to local storage
* Added 'Copy video URL' popup menu item
* Added embed_code option and 'Copy embed code' popup menu item
* Fixed bug when player remains paused after non-linear ad is loaded

## 1.0.83 (2017-08-23)
* Added url option to controls bar watermark

## 1.0.82 (2017-08-22)
* Fixed bug with duplicated internal captions
* Added captions selection to the settings menu
* Added captions toggle button

## 1.0.81 (2017-08-19)
* Added playback speed control to the settings menu
* Settings button is always visible
* Fixed bug with thumbnails while ad is playing

## 1.0.80 (2017-08-17)
* Use original videojs control bar to control ads
* Changed volume button icon and animation

## 1.0.79 (2017-08-15)
* Changed buffering animation
* Fixed volume bar on focus behaviour
* Changed settings icon
* Fixed full screen transition by double click on IE11
* Toggle pause/play and full screen by tap on video on mobile

## 1.0.78 (2017-08-11)
* Improved control bar UI
* Added 4K quality icon
* New buffering animation
* Fixed player resize after exit fullscreen
* Fixed bug with missing settings button
* Fixed quality items order

## 1.0.77 (2017-08-09)
* Changed play/pause animation
* Added HD icon

## 1.0.76 (2017-08-04)
* Toggle fullscreen mode by double click
* Sort quality items from high to low
* Fixed handling settings menu click events on touch devices

## 1.0.75 (2017-08-03)
* Two level settings menu
* Improve UI

## 1.0.73 (2017-08-02)
* Update hola/video.js to use custom UI for ios

## 1.0.72 (2017-08-01)
* fix typeerror for IE10

## 1.0.71 (2017-08-01)
* Improve settings menu UI

## 1.0.70 (2017-07-31)
* Update hap.js dependency (pixelRatio patch)

## 1.0.69 (2017-07-31)
* use vjs.play|pause methods to control ima ads playback

## 1.0.68 (2017-07-24)
* update vjs-settings. Add new methods to programmatically enable and disable
  right click menu

## 1.0.67 (2017-07-13)
_(none)_

## 1.0.67 (2017-07-13)
* update vjs-hola-skin. Show loading-spinner when loading ads

## 1.0.66 (2017-07-06)
* update vjs-hola-skin. Hide big-play-button when loading ads

## 1.0.65 (2017-06-23)
* update vjs-hola-skin. Hide big-play-button for native controls

## 1.0.64 (2017-06-19)
* Fixed bug on Mac/Safari when Hola Player code is self-hosted
* Added no_vjs_large option

## 1.0.63 (2017-06-16)
* Update hap.js dependency (cherry picked mediaDetach
  fix from upstream)

## 1.0.62 (2017-06-13)
* re-release poster fix

## 1.0.61 (2017-06-13)
* Fix poster option for native poster processing (e.g. iOS)

## 1.0.60 (2017-06-02)
* Handle playbackRates vjs option from data-setup
* Update vjs-hola-skin & vjs-settings. Fixes buttons order

## 1.0.59 (2017-05-31)
* Update videojs-ima. Fixes non-linear ads with VMAP
* Update hap.js

## 1.0.58 (2017-05-30)
* Changed preroll timeout to 10 seconds
* IMA resume action now continues main video playback

## 1.0.57 (2017-05-29)
* Handle native text tracks

## 1.0.56 (2017-05-29)
* Fix seeking issue in flash mode

## 1.0.55 (2017-05-22)
* Update hap.js dependency

## 1.0.54 (2017-05-18)
* Add options to put watermark onto controls bar

## 1.0.53 (2017-05-17)
* Improve thumbnails styles

## 1.0.52 (2017-05-16)
* Update videojs-ima

## 1.0.51 (2017-05-16)
* Fixed current_script() to return <script> which loaded hola_player, not <script> which invokes it

## 1.0.50 (2017-05-15)
* Added it.json into zdot_stub

## 1.0.49 (2017-05-15)
* Added workaround for google ima bug on old android

## 1.0.48 (2017-05-12)
* Update hap.js (on the fly manifest and playlist replacement)

## 1.0.47 (2017-05-11)
* Updated hap.js and videojs-contrib-media-sources dependencies

## 1.0.46 (2017-05-10)
* Update hap.js (preloading of level playlists)

## 1.0.45 (2017-05-09)
* Added detection for being loaded from player2.h-cdn.com

## 1.0.44 (2017-05-09)
* Updated hap.js
* hola_player.js and videojs.swf are now used from player2.h-cdn.com instead of jsdelivr

## 1.0.43 (2017-05-08)
* Updated hap.js

## 1.0.42 (2017-05-08)
* Updated hap.js
* Removed arrow functions from the require wrapper
* Made hola_vjs replaceable in hola_player.dash.js, too

## 1.0.41 (2017-05-04)
* Updated hap.js

## 1.0.39 (2017-05-04)
* Made the imported version of hola_vjs replaceable

## 1.0.37 (2017-05-03)
* Updated hap.js and videojs-settings dependencies. Fixed TypeError on old browsers

## 1.0.36 (2017-05-02)
* Updated hap.js dependency. Fixes hls source handler registration

## 1.0.35 (2017-05-02)
* Added videojs-watermark plugin

## 1.0.33 (2017-04-28)
* Load ima sdk script automatically
* Fixed ad controls on touch devices

## 1.0.32 (2017-04-27)
* Update videojs-settings dependency. Fixes manual quality selection after changing video source

## 1.0.31 (2017-04-26)
* Updated hap.js dependency. Fixed extra logging for hls and hls provider initialization if loaded as a part of loader.js

## 1.0.30 (2017-04-25)
* Updated hap.js dependency. Added extra logging for hls

## 1.0.29 (2017-04-24)
* Do not start loading hls video before play if preload=='none'

## 1.0.28 (2017-04-21)
* improved seeking UI on mobile devices

## 1.0.27 (2017-04-20)
* fix UI bug in fullscreen portrait mode

## 1.0.26 (2017-04-19)
* fixed popup menu link item padding
* fixed display of non-linear ads
* fixed error when localStorage access is denied

## 1.0.25 (2017-04-18)
* fixed ads initialization on iOS

## 1.0.24 (2017-04-15)
* update videojs-hola-skin dependency. Fixes CC button.
* depend on dashjs from npm
* update hap.js dependency
* fixed ads initialization on Android

## 1.0.23 (2017-04-12)
* fixed ads handling on Android

## 1.0.22 (2017-04-11)
* fixed handling multiple sources

## 1.0.21 (2017-04-10)
* update videojs-hola-skin dependency. Fixes UI bugs on Firefox and IE
* update videojs-settings dependency. Fixes popup menu bugs on touch devices

## 1.0.20 (2017-04-07)
* update videojs-thumbnails dependency. Add support for WebVTT thumbnails

## 1.0.19 (2017-04-03)
* update hap.js dependency. Improved HLS playlist fetching when
hola_adaptive is enabled

## 1.0.18 (2017-03-31)
* update videojs-thumbnails. Fixes thumbnails reinitialization

## 1.0.16 (2017-03-30)
* fixed duplicated quality level labels
* show current quality label

## 1.0.15 (2017-03-22)
* update videojs-thumbnails dependency. Add support for auto-generated thumbnails

## 1.0.14 (2017-03-19)
* added option to change swf urls for self hosting

## 1.0.12 (2017-03-13)
* update videojs-contrib-media-sources dependency. Fixes TypeError: AdtsStream is not a constructor

## 1.0.11 (2017-03-13)
* update videojs-settings dependency. fixes IE11 issue with CustomEvent

## 1.0.10 (2017-03-13)
* improve styles for live video, add show_time_for_live option
* add support for server-inserted ads by id3 metadata
