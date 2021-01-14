import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
  public async hash(payload: string): Promise<string> {
    return payload;
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return payload == hashed;
  }
}
