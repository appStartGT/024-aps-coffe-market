import { useContext } from 'react';
import { AuthContext } from '../app/context/FirebaseAuthContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;
