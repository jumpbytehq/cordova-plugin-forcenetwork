# cordova-plugin-forcenetwork

This plugin is modified to now support Android as well.

Ensure we always have WiFi available and invite user to change its settings if not.

This plugin use cordova [network-information](https://github.com/apache/cordova-plugin-network-information) and [dialogs](https://github.com/apache/cordova-plugin-dialogs) plugins.

Connexion status is checked on : online, offline, resume

:warning: plugin should add a `CFBundleURLTypes` in the app `plist` file. Make sure it is.

## Installation

Install the plugin :

`cordova plugin add --save https://github.com/dhavaln/cordova-plugin-forcenetwork.git`

## Usage

#### `cordova.plugins.ForceNetwork.init(options)`

Initialize the plugins with options and performs a first connection check.

options :

 - `confirmTitle` : title of the confirm window when no connexion
 - `confirmMessage` : title of the confirm message when no connexion
 - `confirmButtonTitle` : title of the button to open settings when no connexion
 - 'confirmButtonTitles' : this is required in case you want to show dialog to either enable WiFi or open Network (Android Only)
 - 'url' : this url will be used to check Internet connection, if not given it will use http://www.google.com
 

#### `cordova.plugins.ForceNetwork.getConnectionType()`

return a string representing current connection type

#### `cordova.plugins.ForceNetwork.isConnected()`

return boolean indicating if we have any internet

#### `cordova.plugins.ForceNetwork.openNetworkSettings()`

open iOS network settings panel
open Android network settings panel

#### `cordova.plugins.ForceNetwork.openNetworkDialog(success, error)`

open Dialog to ask user to enable WiFi Network or open Network settings panel

#### `cordova.plugins.ForceNetwork.ensureNetworkConnection()`

Check if any connection available, and if not, display a dialog to invite user to change its network settings.

## Licence MIT

Code distributed under MIT licence. Contributions welcome.
