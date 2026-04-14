import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {}

  async sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY not configured. Logging reset link to console only.',
      );
      this.logger.log(`[MAIL DISABLED] Password reset link for ${to}: ${resetUrl}`);
      return;
    }

    const html = this.buildResetEmailHtml(name, resetUrl);
    const text =
      `مرحباً ${name || ''},\n\n` +
      `لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في BoostMarket.\n\n` +
      `اضغط على الرابط التالي لإعادة التعيين (صالح لمدة ساعة):\n${resetUrl}\n\n` +
      `إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.\n\n` +
      `فريق BoostMarket`;

    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: 'BoostMarket <help@boostmarket.app>',
          to: [to],
          subject: 'إعادة تعيين كلمة المرور - BoostMarket',
          html,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      this.logger.log(
        `Password reset email sent to ${to} via Resend (id=${response.data?.id})`,
      );
    } catch (err: any) {
      const detail =
        err?.response?.data
          ? JSON.stringify(err.response.data)
          : err?.message;
      this.logger.error(
        `Failed to send password reset email to ${to}: ${detail}`,
      );
      // Do not throw — keep endpoint responses uniform to avoid email enumeration
    }
  }

  private buildResetEmailHtml(name: string, resetUrl: string): string {
    const safeName = (name || '').replace(/</g, '&lt;');
    return `<!doctype html>
<html lang="ar" dir="rtl">
  <body style="margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Tahoma,Arial,sans-serif;color:#e5e7eb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:linear-gradient(180deg,#18181b,#111113);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 8px 28px;text-align:center;">
                <div style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font-weight:700;font-size:20px;padding:10px 18px;border-radius:12px;">BoostMarket</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px 32px;text-align:right;">
                <h1 style="color:#fff;font-size:22px;margin:16px 0 8px 0;">إعادة تعيين كلمة المرور</h1>
                <p style="color:#a1a1aa;line-height:1.8;font-size:15px;margin:8px 0;">
                  مرحباً ${safeName}،
                </p>
                <p style="color:#a1a1aa;line-height:1.8;font-size:15px;margin:8px 0;">
                  تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في BoostMarket. اضغط على الزر أدناه لإعادة التعيين. الرابط صالح لمدة ساعة واحدة فقط.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 32px 24px 32px;">
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font-weight:600;font-size:15px;padding:14px 28px;border-radius:12px;text-decoration:none;">
                  إعادة تعيين كلمة المرور
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 24px 32px;text-align:right;">
                <p style="color:#71717a;font-size:13px;line-height:1.7;margin:8px 0;">
                  إذا لم يعمل الزر، انسخ الرابط التالي وافتحه في المتصفح:
                </p>
                <p style="word-break:break-all;color:#a78bfa;font-size:12px;margin:4px 0;">${resetUrl}</p>
                <p style="color:#71717a;font-size:13px;line-height:1.7;margin:16px 0 0 0;">
                  إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                <p style="color:#52525b;font-size:12px;margin:0;">© ${new Date().getFullYear()} BoostMarket — help@boostmarket.app</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }
}
