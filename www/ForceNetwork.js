var exec = require('cordova/exec');

var ForceNetwork = function(){};

ForceNetwork.prototype.getConnectionType = function () {
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    return states[navigator.connection.type];
};

ForceNetwork.prototype.isConnected = function () {
    return (navigator.connection.type === Connection.WIFI || 
            navigator.connection.type === Connection.CELL_2G || 
            navigator.connection.type === Connection.CELL_3G ||
            navigator.connection.type === Connection.CELL_4G);
};

ForceNetwork.prototype.enableWifi = function(){
  console.log("CDVForceNetwork - enable wifi");
    cordova.exec(function() {}, function() {}, "CDVForceNetwork", "enableWifi", []);
};

ForceNetwork.prototype.openNetworkSettings = function () {
  console.log("CDVForceNetwork - open network settings");
    cordova.exec(function() {}, function() {}, "CDVForceNetwork", "openNetworkSettings", []);
};

ForceNetwork.prototype.ensureNetworkConnection = function () {
    // ensure network is available and invite user to open settings
    var that = this;
    if (!this.isConnected()) {
        setTimeout(function() {
            // second check after timeout
            if (!that.isConnected()) {
                if (!that.confirmWindow) {
                  that.confirmWindow = true;
                  navigator.notification.confirm(that.options.confirmMessage, function(buttonIndex) {
                      that.confirmWindow = false;
                      that.openNetworkSettings();
                  }, that.options.confirmTitle, [that.options.confirmButtonTitle]);
                }
            }
        }, that.options.timeoutDelay);
    } else {
      navigator.notification.dismissAlert();
      that.confirmWindow = false;
    }
};

ForceNetwork.prototype.openNetworkDialog = function () {
    // ensure network is available and invite user to open settings
    var that = this;
    if (!this.isConnected()) {
        setTimeout(function() {
            // second check after timeout
            if (!that.isConnected()) {
                if (!that.confirmWindow) {
                  that.confirmWindow = true;
                  navigator.notification.confirm(that.options.confirmMessage, function(buttonIndex) {
            console.log("button clicked " + buttonIndex);
                      if(buttonIndex == 1){
                        that.confirmWindow = false;
                        that.enableWifi();
                      }else if(buttonIndex == 2){
                        that.confirmWindow = false;
                        that.openNetworkSettings();
                      }else{
                        that.confirmWindow = false;
                      }                      
                  }, that.options.confirmTitle, that.options.confirmButtonTitles);
                }
            }
        }, that.options.timeoutDelay);
    } else {
      navigator.notification.dismissAlert();
      that.confirmWindow = false;
    }
};

ForceNetwork.prototype.onOnline = function() {
  navigator.notification.dismissAlert();
  this.confirmWindow = false;
}
ForceNetwork.prototype.onOffline = function() {
  this.ensureNetworkConnection();
}
ForceNetwork.prototype.onResume = function() {
  this.ensureNetworkConnection();
}
ForceNetwork.prototype.init = function(options) {
    options = options || {};
    this.options = {
        timeoutDelay: 5000
    };
    this.options.confirmTitle = options.confirmTitle || 'Network access';
    this.options.confirmMessage = options.confirmMessage || 'Internet connection is not available';
    this.options.confirmButtonTitle = options.confirmButtonTitle || 'Open settings';
    this.options.confirmButtonTitles = options.confirmButtonTitles || ["Enable WiFi", "Open Netowrk", "Cancel"];

    document.addEventListener("online", this.onOnline.bind(this), false);
    document.addEventListener("offline", this.onOffline.bind(this), false);
    document.addEventListener("resume", this.onResume.bind(this), false);
};

module.exports = new ForceNetwork();
