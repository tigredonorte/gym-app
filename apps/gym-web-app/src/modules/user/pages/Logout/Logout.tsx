import { EnvContext } from '@gym-app/shared/web';
import React from 'react';
import { Navigate } from 'react-router-dom';

// export const Logout: React.FC = () => {
//   // localStorage.removeItem('userData');
//   // window.location.href = '/';
//   return (<>aaaaaaaaa</>);
// }

export class Logout extends React.Component< object,{ requestComplete?: boolean }> {
  static contextType = EnvContext;
  declare context: React.ContextType<typeof EnvContext>;
  state = {
    requestComplete: false,
  };

  async componentDidMount() {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('User data not found');
      }

      console.log('userData', userData);
      const { email, sessionId } = JSON.parse(userData);
      const url = `${this.context.backendEndpoint}/auth/logout`;
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          sessionId,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error(data.errorMessage);
      }
  
    } catch (error) {
      console.error('Error during fetch operation', error);
    } finally {
      localStorage.removeItem('userData');
      this.setState({ requestComplete: true });
    }
  }

  render() {
    const { requestComplete } = this.state;
    if (requestComplete) {
      return <Navigate to="/" replace={true} />;
    }

    return (<></>)
  }
}
