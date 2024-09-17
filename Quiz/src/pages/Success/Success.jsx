import useQuestionStore from '../../store/zustand';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import AnimateProvider from '../../components/AnimateProvider/AnimateProvider';
import Question from '../../components/Questions/Questions';
import { useTonConnectUI } from '@tonconnect/ui-react';

// const tonweb = new TonWeb();

const SampleMasterContractAddress = 'EQB19OaTlojUXN3dXkn0BgAeGYQ33Gpxx67Nwb1t63CTN4Cr';

function Success() {
    const { trueAnswer, falseAnswer, resetQuestion, setTimeStamp, question: allQuestion } = useQuestionStore();
    const [tonConnectUI, setOptions] = useTonConnectUI();

    const transaction = {
        messages: [
            {
                address: SampleMasterContractAddress,
                amount: 20000000,
                payload: beginCell()
                    .store(
                        storeMintNftSample({
                            $$type: 'MintNftSample',
                            queryId: BigInt(Math.floor(Date.now() / 1000)),
                        }),
                    )
                    .endCell()
                    .toBoc()
                    .toString('base64'),
            },
        ],
    };

    const score = (trueAnswer * 100) / 5;
    const indxColor = score >= 60 ? '#10b981' : score >= 40 ? '#F59E0B' : '#dc2626';

    return (
        <AnimateProvider className="flex flex-col space-y-10 md:max-w-xl md:mx-auto">
            <h3 className="text-lg text-center text-neutral-900 font-bold md:text-xl">Your Final score is</h3>

            <h1
                style={{ background: indxColor }}
                className="text-5xl font-bold mx-auto p-5 rounded-full md:text-6xl text-neutral-100"
            >
                {score}
            </h1>

            <div className="text-xs md:text-sm text-neutral-600 font-medium flex flex-col space-y-1">
                <p className="flex justify-between">
                    Correct Answer <span className="text-green-600">{trueAnswer}</span>
                </p>
                <p className="flex justify-between">
                    Wrong Answer <span className="text-red-600">{falseAnswer}</span>
                </p>
                <p className="flex justify-between">
                    Answer Submitted <span className="text-purple-600">{trueAnswer + falseAnswer}</span>
                </p>
            </div>

            <button className="bg-blue-500" onClick={() => tonConnectUI.sendTransaction(transaction)}>
                Mint cert
            </button>

            {/* Summary */}
            <h3 className="text-center text-neutral-600 font-semibold md:text-lg pt-[100px]">Answer</h3>
            {allQuestion.map((question, i) => (
                <Question
                    key={i}
                    singleQuestion={question}
                    id={i + 1}
                    summary={true}
                    trueAnswer={question.correct_answer}
                />
            ))}
        </AnimateProvider>
    );
}

export default Success;
