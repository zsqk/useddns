import { assert } from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import { getCurrentIP, getDNSIP } from './useddns.ts';

Deno.test('getCurrentIP', async () => {
  const res = await getCurrentIP();
  console.log(res);
  assert(res.length > 0);
});

Deno.test('getDNSIP', async () => {
  const res = await getDNSIP(
    'www.google.com',
    { dns: '1.1.1.1' },
  );
  console.log(res);
  assert(res.length > 0);
});
