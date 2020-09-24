import {
  AuthResponse,
  WalletResponse,
  GenerateMnemonicResponse,
  NodeConnectionResponse,
  ListAccountsResponse,
  Account,
  HasWalletResponse, KeymanagerKind
} from 'src/app/proto/validator/accounts/v2/web_api';
import {
  ValidatorBalances,
  ValidatorBalances_Balance,
  ChainHead,
  ValidatorParticipationResponse,
  ValidatorPerformanceResponse,
  ValidatorQueue,
  Validators,
  Validators_ValidatorContainer
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorParticipation } from 'src/app/proto/eth/v1alpha1/validator';
import { Peers, Peer, ConnectionState } from 'src/app/proto/eth/v1alpha1/node';
import { hexToBase64 } from 'src/app/modules/core/utils/hex-util';

export interface IMocks {
  [key: string]: object;
}

const mockPublicKeys: string[] = [
  hexToBase64('0xaadaf653799229200378369ee7d6d9fdbdcdc2788143ed44f1ad5f2367c735e83a37c5bb80d7fb917de73a61bbcf00c4'),
  hexToBase64('0xb9a7565e5daaabf7e5656b64201685c6c0241df7195a64dcfc82f94b39826562208ea663dc8e340994fe5e2eef05967a'),
  hexToBase64('0xa74a19ce0c8a7909cb38e6645738c8d3f85821e371ecc273f16d02ec8b279153607953522c61e0d9c16c73e4e106dd31'),
  hexToBase64('0x8d4d65e320ebe3f8f45c1941a7f340eef43ff233400253a5532ad40313b4c5b3652ad84915c7ab333d8afb336e1b7407'),
  hexToBase64('0x93b283992d2db593c40d0417ccf6302ed5a26180555ec401c858232dc224b7e5c92aca63646bbf4d0d61df1584459d90'),
];

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
    keymanagerKind: KeymanagerKind.DERIVED,
    walletPath: '/Users/erinlindford/Library/Eth2Validators/prysm-wallet-v2'
  } as WalletResponse,
  '/v2/validator/wallet/create': {
    walletPath: '/Users/johndoe/Library/Eth2Validators/prysm-wallet-v2',
    keymanagerKind: KeymanagerKind.DERIVED,
  } as WalletResponse,
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
  '/eth/v1alpha1/validators/balances': {
    epoch: 7119,
    balances: mockPublicKeys.map((key, idx) => {
      return {
        publicKey: key,
        index: idx,
        balance: '31200823019',
      };
    }),
    totalSize: mockPublicKeys.length,
  } as ValidatorBalances,
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
          activationEpoch: 1000,
          slashed: false,
          exitEpoch: 23020302,
        },
      } as Validators_ValidatorContainer;
    }),
    nextPageToken: '1',
    totalSize: mockPublicKeys.length,
  } as Validators,
};
