import { parse } from 'https://deno.land/std@0.161.0/flags/mod.ts';
import { checkIP } from './useddns.ts';

const args = parse<
  Partial<
    {
      d: string;
      domain: string;
      t: string;
      token: string;
      delaytime: number;
      timeout: number;
      h: boolean;
      help: boolean;
    }
  >
>(
  Deno.args,
);

const isHelp = args.h ?? args.help;
if (isHelp) {
  console.log(`
OPTIONS:

-d, --domain
        Set domain

-t, --token
        Set he.net auth token

    --delaytime
        Set loop delay time, ms. default 5000.

    --timeout
        Set each timeout, ms. default 5000.

-h, --help`);
  Deno.exit();
}

const domain = args.d ?? args.domain ?? Deno.env.get('USEDDNS_DOMAIN');
const token = args.t ?? args.token ?? Deno.env.get('USEDDNS_HE_TOKEN');
const timeout = args.timeout ?? 5000;
const delay = Number(
  args.delaytime ?? Deno.env.get('USEDDNS_DELAY_TIME') ?? 5000,
);

if (!domain || !token) {
  throw new Error(
    'Please set cli args or configure environment variables first.',
  );
}

console.log({ domain, token });
/**
 * Number of successes
 */
let successTime = 0;
/**
 * Number of failures
 */
let failTime = 0;
/**
 * Last successful time
 */
let lastSuccessAt: Date | null = null;
/**
 * Time of last failure
 */
let lastFailAt: Date | null = null;
/**
 * Last successful information
 */
let lastSuccessInfo = '';
/**
 * Information about the last failure
 */
let lastFailInfo = '';

const displayInfoLoopTime = 60000;

setInterval(async () => {
  const [err, res] = await checkIP(token, domain, { timeout });
  const d = new Date();
  if (err) {
    failTime += 1;
    lastFailAt = d;
    lastFailInfo = String(err);
    console.error(d, err);
  } else {
    successTime += 1;
    lastSuccessAt = d;
    lastSuccessInfo = res;
  }
  if (
    delay > displayInfoLoopTime ||
    Math.random() < delay / displayInfoLoopTime
  ) {
    console.log({
      successTime,
      failTime,
      lastSuccessAt: lastSuccessAt?.toString(),
      lastFailAt: lastFailAt?.toString(),
      rate: new Intl.NumberFormat('zh-CN', { style: 'percent' }).format(
        successTime / (successTime + failTime),
      ),
      lastSuccessInfo,
      lastFailInfo,
    });
  }
}, delay);
