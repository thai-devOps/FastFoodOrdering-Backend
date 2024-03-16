export interface RegisterRequestBody {
  email: string
  password: string
  phone: string
  name: string
}

export interface LoginRequestBody {
  email: string
  password: string
}
