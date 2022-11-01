import { assert } from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import { getCurrentIP, getDNSIP } from './useddns.ts';

Deno.test('getCurrentIP', async () => {
  const res = await getCurrentIP();
  assert(res.length > 0);
});

Deno.test('getDNSIP', async () => {
  const res = await getDNSIP({
    dns: '1.1.1.1',
    domain: 'www.google.com',
  });
  assert(res.length > 0);
});
