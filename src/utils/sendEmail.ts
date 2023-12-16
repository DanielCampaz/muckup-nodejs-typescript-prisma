import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import env from './enviroments';
import nodemailer from 'nodemailer';
import type { Options } from 'nodemailer/lib/mailer';

export interface EmailInputs {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  phone: number;
}
export default class SendEmail {
  static instance: SendEmail | null = null;
  private readonly email: string = env.EMAIL_NODEMAILER ?? '';
  private readonly password: string = env.PASSWORD_NODEMAILER ?? '';
  private nameEmail: string;
  private host: string;
  private service: string;
  private port: number;

  private constructor() {
    this.nameEmail = 'MuckUp Express And TypeScript';
    this.host = 'smtp.gmail.com';
    this.service = 'gmail';
    this.port = 587;
  }

  NameEmail(nameEmail: string): void {
    this.nameEmail = nameEmail;
  }

  Host(host: string): void {
    this.host = host;
  }

  Service(service: string): void {
    this.service = service;
  }

  Port(port: number): void {
    this.port = port;
  }

  async send(
    to: `${string}@${string}.${string}`,
    data: EmailInputs
  ): Promise<null | SMTPTransport.SentMessageInfo> {
    if (
      data.email === undefined ||
      data.fullName === undefined ||
      data.message === undefined ||
      data.subject === undefined ||
      data.phone === undefined
    ) {
      console.log('Error to Data Input');
      return null;
    } else {
      const email = `${this.nameEmail} <${this.email}>`;
      const transporter = nodemailer.createTransport({
        host: this.host,
        port: this.port,
        secure: true,
        service: this.service,
        auth: {
          // TODO: replace user and pass values from:
          // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
          user: this.email,
          pass: this.password
        }
      });

      const options: Options = {
        from: email,
        to,
        subject: `${data.fullName} with the email ${data.email} and telephone number ${data.phone} needs a service`,
        html: `Data`
      };
      return await transporter.sendMail(options);
    }
  }

  static getInstances(): SendEmail {
    if (this.instance === null) {
      this.instance = new SendEmail();
    }
    return this.instance;
  }
}
