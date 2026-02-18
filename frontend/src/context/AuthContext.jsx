
import { createContext,useContext,useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export const useAuth = ()=>useContext(AuthContext);

export function AuthProvider({children}){
  const [token,setToken] = useState(localStorage.getItem("token"));
  const user = token ? jwtDecode(token) : null;

  const login = t => {
    localStorage.setItem("token",t);
    setToken(t);
  };

  const logout = ()=>{
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{token,user,login,logout}}>
      {children}
    </AuthContext.Provider>
  );
}
