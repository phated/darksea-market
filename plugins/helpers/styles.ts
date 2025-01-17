import { ArtifactRarity } from "@darkforest_eth/types";

export const listStyle = {
    maxHeight: '400px',
    overflowX: 'hidden',
    overflowY: 'scroll',
};

export const RarityColors = {
    [ArtifactRarity.Unknown]: '#000000',
    [ArtifactRarity.Common]: 'rgb(131, 131, 131)',
    [ArtifactRarity.Rare]: '#6b68ff',
    [ArtifactRarity.Epic]: '#c13cff',
    [ArtifactRarity.Legendary]: '#f8b73e',
    [ArtifactRarity.Mythic]: '#ff44b7',
}

export const warning = {
    color: "red",
};

export const textCenter = {
    textAlign: "center",
    marginBottom: "10px"
};

export const table = {
    lineHeight: '34px',
    width: '100%'
};

export const inputStyle = {
    outline: "none",
    background: "rgb(21, 21, 21)",
    color: "rgb(131, 131, 131)",
    borderRadius: "4px",
    border: "1px solid rgb(95, 95, 95)",
    width: 60,
    padding: "0 2px",
};
