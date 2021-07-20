package com.technicaltestkumparan;

import android.util.Log;
import com.apollographql.apollo.ApolloCall;
import com.apollographql.apollo.ApolloClient;
import com.apollographql.apollo.api.Input;
import com.apollographql.apollo.api.Query;
import com.apollographql.apollo.api.Response;
import com.apollographql.apollo.api.internal.QueryDocumentMinifier;
import com.apollographql.apollo.exception.ApolloException;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.google.gson.Gson;
import com.technicaltestkumparan.LaunchListQuery.Data;
import java.util.ArrayList;
import org.jetbrains.annotations.NotNull;

public class ApolloModule extends ReactContextBaseJavaModule {

  private String NAME = "ApolloGraphql";
  ApolloClient apolloClient;

  public ApolloModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void initiateClient(String url) {
     if (apolloClient == null) apolloClient = ApolloClient.builder().serverUrl(url).build();
  }

  @ReactMethod
  public void query(Integer pageSize,String cursor,Callback successCallback,Callback failureCallback) {
    apolloClient.query(new LaunchListQuery(Input.fromNullable(pageSize), Input.optional(cursor)))
                .enqueue(new ApolloCall.Callback<Data>() {
                  @Override
                  public void onResponse(@NotNull Response<Data> response) {
                    if (response.getData() != null) {
                      WritableMap map = Arguments.createMap();
                      map.putString("cursor", response.getData().launches.cursor);
                      map.putBoolean("hasMore",response.getData().launches.hasMore);

                      WritableArray launches = Arguments.createArray();

                      for(LaunchListQuery.Launch launch : response.getData().launches.launches){
                        WritableMap launchMap = Arguments.createMap();
                        launchMap.putString("id", launch.id);
                        launchMap.putString("site", launch.site);

                        WritableMap rocketMap = Arguments.createMap();
                        rocketMap.putString("name", launch.rocket.name);
                        rocketMap.putString("type", launch.rocket.type);
                        launchMap.putMap("rocket", rocketMap);

                        WritableMap missionMap = Arguments.createMap();
                        missionMap.putString("name", launch.mission.name);
                        missionMap.putString("missionPatch", launch.mission.missionPatch);
                        launchMap.putMap("mission", missionMap);

                        launches.pushMap(launchMap);
                      }
                      map.putArray("launches",launches);

                      successCallback.invoke(map);
                    }
                  }

                  @Override
                  public void onFailure(@NotNull ApolloException e) {
                    failureCallback.invoke(e);
                  }
                });
  }
}
