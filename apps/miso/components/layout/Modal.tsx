import {
  ModalProps,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  Button,
  ButtonProps,
  ButtonGroup,
} from '@chakra-ui/react';
import { Modal as ChakraModal } from 'bento-common/components/Modal';
import { slugify } from 'bento-common/data/helpers';
import React from 'react';
import ModalBody from 'system/ModalBody';

export type ModalCta = ButtonProps & { label: string | React.ReactNode };

type Props = ModalProps & {
  title: string;
  hideCloseButton?: boolean;
  ctas?: ModalCta[];
  /** Providing a footer instead of CTAs will override CTA prop */
  footer?: React.ReactNode;
};

/**
 * Wrapper around Chakra modal to set up consistent CTAs and container styling
 */
const Modal: React.FC<React.PropsWithChildren<Props>> = ({
  title,
  ctas,
  hideCloseButton,
  footer,
  children,
  ...rest
}) => {
  return (
    <ChakraModal size="lg" id={slugify(title)} {...rest}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {!hideCloseButton && <ModalCloseButton />}
        <ModalBody pb="6">{children}</ModalBody>
        <ModalFooter>
          {footer ? (
            footer
          ) : ctas ? (
            <ButtonGroup>
              {ctas.map(({ label, ...buttonProps }) => (
                <Button key={`modal-cta-${label}`} {...buttonProps}>
                  {label}
                </Button>
              ))}
            </ButtonGroup>
          ) : null}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
