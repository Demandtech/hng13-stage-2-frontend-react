import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { authService } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!authService.isAuthenticated()) {
//       navigate('/auth/login', { replace: true });
//     }
//   }, [navigate]);

//   if (!authService.isAuthenticated()) {
//     return null;
//   }

  return <>{children}</>;
};
