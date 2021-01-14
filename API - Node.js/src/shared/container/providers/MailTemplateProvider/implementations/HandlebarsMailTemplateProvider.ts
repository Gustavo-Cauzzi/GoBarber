import handlebars from 'handlebars';
import fs from 'fs';

import IMailTemplateProviderDataDTO from "../dtos/IMailTemplateProviderDataDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";

export default class FakeMailTemplateProvider implements IMailTemplateProvider{
  public async parse({ file, variables }: IMailTemplateProviderDataDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    })

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
