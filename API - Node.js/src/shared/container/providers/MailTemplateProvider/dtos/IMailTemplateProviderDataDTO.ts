interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IMailTemplateProviderDataDTO {
  file: string;
  variables: ITemplateVariables;
}
