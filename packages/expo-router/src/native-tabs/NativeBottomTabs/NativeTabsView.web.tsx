import { NavigationMenu } from 'radix-ui';
import React from 'react';
import { Text, View, type ColorValue, type TextStyle } from 'react-native';

import type { NativeTabsViewProps } from './types';
import { shouldTabBeVisible } from './utils';

export function NativeTabsView(props: NativeTabsViewProps) {
  const { builder } = props;
  const { state, descriptors, navigation } = builder;
  const { routes } = state;

  const items = routes
    .filter(({ key }) => shouldTabBeVisible(descriptors[key].options))
    .map((route, index) => (
      <TabItem
        key={route.key}
        isFocused={state.index === index}
        title={descriptors[route.key].options.title ?? route.name}
        badgeValue={descriptors[route.key].options.badgeValue}
        badgeStyle={{
          backgroundColor: descriptors[route.key].options.tabBarItemBadgeBackgroundColor,
          color: descriptors[route.key].options.tabBarItemBadgeTextColor,
        }}
        style={{
          backgroundColor: props.style?.['&:active']?.indicatorColor,
        }}
        textStyle={{
          fontFamily: props.style?.fontFamily,
          fontSize: props.style?.fontSize,
          fontWeight: props.style?.fontWeight,
          fontStyle: props.style?.fontStyle,
          color: props.style?.color,
        }}
        activeTextStyle={{
          color: props.style?.tintColor ?? props.style?.['&:active']?.color,
          fontSize: props.style?.['&:active']?.fontSize,
        }}
        onPress={() => {
          navigation.dispatch({
            type: 'JUMP_TO',
            target: state.key,
            payload: {
              name: route.name,
            },
          });
        }}
      />
    ));
  const children = routes
    .filter(
      ({ key }, index) => shouldTabBeVisible(descriptors[key].options) && state.index === index
    )
    .map((route) => {
      return (
        <div
          style={{
            flex: 1,
            display: 'flex',
          }}>
          {descriptors[route.key].render()}
        </div>
      );
    });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <NavigationMenu.Root
        style={{
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          position: 'fixed',
          zIndex: 10,
        }}>
        <NavigationMenu.List
          style={{
            display: 'flex',
            backgroundColor: props.style?.backgroundColor
              ? String(props.style?.backgroundColor)
              : '#272727',
            height: 40,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            boxSizing: 'border-box',
            margin: 0,
          }}>
          {items}
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 0,
          overflowY: 'auto',
        }}>
        {children}
      </div>
    </div>
  );
}

interface TabItemProps {
  isFocused: boolean;
  title: string;
  badgeValue?: string;
  badgeStyle?: {
    backgroundColor?: ColorValue;
    color?: ColorValue;
  };
  style: {
    backgroundColor?: ColorValue;
  };
  onPress: () => void;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

function TabItem(props: TabItemProps) {
  const { isFocused, title, onPress, badgeValue } = props;
  const [isHovered, setIsHovered] = React.useState(false);
  const isBadgeEmpty = badgeValue === ' ';
  const badgeSize = isBadgeEmpty ? 14 : 20;

  const definedTextStyle = Object.fromEntries(
    Object.entries(props.textStyle ?? {}).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );
  const definedActiveTextStyle = isFocused
    ? Object.fromEntries(
        Object.entries(props.activeTextStyle ?? {}).filter(
          ([, value]) => value !== undefined && value !== null
        )
      )
    : {};
  const activeBackgroundColor = props.style?.backgroundColor
    ? String(props.style?.backgroundColor)
    : '#444444';

  return (
    <NavigationMenu.Item
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        listStylePosition: 'inside',
        height: '100%',
      }}>
      <NavigationMenu.Trigger
        onClick={onPress}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isFocused ? activeBackgroundColor : 'transparent',
          border: 'none',
          margin: 0,
          height: '100%',
          borderRadius: 20,
          padding: '0 20px',
          cursor: 'pointer',
          outlineColor: '#444444',
          position: 'relative',
        }}>
        <Text
          style={{
            fontWeight: 500,
            fontSize: 15,
            opacity: !isFocused && isHovered ? 0.6 : 1,
            color: isFocused ? 'white' : '#8b8b8b',
            ...definedTextStyle,
            ...definedActiveTextStyle,
          }}>
          {title}
        </Text>
        {badgeValue && (
          <View
            style={{
              position: 'absolute',
              right: isBadgeEmpty ? 4 : 0,
              top: 0,
              minWidth: badgeSize,
              paddingHorizontal: 4,
              paddingVertical: 2,
              width: 'auto',
              height: badgeSize,
              boxSizing: 'border-box',
              borderRadius: badgeSize / 2,
              backgroundColor: props.badgeStyle?.backgroundColor ?? 'red',
            }}>
            <Text
              style={{
                color: props.badgeStyle?.color ?? 'white',
                fontSize: 12,
                textAlign: 'center',
              }}>
              {badgeValue}
            </Text>
          </View>
        )}
      </NavigationMenu.Trigger>
    </NavigationMenu.Item>
  );
}
