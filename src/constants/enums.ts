export enum UserVerifyStatus {
  Unverified = 'Unverified', // chưa xác thực email, mặc định = 0
  Verified = 'Verified', // đã xác thực email
  Banned = 'Banned' // bị khóa
}
export enum RestaurantStyle {
  'Beverage' = 'Cafe - Nước uống giải khát',
  'Restaurant' = 'Nhà hàng',
  'MikTea' = 'Trà sữa ',
  'SnackShop' = 'Quán ăn vặt',
  'FastFood' = 'FastFood',
  'HotPot' = 'Nhậu - Lẩu - Nướng'
}

export enum UserRole {

  Customer = 'Customer',
  Admin = 'Admin',
  Shipper = 'Shipper',
  Partner = 'Partner'
}
export enum MediaType {
  Image = 'Image'
}
export enum GENDER_TYPE {
  Male = 'nam',
  Female = 'nu',
  Other = 'khac'
}
export enum TOKEN_TYPE {
  ACCESS_TOKEN = 'access-token',
  REFRESH_TOKEN = 'refresh-token',
  EMAIL_VERIFY_TOKEN = 'email-verify-token',
  FORGOT_PASSWORD_TOKEN = 'forgot-password-token'
}

export enum PARTNER_STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
export enum RESTAURANT_STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
