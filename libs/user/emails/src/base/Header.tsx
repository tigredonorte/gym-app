import { Column, Head, Img, Link, Row, Section } from '@react-email/components';
import { DefaultEmailProps } from './Email.model';

export const Header = ({
  facebookLink,
  xLink,
  instagramLink,
  logoSrc,
  companyName,
}: DefaultEmailProps) => (
  <Head>
    <Section className="px-8 pt-10 pb-0">
      <Row>
        <Column className="w-4/5">
          <Img
            alt={`${companyName} Logo`}
            height="42"
            src={logoSrc}
          />
        </Column>

        <Column className="flex justify-end">
          <Row className="flex justify-end">
            {xLink && (
              <Column>
                <Link href={xLink} target="_blank">
                  <Img
                    alt="Facebook"
                    height="36"
                    src="https://react.email/static/x-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
            )}
            {instagramLink && (
              <Column>
                <Link href={instagramLink} target="_blank">
                  <Img
                    alt="Facebook"
                    height="36"
                    src="https://react.email/static/instagram-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
            )}
            {facebookLink && (
              <Column>
                <Link href={facebookLink} target="_blank">
                  <Img
                    alt="Facebook"
                    height="36"
                    src="https://react.email/static/facebook-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
            )}
          </Row>
        </Column>
      </Row>
    </Section>
  </Head>
);
