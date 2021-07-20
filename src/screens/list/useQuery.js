import React, {useState, useEffect} from 'react';
import {FlatList, ActivityIndicator, Image, View, Text} from 'react-native';
import ApolloGraphql from '../../modules/ApolloGraphql';

export default function useQuery() {
  const pageSize = 10;
  const [query, setQuery] = useState({
    status: '',
    data: {
      cursor: '',
      hasMore: false,
      launches: [],
    },
  });

  const onLoad = newQuery => {
    setQuery(prevQuery => ({...prevQuery, ...newQuery}));
    request();
  };

  const onRefresh = () =>
    onLoad({
      status: 'refresh',
      data: {
        cursor: '',
        hasMore: false,
        launches: [],
      },
    });

  const onLoadMore = () => {
    if (query.data.hasMore && query.status !== 'more') {
      onLoad({status: 'more'});
    }
  };

  const request = () => {
    ApolloGraphql.query(
      pageSize,
      query.data.cursor,
      newData => {
        setQuery(prevQuery => ({
          status: 'success',
          data: {
            ...newData,
            launches: [...prevQuery.data.launches, ...newData.launches],
          },
        }));
      },
      error => setQuery(prevQuery => ({...prevQuery, status: 'error'})),
    );
  };

  useEffect(() => {
    ApolloGraphql.initiateClient(
      'https://apollo-fullstack-tutorial.herokuapp.com/',
    );
    onLoad({status: 'loading'});
  }, []);

  return {onLoad, onRefresh, onLoadMore, ...query};
}
