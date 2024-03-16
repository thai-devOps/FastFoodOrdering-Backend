export interface CustomerRegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  address: string
}
export interface CustomerLoginRequest {
  email: string
  password: string
}
