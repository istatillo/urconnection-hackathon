export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    statusCode: number;
    statusMsg: string;
    msg: string;
  };
}
