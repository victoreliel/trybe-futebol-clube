export default interface ILogin {
  id?: number,
  username?: string,
  role?: string,
  email: string,
  password?: string,
}

export interface IResponse {
  status: number,
  message?: string,
}
