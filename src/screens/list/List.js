import React, {useState, useEffect} from 'react';
import {FlatList, ActivityIndicator, Image, View, Text} from 'react-native';
import useQuery from './useQuery';

const Item = ({item}) => {
  return (
    <View style={{marginVertical: 4, paddingHorizontal: 16}}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 8,
          overflow: 'hidden',
          marginTop: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View style={{paddingRight: 16, flex: 0.8}}>
          <Text
            testID="Site"
            style={{
              borderWidth: 1,
              borderColor: '#2ed573',
              textAlignVertical: 'bottom',
              color: '#2ed573',
              borderRadius: 4,
              padding: 4,
              alignSelf: 'flex-start',
            }}>
            {item.site}
          </Text>
          <View style={{flexGrow: 1, justifyContent: 'flex-end'}}>
            <Text testID="Rocket">{`${item.rocket.name} \u2022 ${item.rocket.type}`}</Text>
            <Text testID="MissionName" style={{fontWeight: '700'}}>
              {item.mission.name}
            </Text>
          </View>
        </View>
        <Image
          testID="MissionPatch"
          source={{uri: item.mission.missionPatch}}
          style={{
            alignItems: 'center',
            height: 100,
            width: 100,
            backgroundColor: '#24004B',
            borderRadius: 8,
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default List = () => {
  const {onLoadMore, onRefresh, status, data} = useQuery();

  const renderItem = ({item}) => <Item item={item} />;
  const keyExtractor = item => item.id;

  return (
    <View style={{flex: 1, backgroundColor: '#24004B'}}>
      {status === 'loading' && (
        <ActivityIndicator
          testID="loading"
          size="large"
          style={{flex: 1}}
          color="white"
        />
      )}
      <FlatList
        testID="FlatList"
        keyExtractor={keyExtractor}
        onRefresh={onRefresh}
        contentContainerStyle={{paddingBottom: 100}}
        refreshing={status === 'refresh'}
        data={data.launches}
        renderItem={renderItem}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          status === 'more' && (
            <ActivityIndicator
              testID="more"
              size="large"
              color="white"
              style={{padding: 16}}
            />
          )
        }
      />
    </View>
  );
};
