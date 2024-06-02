import React, {createContext, useContext} from "react";

export interface AuthProviderProps {
  token: string | undefined;
  updateToken: (token: string) => void;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [token, setToken] = React.useState<string | undefined>();

  if (!token) {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  }

  const updateToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  return <AuthContext.Provider value={{token, updateToken}}>{children}</AuthContext.Provider>
};

export const AuthContext = createContext<AuthProviderProps>({
  token: '',
  updateToken: () => {
  }
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
