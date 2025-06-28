import { Container, Heading, Section, Text, Button } from '@react-email/components';
import { defaultProps } from '../base/defaultProps.config';
import { Email } from '../base/Email';
import { DefaultEmailProps } from '../base/Email.model';
import { tailwindConfig, typography } from '../base/tailwind.config';

export interface PasswordRecoveryProps extends DefaultEmailProps {
  title: string;
  recoverCode: string;
  recoverLink: string;
}

export default function PasswordRecovery(props: PasswordRecoveryProps) {
  const { title, recoverCode, recoverLink } = props;

  return (
    <Email {...props}>
      <Container className="max-w-lg mx-auto p-5 pt-0">
        <Section className="text-center mt-8">
          <Heading className="text-3xl font-semibold leading-10 tracking-wide text-gray-900">
            {title}
          </Heading>
          <Text className="mt-4 text-base leading-6 text-gray-700">
            An attempt to recover your password has been made.
          </Text>
          <Text className="mt-2 text-base leading-6 text-gray-700">
            If it wasn't you, please ignore this email.
          </Text>
          <Section className="mt-6">
            <Text className="text-xl font-semibold leading-6 text-gray-900">Your Recovery Code:</Text>
            <Text className="code mt-2 text-2xl font-bold text-blue-900">{recoverCode}</Text>
          </Section>
          <Button
            href={recoverLink}
            className="mt-6 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Recover Password
          </Button>
        </Section>
      </Container>
    </Email>
  );
}

PasswordRecovery.defaultProps = {
  tailwindConfig,
  typography,
};

PasswordRecovery.PreviewProps = {
  ...defaultProps,
  title: 'Password Recovery',
  recoverCode: '123456',
  recoverLink: 'https://example.com/recover',
};
