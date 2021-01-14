import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const tmpPath = path.resolve(__dirname,'..','..','tmp');

export default {
  tmpPath, // Coisa nossa, só para ter um variavel com o caminho pra usar como referência em outro arquivo (service do avatar)
  uploadsFolder: path.resolve(tmpPath, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpPath,
    filename(request, file, callback){
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    }
  }),
}

/*
  yarn add multer
  yarn add @types/multer -D

  crypto = vem do node
*/
