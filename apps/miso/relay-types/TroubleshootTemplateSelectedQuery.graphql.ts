/**
 * @generated SignedSource<<def9b1eebda23d90843e3ce96e8b6746>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type GuideDesignTypeEnumType = "announcement" | "everboarding" | "onboarding";
export type GuideFormFactorEnumType = "banner" | "flow" | "inline" | "inline_sidebar" | "modal" | "sidebar" | "tooltip";
export type GuidePageTargetingEnumType = "any_page" | "inline" | "specific_page" | "visual_tag";
export type TroubleshootTemplateSelectedQuery$variables = {
  templateEntityId: any;
};
export type TroubleshootTemplateSelectedQuery$data = {
  readonly template: {
    readonly designType: GuideDesignTypeEnumType;
    readonly formFactor: GuideFormFactorEnumType | null;
    readonly locationShown: string | null;
    readonly name: string | null;
    readonly pageTargetingType: GuidePageTargetingEnumType;
    readonly taggedElements: ReadonlyArray<{
      readonly elementSelector: string;
    }>;
  } | null;
};
export type TroubleshootTemplateSelectedQuery = {
  response: TroubleshootTemplateSelectedQuery$data;
  variables: TroubleshootTemplateSelectedQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "templateEntityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "templateEntityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pageTargetingType",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "designType",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formFactor",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "locationShown",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "elementSelector",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TroubleshootTemplateSelectedQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": [
              (v7/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "RootType",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TroubleshootTemplateSelectedQuery",
    "selections": [
      {
        "alias": "template",
        "args": (v1/*: any*/),
        "concreteType": "Template",
        "kind": "LinkedField",
        "name": "findTemplate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "StepPrototypeTaggedElement",
            "kind": "LinkedField",
            "name": "taggedElements",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c11b8d71fb7e34f268198e8871bbb741",
    "id": null,
    "metadata": {},
    "name": "TroubleshootTemplateSelectedQuery",
    "operationKind": "query",
    "text": "query TroubleshootTemplateSelectedQuery(\n  $templateEntityId: EntityId!\n) {\n  template: findTemplate(entityId: $templateEntityId) {\n    name\n    pageTargetingType\n    designType\n    formFactor\n    locationShown\n    taggedElements {\n      elementSelector\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "271a57338fdae6c15030b47e8faae13a";

export default node;
