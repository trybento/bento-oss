import { graphql } from 'react-relay';

graphql`
  fragment Media_stepMedia on MediaReference {
    entityId
    media {
      type
      url
      meta {
        ... on ImageMediaMeta {
          naturalWidth
          naturalHeight
        }
        ... on VideoMediaMeta {
          videoId
          videoType
        }
      }
    }
    settings {
      ... on ImageMediaReferenceSettings {
        alignment
        fill
        hyperlink
        lightboxDisabled
      }
      ... on VideoMediaReferenceSettings {
        alignment
        playsInline
      }
    }
  }
`;
