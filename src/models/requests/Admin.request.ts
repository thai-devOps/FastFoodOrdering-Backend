export interface AdminRegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  address: string
}
export interface AdminLoginRequest {
  email: string
  password: string
}
