import { Module } from '@nestjs/common';
import { TwilioModule, TwilioService } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TwilioModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                accountSid: config.get('TWILIO_ACCOUNT_SID'),
                authToken: config.get('TWILIO_AUTH_TOKEN'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [TwilioService],
    exports: [TwilioService],
})
export class SmsModule { }