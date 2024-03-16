const response_messages = {
  success: 'success',
  token: {
    refresh_token_success: 'Refresh token thành công'
  },
  error: 'error',
  unprocessable_entity: {
    msg: 'Unprocessable entity error',
    errors: {
      register: {
        name: {
          notEmpty: 'Tên không được để trống',
          isLength: 'Tên phải có độ dài từ 2 đến 30 ký tự',
          isString: 'Tên phải là chuỗi'
        },
        email: {
          notEmpty: 'Email không được để trống',
          existedEmail: 'Email đã tồn tại',
          isEmail: 'Email không hợp lệ',
          isString: 'Email phải là chuỗi'
        },
        password: {
          notEmpty: 'Mật khẩu không được để trống',
          isLength: 'Mật khẩu phải có độ dài từ 6 đến 30 ký tự'
        },
        password_confirmation: {
          notEmpty: 'Mật khẩu xác nhận không được để trống',
          isLength: 'Mật khẩu xác nhận phải có độ dài từ 6 đến 30 ký tự',
          doesNotMatch: 'Mật khẩu xác nhận không khớp'
        },
        phone: {
          notEmpty: 'Số điện thoại không được để trống',
          isMobilePhone: 'Số điện thoại không hợp lệ'
        },
        address: 'Địa chỉ không được để trống'
      },
      login: {
        error: 'Thông tin đăng nhập không đúng',
        success: 'Đăng nhập thành công',
        email: {
          notEmpty: 'Email không được để trống',
          isEmail: 'Email không hợp lệ',
          isString: 'Email phải là chuỗi'
        },
        password: {
          notEmpty: 'Mật khẩu không được để trống',
          isLength: 'Mật khẩu phải có độ dài từ 6 đến 30 ký tự'
        }
      },
      profile: {
        name: {
          notEmpty: 'Tên không được để trống',
          isLength: 'Tên phải có độ dài từ 2 đến 50 ký tự',
          isString: 'Tên phải là chuỗi'
        },
        phone: {
          notEmpty: 'Số điện thoại không được để trống',
          isMobilePhone: 'Số điện thoại không hợp lệ'
        },
        date_of_birth: {
          notEmty: 'Ngày sinh không được để trống',
          isDate: 'Ngày sinh không hợp lệ',
          notIsISO8601: 'Ngày sinh không hợp lệ'
        },
        gender: 'Giới tính không được để trống',
        identity_number: {
          notEmpty: 'Số CMND không được để trống',
          isLength: 'Số CMND phải có độ dài 9 hoặc 12 ký tự'
        },
        address: 'Địa chỉ không được để trống'
      }
    }
  },
  invalid_token: 'invalid token',
  unauthorized: {
    access_denied: 'Access denied',
    expired_token: 'EXPIRED_TOKEN',
    verify_email: {
      expired: 'Liên kết xác thực email đã hết hạn',
      rensend_success: 'Gửi lại liên kết xác thực email thành công',
      error: 'Xác thực email không thành công',
      success: 'Xác thực email thành công',
      verified: 'Email đã được xác thực',
      unverified: 'Email chưa được xác thực',
      banned: 'Tài khoản đã bị khóa'
    },
    access_token: {
      required: 'Access token không được gửi',
      error: 'Access token không hợp lệ',
      success: 'Access token hợp lệ',
      expired: 'Access token đã hết hạn'
    },
    refresh_token: {
      required: 'Refresh token không được gửi',
      error: 'Refresh token không hợp lệ',
      used_or_not_exists: 'Refresh token đã được sử dụng hoặc không tồn tại',
      success: 'Refresh token hợp lệ',
      expired: 'Refresh token đã hết hạn'
    }
  },
  menu: {
    name: 'Tên thực đơn không được để trống',
    description: 'Mô tả thực đơn không được để trống',
    shop_id: 'ID cửa hàng không được để trống',
    create: 'Tạo thực đơn thành công',
    update: 'Cập nhật thực đơn thành công',
    active: 'Kích hoạt thực đơn thành công',
    getAllByPartner: 'Lấy tất cả thực đơn theo ID đối tác thành công'
  },
  not_found: 'not found',
  bad_request: 'bad request',
  internal_server_error: 'internal server error',
  user_already_exists: 'user already exists',
  user_not_found: 'user not found',
  user_created: 'user created',
  user_updated: 'user updated',
  user_deleted: 'user deleted',
  user_not_updated: 'user not updated',
  user_not_deleted: 'user not deleted',
  user_not_created: 'user not created',
  user_not_authorized: 'user not authorized',
  user_not_authenticated: 'user not authenticated',
  user_not_activated: 'user not activated',
  user_not_deactivated: 'user not deactivated',
  user_not_logged_in: 'user not logged in',
  user_not_logged_out: 'user not logged out',
  user_not_verified: 'user not verified',
  user_not_unverified: 'user not unverified',
  user_not_blocked: 'user not blocked',
  user_not_unblocked: 'user not unblocked',
  user_not_password_changed: 'user not password changed',
  user_not_password_reset: 'user not password reset',
  user_not_password_forgot: 'user not password forgot',
  user_not_password_resetted: 'user not password resetted'
}
export default response_messages
