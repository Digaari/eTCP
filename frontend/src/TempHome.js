// ImageDisplay.js
import React from 'react';
import { Container } from '@mui/material';

const ImageDisplay = () => {
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Ensure the container takes at least the full height of the viewport
      }}
    >
      <img
        src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fbluearmy.co.in%2Fcollections%2Fcorps-of-signals%2Fcap&psig=AOvVaw2Tp_HEGieJx4nSB80Qr2IL&ust=1703251417577000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMDB9pnQoIMDFQAAAAAdAAAAABAE" // Replace with the actual path to your image
        alt="Your Image"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </Container>
  );
};

export default ImageDisplay;
