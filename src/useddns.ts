import { run } from 'https://deno.land/x/somefn@v0.20.0/deno/run.ts';

export async function getIP(params: string): Promise<string> {
  const { res } = await run(`dig ${params} +short -4`);
  return res.replace(/(\r\n|\n|\r)/gm, '');
}

export function getCurrentIP(): Promise<string> {
  return getIP('@ns1-1.akamaitech.net ANY whoami.akamai.net');
}

export function getDNSIP(
  { dns = '1.1.1.1', domain = Deno.env.get('USEDDNS_DOMAIN') }: {
    dns?: string;
    domain?: string;
  } = {},
): Promise<string> {
  return getIP(`@${dns} A ${domain}`);
}

export async function checkIP(token: string, domain: string): Promise<void> {
  try {
    const currentIP = await getCurrentIP();
    const DNSIP = await getDNSIP();
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
    }
  } catch (error) {
    console.error(`Something error: ${new Date()}`, error);
  }
}
