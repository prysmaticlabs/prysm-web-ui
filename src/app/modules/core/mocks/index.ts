import {
  AuthResponse,
  WalletResponse,
  GenerateMnemonicResponse,
  BeaconStatusResponse,
  ListAccountsResponse,
  Account,
  ImportKeystoresResponse,
  HasUsedWebResponse,
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
  hexToBase64(
    '0xaadaf653799229200378369ee7d6d9fdbdcdc2788143ed44f1ad5f2367c735e83a37c5bb80d7fb917de73a61bbcf00c4'
  ),
  hexToBase64(
    '0xb9a7565e5daaabf7e5656b64201685c6c0241df7195a64dcfc82f94b39826562208ea663dc8e340994fe5e2eef05967a'
  ),
  hexToBase64(
    '0xa74a19ce0c8a7909cb38e6645738c8d3f85821e371ecc273f16d02ec8b279153607953522c61e0d9c16c73e4e106dd31'
  ),
  hexToBase64(
    '0x8d4d65e320ebe3f8f45c1941a7f340eef43ff233400253a5532ad40313b4c5b3652ad84915c7ab333d8afb336e1b7407'
  ),
  hexToBase64(
    '0x93b283992d2db593c40d0417ccf6302ed5a26180555ec401c858232dc224b7e5c92aca63646bbf4d0d61df1584459d90'
  ),
];

const mockImportedKeys: string[] = [
  hexToBase64(
    '0x80027c7b2213480672caf8503b82d41ff9533ba3698c2d70d33fa6c1840b2c115691dfb6de791f415db9df8b0176b9e4'
  ),
  hexToBase64(
    '0x800212f3ac97227ac9e4418ce649f386d90bbc1a95c400b6e0dbbe04da2f9b970e85c32ae89c4fdaaba74b5a2934ed5e'
  ),
];

export const mockDepositDataJSON = [
  {
    pubkey:
      '887c846ea05cd65ee903c7c99bd5a171005f8081d940e05d70f9c0814e66e3a721e0b2d485ad80c87ce8c7e5a6693fa2',
    withdrawalCredentials:
      '009b3b7a7e3e642645f6cb50dfaf3e139899c5baf4821e09490601395787f45e',
    amount: 32000000000,
    signature:
      '85dbbf537ef846b8995f886e593e433b69f34753b7b34e0d131c091f3b1234cba649d844aaa362d707d4641c6eb9f4f5018c35e05b48db3bb9fc24592dd3b45735cdd7321ad017e2fdad949b0f004a855901788611fd586483cba137702bb022',
    depositMessageRoot:
      '273656cacb66e0bcb62ea3b59b565ea7dc52552b00e458ba13f785a0751bf8bd',
    depositDataRoot:
      'c66bb8bd4226ba48b6d3cf41be1135650beb31638ffb82f83023462e49cf110d',
    forkVersion: '00000001',
  },
  {
    pubkey:
      '942a9a42b50ce5b36ef017aecbe58b1ae59603415bb5b13145c6f0b58a1b6edde582be879e025e38cf178c15ccbecd4d',
    withdrawalCredentials:
      '003b8f16c3af32fa93a03f1ebcbc59ecd0e8050fb38577fcac6f84fc906275d5',
    amount: 32000000000,
    signature:
      '99064e70c4ff44ddcd495cb102dc52b9ee6da8ac5ed1f1be35ce88b8565d099690d5401b046da0218349e671d0b876e608f805fac9e3b48916e56925548dc2d6666472e3a04c87a08d1d4588201f9c3b9787ce4ee74d65721442650128b0d7e6',
    depositMessageRoot:
      '0ec368223e19aebd84e804637022a48bebe6d9a9d3477884ebd72b401cbe6e1c',
    depositDataRoot:
      'cce8f3cc9a795cf413b6eea9bce15ef706b4d75f131f5d35d1feaf2eb6ddf7fb',
    forkVersion: '00000001',
  },
];

export const generateBalancesForEpoch = (url: string) => {
  const params = new URLSearchParams(
    url.substring(url.indexOf('?'), url.length)
  );
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
  '/v2/validator/wallet/recover': {},
  '/v2/validator/login': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/v2/validator/signup': {
    token: 'mock.jwt.token',
  } as AuthResponse,
  '/v2/validator/initialized': {
    hasSignedUp: true,
    hasWallet: true,
  } as HasUsedWebResponse,
  '/v2/validator/wallet': {
    keymanagerConfig: { direct_eip_version: 'EIP-2335' },
    keymanagerKind: 'IMPORTED',
    walletPath: '/Users/erinlindford/Library/Eth2Validators/prysm-wallet-v2',
  } as WalletResponse,
  '/v2/validator/wallet/create': {
    walletPath: '/Users/johndoe/Library/Eth2Validators/prysm-wallet-v2',
    keymanagerKind: 'DERIVED',
  } as WalletResponse,
  '/v2/validator/wallet/keystores/import': {
    importedPublicKeys: mockImportedKeys,
  } as ImportKeystoresResponse,
  '/v2/validator/wallet/keystores/validate': {},
  '/v2/validator/mnemonic/generate': {
    mnemonic:
      'grape harvest method public garden knife power era kingdom immense kitchen ethics walk gap thing rude split lazy siren mind vital fork deposit zebra',
  } as GenerateMnemonicResponse,
  '/v2/validator/beacon/status': {
    beaconNodeEndpoint: '127.0.0.1:4000',
    connected: true,
    syncing: true,
    genesisTime: 1596546008,
    chainHead: {
      headSlot: 1024,
      headEpoch: 32,
      justifiedSlot: 992,
      justifiedEpoch: 31,
      finalizedSlot: 960,
      finalizedEpoch: 30,
    } as ChainHead,
  } as BeaconStatusResponse,
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
  '/v2/validator/beacon/peers': {
    peers: [
      {
        address:
          '/ip4/66.96.218.122/tcp/13000/p2p/16Uiu2HAmLvc5NkmsMnry6vyZnfLLBpbdsMHLaPeW3aqqavfQXCkx',
        direction: 2,
        connectionState: 2,
        peerId: '16Uiu2HAmLvc5NkmsMnry6vyZnfLLBpbdsMHLaPeW3aqqavfQXCkx',
        enr:
          '-LK4QO6sLgvjfBouJt4Lo4J12Rc67ex5g_VBbLGo95VbEqz9RxsqUWaTBx1MwB0lUhAAPsQv2CFWR0tn5tBq2gRD0DMCh2F0dG5ldHOIAEBCIAAAEQCEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhEJg2nqJc2VjcDI1NmsxoQN63ZpGUVRi--fIMVRirw0A1VC_gFdGzvDht1TVb6bHIYN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/83.137.255.115/tcp/13000/p2p/16Uiu2HAmPNwVgsvizCT1wCBWKWqH4N9KLDNPSNdveCaJa9oKuc1s',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmPNwVgsvizCT1wCBWKWqH4N9KLDNPSNdveCaJa9oKuc1s',
        enr:
          '-Ly4QIlofnNMs_Ug7NozFCrU-OMon2Ta6wc7q1YC_0fldE1saMnnr1P9UvDodcB1uRykl2Qzd2xXkf_1IlwC7cGweNqCASCHYXR0bmV0c4jx-eZKww2WyYRldGgykOenXVoAAAAB__________-CaWSCdjSCaXCEU4n_c4lzZWNwMjU2azGhA59UCOyvx8GgBXQG889ox1lFOKlXV3qK0_UxRgmyz2Weg3RjcIIyyIN1ZHCCBICEdWRwNoIu4A==',
      },
      {
        address:
          '/ip4/155.93.136.72/tcp/13000/p2p/16Uiu2HAmLp89TTLD4jHA3KfEYuUSZywNEkh39YmxfoME6Z9CL14y',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmLp89TTLD4jHA3KfEYuUSZywNEkh39YmxfoME6Z9CL14y',
        enr:
          '-LK4QFQT9Jhm_xvzEbVktYthL7bwjadB7eke12TcCMAexHFcAch-8yVA1HneP5pfBoPXdI3dmg3lfJ2jX1aG22C564Eqh2F0dG5ldHOICBAaAAIRFACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhJtdiEiJc2VjcDI1NmsxoQN5NImiuCvAYY5XWdjHWxZ8hurs9Y1-W2Tmxhg0JliYDoN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/161.97.120.220/tcp/13000/p2p/16Uiu2HAmSTLd1iu2doYUx4rdTkEY54MAsejHhBz83GmKvpd5YtDt',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmSTLd1iu2doYUx4rdTkEY54MAsejHhBz83GmKvpd5YtDt',
        enr:
          '-LK4QBv1mbTJPk4U18Cr4J2W9vCRo4_QASRxYdeInEloJ47cVP3SHfdNzXXLu2krsQQ4CdQJNK2I6d2wzrfuDVNttr4Ch2F0dG5ldHOIAAAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhKFheNyJc2VjcDI1NmsxoQPNB5FfI_ENtWYsAW9gfGXraDgob0s0iLZm8Lqu8-tC74N0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/35.197.3.187/tcp/9001/p2p/16Uiu2HAm9eQrK9YKZRdqGUu6QBeHXb4uvUxq6QRXYr5ioo65kKfr',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAm9eQrK9YKZRdqGUu6QBeHXb4uvUxq6QRXYr5ioo65kKfr',
        enr:
          '-LK4QMg714Poc_OVt_86pi85PfUJdPOVmk_s-gMM3jTS7tJ_K_j8z9ioXy4D4nLGZ-L96bTf5-_mL3a4cUAS_hpGifMCh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhCPFA7uJc2VjcDI1NmsxoQLTRw-lNUwbTCXoKq6lF57G4bWeDVbR7oE_KengDnBJ7YN0Y3CCIymDdWRwgiMp',
      },
      {
        address:
          '/ip4/135.181.17.59/tcp/11001/p2p/16Uiu2HAmKh3G1PiqKgBMVYT1H1frp885ckUhafWp8xECHWczeV2E',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmKh3G1PiqKgBMVYT1H1frp885ckUhafWp8xECHWczeV2E',
        enr:
          '-LK4QEN3pAp8qPBEkDcc18yPgO_RnKIvZWLZBHLyIhOlMUV4YdxmVBnt-j3-a6Q80agPRwKMoHZE2e581fvN9W1w-wIFh2F0dG5ldHOIAAEAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhIe1ETuJc2VjcDI1NmsxoQNoiEJdQXfB6fbuqzxyvJ1pvyFbqtub6uK4QMLSDcHzr4N0Y3CCKvmDdWRwgir5',
      },
      {
        address:
          '/ip4/90.92.55.1/tcp/9000/p2p/16Uiu2HAmS3U6RboxobjhdQMw6ZYJe8ncs1E2UaHHyaXFej8Vk5Cd',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmS3U6RboxobjhdQMw6ZYJe8ncs1E2UaHHyaXFej8Vk5Cd',
        enr:
          '-LK4QD8NBSBmKFrZKNVVpMf8pOccchjmt5P5HFKbsZHuFT9tQBS5KeDOTIKEIlSyk6CcQoI47n9IBHnhq9mdOpDeg4hLh2F0dG5ldHOIAAAAAAAgAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhFpcNwGJc2VjcDI1NmsxoQPG6hPnomqTRZeSFsJPzXpADlk_ZvbWsijHTZe0jrhKCoN0Y3CCIyiDdWRwgiMo',
      },
      {
        address:
          '/ip4/51.15.70.7/tcp/9500/p2p/16Uiu2HAmTxXKUd1DFdsudodJostmWRpDVj77e48JKCxUdGm1RLaA',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmTxXKUd1DFdsudodJostmWRpDVj77e48JKCxUdGm1RLaA',
        enr:
          '-LO4QAZbEsTmI-sJYObXpNwTFTkMt98GWjh5UQosZH9CSMRrF-L2sBTtJLf_ee0X_6jcMAFAuOFjOZKWHTF6oHBcweOBxYdhdHRuZXRziP__________hGV0aDKQ56ddWgAAAAH__________4JpZIJ2NIJpcIQzD0YHiXNlY3AyNTZrMaED410xsdx5Gghtp3hcSZmk5-XgoG62ty2NbcAnlzxwoS-DdGNwgiUcg3VkcIIjKA==',
      },
      {
        address:
          '/ip4/192.241.134.195/tcp/13000/p2p/16Uiu2HAmRdW2tGB5tkbHp6SryR6U2vk8zk7pFUhDjg3AFZp2RJVc',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmRdW2tGB5tkbHp6SryR6U2vk8zk7pFUhDjg3AFZp2RJVc',
        enr:
          '-LK4QMA9Mc31oEW0b1qO0EkuZzQbfOBxVGRFi7KcDWY5JdGlTOAb0dPCpcdTy3e-5LbX3MzOX5v0X7SbubSyTsia_vIVh2F0dG5ldHOIAQAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhMDxhsOJc2VjcDI1NmsxoQPAxlSqW_Vx6EM7G56Uc8odv239oG-uCLR-E0_U0k2jD4N0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/207.180.244.247/tcp/13000/p2p/16Uiu2HAkwCy31Sa4CGyr2i48Z6V1cPJ2zswMiS1yKHeCDSwivwzR',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAkwCy31Sa4CGyr2i48Z6V1cPJ2zswMiS1yKHeCDSwivwzR',
        enr:
          '-LK4QAsvRXrk-m0EiXb7t_dXd9xNzxVmhlNR3mA9JBvfan-XWdCWd26nzaZyUmfjXh0t338j7M41YknDrxR7JCr6tK1qh2F0dG5ldHOI3vdI7n_f_3-EZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhM-09PeJc2VjcDI1NmsxoQIadhuj7lfhkM8sChMNbSY0Auuu85qd-BOt63wZBB87coN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/142.93.180.80/tcp/13000/p2p/16Uiu2HAm889yCc1ShrApZyM2qCfhtH9ufqWoTEvcfTowVA9HRhtw',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAm889yCc1ShrApZyM2qCfhtH9ufqWoTEvcfTowVA9HRhtw',
        enr:
          '-LO4QGNMdAziIg8AnQdrwIXY3Tan2bdy5ipd03vLMZwEO0ddRGpXlSLD_lMk1tsHpamqk-gtta0bhd6a7t8avLf2uCqB7YdhdHRuZXRziAACFAFADRQAhGV0aDKQ56ddWgAAAAH__________4JpZIJ2NIJpcISOXbRQiXNlY3AyNTZrMaECvKsfpgBmhqKMypSVgKLZODBvbika9Wy1unvGO1fWE2SDdGNwgjLIg3VkcIIu4A==',
      },
      {
        address:
          '/ip4/95.217.218.193/tcp/13000/p2p/16Uiu2HAmBZJYzwfo9j2zCu3e2mu39KQf5WmxGB8psAyEXAtpZdFF',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmBZJYzwfo9j2zCu3e2mu39KQf5WmxGB8psAyEXAtpZdFF',
        enr:
          '-LK4QNrCgSB9K0t9sREtgEvrMPIlp_1NCJGWiiJnsTUxDUL0c_c5ZCZH8RNfpCbPZm1usonPPqUvBZBNTJ3fz710NwYCh2F0dG5ldHOI__________-EZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhF_Z2sGJc2VjcDI1NmsxoQLvr2i_QG_mcuu9Z4LgrWbamcwIXWXisooICrozlJmqWoN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/46.236.194.36/tcp/13000/p2p/16Uiu2HAm8R1ue5VF6QYRBtzBJT5rmg2KRSRuQeFyKSN2etj4SAQR',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAm8R1ue5VF6QYRBtzBJT5rmg2KRSRuQeFyKSN2etj4SAQR',
        enr:
          '-LK4QBZBkFdArf_m7F4L7eSHe7qV46S4iIZAhBBP64JD9g62MEzNGKeUSWqme9KvEho9SAwuk6f2LBtQdKLphPOmWooMh2F0dG5ldHOIAIAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhC7swiSJc2VjcDI1NmsxoQLA_OHgsf7wo3g0cjvjgt2tXaPbzTtiX2dIiC0RHeF3KoN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/68.97.20.181/tcp/13000/p2p/16Uiu2HAmCBvxmZXpv1oU9NTNabKfQk9dF69E3GD29n4ETVLzVghD',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmCBvxmZXpv1oU9NTNabKfQk9dF69E3GD29n4ETVLzVghD',
        enr:
          '-LK4QMogcECI8mZLSv4V3aYYGhRJMsI-qyYrnFaUu2sLeEHiZrAhrJcNeEMZnh2RaM2ZCGmDDk4K70LDoeyCEeMCBUABh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhERhFLWJc2VjcDI1NmsxoQL5EXysT6_721xB9HGL0KDD805OfGrBMt6S164pc4loaIN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/81.61.61.174/tcp/13000/p2p/16Uiu2HAmQm5wEXrnSxRLDkCx7BhRbBehpJ6nnkb9tmJQyYoVNn3u',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmQm5wEXrnSxRLDkCx7BhRbBehpJ6nnkb9tmJQyYoVNn3u',
        enr:
          '-LK4QMurhtUl2O_DYyQGNBOMe35SYA258cHvFb_CkuJASviIY3buH2hbbqYK9zBo7YnkZXHh5YxMMWlznFZ86hUzIggCh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhFE9Pa6Jc2VjcDI1NmsxoQOz3AsQ_9p7sIMyFeRrkmjCQJAE-5eqSVt8whrZpSkMhIN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/71.244.103.3/tcp/13000/p2p/16Uiu2HAmJogALY3TCFffYWZxKT4SykEGMAPzdVvfrr149N1fwoFY',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmJogALY3TCFffYWZxKT4SykEGMAPzdVvfrr149N1fwoFY',
        enr:
          '-LK4QKekP-beWUJwlRWlw5NMggQl2bIesoUYfr50aGdpIISzEGzTMDvWOyegAFFIopKlICuqxBvcj1Fxc09k6ZDu3mgKh2F0dG5ldHOIAAAAAAAIAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhEf0ZwOJc2VjcDI1NmsxoQNbX8hcitIiNVYKmJTT9FpaRUKhPveqAR3peDAJV7S604N0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/193.81.37.89/tcp/9001/p2p/16Uiu2HAkyCfL1KHRf1yMHpASMZb5GcWX9S5AryWMKxz9ybQJBuJ7',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAkyCfL1KHRf1yMHpASMZb5GcWX9S5AryWMKxz9ybQJBuJ7',
        enr:
          '-LK4QLgSaeoEns2jri5S_aryVPxbHzWUK6T57DyP5xalEu2KQ1zn_kihUG8ncc7D97OxIxNthZG5s5KtTBXQePLsmtISh2F0dG5ldHOICAAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhMFRJVmJc2VjcDI1NmsxoQI4GXXlOBhnkTCCN7f3JYqSQFEtimux0m2VcQZFFDdCsIN0Y3CCIymDdWRwgiMp',
      },
      {
        address:
          '/ip4/203.123.127.154/tcp/13000/p2p/16Uiu2HAmSTqQx7nW6fBQvdHYdaCj2VF4bvh8ttZzdUyvLEFKJh3y',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmSTqQx7nW6fBQvdHYdaCj2VF4bvh8ttZzdUyvLEFKJh3y',
        enr:
          '-LK4QOB0EcZQ7oi49pWb9irDXlwKJztl5pdl8Ni1k-njoik_To638d7FRpqlewGJ8-rYcv4onNSm2cttbaFPqRh1f4IBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhMt7f5qJc2VjcDI1NmsxoQPNKB-ERJoaTH7ZQUylPZtCXe__NaNKVNYTfJvCo-gelIN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/95.217.122.169/tcp/11001/p2p/16Uiu2HAmQFM2VS2vAJrcVkKZbDtHwTauhXmuHLXsX25ECmqCpL15',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmQFM2VS2vAJrcVkKZbDtHwTauhXmuHLXsX25ECmqCpL15',
        enr:
          '-LK4QK_SNVm85T1olSVPKlJ7k3ExB38YWDEZiQmCl8wj-eGWHStMd5wHUG9bi6qjtrFDiZoxVmCOIBqNrftl1iE1Dr4Hh2F0dG5ldHOIQAAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhF_ZeqmJc2VjcDI1NmsxoQOsPa6XDlpLGmIMr8ESuTGALvEAGLp2YwGUqDoyXvNUOIN0Y3CCKvmDdWRwgir5',
      },
      {
        address:
          '/ip4/74.199.47.20/tcp/13100/p2p/16Uiu2HAkv1QpH7uDM5WMtiJUZUqQzHVmWSqTg68W94AVd31VEEZu',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAkv1QpH7uDM5WMtiJUZUqQzHVmWSqTg68W94AVd31VEEZu',
        enr:
          '-LK4QDumfVEd0uDO61jWNXZrCiAQ06aqGDDvwOKTIE9Yq3zNXDJN_yRV2xgUu37GeKOx_mZSZT_NE13Yxb0FesueFp90h2F0dG5ldHOIAAAAABAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhErHLxSJc2VjcDI1NmsxoQIIpJn5mAXbQ8g6VlEwa61lyWkHduP8Vf1EU1X-BFeckIN0Y3CCMyyDdWRwgi9E',
      },
      {
        address:
          '/ip4/24.107.187.198/tcp/9000/p2p/16Uiu2HAm4FYUgC1PahBVwYUppJV5zSPhFeMxKYwQEnjoSpJNNqw4',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAm4FYUgC1PahBVwYUppJV5zSPhFeMxKYwQEnjoSpJNNqw4',
        enr:
          '-LK4QI6UW8aGDMmArQ30O0I_jZEi88kYGBS0_JKauNl6Kz-EFSowowzxRTMJeznWHVqLvw0wQCa3UY-HeQrKT-HpG_UBh2F0dG5ldHOI__________-EZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhBhru8aJc2VjcDI1NmsxoQKDIORFrWiUTct3NdUnjsQ2c9tXIxpopEDzMuwABQ00d4N0Y3CCIyiDdWRwgiMo',
      },
      {
        address:
          '/ip4/95.111.254.160/tcp/13000/p2p/16Uiu2HAmQhEoww9P8sPve2fs9deYro6EDctYzS5hQD57zSDS7nvz',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmQhEoww9P8sPve2fs9deYro6EDctYzS5hQD57zSDS7nvz',
        enr:
          '-LK4QFJ9IN2HyrqXZxKpkWD3f9j8vJVPdyPkBMFEJCSHiKTYRAMPL2U524IIlY0lBJPW8ouzcp-ziKLLhgNagmezwyQRh2F0dG5ldHOIAAAAAAACAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhF9v_qCJc2VjcDI1NmsxoQOy38EYjvf7AfNp5JJScFtmAa4QEOlV4p6ymzYRpnILT4N0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/216.243.55.81/tcp/19000/p2p/16Uiu2HAkud68NRLuAoTsXVQGXntm5zBFiVov9qUXRJ5SjvQjKX9v',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAkud68NRLuAoTsXVQGXntm5zBFiVov9qUXRJ5SjvQjKX9v',
        enr:
          '-LK4QFtd9lcRMGn9GyRkjP_1EO1gvv8l1LhqBv6GrXjf5IqQXITkgiFepEMBB7Ph13z_1SbwUOupz1kRlaPYRgfOTyQBh2F0dG5ldHOI__________-EZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhNjzN1GJc2VjcDI1NmsxoQIC7LFnjN_YSu9jPsbYVL7tLC4b2m-UQ0j148vallFCTYN0Y3CCSjiDdWRwgko4',
      },
      {
        address:
          '/ip4/24.52.248.93/tcp/32900/p2p/16Uiu2HAmGDsgjpjDUBx7Xp6MnCBqsD2N7EHtK3QusWTf6pZFJvUj',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmGDsgjpjDUBx7Xp6MnCBqsD2N7EHtK3QusWTf6pZFJvUj',
        enr:
          '-LK4QH3e9vgnWtvf_z_Fi_g3BiBxySGFyGDVfL-2l8vh9HyhfNDIHqzoiUfK2hbYAlGwIjSgGlTzvRXxrZJtJKhxYE4Bh2F0dG5ldHOI__________-EZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhBg0-F2Jc2VjcDI1NmsxoQM0_7EUNTto4R_9ZWiD4N0XDN6hyWr-F7hiWKoHc-auhIN0Y3CCgISDdWRwgoCE',
      },
      {
        address:
          '/ip4/78.34.189.199/tcp/13000/p2p/16Uiu2HAm8rBxfRE8bZauEJhfUMMCtmuGsJ7X9sRtFQ2WPKvX2g8a',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAm8rBxfRE8bZauEJhfUMMCtmuGsJ7X9sRtFQ2WPKvX2g8a',
        enr:
          '-LK4QEXRE9ObQZxUISYko3tF61sKFwall6RtYtogR6Do_CN0bLmFRVDAzt83eeU_xQEhpEhonRGKmm4IT5L6rBj4DCcDh2F0dG5ldHOIhROMB0ExA0KEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhE4ivceJc2VjcDI1NmsxoQLHb8S-kwOy5rSXNj6yTmUI8YEMtT8F5HxA_BG_Q98I24N0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/35.246.89.6/tcp/9001/p2p/16Uiu2HAmScpoS3ycGQt71n4Untszc8JFvzcSSxhx89s6wNSfZW9i',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmScpoS3ycGQt71n4Untszc8JFvzcSSxhx89s6wNSfZW9i',
        enr:
          '-LK4QEF2wrLiztk1x541oH-meS_2nVntC6_pjvvGSneo3lCjAQt6DI1IZHOEED3eSipNsxsbCVTOdnqAlGSfUd3dvvIRh2F0dG5ldHOIAAABAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhCP2WQaJc2VjcDI1NmsxoQPPdahwhMnKaznrBkOX4lozrwYiEHhGWxr0vAD8x-qsTYN0Y3CCIymDdWRwgiMp',
      },
      {
        address:
          '/ip4/46.166.92.26/tcp/13000/p2p/16Uiu2HAmKebyopoHAAPJQBuRBNZoLzG9xBcVFppS4vZLpZFBhpeF',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmKebyopoHAAPJQBuRBNZoLzG9xBcVFppS4vZLpZFBhpeF',
        enr:
          '-LK4QFw7THHqZTOyAB5NaiMAIHj3Z06FfvfqChAI9xbTTG16KvfEURz1aHB6MqTvY946YLv7lZFEFRjd6iRBOHG3GV8Ih2F0dG5ldHOIAgAAAAAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhC6mXBqJc2VjcDI1NmsxoQNn6IOj-nv3TQ8P1Ks6nkIw9aOrkpwMHADplWFqlLyeLIN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/98.110.221.150/tcp/13000/p2p/16Uiu2HAm4qPpetSWpzSWt93bg7hSuf7Hob343CQHxCiUowBF8ZEy',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAm4qPpetSWpzSWt93bg7hSuf7Hob343CQHxCiUowBF8ZEy',
        enr:
          '-LK4QCoWL-QoEVUsF8EKmFeLR5zabehH1OF52z7ST9SbyiU7K-nwGzXA7Hseno9UeOulMlBef19s_ucxVNQElbpqAdssh2F0dG5ldHOIAAAAACAAAACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhGJu3ZaJc2VjcDI1NmsxoQKLzNox6sgMe65lv5Pt_-LQMeI7FO90lEY3BPTtyDYLYoN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/104.251.255.120/tcp/13000/p2p/16Uiu2HAkvPCeuXUjFq3bwHoxc8MSjypWdkiPnSb4KyxsUu4GNmEn',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAkvPCeuXUjFq3bwHoxc8MSjypWdkiPnSb4KyxsUu4GNmEn',
        enr:
          '-LK4QDGY2BvvP_7TvqJFXOZ1nMw9xGsvidF5Ekaevayi11k8B7hKLQvbyyOsun1-5pPsrtn6VEzIaXXyZdtV2szQsgIIh2F0dG5ldHOIAAAAAAAAAECEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhGj7_3iJc2VjcDI1NmsxoQIOOaDLwwyS2D3LSXcSoWpDfc51EmDl3Uo_iLZryBHX54N0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/116.203.252.60/tcp/13000/p2p/16Uiu2HAm6Jm9N8CoydFzjAtbxx5vaQrdkD1knZv6h9xkNRUrC9Hf',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAm6Jm9N8CoydFzjAtbxx5vaQrdkD1knZv6h9xkNRUrC9Hf',
        enr:
          '-LK4QBeW2sMQ0y77ONJd-dfZOWKiu0DcacavmY05sLeKZnGALsM5ViteToq4KobaaOEXcMeMjaNHh3Jkleohhh-3SZQCh2F0dG5ldHOI__________-EZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhHTL_DyJc2VjcDI1NmsxoQKhq1Sk0QqCyzZPPYyta-SJu79W5dQkS23sH06YRlYYDoN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/24.4.149.245/tcp/13000/p2p/16Uiu2HAmQ29MmPnnGENBG952xrqtRsUGdm1MJWQsKN3nsvNhBr6c',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmQ29MmPnnGENBG952xrqtRsUGdm1MJWQsKN3nsvNhBr6c',
        enr:
          '-LK4QD2iKDsZm1nANdp3CtP4bkgrqe6y0_wtaQdWuwc-TYiETgVVrJ0nVq31SwfGJojACnRSNZmsPxrVWwIGCCzqmbwCh2F0dG5ldHOIcQig9EthDJ2EZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhBgElfWJc2VjcDI1NmsxoQOo2_BVIae-SNx5t_Z-_UXPTJWcYe9y31DK5iML-2i4mYN0Y3CCMsiDdWRwgi7g',
      },
      {
        address:
          '/ip4/104.225.218.208/tcp/13000/p2p/16Uiu2HAmFkHJbiGwJHafuYMNMbuQiL4GiXfhp9ozJw7KwPg6a54A',
        direction: 'OUTBOUND',
        connectionState: 2,
        peerId: '16Uiu2HAmFkHJbiGwJHafuYMNMbuQiL4GiXfhp9ozJw7KwPg6a54A',
        enr:
          '-LK4QMxEUMfj7wwQIXxknbEw29HVM1ABKlCNo5EgMzOL0x-5BObVBPX1viI2T0fJrm5vkzfIFGkucoa9ghdndKxXG61yh2F0dG5ldHOIIAQAAAAAgACEZXRoMpDnp11aAAAAAf__________gmlkgnY0gmlwhGjh2tCJc2VjcDI1NmsxoQMt7iJjp0U3rszrj4rPW7tUQ864MJ0CyCNTuHAYN7N_n4N0Y3CCMsiDdWRwgi7g',
      },
    ],
  } as Peers,
  '/v2/validator/beacon/participation': {
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
  '/v2/validator/beacon/performance': {
    currentEffectiveBalances: ['31000000000', '31000000000', '31000000000'],
    correctlyVotedHead: [true, true, false],
    correctlyVotedSource: [true, true, false],
    correctlyVotedTarget: [true, false, true],
    averageActiveValidatorBalance: '31000000000',
    inclusionDistances: ['2', '2', '1'],
    inclusionSlots: ['3022', '1022', '1021'],
    balancesBeforeEpochTransition: [
      '31200781367',
      '31216554607',
      '31204371127',
    ],
    balancesAfterEpochTransition: ['31200823019', '31216596259', '31204412779'],
    publicKeys: mockPublicKeys,
    missingValidators: [],
  } as ValidatorPerformanceResponse,
  '/v2/validator/beacon/queue': {
    churnLimit: 4,
    activationPublicKeys: [mockPublicKeys[0], mockPublicKeys[1]],
    activationValidatorIndices: [0, 1],
    exitPublicKeys: [mockPublicKeys[2]],
    exitValidatorIndices: [2],
  } as ValidatorQueue,
  '/v2/validator/beacon/validators': {
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
