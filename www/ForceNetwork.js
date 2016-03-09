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

ForceNetwork.prototype.isOnlineNow = function(){
  var xmlhttp = new XMLHttpRequest();
  var that = this;

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xhttp.status == 200) {
      that.options.isOnline();    
    }else{
      that.options.isOffline();
    }
  };

  xmlhttp.open('GET', this.options.url, true);
  xmlhttp.send();
};

ForceNetwork.prototype.isConnected = function () {
    return (navigator.connection.type === Connection.WIFI || 
            navigator.connection.type === Connection.CELL_2G || 
            navigator.connection.type === Connection.CELL_3G ||
            navigator.connection.type === Connection.CELL_4G ||
            navigator.connection.type === Connection.CELL);
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
                      console.log("button clicked " + buttonIndex);
                      if(buttonIndex == 1){
                        that.confirmWindow = false;
                        that.enableWifi();
                        if(success){
                          setTimeout(function(){
                            that.isOnline();
                          }, 5000);
                        }                      
                      }else if(buttonIndex == 2){
                        that.confirmWindow = false;
                        that.openNetworkSettings();
                      }else{
                        that.confirmWindow = false;
                        that.options.isError();  
                      }                      
                  }, that.options.confirmTitle, ["Enable WiFi", "Open Netowrk", "Cancel"]);
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
                        if(success){
                          setTimeout(function(){
                            that.isOnline();
                          }, 5000);
                        }                      
                      }else if(buttonIndex == 2){
                        that.confirmWindow = false;
                        that.openNetworkSettings();
                      }else{
                        that.confirmWindow = false;
                        that.options.isError();  
                      }                      
                  }, that.options.confirmTitle, ["Enable WiFi", "Open Netowrk", "Cancel"]);
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
  this.isOnlineNow();
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
    this.options.url = options.url || 'http://www.google.com';
    this.options.isOnline = options.isOnline || function(){};
    this.options.isOffline = options.isOffline || function(){};
    this.options.isError = options.isError || function(){};

    document.addEventListener("online", this.onOnline.bind(this), false);
    document.addEventListener("offline", this.onOffline.bind(this), false);
    document.addEventListener("resume", this.onResume.bind(this), false);
};

module.exports = new ForceNetwork();
