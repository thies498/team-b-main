import React from "react";
import "@view/styles/gameboard.css";
import { useGame } from "@hooks";
import { motion } from "framer-motion";
import { getPlacePosition, getTilePosition } from "./Positions";
import { BoardCamels } from "../Camel/BoardCamels";
import { toast } from "react-toastify";
import { CharacterName, DesertTile, Player } from "@src/types";

function PlacementPosition({
    handleTilePlacement,
    desertTiles,
    selectedTile,
}: {
    handleTilePlacement: (pos: number) => void;
    desertTiles: DesertTile[]
    selectedTile: DesertTile;
}) {
    const fields = Array.from({ length: 16 }, (_, i) => i + 1);

    const isNeighbor = (pos: number) => {
        return desertTiles.some(tile => tile.ownerId !== selectedTile.ownerId && Math.abs(tile.position - pos) === 1);
    };

    const isNotChangeable = (pos: number) => {
        return desertTiles
            .some(tile => tile.position === pos &&
                (tile.ownerId !== selectedTile.ownerId  || tile.type === selectedTile.type));
    }

    const { camels } = useGame();
    const isCamel = (pos: number) => {
        return camels.some((camel) => camel.position === pos);
    };

    return (
        <>
            {fields.map((pos) => {
                if (isNeighbor(pos) || isCamel(pos) || isNotChangeable(pos)) {
                    return null;
                }
                if (pos == 1){
                    return null;
                }

                const style = getPlacePosition(pos);
                return (
                    <div
                        key={pos}
                        className="absolute w-10 h-10 border-black border-2 cursor-pointer hover:bg-green-500"
                        style={{
                            top: style.top,
                            left: style.left ?? "auto",
                            right: style.right ?? "auto",
                        }}
                        onClick={() => handleTilePlacement(pos)}
                    />
                );
            })}
        </>
    );
}

interface GameBoardProps {
    addDesertTile: (tile: DesertTile) => void;
    desertTiles: DesertTile[];
    selectedTile: DesertTile | null;
    onTilePlaced: (tile: DesertTile | null) => void;
}

export const GameBoard = ({
    selectedTile,
    onTilePlaced,
    desertTiles,
    addDesertTile,
}: GameBoardProps) => {
    const { currentPlayerId, player, players } = useGame();

    const handleTilePlacement = (pos: number) => {
        if (currentPlayerId !== player?.id) {
            toast.error("It's not your turn!");
            return;
        }

        if (selectedTile) {
            addDesertTile({
                ...selectedTile,
                position: pos,
            });
            onTilePlaced(selectedTile);
        }
    };


    function getPlayerCharacter(playerList : Player[], playerId: number): CharacterName | null {
    
        const player = playerList.find((p) => p.id === playerId);
        return player ? (player.character as CharacterName) : null;
    }


    return (
        <div
            className="w-full h-full flex items-center justify-center select-none bg-yellow-mat"
            style={{
                backgroundImage: "url('/gameimg/back.png')",
            }}
        >
            <div
                className="relative"
                style={{
                    backgroundImage: "url('/gameimg/board.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    aspectRatio: "1.45",
                    width: "80%",
                    maxWidth: "1200px",
                }}
            >
                <div className="absolute inset-0 w-[85%] mx-auto h-full">
                    <BoardCamels desertTiles={desertTiles} />

                    {desertTiles.map(({ position, type, ownerId }, idx) => {
                        const style = getTilePosition(position);
                        const character = getPlayerCharacter(players, ownerId);
                        return (
                            <motion.img
                                key={idx}
                                src={`/gameimg/tiles/${type.toLowerCase()+character}.png`}
                                className="object-contain absolute"
                                style={{
                                    width: "12%",
                                    top: style.top,
                                    left: style.left ?? "auto",
                                    right: style.right ?? "auto",
                                }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                whileHover={{ scale: 1.5 }}
                            />
                        );
                    })}

                    {selectedTile && (
                        <PlacementPosition
                            handleTilePlacement={handleTilePlacement}
                            desertTiles={desertTiles}
                            selectedTile={selectedTile}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
