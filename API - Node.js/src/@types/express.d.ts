declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}

/*
  Isso aqui ta anexando um tipo para os
  tipos do express, então a partir de agora, no
  Request, teremos também um objeto "user"
  com um valor "id: string"


  O ".d" no nome do arquivo indica que é
  um arquivo de tipagem do typescript

*/
