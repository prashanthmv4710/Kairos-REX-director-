// @refresh reset

/**
 * @module SignatureCapturePanel
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `SignatureCapturePanel.md` in this folder
 * or run `npm run ld-kit -- show SignatureCapturePanel`.
 */

import * as React from 'react';
import {Panel} from '../Panel';
import {Button} from '../Button';
import {SignatureBase, SignatureBaseProps} from '../SignatureCapture';
import './SignatureCapturePanel.css';

export interface SignatureCapturePanelProps extends SignatureBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'left' | 'right';
  onSubmit?: () => void;
  submitLabel?: string;
}

export const SignatureCapturePanel: React.FunctionComponent<SignatureCapturePanelProps> = ({
  isOpen,
  onClose,
  title = 'Subscription agreement',
  size = 'medium',
  position = 'right',
  onSubmit,
  submitLabel = 'Agree & sign',
  ...signatureBaseProps
}) => (
  <Panel
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size={size}
    position={position}
    actions={
      <Button variant="primary" size="medium" isFullWidth onClick={onSubmit}>
        {submitLabel}
      </Button>
    }
  >
    <SignatureBase {...signatureBaseProps} />
  </Panel>
);
SignatureCapturePanel.displayName = 'SignatureCapturePanel';
