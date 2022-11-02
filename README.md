# useddns

A deno program use dns.he.net as DDNS service.

- require host has a valid dns server.

## Configuration

`deno run -A https://deno.land/x/useddns@v0.0.1/src/cli.ts -t xxx -d test.domain`

```sh
OPTIONS:

-d, --domain
        Set domain

-t, --token
        Set he.net auth token

    --delaytime
        Set loop delay time, ms.

-h, --help
```

Set env:

- USEDDNS_DOMAIN
- USEDDNS_HE_TOKEN
- [OPTION] USEDDNS_DELAY_TIME
