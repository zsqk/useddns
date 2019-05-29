#!/usr/bin/env node

const child_process = require("child_process");

const domain = process.env.USEDDNS_DOMAIN;
const token = process.env.USEDDNS_HE_TOKEN;

if (!domain || !token) {
  throw new Error('请先配置环境变量.');
}

const delayTime = Number(process.env.USEDDNS_DELAY_TIME) || 60000;

function getIP(params) {
  return new Promise((resolve, reject) => {
    child_process.exec(`dig ${params} +short -4`, function(err, stdout) {
      if (err) {
        reject(err);
        return;
      }
      resolve(stdout.replace(/(\r\n|\n|\r)/gm, ""));
    });
  });
}

function getCurrentIP() {
  return getIP("@ns1-1.akamaitech.net ANY whoami.akamai.net");
}

function getDNSIP() {
  return getIP(`@8.8.8.8 A ${domain}`);
}

async function checkIP() {
  try {
    const currentIP = await getCurrentIP();
    const DNSIP = await getDNSIP();
    if (!currentIP || !DNSIP) {
      throw new Error("没有获取到 IP" + JSON.stringify({ currentIP, DNSIP }));
    }
    if (currentIP !== DNSIP) {
      console.log(JSON.stringify({ currentIP, DNSIP }));
      child_process.execSync(
        `curl -4 -H "Authorization: ${token}" https://dyn.dns.he.net/nic/update?hostname=${domain}`
      );
    }
  } catch (error) {
    console.error(`出错了: ${new Date()}`, error);
  }
}

function loop() {
  return checkIP().then(() => delay(delayTime)).then(loop);
}

function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

console.log(`checkip start: ${new Date()}`);
loop();
