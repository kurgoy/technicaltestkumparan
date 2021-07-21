import {render, fireEvent} from '@testing-library/react-native';
import React from 'react';
import List from '../List';
import useQuery from '../useQuery';

jest.mock('../useQuery', () => jest.fn());

const launches = [
  {
    id: '89',
    site: 'CCAFS SLC 40',
    rocket: {
      name: 'Falcon 9',
      type: 'FT',
    },
    mission: {
      name: 'Starlink 3',
      missionPatch: 'https://images2.imgbox.com/d2/3b/bQaWiil0_o.png',
    },
  },
];

test('show indicator loading', () => {
  useQuery.mockImplementation(() => ({
    status: 'loading',
    data: {
      launches: [],
    },
  }));

  const {getByTestId} = render(<List />);

  expect(getByTestId('Loading')).toBeTruthy();
});

test('show indicator more', () => {
  useQuery.mockImplementation(() => ({
    status: 'more',
    data: {
      launches: [],
    },
  }));

  const {getByTestId} = render(<List />);

  expect(getByTestId('More')).toBeTruthy();
});

test('show error message', () => {
  useQuery.mockImplementation(() => ({
    status: 'error',
    data: {
      launches: [],
    },
  }));
  const {getByTestId} = render(<List />);
  expect(getByTestId('Error')).toBeTruthy();
});

test('call onLoadMore', () => {
  const onLoadMore = jest.fn();
  useQuery.mockImplementation(() => ({
    status: '',
    onLoadMore: onLoadMore,
    data: {
      launches: launches,
    },
  }));

  const {getByTestId} = render(<List />);

  const eventData = {
    nativeEvent: {
      contentOffset: {
        y: 500,
      },
      contentSize: {
        height: 500,
        width: 100,
      },
      layoutMeasurement: {
        height: 100,
        width: 100,
      },
    },
  };
  fireEvent.scroll(getByTestId('FlatList'), eventData);
  expect(onLoadMore).toHaveBeenCalled();
});

test('check item mapping is correct', () => {
  const onLoadMore = jest.fn();

  useQuery.mockImplementation(() => ({
    status: '',
    onLoadMore: onLoadMore,
    data: {
      launches: launches,
    },
  }));

  const {getByTestId} = render(<List />);

  expect(getByTestId('Site').props.children).toEqual(launches[0].site);
  expect(getByTestId('Rocket').props.children).toEqual(
    `${launches[0].rocket.name} \u2022 ${launches[0].rocket.type}`,
  );
  expect(getByTestId('MissionName').props.children).toEqual(
    launches[0].mission.name,
  );
  expect(getByTestId('MissionPatch').props.source.uri).toEqual(
    launches[0].mission.missionPatch,
  );
});
