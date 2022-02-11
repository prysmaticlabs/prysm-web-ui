// interface naming and format follows the format defined in the following location on the Prysm repo
// validator/slashing-protection/local/standard-protection-format/format/format.go

export interface EIPSlashingProtectionFormat {
    metadata: Metadata,
    data: ProtectionData[]
}

interface Metadata {
    interchange_format_version: string;
    genesis_validators_root: string;
}

interface ProtectionData {
    pubkey: string;
    signed_blocks: SignedBlock[];
    signed_attestations: SignedAttestation[];
}

interface SignedAttestation {
    source_epoch: string;
    target_epoch: string;
    signing_root?: string;
}

interface SignedBlock {
    slot: string;
    signing_root?: string;
}

