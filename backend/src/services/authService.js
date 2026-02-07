import { User } from '../models/index.js';
import { AppError, generateTokens, verifyRefreshToken } from '../middlewares/index.js';
import { ErrorCodes } from '../config/errorCodes.js';

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(ErrorCodes.USER_EXISTS, 409);
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'user'
    });

    const tokens = generateTokens(user._id);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    
    if (!user || !user.isActive) {
      throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 401);
    }

    const tokens = generateTokens(user._id);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      ...tokens
    };
  }

  async refreshToken(token) {
    try {
      const decoded = verifyRefreshToken(token);
      
      if (decoded.type !== 'refresh') {
        throw new AppError(ErrorCodes.REFRESH_TOKEN_INVALID, 401);
      }

      const user = await User.findById(decoded.userId).select('+refreshToken');
      
      if (!user || !user.isActive || user.refreshToken !== token) {
        throw new AppError(ErrorCodes.REFRESH_TOKEN_INVALID, 401);
      }

      const tokens = generateTokens(user._id);

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return {
        user: this.sanitizeUser(user),
        ...tokens
      };
    } catch (error) {
      if (error.isOperational) throw error;
      throw new AppError(ErrorCodes.REFRESH_TOKEN_INVALID, 401);
    }
  }

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: 'Déconnexion réussie' };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId).populate('avatar');
    if (!user) {
      throw new AppError(ErrorCodes.USER_NOT_FOUND, 404);
    }
    return this.sanitizeUser(user);
  }

  sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    return {
      id: userObj._id,
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      fullName: `${userObj.firstName} ${userObj.lastName}`,
      role: userObj.role,
      avatar: userObj.avatar,
      createdAt: userObj.createdAt
    };
  }
}

export default new AuthService();
