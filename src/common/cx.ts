type CxArg = string | number | boolean | null | undefined;

export function cx(...args: CxArg[]): string {
  return args.filter(Boolean).join(' ');
}
