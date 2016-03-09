
package com.jumpbyte.forcenetwork;

import java.util.TimeZone;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.provider.Settings;

public class CDVForceNetwork extends CordovaPlugin {
    public static final String TAG = "CDVForceNetwork";
    
    /**
     * Constructor.
     */
    public CDVForceNetwork() {
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("openNetworkSettings".equals(action)) {
            Context context=this.cordova.getActivity().getApplicationContext();
            Intent intent = new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
        else if("enableWifi".equals(action)){
            Context context=this.cordova.getActivity().getApplicationContext(); 
            WifiManager wifiManager = (WifiManager)context.getSystemService(context.WIFI_SERVICE);
            wifiManager.setWifiEnabled(true);
        }
        else {
            return false;
        }
        return true;
    }
}