import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly entityManager: EntityManager
  ) { }

  async sendUserConfirmation(dto) {
    const { userInfo, email } = dto;
    try {
      const generateOtpQuery = 'SELECT * FROM f_generate_otp($1, $2)';
      const generateOtpParams = [userInfo.id_user, email];
      const code = await this.entityManager.query(generateOtpQuery, generateOtpParams);

      const sendConfirmation = await this.mailerService.sendMail({
        to: email,
        from: '"Famfund" <famfund@famfund.com>',
        subject: `Your OTP for Famfund Account Verification is ${code[0].f_generate_otp}`,
        template: 'verifyAccount',
        context: {
          name: userInfo.firstname + ' ' + userInfo.lastname,
          otp: code[0].f_generate_otp
        }
      });

      return {
        message: 'OTP has been sent to your email',
        data: sendConfirmation
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async sendInvite(id_user, id_family) {
    try {
      const Query = 'select f_generate_link_invite($1)';
      const params = [id_family];
      const result = await this.entityManager.query(Query, params);
      const inviteLink = result[0].f_generate_link_invite;

      const emailContent = `
            Join Famfund!

            We are a community of warmth, support, and love. We are thrilled to welcome you to join our family!

            Please use the following link to join Famfund: ${inviteLink}
        `;
      return emailContent;

    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async sendResetPassword(dto) {

  }
}
