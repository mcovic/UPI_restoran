import { NextFunction, Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { AuthService } from '../services/AuthService';
import { LoginCredentials } from '../types/auth';

// --------------------------------------------------------------

export class AuthController {
    private readonly authService;
    public readonly authRouter;

    constructor() {
        this.authRouter = Router();
        this.authService = new AuthService();

        this.authRouter.post('/register', this.register.bind(this));
        this.authRouter.post('/login', this.login.bind(this));
    }

    // TODO napravit refreshToken i logout funkcionalnost
    private async register(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: User = req.body;
            const user = await this.authService.register(userData);

            // after creating user from registration process, log him in
            const authData = { email: user.email, username: userData.username, password: userData.password };
            const { accessToken, refreshToken } = await this.authService.login(authData);

            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // maxAge is in milliseconds, so it is 1 day
            res.status(201).json({ message: 'User created', accessToken, user });
        } catch (error) {
            next(error);
        }
    }

    private async login(req: Request, res: Response, next: NextFunction) {
        try {
            const userAuthData: LoginCredentials = req.body;
            const { accessToken, refreshToken } = await this.authService.login(userAuthData);

            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // maxAge is in milliseconds, so it is 1 day
            res.status(200).json({ accessToken });
        } catch (error) {
            next(error);
        }
    }
}