import { listStyle, table, textCenter, warning } from "../helpers/styles";
import { artifactIdFromEthersBN } from "@darkforest_eth/serde";
import { useState, useEffect } from "preact/hooks";
import { getLocalArtifact, setLocalArtifact, getRandomActionId, callAction } from "../helpers/helpers";
import { own, notifyManager } from "../contants";
import { utils, BigNumber } from "ethers";
import { Rarity } from "../components/Rarity";
import { Multiplier } from "../components/Multiplier";
import { Button } from "../components/Button";
import { h } from "preact";
import {
    EnergyIcon,
    EnergyGrowthIcon,
    DefenseIcon,
    RangeIcon,
    SpeedIcon,
} from '../components/Icon';
import { ArtifactType } from "@darkforest_eth/types";

function BuyButton({item, contract}) {
    let [processing, setProcessing] = useState(false);
    let [show, setShow] = useState(true);

    function buy() {
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'buy',
            };
            const overrids = {
                value: BigNumber.from(item.price).toString(),
                gasLimit: 5000000,
                gasPrice: undefined,
            };
            callAction(contract, action, [BigNumber.from(item.listId)], overrids).then(()=>{
                setShow(false);
                setProcessing(false);
            }).catch((err) => {
                setProcessing(false);
                console.error(err);
                notifyManager.unsubmittedTxFail(action, err);
            });
        }
    }

    if (show) {
        return <Button onClick={buy} processing={processing} on="Waiting" off="Buy"/>;
    }
}

function UnlistButton({item, contract}) {
    let [processing, setProcessing] = useState(false);
    let [show, setShow] = useState(true);

    function unlist() {
        if (!processing) {
            setProcessing(true);
            let action = {
                actionId: getRandomActionId(),
                methodName: 'unlist',
            };
            callAction(contract, action, [BigNumber.from(item.listId)]).then(()=>{
                setShow(false);
                setProcessing(false);
            }).catch((err) => {
                setProcessing(false);
                console.error(err);
                notifyManager.unsubmittedTxFail(action, err);
            });
        }
    }

    if (show) {
        return <Button onClick={unlist} processing={processing} on="Waiting" off="Unlist"/>;
    }
}

function ListItem({item, contract}) {
    const artifactId = artifactIdFromEthersBN(item.tokenID);
    //@ts-expect-error
    const artifact = df.getArtifactById(artifactId);
    if (item.rarity !== artifact.rarity) {
        console.log(`Scammer`, item);
    }
    if (item.artifactType !== artifact.artifactType) {
        console.log(`Scammer`, item);
    }
    const defaultArtifact = {
        id: artifactId,
        artifactType: artifact.artifactType,
        rarity: artifact.rarity,
        upgrade: {
            energyCapMultiplier: -1,
            energyGroMultiplier: -1,
            defMultiplier: -1,
            rangeMultiplier: -1,
            speedMultiplier: -1
        }
    };
    //@ts-expect-error
    const [artifact, setArtifact] = useState(getLocalArtifact(artifactId) || df.getArtifactWithId(artifactId) || defaultArtifact);

    if (artifact.upgrade.energyCapMultiplier === -1) {
        useEffect(() => {
            console.log(`[ArtifactsMarket] Loading artifact ${artifactId} from chain`);
            //@ts-expect-error
            df.contractsAPI.getArtifactById(artifactId).then((a) => {
                setArtifact(a);
                console.log(`[ArtifactsMarket] Loaded artifact ${artifactId} from chain`);
                setLocalArtifact(a);
            });
        }, [setArtifact]);
    }

    return (
        <tr key={artifact.id}>
            <td><Rarity rarity={artifact.rarity} type={artifact.artifactType}/></td>
            <td><Multiplier bonus={artifact.upgrade.energyCapMultiplier} /></td>
            <td><Multiplier bonus={artifact.upgrade.energyGroMultiplier} /></td>
            <td><Multiplier bonus={artifact.upgrade.defMultiplier} /></td>
            <td><Multiplier bonus={artifact.upgrade.rangeMultiplier} /></td>
            <td><Multiplier bonus={artifact.upgrade.speedMultiplier} /></td>
            <td>{`${utils.formatEther(item.price)}xDai`}</td>
            <td>{item.owner.toLowerCase() == own ? 
                <UnlistButton item={item} contract={contract}/>
             : <BuyButton item={item} contract={contract}/>
            }</td>
        </tr>
    );
}

export function ListingPane({selected, artifacts, contract}) {
    if (!selected) {
        return
    }

    console.log("[ArtifactsMarket] Building listing");

    let artifactChildren = artifacts.map(item => {
        return <ListItem item={item} contract={contract}/>;
    });

    console.log("[ArtifactsMarket] Build listing");

    return (
        <div style={listStyle}>
            <div style={textCenter}>
                <span style={warning}>Beware:</span> You will be spending actual xDai here!
            </div>
            {artifactChildren.length ? 
            <table style={table}>
                <tr>
                    <th>Type</th>
                    <th><EnergyIcon/></th>
                    <th><EnergyGrowthIcon/></th>
                    <th><DefenseIcon/></th>
                    <th><RangeIcon/></th>
                    <th><SpeedIcon/></th>
                    <th>Price</th>
                    <th></th>
                </tr>
                {artifactChildren}
            </table> : <div style={textCenter}>No artifacts listing right now.</div>}
        </div>
    );
}