import {
  AuthResponse,
  WalletResponse,
  GenerateMnemonicResponse,
  NodeConnectionResponse,
  ListAccountsResponse,
  Account,
} from 'src/app/proto/validator/accounts/v2/web_api';
import {
  ValidatorBalances,
  ValidatorBalances_Balance,
  ChainHead,
  ValidatorParticipationResponse,
  ValidatorPerformanceResponse,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorParticipation } from 'src/app/proto/eth/v1alpha1/validator';
import { Peers, Peer, PeerDirection, ConnectionState } from 'src/app/proto/eth/v1alpha1/node';

const fromHexString = (hexString: string) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

export const Mocks = {
  '/v2/validator/login': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/v2/validator/signup': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/v2/validator/wallet': {
    walletPath: '/home/ubuntu',
  } as WalletResponse,
  '/v2/validator/wallet/create': {
    walletPath: '/home/ubuntu',
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
        validatingPublicKey: fromHexString('0x822e00ec3d8ecc50e037b7ae3eba5486480d1ec49afad69a0d76bfdb158ead9bc389e8defef2c076d080371bf1f0fefc'),
        accountName: 'merely-brief-gator',
      } as Account,
      {
        validatingPublicKey: fromHexString('0xae5155ebd98c00194b3b969d60dc32385c55f6b1378e7d7175ce026402edbe02080dc4a3619b1eb38096cecd73947d0b'),
        accountName: 'personally-conscious-echidna',
      } as Account,
      {
        validatingPublicKey: fromHexString('0x8e557d66788bfd895c9b3676c2dd6d17c9d4bed3fd249482042f8906f2fc8c790900e96ee169c56b858108c10707155'),
        accountName: 'slightly-amused-goldfish',
      } as Account,
      {
        validatingPublicKey: fromHexString('0xb94f7dcf3b39b221585384880b0eb0e278c15a70e80cfad8606d787a207e2a789b54ecf669f082f2b55a2a0f34643b5'),
        accountName: 'nominally-present-bull',
      } as Account,
    ],
  } as ListAccountsResponse,
  '/eth/v1alpha1/validators/balances': {
    epoch: 7119,
    balances: [
      {
        publicKey: fromHexString('0xb94f7dcf3b39b221585384880b0eb0e278c15a70e80cfad8606d787a207e2a789b54ecf669f082f2b55a2a0f34643b5'),
        index: 0,
        balance: 32,
      },
      {
        publicKey: fromHexString('0x8e557d66788bfd895c9b3676c2dd6d17c9d4bed3fd249482042f8906f2fc8c790900e96ee169c56b858108c10707155'),
        index: 1,
        balance: 32,
      },
      {
        publicKey: fromHexString('0xae5155ebd98c00194b3b969d60dc32385c55f6b1378e7d7175ce026402edbe02080dc4a3619b1eb38096cecd73947d0b'),
        index: 2,
        balance: 32,
      },
    ] as ValidatorBalances_Balance[],
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
      globalParticipationRate: 0.8333,
    } as ValidatorParticipation,
  } as ValidatorParticipationResponse,
  '/eth/v1alpha1/validators/performance': {
    currentEffectiveBalances: ["31000000000", "31000000000", "31000000000"] as any,
    correctlyVotedHead: [true, true, false],
    correctlyVotedSource: [true, true, false],
    correctlyVotedTarget: [true, true, true],
    averageActiveValidatorBalance: 32,
    inclusionDistances: [2, 2, 1],
    inclusionSlots: [1022, 1022, 1021],
    balancesBeforeEpochTransition: ["31200781367", "31216554607", "31204371127"] as any,
    balancesAfterEpochTransition: ["31200823019", "31216596259", "31204412779"] as any,
  } as ValidatorPerformanceResponse,
};
