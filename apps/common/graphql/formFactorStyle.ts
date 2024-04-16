import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';
import {
  isCardTheme,
  isCarouselTheme,
  isVideoGalleryTheme,
} from '../data/helpers';

import {
  BannerTypeEnum,
  BannerPosition,
  ModalSize,
  TooltipSize,
  TooltipShowOn,
  FormFactorStyle,
  GuideFormFactor,
  ModalPosition,
  StepBodyOrientation,
  Theme,
  MediaOrientation,
  VerticalAlignmentEnum,
  AlignmentEnum,
  VerticalMediaOrientation,
  CtasOrientation,
} from '../types';
import { enumToGraphqlEnum } from '../utils/graphql';

const CtasOrientationEnumType = enumToGraphqlEnum({
  name: 'CtasOrientation',
  enumType: CtasOrientation,
});

const MediaOrientationType = enumToGraphqlEnum({
  name: 'MediaOrientation',
  enumType: MediaOrientation,
});

const VerticalMediaOrientationType = enumToGraphqlEnum({
  name: 'VerticalMediaOrientation',
  enumType: VerticalMediaOrientation,
});

const VerticalMediaAlignmentType = enumToGraphqlEnum({
  name: 'VerticalMediaAlignment',
  enumType: VerticalAlignmentEnum,
});

const HorizontalMediaAlignmentType = enumToGraphqlEnum({
  name: 'HorizontalMediaAlignment',
  enumType: AlignmentEnum,
});

const StepBodyOrientationType = enumToGraphqlEnum({
  name: 'StepBodyOrientation',
  enumType: StepBodyOrientation,
});

const OrientationRelatedFields = {
  stepBodyOrientation: { type: StepBodyOrientationType },
  mediaOrientation: { type: MediaOrientationType },
  verticalMediaOrientation: { type: VerticalMediaOrientationType },
  verticalMediaAlignment: { type: VerticalMediaAlignmentType },
  horizontalMediaAlignment: { type: HorizontalMediaAlignmentType },
  height: { type: GraphQLInt },
  imageWidth: { type: GraphQLString },
};

const BannerTypeEnumType = enumToGraphqlEnum({
  name: 'BannerType',
  enumType: BannerTypeEnum,
});

const BannerPositionEnumType = enumToGraphqlEnum({
  name: 'BannerPosition',
  enumType: BannerPosition,
});

const BannerStyleFields = {
  bannerType: {
    type: BannerTypeEnumType,
  },
  bannerPosition: {
    type: BannerPositionEnumType,
  },
  backgroundColor: {
    type: GraphQLString,
  },
  textColor: {
    type: GraphQLString,
  },
  canDismiss: {
    type: GraphQLBoolean,
  },
  ctasOrientation: {
    type: CtasOrientationEnumType,
  },
};

const BannerStyleType = new GraphQLObjectType({
  name: 'BannerStyle',
  fields: {
    bannerType: {
      type: new GraphQLNonNull(BannerTypeEnumType),
    },
    bannerPosition: {
      type: new GraphQLNonNull(BannerPositionEnumType),
    },
    backgroundColor: {
      type: GraphQLString,
    },
    textColor: {
      type: GraphQLString,
    },
    canDismiss: {
      type: GraphQLBoolean,
    },
    ctasOrientation: {
      type: CtasOrientationEnumType,
    },
  },
});

const ModalSizeEnumType = enumToGraphqlEnum({
  name: 'ModalSize',
  enumType: ModalSize,
});

const ModalPositionEnumType = enumToGraphqlEnum({
  name: 'ModalPosition',
  enumType: ModalPosition,
});

const ModalStyleFields = {
  modalSize: {
    type: ModalSizeEnumType,
  },
  position: {
    type: ModalPositionEnumType,
  },
  hasBackgroundOverlay: {
    type: GraphQLBoolean,
  },
  canDismiss: {
    type: GraphQLBoolean,
  },
  backgroundColor: {
    type: GraphQLString,
  },
  textColor: {
    type: GraphQLString,
  },
  mediaFontSize: {
    type: GraphQLInt,
  },
  mediaTextColor: {
    type: GraphQLString,
  },
  ctasOrientation: {
    type: CtasOrientationEnumType,
  },
  ...OrientationRelatedFields,
};

const ModalStyleType = new GraphQLObjectType({
  name: 'ModalStyle',
  fields: {
    modalSize: {
      type: new GraphQLNonNull(ModalSizeEnumType),
    },
    position: {
      type: new GraphQLNonNull(ModalPositionEnumType),
      resolve: (formFactorStyle: any) => {
        return formFactorStyle.position || ModalPosition.center;
      },
    },
    hasBackgroundOverlay: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    canDismiss: {
      type: GraphQLBoolean,
    },
    backgroundColor: {
      type: GraphQLString,
    },
    textColor: {
      type: GraphQLString,
    },
    mediaFontSize: {
      type: GraphQLInt,
    },
    mediaTextColor: {
      type: GraphQLString,
    },
    ctasOrientation: {
      type: CtasOrientationEnumType,
    },
    ...OrientationRelatedFields,
  },
});

const TooltipSizeEnumType = enumToGraphqlEnum({
  name: 'TooltipSize',
  enumType: TooltipSize,
});

const TooltipShowOnEnumType = enumToGraphqlEnum({
  name: 'TooltipShowOn',
  enumType: TooltipShowOn,
});

const TooltipStyleFields = {
  backgroundColor: {
    type: GraphQLString,
  },
  backgroundOverlayColor: {
    type: GraphQLString,
  },
  backgroundOverlayOpacity: {
    type: GraphQLInt,
  },
  hasArrow: {
    type: GraphQLBoolean,
  },
  hasBackgroundOverlay: {
    type: GraphQLBoolean,
  },
  textColor: {
    type: GraphQLString,
  },
  mediaFontSize: {
    type: GraphQLInt,
  },
  mediaTextColor: {
    type: GraphQLString,
  },
  tooltipShowOn: {
    type: TooltipShowOnEnumType,
  },
  tooltipSize: {
    type: TooltipSizeEnumType,
  },
  canDismiss: {
    type: GraphQLBoolean,
  },
  ctasOrientation: {
    type: CtasOrientationEnumType,
  },
};

const TooltipStyleType = new GraphQLObjectType({
  name: 'TooltipStyle',
  fields: {
    backgroundColor: {
      type: GraphQLString,
    },
    backgroundOverlayColor: {
      type: GraphQLString,
    },
    backgroundOverlayOpacity: {
      type: GraphQLInt,
    },
    hasArrow: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    hasBackgroundOverlay: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    textColor: {
      type: GraphQLString,
    },
    mediaFontSize: {
      type: GraphQLInt,
    },
    mediaTextColor: {
      type: GraphQLString,
    },
    tooltipShowOn: {
      type: new GraphQLNonNull(TooltipShowOnEnumType),
    },
    tooltipSize: {
      type: new GraphQLNonNull(TooltipSizeEnumType),
    },
    canDismiss: {
      type: GraphQLBoolean,
    },
    ctasOrientation: {
      type: CtasOrientationEnumType,
    },
    ...OrientationRelatedFields,
  },
});

const InlineContextualRelatedFields = {
  backgroundColor: { type: GraphQLString },
  textColor: { type: GraphQLString },
  mediaFontSize: {
    type: GraphQLInt,
  },
  mediaTextColor: {
    type: GraphQLString,
  },
  canDismiss: { type: GraphQLBoolean },
  borderColor: { type: GraphQLString },
  borderRadius: { type: GraphQLInt },
  padding: { type: GraphQLInt },
  advancedPadding: { type: GraphQLString },
};

const CardStyleFields = {
  ctasOrientation: {
    type: CtasOrientationEnumType,
  },
  ...InlineContextualRelatedFields,
  ...OrientationRelatedFields,
};

const CardStyleType = new GraphQLObjectType({
  name: 'CardStyle',
  fields: CardStyleFields,
});

const CarouselStyleFields = {
  ctasOrientation: {
    type: CtasOrientationEnumType,
  },
  dotsColor: { type: GraphQLString },
  ...InlineContextualRelatedFields,
  ...OrientationRelatedFields,
};

const CarouselStyleType = new GraphQLObjectType({
  name: 'CarouselStyle',
  fields: CarouselStyleFields,
});

const VideoGalleryStyleFields = {
  selectedBackgroundColor: { type: GraphQLString },
  statusLabelColor: { type: GraphQLString },
  ...InlineContextualRelatedFields,
};

const VideoGalleryStyleType = new GraphQLObjectType({
  name: 'VideoGalleryStyle',
  fields: VideoGalleryStyleFields,
});

const ChecklistStyleFields = {
  ctasOrientation: {
    type: CtasOrientationEnumType,
  },
  hideStepGroupTitle: { type: GraphQLBoolean },
  hideCompletedSteps: { type: GraphQLBoolean },
  ...OrientationRelatedFields,
};

const ChecklistStyleType = new GraphQLObjectType({
  name: 'ChecklistStyle',
  fields: ChecklistStyleFields,
});

export const FormFactorStyleUnionType = new GraphQLUnionType({
  name: 'FormFactorStyle',
  // add more
  types: [
    BannerStyleType,
    ModalStyleType,
    TooltipStyleType,
    ChecklistStyleType,
    CardStyleType,
    CarouselStyleType,
    VideoGalleryStyleType,
  ],
  resolveType: (
    formFactorStyle: FormFactorStyle & {
      formFactor: GuideFormFactor;
      theme: Theme;
    }
  ) => {
    switch (formFactorStyle.formFactor) {
      case GuideFormFactor.banner:
        return BannerStyleType;

      case GuideFormFactor.modal:
        return ModalStyleType;

      case GuideFormFactor.tooltip:
      case GuideFormFactor.flow:
        return TooltipStyleType;

      case GuideFormFactor.inline: {
        if (isCardTheme(formFactorStyle.theme)) {
          return CardStyleType;
        }
        if (isCarouselTheme(formFactorStyle.theme)) {
          return CarouselStyleType;
        }
        if (isVideoGalleryTheme(formFactorStyle.theme)) {
          return VideoGalleryStyleType;
        }
        return ChecklistStyleType;
      }

      default:
        return ChecklistStyleType;
    }
  },
});

export const FormFactorStyleInputType = new GraphQLInputObjectType({
  name: 'FormFactorStyleInput',
  fields: {
    // must add all fields here since union type isn't supported as an input type
    // do validation in the mutation
    ...BannerStyleFields,
    ...ModalStyleFields,
    ...TooltipStyleFields,
    ...ChecklistStyleFields,
    ...CardStyleFields,
    ...CarouselStyleFields,
    ...VideoGalleryStyleFields,
  },
});
