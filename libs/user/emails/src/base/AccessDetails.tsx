import React from 'react';
import { Section, Text } from '@react-email/components';

interface AccessDetailsProps {
  location?: string;
  device?: string;
  browser?: string;
  os?: string;
}

export const AccessDetails: React.FC<AccessDetailsProps> = ({ location, device, browser, os }) => {
  if (!location && !device && !browser && !os) {
    return null;
  }

  return (
    <Section className="my-2 text-sm text-gray-700 text-center">
      <Text className="font-semibold leading-5 text-gray-700 mb-1">
        This request was made from the following device:
      </Text>

      <Text className="text-gray-700">
        <span className="font-medium text-gray-500">Date & Time:</span> {new Date().toLocaleString()}
        {location && (
          <>
            , <span className="font-medium text-gray-500">Location:</span> {location}
          </>
        )}
        {device && (
          <>
            , <span className="font-medium text-gray-500">Device:</span> {device}
          </>
        )}
        {browser && (
          <>
            , <span className="font-medium text-gray-500">Browser:</span> {browser}
          </>
        )}
        {os && (
          <>
            , <span className="font-medium text-gray-500">System:</span> {os}
          </>
        )}
      </Text>
    </Section>
  );
};
