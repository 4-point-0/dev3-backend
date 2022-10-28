export const nearWalletRegex = new RegExp(
  /^((\w|(?<!\.)\.)+(?<!\.)\.(testnet|near)|[A-Fa-f0-9]{64})$/,
);

export const emailRegex = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
