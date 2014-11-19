var exec = require("cordova/exec");

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
    return (navigator.connection.type !== Connection.NONE);
};

ForceNetwork.prototype.openNetworkSettings = function () {
    cordova.exec(function() {}, function() {}, "CDVForceNetwork", "openNetworkSettings", []);
};

ForceNetwork.prototype.ensureNetworkConnection = function () {
    // ensure network is available and invite user to open settings
    var that = this;
    if (!this.isConnected()) {
        navigator.notification.confirm(this.options.confirmMessage, function(buttonIndex) {
            that.openNetworkSettings();
        }, this.options.confirmTitle, [this.options.confirmButtonTitle]);
    }
};

ForceNetwork.prototype.init = function(options) {
    this.options = options || {};
    this.options.confirmTitle = options.confirmTitle || 'Network access';
    this.options.confirmMessage = options.confirmMessage || 'Internet connexion is not available';
    this.options.confirmButtonTitle = options.confirmButtonTitle || 'Open settings';

    document.addEventListener("resume", this.ensureNetworkConnection.bind(this), false);
    document.addEventListener("offline", this.ensureNetworkConnection.bind(this), false);
    this.ensureNetworkConnection();
};


module.exports = new ForceNetwork();
