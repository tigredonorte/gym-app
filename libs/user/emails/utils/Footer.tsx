import { Img, Link, Section } from '@react-email/components';
import React from 'react';
import { DefaultProps } from './Email.model';

export const Footer: React.FC<DefaultProps> = ({
  companyName,
  tagline,
  logoSrc,
  address,
  email,
  phoneNumber,
  facebookLink,
  xLink,
  instagramLink,
}) => {
  return (
    <Section className="w-full">
      <table className="w-full text-center">
        <tbody>
          {/* Logo Row */}
          {logoSrc && (
            <tr>
              <td align="center">
                <Img alt={`${companyName} Logo`} height="42" src={logoSrc} />
              </td>
            </tr>
          )}

          {/* Company Name and Tagline as Inputs */}
          {(companyName || tagline) && (
            <tr>
              <td>
                {companyName && (
                  <input
                    type="text"
                    defaultValue={companyName}
                    className="my-2 text-lg font-semibold leading-6 text-gray-900 text-center border-none bg-transparent w-full"
                    style={{ outline: 'none' }}
                  />
                )}
                {tagline && (
                  <input
                    type="text"
                    defaultValue={tagline}
                    className="mt-1 text-lg leading-6 text-gray-500 text-center border-none bg-transparent w-full"
                    style={{ outline: 'none' }}
                  />
                )}
              </td>
            </tr>
          )}

          {/* Social Media Icons Row */}
          {(facebookLink || xLink || instagramLink) && (
            <tr>
              <td align="center">
                <div className="flex justify-center items-center space-x-4 mt-2">
                  {facebookLink && (
                    <Link href={facebookLink} target="_blank">
                      <Img
                        alt="Facebook"
                        height="36"
                        src="https://react.email/static/facebook-logo.png"
                        width="36"
                      />
                    </Link>
                  )}
                  {xLink && (
                    <Link href={xLink} target="_blank">
                      <Img
                        alt="X"
                        height="36"
                        src="https://react.email/static/x-logo.png"
                        width="36"
                      />
                    </Link>
                  )}
                  {instagramLink && (
                    <Link href={instagramLink} target="_blank">
                      <Img
                        alt="Instagram"
                        height="36"
                        src="https://react.email/static/instagram-logo.png"
                        width="36"
                      />
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          )}

          {/* Address and Contact Info as Inputs */}
          {(address || email || phoneNumber) && (
            <tr>
              <td>
                {address && (
                  <input
                    type="text"
                    defaultValue={address}
                    className="my-2 text-lg font-semibold leading-6 text-gray-500 text-center border-none bg-transparent w-full"
                    style={{ outline: 'none' }}
                  />
                )}
                {email && (
                  <input
                    type="text"
                    defaultValue={email}
                    className="mt-1 text-lg font-semibold leading-6 text-gray-500 text-center border-none bg-transparent w-full"
                    style={{ outline: 'none' }}
                  />
                )}
                {phoneNumber && (
                  <input
                    type="text"
                    defaultValue={phoneNumber}
                    className="mt-1 text-lg font-semibold leading-6 text-gray-500 text-center border-none bg-transparent w-full"
                    style={{ outline: 'none' }}
                  />
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Section>
  );
};
