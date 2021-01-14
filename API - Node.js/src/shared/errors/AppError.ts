export default class AppError{
  public readonly message: string; // 2

  public readonly statusCode: number;

  constructor(message: string, statusCode = 400){ // 1
    this.message = message;
    this.statusCode = statusCode;
  }
}

/*

  1 - Se não for específicado algum
  valor para o statusCode, ele vai ter
  como padrão o valor 400.

  2 - readonly = Não vai dar pra alterar
  esse valor no meio do código, apenas
  ler (read only)

*/
