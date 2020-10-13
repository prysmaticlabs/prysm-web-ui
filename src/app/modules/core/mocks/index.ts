import {
  AuthResponse,
  WalletResponse,
  GenerateMnemonicResponse,
  NodeConnectionResponse,
  ListAccountsResponse,
  Account,
  HasWalletResponse,
  ImportKeystoresResponse,
  BackupAccountsResponse,
  DeleteAccountsResponse, DefaultWalletResponse
} from 'src/app/proto/validator/accounts/v2/web_api';
import {
  ChainHead,
  ValidatorParticipationResponse,
  ValidatorPerformanceResponse,
  ValidatorQueue,
  Validators,
  Validators_ValidatorContainer,
  ValidatorBalances,
  ValidatorBalances_Balance,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorParticipation } from 'src/app/proto/eth/v1alpha1/validator';
import { Peers, Peer, ConnectionState } from 'src/app/proto/eth/v1alpha1/node';
import { GWEI_PER_ETHER } from '../constants';

import { hexToBase64 } from 'src/app/modules/core/utils/hex-util';

export interface IMocks {
  [key: string]: object;
}

export const mockPublicKeys: string[] = [
  hexToBase64('0xaadaf653799229200378369ee7d6d9fdbdcdc2788143ed44f1ad5f2367c735e83a37c5bb80d7fb917de73a61bbcf00c4'),
  hexToBase64('0xb9a7565e5daaabf7e5656b64201685c6c0241df7195a64dcfc82f94b39826562208ea663dc8e340994fe5e2eef05967a'),
  hexToBase64('0xa74a19ce0c8a7909cb38e6645738c8d3f85821e371ecc273f16d02ec8b279153607953522c61e0d9c16c73e4e106dd31'),
  hexToBase64('0x8d4d65e320ebe3f8f45c1941a7f340eef43ff233400253a5532ad40313b4c5b3652ad84915c7ab333d8afb336e1b7407'),
  hexToBase64('0x93b283992d2db593c40d0417ccf6302ed5a26180555ec401c858232dc224b7e5c92aca63646bbf4d0d61df1584459d90'),
];

const mockImportedKeys: string[] = [
  hexToBase64('0x80027c7b2213480672caf8503b82d41ff9533ba3698c2d70d33fa6c1840b2c115691dfb6de791f415db9df8b0176b9e4'),
  hexToBase64('0x800212f3ac97227ac9e4418ce649f386d90bbc1a95c400b6e0dbbe04da2f9b970e85c32ae89c4fdaaba74b5a2934ed5e'),
];

export const mockDepositDataJSON = [
  {
    pubkey: '887c846ea05cd65ee903c7c99bd5a171005f8081d940e05d70f9c0814e66e3a721e0b2d485ad80c87ce8c7e5a6693fa2',
    withdrawalCredentials: '009b3b7a7e3e642645f6cb50dfaf3e139899c5baf4821e09490601395787f45e',
    amount: 32000000000,
    signature: '85dbbf537ef846b8995f886e593e433b69f34753b7b34e0d131c091f3b1234cba649d844aaa362d707d4641c6eb9f4f5018c35e05b48db3bb9fc24592dd3b45735cdd7321ad017e2fdad949b0f004a855901788611fd586483cba137702bb022',
    depositMessageRoot: '273656cacb66e0bcb62ea3b59b565ea7dc52552b00e458ba13f785a0751bf8bd',
    depositDataRoot: 'c66bb8bd4226ba48b6d3cf41be1135650beb31638ffb82f83023462e49cf110d',
    forkVersion: '00000001'
  },
  {
    pubkey: '942a9a42b50ce5b36ef017aecbe58b1ae59603415bb5b13145c6f0b58a1b6edde582be879e025e38cf178c15ccbecd4d',
    withdrawalCredentials: '003b8f16c3af32fa93a03f1ebcbc59ecd0e8050fb38577fcac6f84fc906275d5',
    amount: 32000000000,
    signature: '99064e70c4ff44ddcd495cb102dc52b9ee6da8ac5ed1f1be35ce88b8565d099690d5401b046da0218349e671d0b876e608f805fac9e3b48916e56925548dc2d6666472e3a04c87a08d1d4588201f9c3b9787ce4ee74d65721442650128b0d7e6',
    depositMessageRoot: '0ec368223e19aebd84e804637022a48bebe6d9a9d3477884ebd72b401cbe6e1c',
    depositDataRoot: 'cce8f3cc9a795cf413b6eea9bce15ef706b4d75f131f5d35d1feaf2eb6ddf7fb',
    forkVersion: '00000001'
  },
];

export const generateBalancesForEpoch = (url: string) => {
  const params = new URLSearchParams(url.substring(url.indexOf('?'), url.length));
  let epoch = '1';
  const paramsEpoch = params.get('epoch');
  if (paramsEpoch) {
    epoch = paramsEpoch;
  }
  const bals: ValidatorBalances_Balance[] = mockPublicKeys.map((key, idx) => {
    let bal = 32 * GWEI_PER_ETHER;
    if (idx === 0) {
      bal -= (idx + 1) * 500000 * Number.parseInt(epoch, 10);
    } else {
      bal += (idx + 1) * 500000 * Number.parseInt(epoch, 10);
    }
    return {
      publicKey: key,
      index: idx,
      balance: `${bal}`,
    } as ValidatorBalances_Balance;
  });
  return {
    epoch,
    balances: bals,
  } as ValidatorBalances;
};

export const Mocks: IMocks = {
  '/v2/validator/login': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/v2/validator/signup': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/v2/validator/wallet/exists': {
    walletExists: true,
  } as HasWalletResponse,
  '/v2/validator/wallet': {
    keymanagerConfig: { direct_eip_version: 'EIP-2335' },
    keymanagerKind: 'DIRECT',
    walletPath: '/Users/erinlindford/Library/Eth2Validators/prysm-wallet-v2'
  } as WalletResponse,
  '/v2/validator/wallet/default': {
    walletDir: '/Users/erinlindford/Library/Eth2Validators/prysm-wallet-v2'
  } as DefaultWalletResponse,
  '/v2/validator/wallet/create': {
    walletPath: '/Users/johndoe/Library/Eth2Validators/prysm-wallet-v2',
    keymanagerKind: 'DERIVED',
  } as WalletResponse,
  '/v2/validator/wallet/keystores/import': {
    importedPublicKeys: mockImportedKeys,
  } as ImportKeystoresResponse,
  '/v2/validator/wallet/accounts/backup': {
    zipFile: 'hello',
  } as BackupAccountsResponse,
  '/v2/validator/wallet/accounts/delete': {
    deletedKeys: mockPublicKeys,
  } as DeleteAccountsResponse,
  '/v2/validator/mnemonic/generate': {
    mnemonic: 'grape harvest method public garden knife power era kingdom immense kitchen ethics walk gap thing rude split lazy siren mind vital fork deposit zebra',
  } as GenerateMnemonicResponse,
  '/v2/validator/health/node_connection': {
    beaconNodeEndpoint: '127.0.0.1:3500',
    connected: true,
    syncing: true,
    genesisTime: 1596546008,
  } as NodeConnectionResponse,
  '/v2/validator/accounts': {
    accounts: [
      {
        validatingPublicKey: mockPublicKeys[0],
        accountName: 'merely-brief-gator',
      } as Account,
      {
        validatingPublicKey: mockPublicKeys[1],
        accountName: 'personally-conscious-echidna',
      } as Account,
      {
        validatingPublicKey: mockPublicKeys[2],
        accountName: 'slightly-amused-goldfish',
      } as Account,
      {
        validatingPublicKey: mockPublicKeys[3],
        accountName: 'nominally-present-bull',
      } as Account,
      {
        validatingPublicKey: mockPublicKeys[4],
        accountName: 'marginally-green-mare',
      } as Account,
    ],
  } as ListAccountsResponse,
  '/eth/v1alpha1/beacon/chainhead': {
    headSlot: 1024,
    headEpoch: 32,
    justifiedSlot: 992,
    justifiedEpoch: 31,
    finalizedSlot: 960,
    finalizedEpoch: 30,
  } as ChainHead,
  '/eth/v1alpha1/node/peers': {
    peers: [
      {
        connectionState: ConnectionState.CONNECTED,
      },
      {
        connectionState: ConnectionState.CONNECTED,
      },
      {
        connectionState: ConnectionState.DISCONNECTED,
      },
      {
        connectionState: ConnectionState.DISCONNECTED,
      },
      {
        connectionState: ConnectionState.CONNECTED,
      },
      {
        connectionState: ConnectionState.CONNECTED,
      },
    ] as Peer[]
  } as Peers,
  '/eth/v1alpha1/validators/participation': {
    epoch: 32,
    finalized: true,
    participation: {
      currentEpochActiveGwei: '1446418000000000',
      currentEpochAttestingGwei: '102777000000000',
      currentEpochTargetAttestingGwei: '101552000000000',
      eligibleEther: '1446290000000000',
      globalParticipationRate: 0.7861,
      previousEpochActiveGwei: '1446290000000000',
      previousEpochAttestingGwei: '1143101000000000',
      previousEpochHeadAttestingGwei: '1089546000000000',
      previousEpochTargetAttestingGwei: '1136975000000000',
      votedEther: '1136975000000000',
    } as ValidatorParticipation,
  } as ValidatorParticipationResponse,
  '/eth/v1alpha1/validators/performance': {
    currentEffectiveBalances: ['31000000000', '31000000000', '31000000000'],
    correctlyVotedHead: [true, true, false],
    correctlyVotedSource: [true, true, false],
    correctlyVotedTarget: [true, false, true],
    averageActiveValidatorBalance: '31000000000',
    inclusionDistances: ['2', '2', '1'],
    inclusionSlots: ['3022', '1022', '1021'],
    balancesBeforeEpochTransition: ['31200781367', '31216554607', '31204371127'],
    balancesAfterEpochTransition: ['31200823019', '31216596259', '31204412779'],
    publicKeys: mockPublicKeys,
    missingValidators: [],
  } as ValidatorPerformanceResponse,
  '/eth/v1alpha1/validators/queue': {
    churnLimit: 4,
    activationPublicKeys: [
      mockPublicKeys[0],
      mockPublicKeys[1],
    ],
    activationValidatorIndices: [0, 1],
    exitPublicKeys: [
      mockPublicKeys[2],
    ],
    exitValidatorIndices: [2],
  } as ValidatorQueue,
  '/eth/v1alpha1/validators': {
    validatorList: mockPublicKeys.map((key, idx) => {
      return {
        index: idx ? idx * 3000 : idx + 2000,
        validator: {
          publicKey: key,
          effectiveBalance: '31200823019',
          activationEpoch: '1000',
          slashed: false,
          exitEpoch: '23020302',
        },
      } as Validators_ValidatorContainer;
    }),
    nextPageToken: '1',
    totalSize: mockPublicKeys.length,
  } as Validators,
};
