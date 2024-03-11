import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface LinkCompProps {
  subTitle: string;
  content: string;
  url: string;
}

interface SimpleLinkCompProps {
  includeSubTitle?: boolean;
}

const LinkComp = ({ subTitle, content, url }: LinkCompProps) => {
  const LinkType = (
    <Link component={RouterLink} to={url} variant="body2" className='link'>
      {content}
    </Link>
  )
  if (!subTitle) {
    return LinkType;
  }

  return (
    <div className='box'>
      <span className='pad'>{subTitle}</span>
      {LinkType}
    </div>
  )
}

export const LoginLink = ({ includeSubTitle = true }: SimpleLinkCompProps) => (
  <LinkComp subTitle={includeSubTitle ? 'Have an account?' : ''} content='Login' url='/auth' />
)


export const SignupLink = ({ includeSubTitle = true }: SimpleLinkCompProps) => (
  <LinkComp subTitle={includeSubTitle ? "Don't have an account?" : ''} content='Create Account' url='/auth/signup' />
)

export const ForgotLink = ({ includeSubTitle = true, email = '' }: SimpleLinkCompProps & { email?: string }) => (
  <LinkComp 
    subTitle={includeSubTitle ? "Don't know your account?" : ''} 
    content='Forgot Password' 
    url={`/auth/forgot-password${email &&`?email=${email}`}`} 
  />
)
