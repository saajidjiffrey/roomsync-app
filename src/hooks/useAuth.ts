import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store/hooks';
import {
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectUserRole,
  login,
  register,
  logout,
  getProfile,
  updatePassword,
  clearError,
  refreshUserProfile,
} from '../store/slices/authSlice';
import { LoginRequest, RegisterRequest, PasswordUpdateRequest } from '../types/user';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const userRole = useSelector(selectUserRole);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    
    // Actions
    login: (credentials: LoginRequest) => dispatch(login(credentials)),
    register: (userData: RegisterRequest) => dispatch(register(userData)),
    logout: () => dispatch(logout()),
    getProfile: () => dispatch(getProfile()),
    updatePassword: (passwordData: PasswordUpdateRequest) => dispatch(updatePassword(passwordData)),
    clearError: () => dispatch(clearError()),
    refreshUserProfile: () => dispatch(getProfile()),
    
    // Helper methods
    isAdmin: userRole === 'admin',
    isOwner: userRole === 'owner',
    isTenant: userRole === 'tenant',
    hasRole: (role: string | string[]) => {
      if (!userRole) return false;
      if (Array.isArray(role)) {
        return role.includes(userRole);
      }
      return userRole === role;
    },
  };
};
