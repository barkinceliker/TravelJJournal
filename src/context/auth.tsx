// AuthProvider.tsx
import { FC, createContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

// AuthContext tanımı
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

// AuthProvider tanımı
interface AuthProviderProps {
  children: React.ReactElement;
}
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Komponent unmount olduğunda aboneliği temizle
  }, []);

  const value = {
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
