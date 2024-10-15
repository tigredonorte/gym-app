import { Body, Html, Tailwind } from '@react-email/components';
import React from 'react';
import { DefaultProps } from './Email.model';
import { Footer } from './Footer';
import { Header } from './Header';
import { tailwindConfig, typography } from './tailwind.config';

export const Email = ({ children, ...params }: DefaultProps & { children: React.ReactNode }) => {
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