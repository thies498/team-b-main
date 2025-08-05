import { Game, RawPlayer } from "@src/types";
import React, { useState } from "react";
import {Button, Input, Range, Toggle} from "react-daisyui";
import { toast } from "react-toastify";
import { useGame } from "@src/hooks/useGame";

interface CheckGameProps {
    checkGame: Game | null;
    handleJoinGame: (roomCode: string, player: RawPlayer) => Promise<void>;
    goBack: () => void;
}

export function CheckGame({ checkGame, handleJoinGame, goBack }: CheckGameProps) {
    const [name, setName] = useState<string>("");
    const [age, setAge] = useState<number>(10);
    const GameIsRandom = checkGame?.isRandom;

    const handleJoin = async () => {
        if(checkGame?.state != "WAITING"){
            toast.error("Game is already started");
            return ;
        }

        const finalAge = checkGame.isRandom ?
            Math.floor(Math.random() * 90)
            : age;

        await handleJoinGame(checkGame?.roomCode!, { name, age: finalAge });
    };

    return (
        <div className="flex flex-col h-full">
            <div>
                <h2 className="text-xl font-semibold mb-6">{checkGame?.name}</h2>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-white">Your Name</label>
                    <Input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-purple-light"
                    />
                </div>

            {!GameIsRandom && (
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-white">Your Age</label>
                    <div className="flex items-center gap-4">
                        <Range
                            value={age}
                            size="xs"
                            color="primary"
                            onChange={(e) => setAge(Number(e.target.value))}
                        />
                        <input
                            type="number"
                            className="w-11 p-1 border rounded text-sm text-gray-800 "
                            min={0}
                            max={100}
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                        />
                    </div>
                </div>
            )}

                <div className="bg-purple-light p-4 rounded-lg mb-4">
                    <p className="text-lg font-semibold mb-2">Game Info</p>
                    <p className="text-sm mt-2 text-gray-300">
                        Players: {checkGame?.players.length} / 8
                    </p>
                    <p className="text-sm mt-2 text-gray-300">State: {checkGame?.state}</p>
                    <p className="text-sm mt-2 text-gray-300">Order: {checkGame?.isRandom ? "🎲 Random" : "📋 Age Order"}</p>
                </div>
            </div>

            <div className="mt-auto flex gap-2">
                <Button
                    color="primary"
                    className="text-white flex-1"
                    onClick={handleJoin}
                >
                    Join Game
                </Button>
                <Button color="error" className="text-white" onClick={goBack}>
                    Back
                </Button>
            </div>
        </div>
    );
}