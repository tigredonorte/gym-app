import { Body, Html, Tailwind } from '@react-email/components';
import React from 'react';
import { DefaultEmailProps } from './Email.model';
import { Footer } from './Footer';
import { Header } from './Header';

export const Email = ({ children, tailwindConfig, typography, ...params }: DefaultEmailProps & { children: React.ReactNode }) => {
  return (
    <Tailwind
      config={tailwindConfig}
    >
      <Html lang="en">
        <Body style={typography}>
          <Header {...params} />
          {children}
          <Footer {...params} />
        </Body>
      </Html>
    </Tailwind>
  );
};
