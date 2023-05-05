
export interface IAppRequest extends Request {
  params: { cardId: any; };
  user?: {
    _id: String,
  };
}

export const requestIdHandler = (req: any, res: any, next: any) => {
  req.user = {
    _id: '63b24b4b89048d067a728b4c',
  };
  next();
};