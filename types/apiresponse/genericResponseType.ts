// export type BackendResponse = {
//   ResultCode: string;
//   ErrorMessage: string | null;
//   ServisVersiyon: string;
//   SQL_Data?: string | null;
// };
// export type SqlData<T> = {
//   RECORD_COUNT: string;
//   DATA: T[];
// };


export type AddUpdateData = { [key: string]: any }; 

export interface AddUpdateApiResponse {
  ResultCode: string;
  ErrorMessage: string | null;
  BelgeNo?: string;
  Id?: number;
  CariId?: number;
  SQL_Data?: string;
  [key: string]: any; 
}