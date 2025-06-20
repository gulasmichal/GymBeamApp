import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#FF4410',
  secondary: '#FF4410',
  white: '#ffffff',
  black: '#000000',
  gray: '#cccccc',
  lightGray: '#e0e0e0',
  whitebg: 'F2F2F2',
  buttongray: "#959595"
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add more global styles as needed
});