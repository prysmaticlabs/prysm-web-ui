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