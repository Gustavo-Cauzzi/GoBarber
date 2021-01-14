import {Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface TokenPayload{
  iat: number; //Quando foi feito - Padrão
  exp: number; //Quando expira - Padrão
  sub: string;//Nosso ID de usuário que passamos
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void{
  const authHeader = request.headers.authorization;

  if(!authHeader){
    throw new AppError('missing JWT token', 401);
  }

  const [, token] = authHeader.split(' '); //1

  try {
    const decoded = verify(token, authConfig.jwt.secret);//2

    const { sub } = decoded as TokenPayload; //3

    request.user = {
      id: sub,
    }

    return next()
  } catch { //4
    throw new AppError('Invalid JWT token', 401);
  }
}



/*

1-
  authToken --> Bearer udhusadhsaihdis
                  |         |
                Padrão    Token

  Usar o .split() que vai separar o token
  no primeiro 'espaço' que aparecer.
    - Retorna um array
      Pelo fato que não vamos querer a pri-
      meira parte do .split() ('Baerer'),
      podemos fazer uma desestruturação, e
      se deixarmos a primeira em branco,
      temos a possibilidade de nem armaze-
      na-la

  2- .verify() retorna o payload e talz do token

  3- um Hackzinho do typescript pra forcar uma tipagem

  4- O .verify() retorna um erro caso não estiver certo, e como
  esse erro não fica nos nossos padrões de erro, podemos envol-
  ve-lo com um try-catch para aí sim dispararmos o nosso erro.
    OBS: n precisamos  colocar (err) no catch pois não iremos
    utilizar. (ISSO PODE APENAS NO TYPESCRIPT)
*/
