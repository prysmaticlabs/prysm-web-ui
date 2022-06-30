/* Keymanager API standard */


export interface DeleteAccountsRequest {
    /**
     *  Public keys to delete.
     */
    pubkeys: string[];
}
  
export interface DeleteAccountsResponse {
    data: DeleteAccountsData[], 
    slashing_protection: string
}

export interface DeleteAccountsData {
    status: string,
    message: string
}

export interface ListFeeRecipientResponse {
    data: FeeRecipientData
}

export interface FeeRecipientData {
    pubkey: string,
    ethaddress: string
}

export interface SetFeeRecipientRequest {
    ethaddress: string
}