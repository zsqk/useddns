import { run } from 'https://deno.land/x/somefn@v0.22.0/deno/run.ts';

export async function getIP(
  params: string,
  { timeout }: { timeout?: number } = {},
): Promise<string> {
  const { res, code, errMsg } = await run(`dig ${params} +short -4`, {
    timeout,
  });
  if (code !== 0) {
    console.warn('getIP error', res, errMsg);
    return '';
  }
  return res.replace(/(\r\n|\n|\r)/gm, '');
}

export function getCurrentIP(
  { timeout }: { timeout?: number } = {},
): Promise<string> {
  return getIP('@ns1-1.akamaitech.net ANY whoami.akamai.net', { timeout });
}

export function getDNSIP(
  domain: string,
  { dns = '1.1.1.1', timeout }: { dns?: string; timeout?: number } = {},
): Promise<string> {
  return getIP(`@${dns} A ${domain}`, { timeout });
}

export async function checkIP(
  token: string,
  domain: string,
  { timeout, dnsServer }: { timeout?: number; dnsServer?: string } = {},
): Promise<[err: Error] | [err: null, res: string]> {
  try {
    const currentIP = await getCurrentIP({ timeout });
    const DNSIP = await getDNSIP(domain, { timeout, dns: dnsServer });
    if (!currentIP || !DNSIP) {
      throw new Error(
        'Did not get IP: ' + JSON.stringify({ currentIP, DNSIP }),
      );
    }
    if (currentIP !== DNSIP) {
      console.log(JSON.stringify({ currentIP, DNSIP }));
      const url = new URL('https://dyn.dns.he.net/nic/update');
      url.searchParams.set('hostname', domain);
      url.searchParams.set('password', token);
      url.searchParams.set('myip', currentIP);
      const res = await fetch(
        url,
        { method: 'GET' },
      );
      console.log('res', res.status, res.headers, await res.text());
      return [null, await res.text()];
    }
    return [null, 'eq'];
  } catch (err) {
    if (err instanceof Error) {
      return [err];
    }
    return [new Error(`unknown ${err}`)];
  }
}
