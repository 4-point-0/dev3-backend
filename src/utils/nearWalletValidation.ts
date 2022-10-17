export function isNearWallet(wallet: string) {
  const regex = new RegExp(/^(\w|(?<!\.)\.)+(?<!\.)\.(testnet|near)$/gm);
  return regex.test(wallet);
}

export function isNearImplicitWallet(wallet: string) {
  const regex = new RegExp(/^[a-z0-9]{64,}$/);
  return regex.test(wallet);
}
