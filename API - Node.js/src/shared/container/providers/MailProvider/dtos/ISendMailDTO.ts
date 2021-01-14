import IMailTemplateProviderDataDTO from "@shared/container/providers/MailTemplateProvider/dtos/IMailTemplateProviderDataDTO";

interface IMailContact {
  name: string;
  email: string;
}

export default interface SendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IMailTemplateProviderDataDTO;
}
