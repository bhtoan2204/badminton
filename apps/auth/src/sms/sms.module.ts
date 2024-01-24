import { Module } from '@nestjs/common';
import { TwilioModule, TwilioService } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { SmsController } from './sms.controller';
import SmsService from './sms.service';

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
        RmqModule,
    ],
    controllers: [SmsController],
    providers: [SmsService],
    exports: [SmsService],
})
export class SmsModule { }