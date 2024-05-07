export interface ITokenProvider {
  refreshToken?: string;
  accessToken?: string;
  expiresInRefresh?: string;
  expiresInAccess?: string;
}
