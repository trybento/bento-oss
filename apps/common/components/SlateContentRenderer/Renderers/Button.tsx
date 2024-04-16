import React from 'react';

import { Box } from '@chakra-ui/react';
import UIButton from './shared/UIButton';

import SlateContentRendererContext from '../SlateContentRendererContext';

interface ButtonNode {
  type: 'button';
  buttonText: string;
  url: string;
  children: any; //TODO FIX THIS TYPING;
}

export interface ButtonProps {
  node: ButtonNode;
  children: any;
  onClick?: (e: React.MouseEvent) => void;
  [additionalProp: string]: any;
}

export default function Button(props: ButtonProps) {
  const { node, onClick, ...restProps } = props;
  const context = React.useContext(SlateContentRendererContext);
  const primaryColorHex = context.colors.primary;

  const url = node.url;
  const deprecatedButtonText = node.children?.[0]?.text;
  const buttonText = node.buttonText || deprecatedButtonText;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onClick) {
      onClick(e);
    } else if (url) {
      if (window) {
        if (url.includes(window.location.host)) {
          window.location.href = url;
        } else {
          window.open(url, '_blank');
        }
      }
    }
  };

  return (
    <Box mt="24px" mb="32px" textAlign="center" width="100%" {...restProps}>
      <UIButton
        onClick={handleClick}
        href={url}
        bg={primaryColorHex}
        _hover={{
          bg: primaryColorHex,
          opacity: '0.8',
        }}
        _active={{
          bg: primaryColorHex,
          opacity: '0.6',
        }}
      >
        {buttonText}
      </UIButton>
    </Box>
  );
}
