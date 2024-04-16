/**
 * @generated SignedSource<<806bcabc899ad0705258e2c35676d22f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EditUserGuideBaseQuery$variables = {
  entityId: any;
};
export type EditUserGuideBaseQuery$data = {
  readonly guideBase: {
    readonly " $fragmentSpreads": FragmentRefs<"EditUserGuideBase_guideBase">;
  } | null;
  readonly organization: {
    readonly " $fragmentSpreads": FragmentRefs<"EditUserGuideBase_organization">;
  };
};
export type EditUserGuideBaseQuery = {
  response: EditUserGuideBaseQuery$data;
  variables: EditUserGuideBaseQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entityId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "entityId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "entityId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  (v2/*: any*/),
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "backgroundColor",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textColor",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "canDismiss",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ctasOrientation",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasBackgroundOverlay",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepBodyOrientation",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaOrientation",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaOrientation",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "verticalMediaAlignment",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "horizontalMediaAlignment",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageWidth",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaFontSize",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediaTextColor",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderColor",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "borderRadius",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "padding",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "advancedPadding",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "orderIndex",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stepType",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "fullName",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v30 = [
  (v28/*: any*/),
  (v29/*: any*/),
  (v4/*: any*/)
],
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "alignment",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "label",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "required",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helperText",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "maxValue",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditUserGuideBaseQuery",
    "selections": [
      {
        "alias": "guideBase",
        "args": (v1/*: any*/),
        "concreteType": "GuideBase",
        "kind": "LinkedField",
        "name": "findGuideBase",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EditUserGuideBase_guideBase"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EditUserGuideBase_organization"
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
    "name": "EditUserGuideBaseQuery",
    "selections": [
      {
        "alias": "guideBase",
        "args": (v1/*: any*/),
        "concreteType": "GuideBase",
        "kind": "LinkedField",
        "name": "findGuideBase",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "primaryContact",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "wasAutoLaunched",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "state",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isCyoa",
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isSideQuest",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isModifiedFromTemplate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "theme",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isTargetedForSplitTesting",
            "storageKey": null
          },
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Template",
            "kind": "LinkedField",
            "name": "createdFromTemplate",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "privateName",
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "pageTargetingType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "formFactor",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "formFactorStyle",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              {
                "kind": "TypeDiscriminator",
                "abstractKey": "__isFormFactorStyle"
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "bannerType",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "bannerPosition",
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/)
                ],
                "type": "BannerStyle",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "modalSize",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "position",
                    "storageKey": null
                  },
                  (v12/*: any*/),
                  (v10/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v11/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/)
                ],
                "type": "ModalStyle",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "backgroundOverlayColor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "backgroundOverlayOpacity",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasArrow",
                    "storageKey": null
                  },
                  (v12/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "tooltipShowOn",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "tooltipSize",
                    "storageKey": null
                  },
                  (v10/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v11/*: any*/),
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/)
                ],
                "type": "TooltipStyle",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v21/*: any*/),
                  (v18/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v11/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/)
                ],
                "type": "CardStyle",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "dotsColor",
                    "storageKey": null
                  },
                  (v21/*: any*/),
                  (v18/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v11/*: any*/)
                ],
                "type": "CarouselStyle",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "selectedBackgroundColor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "statusLabelColor",
                    "storageKey": null
                  }
                ],
                "type": "VideoGalleryStyle",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v21/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hideStepGroupTitle",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hideCompletedSteps",
                    "storageKey": null
                  },
                  (v18/*: any*/),
                  (v11/*: any*/)
                ],
                "type": "ChecklistStyle",
                "abstractKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "designType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "participantsCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "participantsWhoViewedCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Guide",
            "kind": "LinkedField",
            "name": "guides",
            "plural": true,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "GuideModuleBase",
            "kind": "LinkedField",
            "name": "guideModuleBases",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              (v2/*: any*/),
              (v26/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Step",
                "kind": "LinkedField",
                "name": "dynamicallyAddedByStep",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Module",
                "kind": "LinkedField",
                "name": "createdFromModule",
                "plural": false,
                "selections": (v5/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "GuideStepBase",
                "kind": "LinkedField",
                "name": "guideStepBases",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "body",
                    "storageKey": null
                  },
                  (v26/*: any*/),
                  (v27/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "bodySlate",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "dismissLabel",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "branchingQuestion",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "branchingMultiple",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "branchingDismissDisabled",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BranchingPath",
                    "kind": "LinkedField",
                    "name": "branchingPaths",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "entityType",
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "usersViewed",
                    "plural": true,
                    "selections": (v30/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AccountUser",
                    "kind": "LinkedField",
                    "name": "usersCompleted",
                    "plural": true,
                    "selections": (v30/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "StepPrototype",
                    "kind": "LinkedField",
                    "name": "createdFromStepPrototype",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isAutoCompletable",
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Step",
                    "kind": "LinkedField",
                    "name": "steps",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v27/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideBaseStepCta",
                    "kind": "LinkedField",
                    "name": "ctas",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "style",
                        "storageKey": null
                      },
                      (v31/*: any*/),
                      (v32/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "StepCtaSettingsType",
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "bgColorField",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "textColorField",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "eventName",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "markComplete",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "implicit",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "opensInNewTab",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "destinationGuide",
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MediaReference",
                    "kind": "LinkedField",
                    "name": "mediaReferences",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Media",
                        "kind": "LinkedField",
                        "name": "media",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          (v32/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "meta",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "naturalWidth",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "naturalHeight",
                                    "storageKey": null
                                  }
                                ],
                                "type": "ImageMediaMeta",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "videoId",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "videoType",
                                    "storageKey": null
                                  }
                                ],
                                "type": "VideoMediaMeta",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v33/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "fill",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "hyperlink",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "lightboxDisabled",
                                "storageKey": null
                              }
                            ],
                            "type": "ImageMediaReferenceSettings",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v33/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "playsInline",
                                "storageKey": null
                              }
                            ],
                            "type": "VideoMediaReferenceSettings",
                            "abstractKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "GuideBaseStepTaggedElement",
                    "kind": "LinkedField",
                    "name": "taggedElements",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v6/*: any*/),
                      (v32/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "wildcardUrl",
                        "storageKey": null
                      },
                      (v33/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "xOffset",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "yOffset",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "relativeToText",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "elementSelector",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "tooltipAlignment",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "style",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isVisualTagStyleSettings"
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v6/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "pulse",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "color",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "thickness",
                                "storageKey": null
                              },
                              (v24/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "radius",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "opacity",
                                "storageKey": null
                              },
                              (v31/*: any*/)
                            ],
                            "type": "VisualTagHighlightSettings",
                            "abstractKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "InputStepBase",
                    "kind": "LinkedField",
                    "name": "inputs",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v34/*: any*/),
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "settings",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          {
                            "kind": "TypeDiscriminator",
                            "abstractKey": "__isInputSettings"
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "placeholder",
                                "storageKey": null
                              },
                              (v35/*: any*/),
                              (v36/*: any*/),
                              (v37/*: any*/)
                            ],
                            "type": "TextOrEmailSettings",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v35/*: any*/),
                              (v36/*: any*/)
                            ],
                            "type": "NpsSettings",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v35/*: any*/),
                              (v36/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "minLabel",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "minValue",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "maxLabel",
                                "storageKey": null
                              },
                              (v37/*: any*/)
                            ],
                            "type": "NumberPollSettings",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v35/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "multiSelect",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "variation",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "DropdownInputOption",
                                "kind": "LinkedField",
                                "name": "options",
                                "plural": true,
                                "selections": [
                                  (v34/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "value",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "DropdownSettings",
                            "abstractKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "users",
            "plural": true,
            "selections": [
              (v28/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "avatarUrl",
                "storageKey": null
              },
              (v29/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e01297bd5f701ec881a8127a86ba385a",
    "id": null,
    "metadata": {},
    "name": "EditUserGuideBaseQuery",
    "operationKind": "query",
    "text": "query EditUserGuideBaseQuery(\n  $entityId: EntityId!\n) {\n  guideBase: findGuideBase(entityId: $entityId) {\n    ...EditUserGuideBase_guideBase\n    id\n  }\n  organization {\n    ...EditUserGuideBase_organization\n    id\n  }\n}\n\nfragment EditUserGuideBase_guideBase on GuideBase {\n  entityId\n  account {\n    entityId\n    name\n    primaryContact {\n      entityId\n      id\n    }\n    id\n  }\n  wasAutoLaunched\n  state\n  isCyoa\n  name\n  isSideQuest\n  isModifiedFromTemplate\n  theme\n  isTargetedForSplitTesting\n  type\n  createdFromTemplate {\n    entityId\n    name\n    privateName\n    id\n  }\n  pageTargetingType\n  formFactor\n  formFactorStyle {\n    __typename\n    __isFormFactorStyle: __typename\n    ... on BannerStyle {\n      bannerType\n      bannerPosition\n      backgroundColor\n      textColor\n      canDismiss\n      ctasOrientation\n    }\n    ... on ModalStyle {\n      modalSize\n      position\n      hasBackgroundOverlay\n      canDismiss\n      backgroundColor\n      textColor\n      stepBodyOrientation\n      mediaOrientation\n      verticalMediaOrientation\n      verticalMediaAlignment\n      horizontalMediaAlignment\n      ctasOrientation\n      imageWidth\n      mediaFontSize\n      mediaTextColor\n    }\n    ... on TooltipStyle {\n      backgroundColor\n      backgroundOverlayColor\n      backgroundOverlayOpacity\n      hasArrow\n      hasBackgroundOverlay\n      textColor\n      tooltipShowOn\n      tooltipSize\n      canDismiss\n      stepBodyOrientation\n      mediaOrientation\n      verticalMediaOrientation\n      verticalMediaAlignment\n      horizontalMediaAlignment\n      ctasOrientation\n      imageWidth\n      mediaFontSize\n      mediaTextColor\n    }\n    ... on CardStyle {\n      backgroundColor\n      textColor\n      canDismiss\n      stepBodyOrientation\n      mediaOrientation\n      verticalMediaOrientation\n      verticalMediaAlignment\n      horizontalMediaAlignment\n      height\n      imageWidth\n      borderColor\n      borderRadius\n      padding\n      advancedPadding\n      ctasOrientation\n      mediaFontSize\n      mediaTextColor\n    }\n    ... on CarouselStyle {\n      backgroundColor\n      textColor\n      canDismiss\n      stepBodyOrientation\n      mediaOrientation\n      dotsColor\n      height\n      imageWidth\n      borderColor\n      borderRadius\n      padding\n      advancedPadding\n      ctasOrientation\n    }\n    ... on VideoGalleryStyle {\n      backgroundColor\n      textColor\n      canDismiss\n      borderColor\n      borderRadius\n      padding\n      advancedPadding\n      selectedBackgroundColor\n      statusLabelColor\n    }\n    ... on ChecklistStyle {\n      stepBodyOrientation\n      mediaOrientation\n      height\n      hideStepGroupTitle\n      hideCompletedSteps\n      imageWidth\n      ctasOrientation\n    }\n  }\n  designType\n  participantsCount\n  participantsWhoViewedCount\n  guides {\n    entityId\n    id\n  }\n  guideModuleBases {\n    name\n    entityId\n    orderIndex\n    dynamicallyAddedByStep {\n      entityId\n      name\n      id\n    }\n    createdFromModule {\n      entityId\n      id\n    }\n    guideStepBases {\n      name\n      entityId\n      body\n      orderIndex\n      stepType\n      bodySlate\n      dismissLabel\n      branchingQuestion\n      branchingMultiple\n      branchingDismissDisabled\n      branchingPaths {\n        entityType\n        id\n      }\n      usersViewed {\n        fullName\n        email\n        id\n      }\n      usersCompleted {\n        fullName\n        email\n        id\n      }\n      createdFromStepPrototype {\n        entityId\n        isAutoCompletable\n        id\n      }\n      steps {\n        entityId\n        stepType\n        id\n      }\n      ctas {\n        entityId\n        type\n        style\n        text\n        url\n        settings {\n          bgColorField\n          textColorField\n          eventName\n          markComplete\n          implicit\n          opensInNewTab\n        }\n        destinationGuide\n        id\n      }\n      mediaReferences {\n        entityId\n        media {\n          type\n          url\n          meta {\n            __typename\n            ... on ImageMediaMeta {\n              naturalWidth\n              naturalHeight\n            }\n            ... on VideoMediaMeta {\n              videoId\n              videoType\n            }\n          }\n          id\n        }\n        settings {\n          __typename\n          ... on ImageMediaReferenceSettings {\n            alignment\n            fill\n            hyperlink\n            lightboxDisabled\n          }\n          ... on VideoMediaReferenceSettings {\n            alignment\n            playsInline\n          }\n        }\n        id\n      }\n      taggedElements {\n        entityId\n        type\n        url\n        wildcardUrl\n        alignment\n        xOffset\n        yOffset\n        relativeToText\n        elementSelector\n        tooltipAlignment\n        style {\n          __typename\n          __isVisualTagStyleSettings: __typename\n          ... on VisualTagHighlightSettings {\n            type\n            pulse\n            color\n            thickness\n            padding\n            radius\n            opacity\n            text\n          }\n        }\n        id\n      }\n      inputs {\n        entityId\n        label\n        type\n        settings {\n          __typename\n          __isInputSettings: __typename\n          ... on TextOrEmailSettings {\n            placeholder\n            required\n            helperText\n            maxValue\n          }\n          ... on NpsSettings {\n            required\n            helperText\n          }\n          ... on NumberPollSettings {\n            required\n            helperText\n            minLabel\n            minValue\n            maxLabel\n            maxValue\n          }\n          ... on DropdownSettings {\n            required\n            multiSelect\n            variation\n            options {\n              label\n              value\n            }\n          }\n        }\n        id\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment EditUserGuideBase_organization on Organization {\n  name\n  users {\n    ...OrgUsersDropdown_users\n    id\n  }\n}\n\nfragment OrgUsersDropdown_users on User {\n  fullName\n  entityId\n  avatarUrl\n  email\n}\n"
  }
};
})();

(node as any).hash = "e70e870979ef6cb7eadad63a5507afa4";

export default node;
