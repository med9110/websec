import { authService } from '../services/index.js';
import { asyncHandler } from '../middlewares/index.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Inscription réussie',
    data: result
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  res.status(200).json({
    success: true,
    message: 'Connexion réussie',
    data: result
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  
  res.status(200).json({
    success: true,
    message: 'Tokens renouvelés',
    data: result
  });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  
  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);
  
  res.status(200).json({
    success: true,
    data: user
  });
});
