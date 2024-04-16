export enum DroppableType {
  Module = 'MODULE',
  Step = 'STEP',
  Cta = 'cta',
}

export enum FormEntityType {
  guideBase = 'guideBase',
  template = 'template',
  module = 'module',
  nps = 'nps',
}

export enum FormEntityLabel {
  guide = 'guide',
  test = 'test',
  nps = 'survey',
  commandCtr = 'commandCtr',
}

export type ActiveStepListEvent = {
  formKey: string | null;
  expandedStepIndex: number;
};
