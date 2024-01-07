// PublicRoute.tsx
import { FC } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: FC<PublicRouteProps> = ({ children }) => {
  const { user } = useAuth();

  console.log(user);

  if (user) {
    return <Navigate to='/' replace={true} />;
  }

  return children;
};

export default PublicRoute;
