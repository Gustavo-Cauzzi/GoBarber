import IMailTemplateProviderDataDTO from '../dtos/IMailTemplateProviderDataDTO';

export default interface IMailTemplateProvider {
  parse(data: IMailTemplateProviderDataDTO): Promise<string>;
}
