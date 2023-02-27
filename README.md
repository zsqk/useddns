# useddns

A deno program use dns.he.net as DDNS service.

- require host has a valid dns server.

## Configuration

`deno run -A https://deno.land/x/useddns/src/cli.ts -t xxx -d test.domain`

```sh
OPTIONS:

-d, --domain
        Set domain

    --dns
        Set DNS server.

-t, --token
        Set he.net auth token

    --delaytime
        Set loop delay time, ms.

    --timeout
        Set each timeout, ms.

-h, --help
```

Set env:

- USEDDNS_DOMAIN
- USEDDNS_HE_TOKEN
- [OPTION] USEDDNS_DELAY_TIME

## Dev

`deno run -A --watch src/cli.ts -t xxx -d test.domain`
