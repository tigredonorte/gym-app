import { Container, Heading, Section, Text } from '@react-email/components';
import { defaultProps } from '../base/defaultProps.config';
import { Email } from '../base/Email';
import { DefaultEmailProps } from '../base/Email.model';
import { tailwindConfig, typography } from '../base/tailwind.config';

export interface RevertChangeEmailProps extends DefaultEmailProps {
  title: string;
}

export default function RevertChangeEmail(props: RevertChangeEmailProps) {
  const { title } = props;

  return (
    <Email {...props}>
      <Container className="max-w-lg mx-auto p-5 pt-0">

        <Section className="text-center mt-8">
          <Section className="mt-8 text-center">
            <Heading className="text-3xl font-semibold leading-10 tracking-wide text-gray-900">
              {title}
            </Heading>
            <Text className="mt-2 text-base leading-6 text-gray-500">
              Your email has recently changed by you or someone else. But you reverted the change.
              If you think this is wrong, please, enter in contact with us by replying to this email
            </Text>

          </Section>
        </Section>

      </Container>
    </Email>
  );
}

RevertChangeEmail.defaultProps = {
  tailwindConfig,
  typography,
};

RevertChangeEmail.PreviewProps = {
  ...defaultProps,
  title: 'Reverted Change Email',
};


