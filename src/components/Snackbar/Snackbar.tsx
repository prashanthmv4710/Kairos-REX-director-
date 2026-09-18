'use client';
// @refresh reset

/**
 * @module Snackbar
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
 * For prop API + usage notes, read `Snackbar.md` in this folder
 * or run `npm run ld-kit -- show Snackbar`.
 */

import * as React from 'react';
import {cx} from '../../common/cx';
import {applyCommonProps} from '../../common/helpers';
import {
  CloseIcon,
} from '../Icons';
// ---------------------------------------------------------------------------
// Snack (inlined sub-component)
// ---------------------------------------------------------------------------

export interface SnackProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  UNSAFE_className?: string;
  UNSAFE_style?: React.CSSProperties;
  /**
   * The props spread to the snack's action button.
   */
  actionButtonProps?: SnackActionButtonProps & {
    children: string;
  };
  /**
   * The props spread to the snack's close button.
   */
  closeButtonProps?: SnackCloseButtonProps;
  /**
   * The message for the snack.
   */
  message: string;
  /**
   * The callback fired when the snack requests to close.
   */
  onClose: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * @private
 */
export const Snack: React.FunctionComponent<SnackProps> = (props) => {
  const {
    actionButtonProps,
    className,
    message,
    onClose,
    closeButtonProps,
    ...rest
  } = applyCommonProps(props);

  const {
    children: actionButtonLabel,
    onClick: actionButtonClick,
    ...actionButtonRest
  } = actionButtonProps || {};

  const {onClick: closeButtonClick, ...closeButtonRest} =
    closeButtonProps || {};

  return (
    <div className={cx('ld-snackbar-snack-snack', className)} {...rest}>
      <div className={'ld-snackbar-snack-message'}>{message}</div>

      {actionButtonProps && (
        <SnackActionButton
          onClick={(event) => {
            actionButtonClick?.(event);

            onClose(event);
          }}
          {...actionButtonRest}
        >
          {actionButtonLabel}
        </SnackActionButton>
      )}

      <SnackCloseButton
        aria-label="Close"
        onClick={(event) => {
          closeButtonClick?.(event);

          onClose(event);
        }}
        {...closeButtonRest}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// SnackActionButton (inlined sub-component)
// ---------------------------------------------------------------------------

export type SnackActionButtonProps = Omit<
  React.ComponentPropsWithRef<'button'>,
  'className' | 'style' | 'type'
> &
  { UNSAFE_className?: string; UNSAFE_style?: React.CSSProperties };

/**
 * @private
 */
export const SnackActionButton = React.forwardRef<
  HTMLButtonElement,
  SnackActionButtonProps
>((props, ref) => {
  const {className, ...rest} = applyCommonProps(props);

  return (
    <button
      className={cx('ld-snackbar-snackactionbutton-action', className)}
      ref={ref}
      type="button"
      {...rest}
    />
  );
});

// ---------------------------------------------------------------------------
// SnackCloseButton (inlined sub-component)
// ---------------------------------------------------------------------------

export interface SnackCloseButtonProps
  extends Omit<
      React.ComponentPropsWithRef<'button'>,
      'children' | 'className' | 'style' | 'type'
    > {}

/**
 * @private
 */
export const SnackCloseButton = React.forwardRef<
  HTMLButtonElement,
  SnackCloseButtonProps
>((props, ref) => {
  const {className, ...rest} = applyCommonProps(props);

  return (
    <button
      className={cx('ld-snackbar-snackclosebutton-closeButton', className)}
      ref={ref}
      type="button"
      {...rest}
    >
      <CloseIcon size={"small"} className={'ld-snackbar-snackclosebutton-icon'} />
    </button>
  );
});

// ---------------------------------------------------------------------------
// SnackbarContext (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 */
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SnackbarProviderPartialSnackProps = Optional<SnackProps, 'onClose'>;
/* eslint-disable @typescript-eslint/no-unused-vars */
export const SnackbarContext = React.createContext<
  Readonly<{
    addSnack: (snack: SnackbarProviderPartialSnackProps) => void;
  }>
>({
  addSnack: /* istanbul ignore next */ () => undefined,
});

// ---------------------------------------------------------------------------
// SnackbarProvider (inlined sub-component)
// ---------------------------------------------------------------------------

export interface SnackbarProviderProps {
  /**
   * The content for the snackbar provider.
   */
  children: React.ReactNode;
}

/**
 * @private
 */
export const SnackbarProvider: React.FunctionComponent<
  SnackbarProviderProps
> = (props) => {
  const {children} = props;

  const [snack, setSnack] = React.useState<SnackbarProviderPartialSnackProps>();

  const value = React.useRef({
    addSnack: setSnack,
  });

  return (
    <SnackbarContext.Provider value={value.current}>
      {children}
      {snack && <Snackbar snack={snack} setSnack={setSnack} />}
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.displayName = 'SnackbarProvider';

/**
 * Alias for {@link SnackbarProvider}. Some upstream snippets (notably the PX V2
 * starter kit) refer to the provider as `SnackbarContainer`; this export lets
 * those imports drop in without a rename.
 */
export const SnackbarContainer = SnackbarProvider;

// ---------------------------------------------------------------------------
// useRemoveSnackbar (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private
 *
 * This hook automatically initiates removal of the snackbar after a duration period. The period changes based on the length of the snack message.
 *
 * NOTE: This hook has been abstracted into a separate file to prevent
 * any `setTimeout` issues within glass and is not meant for reuse.
 * The implementation has been mocked within the glass `jestSetup`.
 *
 * @param snack
 * @param onClose
 */
export const useRemoveSnackbar = (
  snack: SnackbarProviderPartialSnackProps | undefined,
  onClose: () => void
) => {
  React.useEffect(() => {
    if (!snack) {
      return () => undefined;
    }

    const {message} = snack;

    const duration =
      message.length > 120 ? 3500 + (message.length - 120) * 60 : 3500;

    const timeoutID = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [snack, onClose]);
};

// ---------------------------------------------------------------------------
// useSnackbar (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * Snackbars provide brief messages at the bottom of the screen regarding app processes. Snackbars contain brief text directly related to the operation performed. They may contain an action, but no icons.
 *
 * {@link https://digitaltoolkit.livingdesign.walmart.com/components/snackbar/ Guidelines}
 * {@link https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/snackbar/ React documentation}
 *
 */
export const useSnackbar = () => React.useContext(SnackbarContext);

import {CSSTransition} from '../../common/CSSTransition';
import {useA11yAnnouncement} from '../A11yAnnouncement';
import './Snackbar.css';

// Inlined from hooks to avoid transitive @livingdesign/tokens dependency
const useOnClick = (
  onClick: (event: PointerEvent | MouseEvent | TouchEvent) => void,
  dependencies: ReadonlyArray<unknown> = [],
  useCapture = false
) =>
  React.useEffect(() => {
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', onClick, useCapture);
    } else {
      document.addEventListener('mousedown', onClick, useCapture);
      document.addEventListener('touchstart', onClick, useCapture);
    }
    return () => {
      if (window.PointerEvent) {
        document.removeEventListener('pointerdown', onClick, useCapture);
      } else {
        document.removeEventListener('mousedown', onClick, useCapture);
        document.removeEventListener('touchstart', onClick, useCapture);
      }
    };
  }, [onClick, ...dependencies, useCapture]);

const useOnClickInside: (
  ref: React.RefObject<HTMLElement> | React.RefObject<HTMLElement>[],
  onClick: (event: PointerEvent | MouseEvent | TouchEvent) => void,
  useCapture?: boolean
) => void = (ref, onClick, useCapture = false) => {
  const listener = (event: PointerEvent | MouseEvent | TouchEvent) => {
    const elementRef = Array.isArray(ref) ? ref : [ref];
    if (
      elementRef.some((ref2) =>
        ref2.current?.contains(event.target as Node)
      ) === false
    ) {
      return;
    }
    onClick(event);
  };
  useOnClick(listener, [ref, listener], useCapture);
};

interface SnackbarProps extends React.ComponentPropsWithoutRef<'div'> {
  snack: SnackbarProviderPartialSnackProps;
  setSnack: React.Dispatch<
    React.SetStateAction<SnackbarProviderPartialSnackProps | undefined>
  >;
}

/**
 * @private
 */
export const Snackbar: React.FunctionComponent<SnackbarProps> = (props) => {
  const {snack, setSnack} = props;

  const {
    actionButtonProps,
    closeButtonProps,
    message,
    onClose: snackOnClose,
    ...snackRest
  } = snack;

  const snackbarRef = React.useRef<HTMLDivElement>(null);
  const [inProp, setInProp] = React.useState(false);

  const onClose = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setInProp(false);

    snackOnClose?.(event);
  };

  // ensure that snackbar do not propogate to overlay components. if stop propagation
  // is preventing clicks from being captured, a new event must be specified with
  // `useCapture` that is declared before this component is rendered.
  // @see {@link https://jira.walmart.com/browse/LD-1260}
  useOnClickInside(snackbarRef, (event) => event.stopPropagation(), true);

  // remove snackbar after X duration
  useRemoveSnackbar(snack, onClose);

  const {announceAssertive} = useA11yAnnouncement();

  React.useEffect(() => {
    setInProp(true);
    announceAssertive(message);
  }, [announceAssertive, message, snack]);

  return (
    <CSSTransition
      classNames={{
        enter: 'ld-snackbar-transitionEnter',
        enterActive: 'ld-snackbar-transitionEnterActive',
        exit: 'ld-snackbar-transitionExit',
        exitActive: 'ld-snackbar-transitionExitActive',
      }}
      in={inProp}
      mountOnEnter
      nodeRef={snackbarRef}
      onExited={() => setSnack(undefined)}
      timeout={{
        enter: 500,
        exit: 750,
      }}
    >
      <div className={'ld-snackbar-snackbar'} ref={snackbarRef}>
        <div className={'ld-snackbar-snackContainer'}>
          <Snack
            actionButtonProps={actionButtonProps}
            closeButtonProps={closeButtonProps}
            message={message}
            onClose={onClose}
            UNSAFE_className={'ld-snackbar-snack'}
            {...snackRest}
          />
        </div>
      </div>
    </CSSTransition>
  );
};
