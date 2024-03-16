import nodemailer from 'nodemailer'
import envConfig from '~/constants/config'
import { UserRole } from '~/constants/enums'
export const sendEmailVerify = async (email: string, subject: string, token: string, role: UserRole) => {
  try {
    const transporter = nodemailer.createTransport({
      host: envConfig.HOST,
      service: envConfig.SERVICE,
      port: Number(envConfig.EMAIL_PORT),
      secure: Boolean(envConfig.SECURE),
      auth: {
        user: envConfig.USER,
        pass: envConfig.PASS
      }
    })
    if (role === UserRole.Customer) {
      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        html: `
         <p>Xin chào,</p>
<p>Cảm ơn bạn đã đăng ký với TTFood! Vui lòng sử dụng liên kết xác minh sau để kích hoạt tài khoản của bạn:</p>

<a href="http://localhost:3003user-verification?token=${token}"
   style="display: inline-block;
          background-color: #edf2f7; /* Tương đương với bg-gray-200 trong Tailwind */
          color: #2d3748; /* Tương đương với text-gray-800 trong Tailwind */
          font-weight: bold;
          padding: 0.5rem 1rem; /* Tương đương với py-2 px-4 trong Tailwind */
          border-radius: 9999px; /* Tương đương với rounded-full trong Tailwind */
          text-decoration: none;
          transition: background-color 0.3s ease; /* Tương đương với hover:bg-gray-300 trong Tailwind */
          "
   onmouseover="this.style.backgroundColor='#cbd5e0'"
   onmouseout="this.style.backgroundColor='#edf2f7'"
>
  http://ttfood.com/user-verification
</a>

<p>Nhấp vào liên kết ở trên hoặc sao chép và dán nó vào thanh địa chỉ trình duyệt để hoàn tất quá trình xác minh và kích hoạt tài khoản của bạn.</p>

<p>Nếu bạn không đăng ký dịch vụ này, vui lòng bỏ qua email này.</p>

<p>Trân trọng,<br>Chau Thai - B2005731 | TTFood</p>

        `
      })
    }
    // http://localhost:3003/verify-email?token=${token}
    if (role === UserRole.Partner) {
      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        html: `
         <p>Xin chào,</p>
<p>Cảm ơn bạn đã đăng ký với TTFood! Vui lòng sử dụng liên kết xác minh sau để kích hoạt tài khoản của bạn:</p>

<a href="http://localhost:3002/user-verification?token=${token}"
   style="display: inline-block;
          background-color: #edf2f7; /* Tương đương với bg-gray-200 trong Tailwind */
          color: #2d3748; /* Tương đương với text-gray-800 trong Tailwind */
          font-weight: bold;
          padding: 0.5rem 1rem; /* Tương đương với py-2 px-4 trong Tailwind */
          border-radius: 9999px; /* Tương đương với rounded-full trong Tailwind */
          text-decoration: none;
          transition: background-color 0.3s ease; /* Tương đương với hover:bg-gray-300 trong Tailwind */
          "
   onmouseover="this.style.backgroundColor='#cbd5e0'"
   onmouseout="this.style.backgroundColor='#edf2f7'"
>
  http://ttfood.com/user-verification
</a>

<p>Nhấp vào liên kết ở trên hoặc sao chép và dán nó vào thanh địa chỉ trình duyệt để hoàn tất quá trình xác minh và kích hoạt tài khoản của bạn.</p>

<p>Nếu bạn không đăng ký dịch vụ này, vui lòng bỏ qua email này.</p>

<p>Trân trọng,<br>Chau Thai - B2005731 | TTFood</p>

        `
      })
    }
    if (role === UserRole.Shipper) {
      await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: subject,
        html: `
         <p>Xin chào,</p>
<p>Cảm ơn bạn đã đăng ký với TTFood! Vui lòng sử dụng liên kết xác minh sau để kích hoạt tài khoản của bạn:</p>

<a href="http://localhost:3004/user-verification?token=${token}"
   style="display: inline-block;
          background-color: #edf2f7; /* Tương đương với bg-gray-200 trong Tailwind */
          color: #2d3748; /* Tương đương với text-gray-800 trong Tailwind */
          font-weight: bold;
          padding: 0.5rem 1rem; /* Tương đương với py-2 px-4 trong Tailwind */
          border-radius: 9999px; /* Tương đương với rounded-full trong Tailwind */
          text-decoration: none;
          transition: background-color 0.3s ease; /* Tương đương với hover:bg-gray-300 trong Tailwind */
          "
   onmouseover="this.style.backgroundColor='#cbd5e0'"
   onmouseout="this.style.backgroundColor='#edf2f7'"
>
  http://ttfood.com/user-verification
</a>

<p>Nhấp vào liên kết ở trên hoặc sao chép và dán nó vào thanh địa chỉ trình duyệt để hoàn tất quá trình xác minh và kích hoạt tài khoản của bạn.</p>

<p>Nếu bạn không đăng ký dịch vụ này, vui lòng bỏ qua email này.</p>

<p>Trân trọng,<br>Chau Thai - B2005731 | TTFood</p>

        `
      })
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
