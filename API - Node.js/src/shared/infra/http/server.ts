import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import 'express-async-errors';
import routes from './routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';

import '../typeorm';
import '@shared/container';

const app = express();

app.use(cors()); //  Não permite que sites não confiáveis acesse a nossa api
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);


app.use((
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if(err instanceof AppError){
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      })
    }

    console.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server/api error',
    })
});//1

app.listen(3333, () => {
  console.log('Server is running (3333)');
});

/*

  1 - yarn add express-async-errors
    Express não tem capacidade ainda de
    captar as tratativas de erros nas
    funções asíncronas das rotas. Por
    esse motivo precisamos dessa biblioteca
*/
