export enum WalletKind {
  Imported,
  Derived,
  Remote,
}

export interface WalletSelection {
  kind: WalletKind;
  name: string;
  description: string;
  image: string;
  comingSoon?: boolean;
}
