import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { AUTH_SERVICE } from '../../../utils/constant/services.constant';
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy,
        private readonly configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>("FACEBOOK_CLIENT_ID"),
            clientSecret: configService.get<string>("FACEBOOK_CLIENT_SECRET"),
            callbackURL: configService.get<string>("FACEBOOK_REDIRECT_URI"),

            scope: ["email", "public_profile"],
            profileFields: ["id", "emails", "name", "picture.type(large)", "birthday"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<any> {
        try {
            const source = this.authClient.send('authClient/facebook_login', { accessToken, profile }).pipe(
                timeout(5000)
            );
            const result = await lastValueFrom(source);
        }
        catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}