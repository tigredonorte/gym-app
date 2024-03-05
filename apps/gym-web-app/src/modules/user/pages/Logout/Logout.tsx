export const Logout: React.FC = () => {
  localStorage.removeItem('userData');
  window.location.href = '/';
  return (<></>);
}