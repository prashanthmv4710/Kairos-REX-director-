'use client';
// @refresh reset

/**
 * @module PromptComposer
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
 * For prop API + usage notes, read `PromptComposer.md` in this folder
 * or run `npm run ld-kit -- show PromptComposer`.
 */

import * as React from 'react';

import {cx} from '../../common/cx';
import {applyCommonProps, CommonProps} from '../../common/helpers';
import {useAnnounce} from '../A11yAnnouncement';
import {IconButton} from '../IconButton/IconButton';
import {IconSelector} from '../IconSelector/IconSelector';
import {ArrowUpIcon, CloseIcon, Icon, PlusIcon, StopIcon, VoiceSearchIcon} from '../Icons';
import {MagicBox} from '../MagicBox';
import {Tooltip} from '../Tooltip';
import {VisuallyHidden} from '../VisuallyHidden';
import './PromptComposer.css';

/* ------------------------------------------------------------------ */
/*  Inline SVG icons (no LD equivalent exists for expand)               */
/* ------------------------------------------------------------------ */

function ExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M6 2H2v4M10 14h4v-4M14 6V2h-4M2 10v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// DictationWaveform — the live, scrolling voice waveform shown while listening
// ---------------------------------------------------------------------------

// bar-width (2 px) + gap (2 px) = 4 px per slot — keep in sync with
// --_pc-wave-bar-width and --_pc-wave-gap CSS tokens (both 0.125 rem at 16 px root).
const WAVEFORM_BAR_SLOT_PX = 4;
const WAVEFORM_BARS_MIN = 8;
const WAVEFORM_BARS_DEFAULT = 32; // used before the first ResizeObserver measurement

/** Whether the user has asked for reduced motion (SSR-safe). */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * A gentle, flowing pseudo-waveform sample (0–1) for a given step — used to
 * keep the "Listening" indicator alive when there's no live mic envelope to
 * read (the component-config preview, externally-driven `recording`, or when
 * mic metering is blocked). Layered sines + a touch of jitter read as voice.
 */
function synthWaveformSample(step: number): number {
  // Layered sines give voice-like contour; small random nudge adds organic
  // feel without making consecutive bars jump wildly (kept well below the
  // sine amplitudes so height variation reads as smooth, not jittery).
  const s =
    0.35 +
    0.3 * Math.sin(step * 2.7 + 0.5) +
    0.15 * Math.sin(step * 5.1 + 1.2) +
    (Math.random() - 0.5) * 0.06;
  return Math.max(0.06, Math.min(1, s));
}

/**
 * A row of thin vertical bars that scrolls left as new mic-level samples arrive
 * on the right — the "voice wavelengths" shown next to the "Listening" label.
 * Reads the current loudness from `levelRef` on its own animation loop (no
 * per-sample React churn upstream) and pushes one sample ~18x/s so the bars
 * feel alive without thrashing layout or React state upstream.
 *
 * Bar count is kept proportional to the container's measured width so bars
 * always fill the available space snugly (~2 px gap) — no clumping on the left
 * or over-spreading across a wide row.
 */
function DictationWaveform({
  active,
  levelRef,
}: {
  active: boolean;
  levelRef: React.MutableRefObject<number>;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  // barCountRef lets the animation tick read the latest count without being
  // listed as a dep, so a resize mid-session smoothly adjusts without restarting.
  const barCountRef = React.useRef(WAVEFORM_BARS_DEFAULT);
  // EMA-smoothed mic level shared between the 60fps live-bar loop and the 18Hz
  // history-scroll tick so both see the same stable envelope, not raw RMS noise.
  const smoothedLevelRef = React.useRef(0);
  // Start empty — bars grow in from the right as ticks arrive, so there are no
  // pre-populated stub bars at the moment the mic button is pressed.
  const [bars, setBars] = React.useState<number[]>([]);

  // Measure the container width and keep bar count proportional so bars always
  // fill snugly with the configured gap (WAVEFORM_BAR_SLOT_PX = bar + gap).
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const sync = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 0) {
        barCountRef.current = Math.max(
          WAVEFORM_BARS_MIN,
          Math.floor(w / WAVEFORM_BAR_SLOT_PX),
        );
      }
    };
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    sync();
    return () => ro.disconnect();
  }, []);

  // 60fps EMA loop — keeps smoothedLevelRef current at full mic resolution so
  // the 18Hz history tick always has an accurate, smoothed envelope to sample.
  // No DOM writes here — React owns all bar styles via setBars below.
  React.useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    smoothedLevelRef.current = 0;
    let raf = 0;
    const updateSmoothed = () => {
      const raw = levelRef.current;
      // Asymmetric EMA: fast attack (α=0.4 ≈ 45ms half-life at 60fps),
      // slow decay (α=0.12 ≈ 150ms) so brief pauses between words don't
      // drop the envelope to zero before the next syllable arrives.
      const alpha = raw > smoothedLevelRef.current ? 0.4 : 0.12;
      smoothedLevelRef.current = smoothedLevelRef.current * (1 - alpha) + raw * alpha;
      raf = requestAnimationFrame(updateSmoothed);
    };
    raf = requestAnimationFrame(updateSmoothed);
    return () => cancelAnimationFrame(raf);
  }, [active, levelRef]);

  React.useEffect(() => {
    if (!active) {
      setBars([]);
      return;
    }
    // Reduced motion: render one static, varied waveform and don't animate.
    if (prefersReducedMotion()) {
      setBars(Array.from({length: barCountRef.current}, (_, i) => synthWaveformSample(i)));
      return;
    }
    let raf = 0;
    let last = 0;
    let step = 0;
    const tick = (t: number) => {
      if (t - last >= 55) {
        last = t;
        step += 1;
        // smoothedLevelRef is kept current by the 60fps EMA loop above,
        // so this sample always reflects actual mic activity even if the
        // tick fires during a brief inter-syllable pause.
        const live = smoothedLevelRef.current;
        // Only use real mic level — no synthetic fallback. Bars go flat
        // during silence so the waveform only reacts to actual speech.
        const sample = live > 0.04 ? live : 0;
        setBars((prev) => {
          // Self-corrects to the current bar count on every tick, so resizing
          // during an active session adjusts bar density without restarting.
          const count = barCountRef.current;
          const next = prev.slice(-(count - 1));
          next.push(sample);
          return next;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, levelRef]);

  return (
    <div ref={containerRef} className="ld-promptcomposer-waveform" aria-hidden>
      {bars.map((lvl, i) => (
        <span
          key={i}
          className="ld-promptcomposer-waveform-bar"
          style={{
            // Square-root curve stretches mid-range speech levels (0.2–0.5)
            // into the upper half of the bar height so normal conversation
            // reads as visually tall bars, not just small twitches.
            transform: `scaleY(${(0.08 + Math.sqrt(lvl) * 0.92).toFixed(3)})`,
            opacity: (0.25 + Math.sqrt(lvl) * 0.75).toFixed(3),
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PromptComposerSuggestions
// ---------------------------------------------------------------------------

export interface PromptComposerSuggestionsProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style' | 'onSelect'> {
  /** The suggestion strings shown as starter chips. */
  suggestions: string[];
  /** Fired when a chip is chosen; typically fills the composer. */
  onSelect?: (suggestion: string) => void;
}

/**
 * A wrapping row of starter / suggestion chips shown above the input for the
 * empty (landing) state. Selecting a chip surfaces its text via `onSelect`.
 */
export const PromptComposerSuggestions = React.forwardRef<
  HTMLDivElement,
  PromptComposerSuggestionsProps
>((props, ref) => {
  const {className, suggestions, onSelect, ...rest} = applyCommonProps(props);
  return (
    <div ref={ref} className={cx('ld-promptcomposer-suggestions', className)} {...rest}>
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          className="ld-promptcomposer-suggestion"
          onClick={(e) => {
            onSelect?.(s);
            // Move focus to the composer input so the just-inserted text is
            // announced and the user can keep typing from the end. Deferred a
            // frame so the value has committed before we place the caret.
            const textarea = e.currentTarget
              .closest('.ld-promptcomposer-root')
              ?.querySelector('textarea');
            if (textarea) {
              requestAnimationFrame(() => {
                textarea.focus();
                const end = textarea.value.length;
                textarea.setSelectionRange(end, end);
              });
            }
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
});

PromptComposerSuggestions.displayName = 'PromptComposerSuggestions';

// ---------------------------------------------------------------------------
// PromptComposerDisclaimer
// ---------------------------------------------------------------------------

export interface PromptComposerDisclaimerProps
  extends CommonProps,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  /** The disclaimer copy (may contain links). */
  children: React.ReactNode;
  /** Leading sparkle. `true` renders the default sparkle icon. */
  icon?: React.ReactNode | boolean;
  /**
   * Horizontal alignment of the caption.
   *
   * @default "center"
   */
  align?: 'start' | 'center';
  /**
   * Typography token to use for the disclaimer.
   *
   * Use `body-small` when the disclaimer is inline in the chat at the start
   * of a conversation. Use `caption` when it sits below the Prompt Composer.
   *
   * @default "caption"
   */
  size?: 'caption' | 'body-small';
}

/**
 * The legal / safety caption shown beneath a Prompt Composer — e.g. an
 * "AI can make mistakes" note or links to Privacy Notes and Terms of Use.
 */
export const PromptComposerDisclaimer = React.forwardRef<
  HTMLDivElement,
  PromptComposerDisclaimerProps
>((props, ref) => {
  const {className, children, icon = false, align = 'center', size = 'caption', ...rest} =
    applyCommonProps(props);

  const leading =
    icon === true ? (
      <Icon name="Magic" decorative className="ld-promptcomposer-disclaimer-icon" />
    ) : icon ? (
      <span className="ld-promptcomposer-disclaimer-icon" aria-hidden>
        {icon}
      </span>
    ) : null;

  return (
    <div
      ref={ref}
      role="note"
      data-align={align}
      data-size={size}
      className={cx('ld-promptcomposer-disclaimer', className)}
      {...rest}
    >
      <span className="ld-promptcomposer-disclaimer-content">
        {leading}
        <span className="ld-promptcomposer-disclaimer-text">{children}</span>
      </span>
    </div>
  );
});

PromptComposerDisclaimer.displayName = 'PromptComposerDisclaimer';

// ---------------------------------------------------------------------------
// useDictation — Web Speech voice-to-text + live mic-level metering
// ---------------------------------------------------------------------------

/* The browser Speech APIs aren't in the standard DOM lib types, so this hook
   talks to them through `any`. It transcribes speech into `onResult` and, in
   parallel, runs a Web Audio analyser that reports the live input loudness
   (0–1) to `onLevel` so the UI can pulse a border in time with the voice. */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface DictationController {
  /** Whether the browser exposes a Speech Recognition implementation. */
  supported: boolean;
  /** Whether a dictation session is currently active. */
  recording: boolean;
  /** Start / stop the session. */
  toggle: () => void;
  /** Stop the session (no-op when idle). */
  stop: () => void;
}

function useDictation(params: {
  /** BCP-47 language tag for recognition (e.g. "en-US"). */
  lang: string;
  /** Fired for each recognized chunk; commit only `isFinal` chunks. */
  onResult: (transcript: string, isFinal: boolean) => void;
  /** Fired ~60×/s with the normalized input loudness (0–1); 0 when idle. */
  onLevel: (level: number) => void;
}): DictationController {
  // Keep the callbacks in refs so the long-lived recognition/analyser handlers
  // always call the latest closures without being re-created.
  const onResultRef = React.useRef(params.onResult);
  const onLevelRef = React.useRef(params.onLevel);
  onResultRef.current = params.onResult;
  onLevelRef.current = params.onLevel;

  const {lang} = params;

  const supported = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    const w = window as any;
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  }, []);

  const [recording, setRecording] = React.useState(false);
  const recognitionRef = React.useRef<any>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const audioCtxRef = React.useRef<any>(null);
  const rafRef = React.useRef<number | null>(null);

  const stop = React.useCallback(() => {
    setRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    }
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close?.().catch?.(() => {});
      audioCtxRef.current = null;
    }
    onLevelRef.current(0);
  }, []);

  const start = React.useCallback(() => {
    if (!supported || recognitionRef.current) return;
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    // Tracks the full accumulated transcript for the current session so
    // `onend` can commit it even when recognition stops silently mid-session.
    let latestFullText = '';
    recognition.onresult = (e: any) => {
      // Accumulate ALL results (previously finalized + current interim) into
      // one string and emit it as non-final on every event. This eliminates the
      // "commit then restart" pattern that caused visible pauses between utterances.
      let text = '';
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      latestFullText = text;
      onResultRef.current(text, false);
    };
    recognition.onerror = () => {
      /* Permission denied / no-speech — fall through to onend cleanup. */
    };
    recognition.onend = () => {
      // Emit a final result with the full session text so PromptComposer can
      // commit it cleanly regardless of why recognition stopped.
      if (latestFullText) {
        onResultRef.current(latestFullText, true);
      }
      recognitionRef.current = null;
      stop();
    };
    recognitionRef.current = recognition;
    setRecording(true);
    try {
      recognition.start();
    } catch {
      /* start() throws if called while already running — ignore. */
    }

    // In parallel, meter the live input loudness so a border can pulse with
    // the voice. This is best-effort: if it fails, dictation still works.
    navigator.mediaDevices
      ?.getUserMedia({audio: true})
      .then((stream) => {
        // The session may have been stopped while permission was pending.
        if (!recognitionRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const AudioCtx = w.AudioContext || w.webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          // RMS of the waveform around the 128 midpoint → perceived loudness.
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          // Speech RMS sits ~0.02–0.25; lift it into a usable 0–1 envelope.
          const level = Math.min(1, rms * 4);
          onLevelRef.current(level);
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => {
        /* Mic blocked for metering — recognition continues without a pulse. */
      });
  }, [supported, lang, stop]);

  const toggle = React.useCallback(() => {
    if (recognitionRef.current) stop();
    else start();
  }, [start, stop]);

  // Tear everything down if the composer unmounts mid-session.
  React.useEffect(() => stop, [stop]);

  return {supported, recording, toggle, stop};
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// PromptComposer
// ---------------------------------------------------------------------------

/**
 * Prompt Composer layout variant:
 * - `default` → the full two-row composer (input above a toolbar row).
 * - `inline` → a single-row composer for narrow panels / compact surfaces.
 *   It has no room for an attachments strip, so it auto-expands into the
 *   `default` layout — the same morph used for multi-line text — as soon as
 *   `attachments` is non-empty, and collapses back once every attachment is
 *   removed.
 */
export type PromptComposerVariant = 'default' | 'inline';

/**
 * Prompt Composer size. Maps to a device / density treatment that scales text,
 * icons, and padding. The underlying prop values are stable for consumers.
 * - `large` → Desktop (default): LD body-medium (16px) text, 8px padding, 32px buttons (IconButton small).
 * - `small` → Desktop (compressed): LD body-small (14px) text, 4px padding, 32px buttons. Same responsive width as `large`.
 * - `mobile` → Mobile: LD body-medium (16px) text, 8px padding, 40px buttons (IconButton medium). Opts out of desktop width clamp.
 */
export type PromptComposerSize = 'large' | 'small' | 'mobile';

/**
 * How an active dictation session is presented:
 * - `listening` → the in-field "Listening" label + live voice waveform, with
 *   the leading `+` replaced by a `✕` to cancel and the send button shown as
 *   an equalizer glyph. No MagicBox.
 * - `voice-to-text` → the mic button is wrapped in a MagicBox that pulses with
 *   the live voice level. The rest of the composer layout is unchanged.
 */
export type PromptComposerDictationVariant = 'listening' | 'voice-to-text';

export interface PromptComposerProps
  extends CommonProps,
    Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'style' | 'onChange' | 'onSubmit'
    > {
  /**
   * Visually-hidden heading rendered at the top of the composer so screen
   * reader users have a labelled landmark for the message-input region.
   *
   * @default "Send a message"
   */
  a11yHeading?: string;
  /**
   * The layout variant.
   *
   * @default "inline"
   */
  variant?: PromptComposerVariant;
  /**
   * The size for the composer (text / icon / padding scale).
   *
   * @default "large"
   */
  size?: PromptComposerSize;
  /** Controlled value of the prompt text. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fired on every change of the prompt text. */
  onValueChange?: (value: string) => void;
  /**
   * Fired when the prompt is submitted (send click, or Enter per `submitOn`).
   * The composer clears its own value afterward when uncontrolled.
   */
  onSend?: (value: string) => void;
  /**
   * The placeholder for the input.
   *
   * @default "Ask anything"
   */
  placeholder?: string;
  /** If the composer is disabled. */
  disabled?: boolean;
  /**
   * Error / negative styling. A node is rendered as a message beneath the
   * field; `true` applies error styling without a message.
   */
  error?: boolean | React.ReactNode;
  /**
   * When the agent is generating, the primary button becomes a Stop button.
   */
  busy?: boolean;
  /** Fired when the Stop button is pressed (only relevant while `busy`). */
  onStop?: () => void;
  /**
   * Submit behavior. `enter` sends on Enter (Shift+Enter inserts a newline);
   * `mod+enter` only sends on Cmd/Ctrl+Enter. Cmd/Ctrl+Enter always sends.
   *
   * @default "enter"
   */
  submitOn?: 'enter' | 'mod+enter';
  /**
   * Max rows the textarea grows to before it scrolls. The field hugs its
   * content until then.
   *
   * @default 5
   */
  maxRows?: number;
  /** Show an expand / fullscreen toggle for long prompts. */
  expandable?: boolean;
  /** Fired when the expand toggle is pressed. */
  onExpand?: () => void;
  /** Character limit. Sending is blocked while the value is over the limit. */
  maxLength?: number;
  /** Show the character counter (auto-on when `maxLength` is set). */
  showCount?: boolean;
  /** Attachment tiles rendered in the attachments row. */
  attachments?: React.ReactNode;
  /** Fired by the file picker, drag-and-drop, and clipboard paste. */
  onAttachFiles?: (files: File[]) => void;
  /**
   * Enable drag-and-drop attachment. Shows a drop affordance while dragging.
   *
   * @default true
   */
  allowDrop?: boolean;
  /** Fired when `/` is typed at the start of a token (open a command menu). */
  onSlashTrigger?: () => void;
  /** Fired when `@` is typed at the start of a token (open a mention menu). */
  onMentionTrigger?: () => void;
  /** Mic dictation active state. */
  recording?: boolean;
  /**
   * How an active dictation session is presented (see
   * `PromptComposerDictationVariant`). `listening` shows the in-field waveform;
   * `voice-to-text` wraps the mic in a pulsing MagicBox.
   *
   * @default "listening"
   */
  dictationVariant?: PromptComposerDictationVariant;
  /** Fired when the mic is toggled. */
  onMicToggle?: () => void;
  /** Show the mic button. @default true */
  showMic?: boolean;
  /**
   * Show an optional `IconSelector` button between the leading `+` button and
   * the `toolbarStart` tools pill — used for binary on/off context selectors
   * (e.g. "select element"). Provide `selectorIconUnselected` and
   * `selectorIconSelected` to drive the paired icon set.
   *
   * @default false
   */
  showSelector?: boolean;
  /** The icon shown when the selector is **selected** (the "on" state).
   *
   * @default <Icon name="ArrowSelect" />
   */
  selectorIconSelected?: React.ReactNode;
  /** The icon shown when the selector is **unselected** (the "off" state).
   *
   * @default <Icon name="ArrowSelect" />
   */
  selectorIconUnselected?: React.ReactNode;
  /** Controlled selected state of the selector. */
  selectorSelected?: boolean;
  /** Default selected state when uncontrolled. @default false */
  selectorDefaultSelected?: boolean;
  /** Fired when the selector's selected state changes. */
  onSelectorChange?: (selected: boolean) => void;
  /** Accessible label for the selector. @default "Select context" */
  selectorLabel?: string;
  /**
   * Content rendered by the leading `+` button (e.g. a Menu of add actions).
   * When provided, the `+` button is rendered by the consumer instead; pass a
   * trigger element here. When omitted, the composer renders a `+` button that
    * fires `onAdd`.
    *
    * Two supported recipes for downstream teams:
    * - Status quo preset: omit `addMenu`; provide `onAttachFiles` and let the
    *   built-in `+` trigger the browser file picker.
    * - Menu preset: provide `addMenu` with a Menu trigger/items (for example:
    *   Add files, Insert skill, Explore agents) and wire actions in the
    *   consumer.
   */
  addMenu?: React.ReactNode;
    /**
    * Fired when the built-in `+` add button is pressed (no `addMenu`). When
    * `addMenu` is provided, the consumer-owned trigger/actions take precedence
    * and this callback is not used by the slotted control.
    */
  onAdd?: () => void;
  /** Tools / context pill(s) placed after the `+` button (e.g. ButtonToggle). */
  toolbarStart?: React.ReactNode;
  /** Mode selector(s) placed before the mic + send cluster. */
  toolbarEnd?: React.ReactNode;
  /** Suggestion starter chips shown above the input (empty state). */
  suggestions?: React.ReactNode;
  /** Accessible label for the send button. @default "Send message" */
  sendLabel?: string;
  /** Accessible label for the stop button. @default "Stop answering" */
  stopLabel?: string;
  /** Accessible label for the add button. @default "Add files" */
  addLabel?: string;
  /** Accessible label for the mic button. @default "Dictate" */
  micLabel?: string;
  /**
   * BCP-47 language tag used for built-in voice-to-text dictation when the
   * browser supports the Web Speech API.
   *
   * @default "en-US"
   */
  dictationLang?: string;
}

/**
 * Prompt Composer is the input used to talk to an AI agent. It supports a full
 * two-row `default` layout and a compact single-row `inline` layout, scales via
 * `size`, and covers the full interaction matrix: typing, focus, attachments
 * (picker / drag-drop / paste), a generate→stop cycle, slash/mention triggers,
 * dictation, a character counter, and starter suggestions. Pair it with
 * `PromptComposerDisclaimer` for the safety caption and
 * `PromptComposerSuggestions` for the empty-state starters.
 *
 * ### A11yAnnouncementProvider (required for character-limit announcements)
 * When `maxLength` is set, closing in on and reaching/exceeding it is announced
 * via `useAnnounce()`. Without an `<A11yAnnouncementProvider>` ancestor the hook
 * silently no-ops and AT users get the visible counter but no live feedback:
 *
 * ```tsx
 * import { A11yAnnouncementProvider } from '../A11yAnnouncement';
 *
 * <A11yAnnouncementProvider>
 *   <PromptComposer maxLength={280} />
 * </A11yAnnouncementProvider>
 * ```
 *
 * Pages already wrapped by `<LivingDesign>` are covered automatically.
 */
export const PromptComposer = React.forwardRef<HTMLDivElement, PromptComposerProps>(
  (props, ref) => {
    const LAYOUT_MORPH_MS = 130;
    const LAYOUT_MORPH_EASING = 'cubic-bezier(0.2, 0, 0, 1)';
    const INLINE_EXPAND_PX = 1;
    const INLINE_COLLAPSE_PX = 0.5;

    const {
      variant = 'inline',
      size = 'large',
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      onSend,
      placeholder = 'Ask anything',
      disabled = false,
      error = false,
      busy = false,
      onStop,
      submitOn = 'enter',
      maxRows = 5,
      expandable = false,
      onExpand,
      maxLength,
      showCount,
      attachments,
      onAttachFiles,
      allowDrop = true,
      onSlashTrigger,
      onMentionTrigger,
      recording = false,
      dictationVariant = 'listening',
      onMicToggle,
      showMic = true,
      showSelector = false,
      selectorIconSelected = <Icon name="ArrowSelect" />,
      selectorIconUnselected = <Icon name="ArrowSelect" />,
      selectorSelected,
      selectorDefaultSelected = false,
      onSelectorChange,
      selectorLabel = 'Select context',
      addMenu,
      onAdd,
      toolbarStart,
      toolbarEnd,
      suggestions,
      sendLabel = 'Send message',
      stopLabel = 'Stop answering',
      addLabel = 'Add files',
      micLabel = 'Dictate',
      dictationLang = 'en-US',
      a11yHeading = 'Send a message',
      className,
      ...rest
    } = applyCommonProps(props);

    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const value = controlledValue !== undefined ? controlledValue : uncontrolled;
    // Live interim transcript — shown in the textarea as the user speaks but
    // never committed to `value` until dictation stops. Cleared when the
    // session ends so `value` always reflects only confirmed text.
    const [interimSuffix, setInterimSuffix] = React.useState('');
    // Committed value captured the moment dictation starts, used as the fixed
    // display base so interim accumulates from it without duplicating text.
    const preDictationBaseRef = React.useRef('');
    // Set to true when the user submits mid-session so the onend commit
    // (which fires async after recognition.stop()) doesn't double-commit.
    const sessionSubmittedRef = React.useRef(false);
    // Tracks whether the user had explicitly focused the textarea before
    // starting dictation. Used by handleCommitDictation to decide whether to
    // restore focus (keeping the shadow) or let focus fall to body (no shadow).
    const textareaHadFocusRef = React.useRef(false);
    // When the textarea was focused before dictation started, apply the
    // `.focused` class to the root so the field shadow persists through the
    // listening state (where :focus-within would otherwise drop it).
    const [listeningFocused, setListeningFocused] = React.useState(false);
    // Set by cancel/commit handlers; read by a useLayoutEffect that fires after
    // React commits the textarea back to the DOM (null = not pending).
    const pendingFocusRestoreRef = React.useRef<boolean | null>(null);
    // Snapshot of textareaHadFocusRef taken at handleMicToggle time (before any
    // state updates / DOM mutations). After the mic button unmounts focus falls
    // to body, which clears textareaHadFocusRef via focusout — so we snapshot
    // it here, before that happens, and use THIS value for focus-restore decisions.
    const listeningStartedWithFocusRef = React.useRef(false);

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const attachmentsRef = React.useRef<HTMLDivElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const micWrapRef = React.useRef<HTMLSpanElement>(null);
    const transitionCleanupRef = React.useRef<(() => void) | null>(null);
    const transitionFromHeightRef = React.useRef<number | null>(null);
    const expandedAtLengthRef = React.useRef<number | null>(null);
    const pendingSelectionRef = React.useRef<{
      start: number;
      end: number;
    } | null>(null);
    const [dragOver, setDragOver] = React.useState(false);
    const [autoExpanded, setAutoExpanded] = React.useState(false);
    const [attachmentFade, setAttachmentFade] = React.useState({left: false, right: false});

    const setRootRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Latest value, read inside the dictation callback to append transcripts
    // without re-creating the recognition handler on every keystroke.
    const valueRef = React.useRef(value);
    valueRef.current = value;

    // Latest live mic loudness (0–1). The waveform reads this on its own loop;
    // the MagicBox reads it via the CSS variable set below.
    const levelRef = React.useRef(0);

    // The inline (single-row) composer has no room for an attachments strip,
    // so it borrows the same auto-expand morph used for multi-line text: as
    // soon as there's at least one attachment, it grows into the full
    // `default` two-row layout (attachments row above the field) and shrinks
    // back to `inline` once every attachment is removed.
    // `React.Children.count` (not `Boolean`) so an empty array/fragment —
    // e.g. a consumer passing `files.map(...)` before checking `files.length`
    // — doesn't read as "has attachments" and wrongly pin the `inline`
    // variant to its expanded `default` layout when there's really no content.
    const hasAttachments = React.Children.count(attachments) > 0;
    const effectiveVariant: PromptComposerVariant =
      variant === 'inline' && (autoExpanded || hasAttachments) ? 'default' : variant;
    const isInline = effectiveVariant === 'inline';
    const hasError = Boolean(error);
    const errorMessage = typeof error !== 'boolean' && error ? error : null;
    // Unique id so the invalid input can point at its error message via
    // aria-describedby — unique per instance (multiple composers on a page).
    const errorId = React.useId();
    const overLimit = maxLength != null && value.length > maxLength;
    const isEmpty = value.trim().length === 0 && interimSuffix.trim().length === 0;
    const canSend = !disabled && !isEmpty && !overLimit;
    const counterShown = showCount || maxLength != null;

    // The visible counter (e.g. "33/280") used to carry its own `aria-live`,
    // which announced the running count on *every* keystroke — noisy enough
    // to make the field unusable with a screen reader. The limit itself is
    // now stated once, declaratively, in the textarea's own `aria-label`
    // (below); live announcements are reserved for the moments that actually
    // need a nudge: closing in on the limit, and reaching/exceeding it.
    const announce = useAnnounce();
    const lastAnnouncedRemainingRef = React.useRef<number | null>(null);
    React.useEffect(() => {
      if (maxLength == null) return;
      const remaining = maxLength - value.length;

      if (remaining > 50) {
        // Back out of the final stretch (e.g. text was deleted) — clear so
        // typing back into it announces again instead of staying silent.
        lastAnnouncedRemainingRef.current = null;
        return;
      }
      if (lastAnnouncedRemainingRef.current === remaining) return;

      if (remaining <= 0) {
        // At or past the limit — assertive, since this blocks sending.
        // Fire once on entering the over-limit state; don't repeat on every
        // additional keystroke (assertive interrupts the screen reader each time).
        const wasAlreadyOver = (lastAnnouncedRemainingRef.current ?? 1) <= 0;
        lastAnnouncedRemainingRef.current = remaining;
        if (!wasAlreadyOver) {
          announce.assertive(
            remaining === 0
              ? `Character limit reached: ${maxLength} of ${maxLength}.`
              : `Over the ${maxLength} character limit.`,
          );
        }
      } else {
        // Final 50 characters — announce per 10-char bucket so a paste that
        // jumps past a multiple of 10 still triggers a polite nudge.
        const bucket = Math.ceil(remaining / 10) * 10;
        if (lastAnnouncedRemainingRef.current !== bucket) {
          lastAnnouncedRemainingRef.current = bucket;
          announce.polite(`${remaining} characters remaining.`);
        }
      }
    }, [value, maxLength, announce]);

    // Auto-grow the textarea up to `maxRows`, then let it scroll. Hugs a single
    // line when empty.
    const resizeTextarea = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;
      const styles = window.getComputedStyle(el);
      const lineHeight = parseFloat(styles.lineHeight) || 20;
      const paddingY =
        parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const oneLine = lineHeight + paddingY;
      // Empty field hugs one line — never trust scrollHeight measured before the
      // flex/resizable layout has settled the width (it inflates from wrapping).
      if (el.value.length === 0) {
        el.style.height = `${oneLine}px`;
        el.style.overflowY = 'hidden';
        if (variant === 'inline') {
          setAutoExpanded((prev) => {
            if (!prev) return prev;
            expandedAtLengthRef.current = null;
            transitionFromHeightRef.current =
              rootRef.current?.getBoundingClientRect().height ?? null;
            if (document.activeElement === el) {
              pendingSelectionRef.current = {
                start: el.selectionStart ?? el.value.length,
                end: el.selectionEnd ?? el.value.length,
              };
            }
            return false;
          });
        }
        return;
      }
      el.style.height = 'auto';
      const contentHeight = Math.max(el.scrollHeight - paddingY, lineHeight);
      if (variant === 'inline') {
        const rootHeightBeforeToggle =
          rootRef.current?.getBoundingClientRect().height ?? null;
        const currentLength = el.value.length;
        setAutoExpanded((prev) => {
          const nextAutoExpanded = prev
            ? !(
                contentHeight <= lineHeight + INLINE_COLLAPSE_PX &&
                (expandedAtLengthRef.current == null ||
                  currentLength < expandedAtLengthRef.current)
              )
            : contentHeight > lineHeight + INLINE_EXPAND_PX;
          if (prev === nextAutoExpanded) return prev;
          if (nextAutoExpanded) {
            expandedAtLengthRef.current = currentLength;
          } else {
            expandedAtLengthRef.current = null;
          }
          transitionFromHeightRef.current = rootHeightBeforeToggle;
          if (document.activeElement === el) {
            pendingSelectionRef.current = {
              start: el.selectionStart ?? el.value.length,
              end: el.selectionEnd ?? el.value.length,
            };
          }
          return nextAutoExpanded;
        });
      }
      const maxHeight = lineHeight * maxRows + paddingY;
      const next = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${next}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }, [maxRows, variant]);

    React.useLayoutEffect(() => {
      resizeTextarea();
      // interimSuffix drives displayValue during dictation; value itself doesn't
      // change then, so include it so the textarea grows as transcription arrives.
      // When the field is at max-height and overflowing, pin the scroll position
      // to the bottom so the newest transcribed line is always visible.
      if (interimSuffix) {
        const el = textareaRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }
    }, [value, interimSuffix, resizeTextarea]);

    React.useEffect(() => {
      if (variant !== 'inline') {
        setAutoExpanded(false);
      }
    }, [variant]);

    const syncAttachmentFade = React.useCallback(() => {
      const el = attachmentsRef.current;
      if (!el) {
        setAttachmentFade((prev) => (prev.left || prev.right ? {left: false, right: false} : prev));
        return;
      }

      const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      if (maxScrollLeft < 1) {
        setAttachmentFade((prev) => (prev.left || prev.right ? {left: false, right: false} : prev));
        return;
      }

      const scrollLeft = Math.max(0, Math.min(el.scrollLeft, maxScrollLeft));
      const edgeEpsilon = 1;
      const left = scrollLeft > edgeEpsilon;
      const right = scrollLeft < maxScrollLeft - edgeEpsilon;
      setAttachmentFade((prev) =>
        prev.left === left && prev.right === right ? prev : {left, right}
      );
    }, []);

    React.useLayoutEffect(() => {
      syncAttachmentFade();
    }, [attachments, syncAttachmentFade]);

    React.useEffect(() => {
      const el = attachmentsRef.current;
      if (!el) return;

      const handleScroll = () => syncAttachmentFade();
      el.addEventListener('scroll', handleScroll, {passive: true});
      let ro: ResizeObserver | null = null;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(syncAttachmentFade);
        ro.observe(el);
      }

      window.addEventListener('resize', syncAttachmentFade);
      syncAttachmentFade();

      return () => {
        el.removeEventListener('scroll', handleScroll);
        ro?.disconnect();
        window.removeEventListener('resize', syncAttachmentFade);
      };
    }, [syncAttachmentFade, attachments]);

    // After files are added (file picker, drop, or paste), move focus to the
    // first newly-added tile — otherwise focus stays on the "Add files"
    // button (or is lost, for drop/paste) and keyboard/screen-reader users
    // get no confirmation of what was attached or where it landed.
    // `attachments` is owned by the consumer (e.g. `useDroppedAttachments`),
    // so there's no synchronous hook here — react to the prop growing instead.
    // 'picker' = user explicitly navigated away to a file picker / drop zone;
    // 'paste' = user pasted while mid-typing — focus must NOT leave the textarea.
    const pendingFocusNewAttachmentRef = React.useRef<'picker' | 'paste' | null>(null);
    const prevAttachmentsCountRef = React.useRef(React.Children.count(attachments));
    React.useEffect(() => {
      const count = React.Children.count(attachments);
      const prevCount = prevAttachmentsCountRef.current;
      prevAttachmentsCountRef.current = count;

      if (!pendingFocusNewAttachmentRef.current || count <= prevCount) return;
      const mode = pendingFocusNewAttachmentRef.current;
      pendingFocusNewAttachmentRef.current = null;

      // Paste happens mid-typing — don't steal the caret out of the textarea
      // (WCAG 3.2.2 On Input). Announce the attachment but keep focus in place.
      if (mode === 'paste') {
        const added = count - prevCount;
        announce.polite(`${added} file${added !== 1 ? 's' : ''} attached.`);
        return;
      }

      // New files are always appended, so the first newly-added tile sits at
      // the previous count's index. rAF: the count change lands in this
      // render, but the tile's own DOM node only exists after it commits.
      const newIndex = prevCount;
      requestAnimationFrame(() => {
        const tiles = attachmentsRef.current?.querySelectorAll<HTMLElement>('.ld-attachmenttile-tile');
        const closeButton = tiles?.[newIndex]?.querySelector<HTMLElement>('.ld-attachmenttile-close');
        closeButton?.focus();
      });
    }, [attachments]);

    React.useLayoutEffect(() => {
      const pendingSelection = pendingSelectionRef.current;
      const el = textareaRef.current;
      if (!pendingSelection || !el) return;
      pendingSelectionRef.current = null;
      el.focus();
      el.setSelectionRange(pendingSelection.start, pendingSelection.end);
    }, [effectiveVariant]);

    React.useLayoutEffect(() => {
      const root = rootRef.current;
      const from = transitionFromHeightRef.current;
      transitionFromHeightRef.current = null;
      if (!root || from == null || prefersReducedMotion()) return;

      const to = root.getBoundingClientRect().height;
      if (Math.abs(to - from) < 1) return;

      transitionCleanupRef.current?.();

      root.style.height = `${from}px`;
      root.style.overflow = 'clip';
      root.style.transition = 'none';
      root.getBoundingClientRect();
      root.style.transition = `height ${LAYOUT_MORPH_MS}ms ${LAYOUT_MORPH_EASING}`;
      root.style.height = `${to}px`;

      const cleanup = () => {
        root.style.removeProperty('height');
        root.style.removeProperty('overflow');
        root.style.removeProperty('transition');
        if (transitionCleanupRef.current === stopTransition) {
          transitionCleanupRef.current = null;
        }
      };

      const onEnd = (event: TransitionEvent) => {
        if (event.target !== root || event.propertyName !== 'height') return;
        root.removeEventListener('transitionend', onEnd);
        cleanup();
      };

      const timeoutId = window.setTimeout(() => {
        root.removeEventListener('transitionend', onEnd);
        cleanup();
      }, LAYOUT_MORPH_MS + 60);

      const stopTransition = () => {
        window.clearTimeout(timeoutId);
        root.removeEventListener('transitionend', onEnd);
        cleanup();
      };

      root.addEventListener('transitionend', onEnd);
      transitionCleanupRef.current = stopTransition;
      return stopTransition;
    }, [effectiveVariant]);

    React.useEffect(
      () => () => {
        transitionCleanupRef.current?.();
      },
      [],
    );

    // Recompute once the layout settles and on any width change (flex settling,
    // container/panel resize) so the field never locks to a stale height.
    React.useEffect(() => {
      const el = textareaRef.current;
      const parent = el?.parentElement;
      if (!parent || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(() => resizeTextarea());
      ro.observe(parent);
      return () => ro.disconnect();
    }, [resizeTextarea, effectiveVariant]);

    // Clear the textarea-had-focus flag whenever focus truly leaves the composer.
    // Uses a native focusout (bubbles from any child) so it catches all cases
    // without relying on relatedTarget in individual element blur handlers.
    React.useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const onFocusOut = (e: FocusEvent) => {
        if (!el.contains(e.relatedTarget as Node)) {
          textareaHadFocusRef.current = false;
        }
      };
      el.addEventListener('focusout', onFocusOut);
      return () => el.removeEventListener('focusout', onFocusOut);
    }, []);

    const setValue = (next: string) => {
      if (controlledValue === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    // Built-in voice-to-text. Each onResult fires with the FULL accumulated
    // session text (all utterances so far + current interim), so the display
    // updates continuously without resetting between utterance boundaries.
    // The final commit (isFinal=true) happens once when recognition ends.
    const dictation = useDictation({
      lang: dictationLang,
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          // Recognition ended — commit the full session text unless the user
          // already submitted mid-session (sessionSubmittedRef prevents double-commit).
          setInterimSuffix('');
          if (!sessionSubmittedRef.current) {
            const chunk = transcript.trim();
            if (chunk) {
              const base = preDictationBaseRef.current;
              const sep = base && !/\s$/.test(base) ? ' ' : '';
              setValue(base + sep + chunk);
            }
          }
          sessionSubmittedRef.current = false;
        } else {
          // Full accumulated session text (grows continuously across utterances).
          setInterimSuffix(transcript.trim());
        }
      },
      onLevel: (level) => {
        levelRef.current = level;
        micWrapRef.current?.style.setProperty('--pc-mic-level', String(level));
      },
    });

    // Clear interim when externally-controlled `recording` drops to false
    // (the built-in session covers its own cleanup via the isFinal onResult).
    React.useEffect(() => {
      if (!recording && !dictation.recording) setInterimSuffix('');
    }, [recording, dictation.recording]);

    // Recording reads as active when the consumer drives it OR a built-in
    // dictation session is live, so the mic, glow, and a11y stay in sync.
    const isRecording = recording || dictation.recording;
    // The two dictation presentations are mutually exclusive: the "listening"
    // waveform UI (no MagicBox) vs. the "voice-to-text" pulsing MagicBox mic.
    const showListening = isRecording && dictationVariant === 'listening';
    const showVoiceToText = isRecording && dictationVariant === 'voice-to-text';

    // After listening ends, focus the textarea if it was focused before dictation.
    // useLayoutEffect runs synchronously after React commits the DOM, so
    // textareaRef.current is guaranteed to be set even in the inline variant
    // (where the textarea was unmounted during the listening state).
    React.useLayoutEffect(() => {
      if (showListening) return;
      if (pendingFocusRestoreRef.current === null) return;
      const shouldFocus = pendingFocusRestoreRef.current;
      pendingFocusRestoreRef.current = null;
      if (shouldFocus) {
        textareaRef.current?.focus();
        return;
      }
      // The ✕ / ✓ buttons reconcile into the + / send buttons at the same DOM
      // position, so focus survives the swap and keeps :focus-within (and its
      // shadow) alive. Blur it — unless it was reached by keyboard, where
      // dropping focus to <body> would strip the user's place in the tab order.
      const activeEl = document.activeElement as HTMLElement | null;
      if (!activeEl || !rootRef.current?.contains(activeEl)) return;
      let keyboardFocused = false;
      try {
        keyboardFocused = activeEl.matches(':focus-visible');
      } catch {
        /* :focus-visible unsupported — treat as pointer focus and blur. */
      }
      if (!keyboardFocused) activeEl.blur();
    }, [showListening]);

    // Clear the simulated focus class once listening ends (textarea :focus-within
    // takes over if focus was restored above, so there's no visible gap).
    React.useEffect(() => {
      if (!isRecording) setListeningFocused(false);
    }, [isRecording]);

    const handleMicToggle = () => {
      if (disabled) return;
      if (!dictation.recording && !recording) {
        // Snapshot textarea-focus state NOW, before state updates cause the mic
        // button to unmount (which moves focus to body and fires focusout, which
        // would clear textareaHadFocusRef before we can read it).
        listeningStartedWithFocusRef.current = textareaHadFocusRef.current;
        preDictationBaseRef.current = valueRef.current;
        sessionSubmittedRef.current = false;
        setInterimSuffix('');
        if (listeningStartedWithFocusRef.current) setListeningFocused(true);
      }
      if (dictation.supported) dictation.toggle();
      onMicToggle?.();
    };

    // Cancel dictation: discard interim text, revert to the pre-dictation value,
    // and stop without committing anything.
    const handleCancelDictation = () => {
      sessionSubmittedRef.current = true; // prevent onend from committing
      dictation.stop();
      onMicToggle?.();
      setInterimSuffix(''); // discard — value already equals preDictationBase
      pendingFocusRestoreRef.current = listeningStartedWithFocusRef.current;
    };

    // Commit dictation: save the full accumulated interim text into value and
    // stop listening. Does NOT send the message — returns the composer to its
    // normal idle state so the user can keep editing or send separately.
    const handleCommitDictation = () => {
      if (interimSuffix) {
        const b = preDictationBaseRef.current;
        const sep = b && !/\s$/.test(b) ? ' ' : '';
        setValue(b + sep + interimSuffix);
        sessionSubmittedRef.current = true; // prevent onend double-commit
        setInterimSuffix('');
      }
      dictation.stop();
      onMicToggle?.();
      pendingFocusRestoreRef.current = listeningStartedWithFocusRef.current;
    };

    const submit = () => {
      if (!canSend) return;
      // During dictation, send the full display text (preDictationBase + interim).
      const base = preDictationBaseRef.current;
      const sep = base && interimSuffix && !/\s$/.test(base) ? ' ' : '';
      const textToSend = interimSuffix ? base + sep + interimSuffix : value;
      onSend?.(textToSend);
      if (interimSuffix) {
        sessionSubmittedRef.current = true; // prevent onend double-commit
        setInterimSuffix('');
      }
      if (controlledValue === undefined) setUncontrolled('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // If the user types while interim text is showing, accept the whole
      // textarea content (committed + interim they typed into) as the new value.
      if (interimSuffix) setInterimSuffix('');
      const next = e.target.value;
      const prevLen = value.length;
      setValue(next);
      // Fire slash / mention triggers when the newly typed char starts a token.
      if (next.length === prevLen + 1) {
        const caret = e.target.selectionStart ?? next.length;
        const typed = next[caret - 1];
        const before = next[caret - 2];
        const atTokenStart = caret === 1 || before === ' ' || before === '\n';
        if (atTokenStart && typed === '/') onSlashTrigger?.();
        else if (atTokenStart && typed === '@') onMentionTrigger?.();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const mod = e.metaKey || e.ctrlKey;
      if (e.key === 'Enter') {
        if (mod) {
          e.preventDefault();
          submit();
        } else if (submitOn === 'enter' && !e.shiftKey) {
          e.preventDefault();
          submit();
        }
        // Shift+Enter (or mod+enter mode) falls through → newline.
      } else if (e.key === 'Escape' && busy) {
        e.preventDefault();
        onStop?.();
      }
    };

    const emitFiles = (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      pendingFocusNewAttachmentRef.current = 'picker';
      onAttachFiles?.(Array.from(fileList));
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (!onAttachFiles) return;
      const files = Array.from(e.clipboardData?.files ?? []);
      if (files.length > 0) {
        e.preventDefault();
        // Paste is a mid-composition action — the user's caret is already in
        // the textarea. Marking 'paste' keeps focus there (WCAG 3.2.2).
        pendingFocusNewAttachmentRef.current = 'paste';

        // For `variant="inline"`, pasting the *first* attachment flips
        // `effectiveVariant` from 'inline' to 'default' (see hasAttachments
        // above) — an entirely different JSX branch (`inlineRow` vs
        // `inputRow` + `toolbar`), not just the attachments viewport
        // mounting. React tears down and rebuilds the textarea across that
        // branch swap regardless of the viewport's own mount strategy, so
        // there is no caret left for the effect below to find. Reuse the
        // same pendingSelectionRef mechanism the auto-expand-while-typing
        // path already relies on for this exact kind of swap: capture the
        // caret now, and the useLayoutEffect keyed on [effectiveVariant]
        // restores focus + selection once the new textarea node commits.
        // Second attachment onward, effectiveVariant is already 'default'
        // and doesn't change again, so this is a no-op there — the textarea
        // survives untouched (verified: no remount past the first paste).
        const el = e.currentTarget;
        if (document.activeElement === el) {
          pendingSelectionRef.current = {
            start: el.selectionStart ?? el.value.length,
            end: el.selectionEnd ?? el.value.length,
          };
        }

        onAttachFiles(files);
      }
    };

    const dropProps =
      allowDrop && onAttachFiles && !disabled
        ? {
            onDragOver: (e: React.DragEvent) => {
              e.preventDefault();
              setDragOver(true);
            },
            onDragLeave: (e: React.DragEvent) => {
              if (e.currentTarget === e.target) setDragOver(false);
            },
            onDrop: (e: React.DragEvent) => {
              e.preventDefault();
              setDragOver(false);
              emitFiles(e.dataTransfer?.files ?? null);
            },
          }
        : {};

    const handleAddClick = () => {
      if (disabled) return;
      if (onAttachFiles && !onAdd) fileInputRef.current?.click();
      onAdd?.();
    };

    const addButton = addMenu ?? (
      <Tooltip content={addLabel} relationship="label" position="above">
        <IconButton
          a11yLabel={addLabel}
          UNSAFE_className="ld-promptcomposer-iconbtn ld-promptcomposer-add"
          color="tertiary"
          size={size === 'mobile' ? 'medium' : 'small'}
          variant="round"
          disabled={disabled}
          onClick={handleAddClick}
        >
          <PlusIcon size="medium" />
        </IconButton>
      </Tooltip>
    );

    // While listening, the leading `+` becomes a `✕` that cancels dictation
    // and discards any interim text (reverts to the pre-dictation value).
    const cancelButton = (
      <Tooltip content="Cancel dictation" relationship="description" position="above">
        <IconButton
          a11yLabel="Cancel dictation"
          UNSAFE_className="ld-promptcomposer-iconbtn ld-promptcomposer-cancel"
          color="tertiary"
          size={size === 'mobile' ? 'medium' : 'small'}
          variant="round"
          disabled={disabled}
          onClick={handleCancelDictation}
        >
          <CloseIcon size="medium" />
        </IconButton>
      </Tooltip>
    );

    // Commit button — shown instead of send during inline listening. Saves the
    // dictated text into the composer without sending, then exits listening state.
    const commitButton = (
      <IconButton
        a11yLabel="Save dictation"
        UNSAFE_className="ld-promptcomposer-send ld-promptcomposer-send--listening"
        color="primary"
        size={size === 'mobile' ? 'medium' : 'small'}
        variant="round"
        disabled={disabled}
        onClick={handleCommitDictation}
      >
        <Icon name="Check" size="medium" />
      </IconButton>
    );

    // Only the "listening" waveform variant swaps the leading `+` for a ✕.
    const leadButton = showListening ? cancelButton : addButton;

    // The optional binary on/off context selector. Sits between the leading
    // `+` and the `toolbarStart` tools pill, mirroring the Figma "Context
    // selector" pattern. Hidden while listening so the cancel + waveform
    // composition stays uncluttered.
    //
    // PromptComposer mirrors the selector's selected state so it can drive
    // side effects (the crosshair cursor below) whether the consumer leaves
    // the selector uncontrolled or owns the value externally.
    const [selectorActiveUncontrolled, setSelectorActiveUncontrolled] =
      React.useState(selectorDefaultSelected);
    const selectorIsControlled = selectorSelected !== undefined;
    const selectorActive = selectorIsControlled
      ? !!selectorSelected
      : selectorActiveUncontrolled;

    const handleSelectorChange = (next: boolean) => {
      if (!selectorIsControlled) setSelectorActiveUncontrolled(next);
      onSelectorChange?.(next);
    };

    // While the selector is activated, switch the document cursor to a
    // crosshair so the user knows the page is in "pick an element" mode.
    // Cleared on toggle-off, on unmount, and when disabled mid-session.
    React.useEffect(() => {
      if (!showSelector || !selectorActive || disabled) return;
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      const previous = root.style.cursor;
      root.style.cursor = 'crosshair';
      return () => {
        root.style.cursor = previous;
      };
    }, [showSelector, selectorActive, disabled]);

    // The IconSelector must visually match the leading `+` IconButton — the
    // `+` glyph is a hard-coded 20px SVG inside 0.5rem padding (→ 36×36), but
    // an Icon font glyph passed in here would clone to `size="medium"`
    // (1.5rem / 24px → 40×40). Lock the inner icon's font-size to 1.25rem so
    // the selector button always renders at the same size as the `+` button,
    // regardless of any size the consumer set on their icon.
    const lockSelectorIconSize = (icon: React.ReactNode): React.ReactNode => {
      if (!React.isValidElement(icon)) return icon;
      const element = icon as React.ReactElement<{style?: React.CSSProperties}>;
      return React.cloneElement(element, {
        style: {...(element.props.style ?? {}), fontSize: '1.25rem'},
      });
    };

    const selectorButton =
      showSelector && !showListening ? (
        <Tooltip content={selectorLabel} relationship="description" position="above">
          <IconSelector
            a11yLabel={selectorLabel}
            color="primary"
            variant="round"
            size={size === 'mobile' ? 'medium' : 'small'}
            disabled={disabled}
            iconSelected={lockSelectorIconSize(selectorIconSelected)}
            iconUnselected={lockSelectorIconSize(selectorIconUnselected)}
            selected={selectorActive}
            onSelectedChange={handleSelectorChange}
          />
        </Tooltip>
      ) : null;

    // Inline variant: waveform replaces the textarea (no label).
    const listeningCluster = (
      <div className="ld-promptcomposer-listening">
        <DictationWaveform active={isRecording} levelRef={levelRef} />
      </div>
    );
    // Default (expanded) variant: waveform-only fills toolbarStart while the
    // textarea remains visible above showing the live transcribed text.
    const toolbarWaveform = (
      <div className="ld-promptcomposer-listening">
        <DictationWaveform active={isRecording} levelRef={levelRef} />
      </div>
    );

    const micButton = showMic ? (
      // In the `voice-to-text` variant the MagicBox wraps the mic and pulses its
      // glow ring in time with the live voice level (see `onLevel` above + the
      // `.ld-promptcomposer-micWrap` rules). The `listening` waveform variant
      // gets no MagicBox — `active={false}` renders the bare button.
      <span ref={micWrapRef} className="ld-promptcomposer-micWrap">
        <MagicBox active={showVoiceToText} borderRadius="round" state="loading">
          <Tooltip
            content={isRecording ? 'Stop dictation' : micLabel}
            relationship="label"
            position="above"
          >
            <IconButton
              a11yLabel={isRecording ? 'Stop dictation' : micLabel}
              aria-pressed={isRecording}
              UNSAFE_className={cx(
                'ld-promptcomposer-iconbtn ld-promptcomposer-mic',
                isRecording && 'ld-promptcomposer-mic--recording',
              )}
              color="tertiary"
              size={size === 'mobile' ? 'medium' : 'small'}
              variant="round"
              disabled={disabled}
              onClick={handleMicToggle}
            >
              <Icon name="Microphone" size="medium" />
            </IconButton>
          </Tooltip>
        </MagicBox>
      </span>
    ) : null;

    const sendButton = busy ? (
      <Tooltip content={stopLabel} relationship="label" position="above">
        <IconButton
          a11yLabel={stopLabel}
          UNSAFE_className="ld-promptcomposer-send"
          color="primary"
          size={size === 'mobile' ? 'medium' : 'small'}
          variant="round"
          onClick={() => onStop?.()}
        >
          <StopIcon />
        </IconButton>
      </Tooltip>
    ) : showListening ? (
      // In the listening variant, the primary blue equalizer button submits:
      // it ends the dictation session (built-in + controlled `recording`) and
      // sends the dictated message.
      <Tooltip content={sendLabel} relationship="label" position="above">
        <IconButton
          a11yLabel={sendLabel}
          UNSAFE_className="ld-promptcomposer-send ld-promptcomposer-send--listening"
          color="primary"
          size={size === 'mobile' ? 'medium' : 'small'}
          variant="round"
          disabled={disabled}
          onClick={() => {
            dictation.stop();
            // Clear externally-controlled `recording` so the composer leaves the
            // listening state, then send whatever was dictated.
            onMicToggle?.();
            submit();
          }}
        >
          {isRecording ? <VoiceSearchIcon size="medium" /> : <ArrowUpIcon size="medium" />}
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip content={sendLabel} relationship="label" position="above">
        <IconButton
          a11yLabel={sendLabel}
          UNSAFE_className="ld-promptcomposer-send"
          color="primary"
          size={size === 'mobile' ? 'medium' : 'small'}
          variant="round"
          disabled={!canSend}
          onClick={submit}
        >
          {isRecording ? <VoiceSearchIcon size="medium" /> : <ArrowUpIcon size="medium" />}
        </IconButton>
      </Tooltip>
    );

    // Display = pre-dictation base + full accumulated session interim.
    // Using preDictationBaseRef (not live `value`) as the base prevents
    // duplication — `value` updates on each utterance finalization, but the
    // full session text is already captured in interimSuffix.
    const base = preDictationBaseRef.current;
    const displayValue = interimSuffix
      ? base + (base && !/\s$/.test(base) ? ' ' : '') + interimSuffix
      : value;

    const textarea = (
      <textarea
        ref={textareaRef}
        className="ld-promptcomposer-input"
        rows={1}
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={hasError || overLimit || undefined}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-label={maxLength != null ? `${placeholder}. Maximum ${maxLength} characters.` : placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => {
          textareaHadFocusRef.current = true;
        }}
      />
    );

    return (
      <div
        ref={setRootRef}
        data-variant={effectiveVariant}
        data-size={size}
        data-state={
          disabled ? 'disabled' : hasError || overLimit ? 'error' : busy ? 'busy' : undefined
        }
        data-dragover={dragOver || undefined}
        className={cx('ld-promptcomposer-root', listeningFocused && 'focused', className)}
        {...dropProps}
        {...rest}
      >
        {a11yHeading ? <VisuallyHidden as="h2">{a11yHeading}</VisuallyHidden> : null}
        {onAttachFiles ? (
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              emitFiles(e.target.files);
              e.target.value = '';
            }}
          />
        ) : null}

        {variant !== 'inline' && suggestions ? (
          <div className="ld-promptcomposer-suggestionsSlot">{suggestions}</div>
        ) : null}

        <div
          className="ld-promptcomposer-field"
          onClick={(e) => {
            // Redirect clicks on non-interactive padding/whitespace to the
            // textarea so the apparent and actual click targets match.
            // Guard against: native controls, ARIA widgets, and any element
            // with a tabindex (covers slotted menus, selectors, custom toggles).
            if (disabled) return;
            const target = e.target as HTMLElement;
            if (
              target.closest(
                'button, input, textarea, select, a, [role="button"], [tabindex]',
              )
            )
              return;
            textareaRef.current?.focus();
          }}
        >
          {!isInline ? (
            // Stays mounted (visibility toggled via `hidden`) rather than being
            // conditionally rendered on `hasAttachments`. Unmounting/remounting
            // this sibling shifted the textarea's position in the reconciled
            // tree, tearing it down and rebuilding it on the empty→non-empty
            // transition — which silently dropped the caret set up by the
            // paste-focus-preservation effect below (WCAG 3.2.2). Keeping the
            // subtree stable across that transition is what makes that fix work
            // on the *first* pasted attachment, not just the second onward.
            <div
              className="ld-promptcomposer-attachmentsViewport"
              hidden={!hasAttachments}
              data-fade-left={attachmentFade.left || undefined}
              data-fade-right={attachmentFade.right || undefined}
            >
              <div
                ref={attachmentsRef}
                className="ld-promptcomposer-attachments"
              >
                {attachments}
              </div>
            </div>
          ) : null}

          {isInline ? (
            <div className="ld-promptcomposer-inlineRow">
              <span className="ld-promptcomposer-lead">{leadButton}</span>
              {selectorButton}
              {showListening ? listeningCluster : textarea}
              {/* toolbarEnd, expand, and mic are hidden while listening —
                  only the commit (✓) button remains on the right */}
              {!showListening && counterShown ? (
                <span
                  className={cx(
                    'ld-promptcomposer-count',
                    overLimit && 'ld-promptcomposer-count--over',
                  )}
                  aria-hidden="true"
                >
                  {maxLength != null ? `${value.length}/${maxLength}` : value.length}
                </span>
              ) : null}
              {!showListening && toolbarEnd ? (
                <div className="ld-promptcomposer-modes">{toolbarEnd}</div>
              ) : null}
              {!showListening && expandable ? (
                <Tooltip content="Expand" relationship="description" position="above">
                  <IconButton
                    a11yLabel="Expand"
                    UNSAFE_className="ld-promptcomposer-iconbtn"
                    color="tertiary"
                    size="small"
                    variant="round"
                    disabled={disabled}
                    onClick={onExpand}
                  >
                    <ExpandIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              {!showListening && micButton}
              {showListening ? commitButton : sendButton}
            </div>
          ) : (
            <>
              {/* The textarea stays visible while listening so transcribed text
                  appears live in the input area (like Claude iOS). The waveform
                  moves to toolbarStart, replacing the tools pill. */}
              <div className="ld-promptcomposer-inputRow">
                {textarea}
                {expandable && !showListening ? (
                  <Tooltip content="Expand" relationship="description" position="above">
                    <IconButton
                      a11yLabel="Expand"
                      UNSAFE_className="ld-promptcomposer-iconbtn ld-promptcomposer-expand"
                      color="tertiary"
                      size="small"
                      variant="round"
                      disabled={disabled}
                      onClick={onExpand}
                    >
                      <ExpandIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </div>
              <div className="ld-promptcomposer-toolbar">
                <div className="ld-promptcomposer-toolbarStart">
                  <div className="ld-promptcomposer-toolbarLeadingActions">
                    <span className="ld-promptcomposer-lead">{leadButton}</span>
                    {selectorButton}
                  </div>
                  {showListening ? toolbarWaveform : toolbarStart}
                </div>
                <div className="ld-promptcomposer-toolbarEnd">
                  {/* Counter and toolbarEnd (model selector etc.) are hidden
                      while listening — only the commit (✓) button remains */}
                  {!showListening && counterShown ? (
                    <span
                      className={cx(
                        'ld-promptcomposer-count',
                        overLimit && 'ld-promptcomposer-count--over',
                      )}
                      aria-live="polite"
                    >
                      {maxLength != null ? `${value.length}/${maxLength}` : value.length}
                    </span>
                  ) : null}
                  {!showListening && toolbarEnd}
                  <div className="ld-promptcomposer-toolbarActions">
                    {!showListening && micButton}
                    {showListening ? commitButton : sendButton}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {errorMessage ? (
          <div id={errorId} className="ld-promptcomposer-error" role="alert">
            {errorMessage}
          </div>
        ) : null}
      </div>
    );
  },
);

PromptComposer.displayName = 'PromptComposer';
