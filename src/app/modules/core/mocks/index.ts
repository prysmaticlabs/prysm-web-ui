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
  ValidatorQueue,
} from 'src/app/proto/eth/v1alpha1/beacon_chain';
import { ValidatorParticipation } from 'src/app/proto/eth/v1alpha1/validator';
import { Peers, Peer, ConnectionState } from 'src/app/proto/eth/v1alpha1/node';
import fromHexString from 'src/app/modules/core/utils/from-hex-string';

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
      {
        validatingPublicKey: fromHexString('0x28372738748972893748972839748927389478923784972893748927389478293748972389478927348972482734734'),
        accountName: 'marginally-green-mare',
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
      currentEpochActiveGwei: "1446418000000000" as any,
      currentEpochAttestingGwei: "102777000000000" as any,
      currentEpochTargetAttestingGwei: "101552000000000" as any,
      eligibleEther: "1446290000000000" as any,
      globalParticipationRate: 0.7861,
      previousEpochActiveGwei: "1446290000000000" as any,
      previousEpochAttestingGwei: "1143101000000000" as any,
      previousEpochHeadAttestingGwei: "1089546000000000" as any,
      previousEpochTargetAttestingGwei: "1136975000000000" as any,
      votedEther: "1136975000000000" as any,
    } as ValidatorParticipation,
  } as ValidatorParticipationResponse,
  '/eth/v1alpha1/validators/performance': {
    currentEffectiveBalances: ["31000000000", "31000000000", "31000000000"] as any,
    correctlyVotedHead: [true, true, false],
    correctlyVotedSource: [true, true, false],
    correctlyVotedTarget: [true, false, true],
    averageActiveValidatorBalance: 32,
    inclusionDistances: [2, 2, 1],
    inclusionSlots: [3022, 1022, 1021],
    balancesBeforeEpochTransition: ["31200781367", "31216554607", "31204371127"] as any,
    balancesAfterEpochTransition: ["31200823019", "31216596259", "31204412779"] as any,
    publicKeys: ["0x00822e00ec3d8ecc50e037b7ae3eba5486480d1ec49afad69a0d76bfdb158ead9bc389e8defef2c076d080371bf1f0fefc", "0x00ae5155ebd98c00194b3b969d60dc32385c55f6b1378e7d7175ce026402edbe02080dc4a3619b1eb38096cecd73947d0b","0x008e557d66788bfd895c9b3676c2dd6d17c9d4bed3fd249482042f8906f2fc8c790900e96ee169c56b858108c107071505"] as any,
    missingValidators: [],
  } as ValidatorPerformanceResponse,
  '/eth/v1alpha1/validators/queue': {
    churnLimit: "4" as any,
    activationPublicKeys: [
      fromHexString('0xb94f7dcf3b39b221585384880b0eb0e278c15a70e80cfad8606d787a207e2a789b54ecf669f082f2b55a2a0f34643b5'),
      fromHexString('0x8e557d66788bfd895c9b3676c2dd6d17c9d4bed3fd249482042f8906f2fc8c790900e96ee169c56b858108c10707155'),
    ],
    activationValidatorIndices: [0, 1],
    exitPublicKeys: [
      fromHexString('0xae5155ebd98c00194b3b969d60dc32385c55f6b1378e7d7175ce026402edbe02080dc4a3619b1eb38096cecd73947d0b'),
    ],
    exitValidatorIndices: [2],
  } as ValidatorQueue,
};
