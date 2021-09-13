import React from 'react';
import { Text, View } from 'react-native';

// home screen and more screen
// more screen contains just some wording
// home screen
//   a button, onclick
//     if first time, ask for permission
//       if not granted, pop up modal saying permission needed
//       if granted, replace the button with lat, long
//       with additional button to save the location, onclick
//          name the place
//   on top, have button that see list of locations
export default function MoreScreen() {
  return (
    <View>
      <Text>more screen</Text>
    </View>
  );
}

