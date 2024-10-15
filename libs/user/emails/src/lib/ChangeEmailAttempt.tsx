import { Button, Container, Heading, Section, Text } from '@react-email/components';
import { AccessDetails } from '../base/AccessDetails';
import { Email } from '../base/Email';
import { DefaultEmailProps } from '../base/Email.model';
import { tailwindConfig, typography } from '../base/tailwind.config';

export interface ChangeEmailAttemptProps extends DefaultEmailProps {
  changeEmailLink: string;
  changePasswordLink: string;
  location?: string;
  device?: string;
  browser?: string;
  os?: string;
  title: string;
}

export default function ChangeEmailAttempt(props: ChangeEmailAttemptProps) {
  const { changeEmailLink, changePasswordLink, location, device, browser, os, title } = props;

  return (
    <Email {...props}>
      <Container className="max-w-lg mx-auto p-5 pt-0">

        <Section className="text-center mt-8">
          <Section className="mt-8 text-center">
            <Heading className="text-3xl font-semibold leading-10 tracking-wide text-gray-900">
              {title}
            </Heading>
            <Text className="mt-2 text-base leading-6 text-gray-500">
              We received one request to change your account email. You can click on the link below to confirm the new email address.
            </Text>

            <Button
              className="mt-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6"
              href={changeEmailLink}
            >
              Change Email
            </Button>
          </Section>
        </Section>

        <Section className="text-center mt-8 bg-secondary-light p-6 rounded-lg">
          <Text className="text-base leading-6 text-gray-600">
            If this wasn't you, we recommend that you change your password immediately. This request can only be made by someone accessing your account.
          </Text>

          <Button
            className="mt-4 rounded-lg bg-secondary-dark text-primary-contrastText font-semibold py-3 px-6"
            href={changePasswordLink}
          >
            Change Password
          </Button>
        </Section>

        <AccessDetails location={location} device={device} browser={browser} os={os} />
      </Container>
    </Email>
  );
}

ChangeEmailAttempt.defaultProps = {
  tailwindConfig,
  typography,
};

ChangeEmailAttempt.PreviewProps = {
  changeEmailLink: 'https://thomfilg.com',
  changePasswordLink: 'https://thomfilg.com',
  location: 'Lagos, Nigeria',
  device: 'iPhone 11',
  browser: 'Chrome',
  os: 'iOS',
  title: 'Change Email Attempt',

  companyName: 'Tech Solutions Inc.',
  tagline: 'Innovate Your World',
  logoSrc: 'https://picsum.photos/90',
  address: '456 Innovation Drive, Tech City, TX 78901',
  email: 'contact@techsolutions.com',
  phoneNumber: '+1234567890',
  facebookLink: 'https://facebook.com/techsolutions',
  xLink: 'https://x.com/techsolutions',
  instagramLink: 'https://instagram.com/techsolutions',
};


