CHANGELOG
=========

## HEAD (Unreleased)
_(none)_

--------------------

## 1.0.39 (2017-05-04)
_(none)_

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

