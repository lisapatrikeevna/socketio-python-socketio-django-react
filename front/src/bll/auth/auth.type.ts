export type responseRegisterType = {
  user: UserType
}
export type LoginArgs = {
  identifier: string
  // email: string
  password: string
}
export type SignUpArgs = {
  Nachname: string
  Vorname: string
  username?: string
  password: string
  Private_E_mail: string ///????? email
  avatar?: any
  // phone?: string | null
}
export type UserType = {
  id?: number
  email: string
  first_name?: string
  last_name?: string
  is_staff?: boolean
  is_admin?: boolean
  is_superuser?: boolean
  username?: string
  password?: string
}
export type responseType = {
  email:string
  Nachname: string
  Vorname: string
}
export interface RefreshResponse {
  // access_token: string
  // refresh_token?: string
}
