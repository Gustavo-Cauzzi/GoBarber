import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswrodEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  })

  it('should be able to reset password using its email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: "teste",
      email: "teste@teste.com",
      password:"123456",
    })

    await sendForgotPasswordEmail.execute({
      email: 'teste@teste.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover password of a non-existing user', async () => {
    await expect(sendForgotPasswordEmail.execute({
      email: 'teste@teste.com',
    })).rejects.toBeInstanceOf(AppError);
  })

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    await fakeUsersRepository.create({
      name: "teste",
      email: "teste@teste.com",
      password:"123456",
    })

    await sendForgotPasswordEmail.execute({
      email: 'teste@teste.com',
    });

    expect(generateToken).toHaveBeenCalled();
  })
})
