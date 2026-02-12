'use client';

import Image from 'next/image';
import {useCallback, useEffect, useRef, useState, type ReactElement} from 'react';
import {useCroct} from '@croct/plug-next';

type Option = {
    interest: string,
    label: string,
};

type Question = {
    id: string,
    title: string,
    options: Option[],
    gridCols: 2 | 3,
};

const QUESTIONS: Question[] = [
    {
        id: 'style',
        title: "What's your style?",
        options: [
            {label: 'Sportswear', interest: 'sportswear'},
            {label: 'Elegant', interest: 'elegant-fashion'},
            {label: 'Casual', interest: 'casual-wear'},
            {label: 'A bit of everything', interest: 'mixed-styles'},
        ],
        gridCols: 2,
    },
    {
        id: 'occasion',
        title: "What's the occasion?",
        options: [
            {label: 'Everyday wear', interest: 'everyday-wear'},
            {label: 'Working out', interest: 'workout-gear'},
            {label: 'Special events', interest: 'special-event-attire'},
            {label: 'Professional', interest: 'professional-attire'},
        ],
        gridCols: 2,
    },
    {
        id: 'sport',
        title: 'Favorite sport?',
        options: [
            {label: 'Running', interest: 'running'},
            {label: 'Yoga', interest: 'yoga'},
            {label: 'Gym & CrossFit', interest: 'gym-and-crossfit'},
            {label: 'Tennis', interest: 'tennis'},
            {label: 'Cycling', interest: 'cycling'},
            {label: 'None of these', interest: 'general-fitness'},
        ],
        gridCols: 3,
    },
    {
        id: 'intensity',
        title: 'How dedicated are you?',
        options: [
            {label: 'Just for fun', interest: 'recreational-fitness'},
            {label: 'Staying active', interest: 'active-lifestyle'},
            {label: 'Competitive', interest: 'competitive-training'},
        ],
        gridCols: 3,
    },
    {
        id: 'priority',
        title: 'What matters most?',
        options: [
            {label: 'Comfort', interest: 'comfort'},
            {label: 'Style', interest: 'style'},
            {label: 'Performance', interest: 'performance'},
            {label: 'Value', interest: 'value'},
        ],
        gridCols: 2,
    },
];

type Screen = 'welcome' | 'question' | 'complete';

type ConciergeWidgetProps = {
    open: boolean,
    onClose: () => void,
};

export function ConciergeWidget({open, onClose}: ConciergeWidgetProps): ReactElement | null {
    const croct = useCroct();
    const [screen, setScreen] = useState<Screen>('welcome');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
    const [closing, setClosing] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const visible = open || closing;

    useEffect(
        () => {
            if (!open) {
                return;
            }

            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = '';
            };
        },
        [open],
    );

    const handleClose = useCallback(
        () => {
            setClosing(true);

            setTimeout(
                () => {
                    setClosing(false);
                    setScreen('welcome');
                    setQuestionIndex(0);
                    setAnswers({});
                    setSelectedOption(null);
                    onClose();
                },
                250,
            );
        },
        [onClose],
    );

    useEffect(
        () => {
            if (!open) {
                return;
            }

            function handleKeyDown(event: KeyboardEvent): void {
                if (event.key === 'Escape') {
                    handleClose();
                }
            }

            document.addEventListener('keydown', handleKeyDown);

            return () => document.removeEventListener('keydown', handleKeyDown);
        },
        [open, handleClose],
    );

    useEffect(
        () => () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
        },
        [],
    );

    if (!visible) {
        return null;
    }

    const question = QUESTIONS[questionIndex];
    const progress = screen === 'complete' ? 1 : questionIndex / QUESTIONS.length;

    function handleOptionSelect(option: Option): void {
        if (selectedOption !== null) {
            return;
        }

        setSelectedOption(option.interest);

        void croct.track('interestShown', {interests: [option.interest]});

        const updatedAnswers = {...answers, [question.id]: option.interest};

        setAnswers(updatedAnswers);

        timerRef.current = setTimeout(
            () => {
                setSelectedOption(null);

                if (questionIndex < QUESTIONS.length - 1) {
                    setSlideDirection('right');
                    setQuestionIndex(questionIndex + 1);
                } else {
                    void croct.track('goalCompleted', {goalId: 'concierge-completion'});
                    setScreen('complete');
                }
            },
            200,
        );
    }

    function handleBack(): void {
        if (questionIndex > 0) {
            setSlideDirection('left');
            setSelectedOption(null);
            setQuestionIndex(questionIndex - 1);
        }
    }

    function handleGetStarted(): void {
        void croct.track('goalCompleted', {goalId: 'concierge-start'});
        setSlideDirection('right');
        setScreen('question');
    }

    function handleFinish(): void {
        handleClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className={closing ? 'concierge-overlay-out' : 'concierge-overlay-in'}
                onClick={handleClose}
                aria-hidden="true"
                style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)'}}
            />

            <div
                className={`relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden ${closing ? 'concierge-card-out' : 'concierge-card-in'}`}
            >
                {(screen === 'question' || screen === 'complete') && (
                    <div className="h-1 bg-progress-track">
                        <div
                            className="h-full bg-accent origin-left transition-transform duration-500 ease-out"
                            style={{transform: `scaleX(${progress})`}}
                        />
                    </div>
                )}

                {screen === 'welcome' && (
                    <div className="flex flex-col sm:flex-row sm:min-h-[400px]">
                        <div className="flex flex-col justify-center px-10 py-12 sm:flex-1 sm:pr-0">
                            <h2 className="text-3xl font-semibold text-primary tracking-tight whitespace-nowrap">
                                Your personal stylist
                            </h2>
                            <p className="mt-3 text-base text-muted">
                                Answer 5 quick questions and we&apos;ll personalize your experience.
                            </p>
                            <div className="mt-8 flex items-center gap-4">
                                <button
                                    onClick={handleGetStarted}
                                    className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                                >
                                    Get started
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="text-sm text-muted hover:text-primary transition-colors"
                                >
                                    Maybe later
                                </button>
                            </div>
                        </div>
                        <div className="relative hidden sm:block sm:w-[240px] overflow-hidden rounded-r-2xl">
                            <Image
                                src="/concierge.webp"
                                alt="Personal stylist"
                                width={480}
                                height={800}
                                unoptimized
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                {screen === 'question' && (
                    <div className="relative px-10 py-10">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={handleBack}
                                className={`text-lg text-muted hover:text-primary transition-colors ${questionIndex === 0 ? 'invisible' : ''}`}
                                aria-label="Go back"
                            >
                                &#8249;
                            </button>
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                                {questionIndex + 1} of {QUESTIONS.length}
                            </span>
                            <button
                                onClick={handleClose}
                                className="text-lg text-muted hover:text-primary transition-colors"
                                aria-label="Close"
                            >
                                &#10005;
                            </button>
                        </div>

                        <div
                            key={questionIndex}
                            className={slideDirection === 'right' ? 'concierge-slide-in-right' : 'concierge-slide-in-left'}
                        >
                            <h2 className="text-2xl font-semibold text-primary tracking-tight mb-8">
                                {question.title}
                            </h2>

                            <div
                                className={`grid gap-3 ${question.gridCols === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}
                            >
                                {question.options.map(
                                    (option, index) => (
                                        <button
                                            key={option.interest}
                                            onClick={() => handleOptionSelect(option)}
                                            className={`rounded-xl px-5 py-5 text-base font-medium transition-all duration-200 concierge-option-pop ${
                                                selectedOption === option.interest
                                                    ? 'bg-accent text-white scale-[0.97]'
                                                    : 'bg-surface-alt text-primary hover:bg-surface-hover'
                                            }`}
                                            style={{animationDelay: `${index * 50}ms`}}
                                        >
                                            {option.label}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {screen === 'complete' && (
                    <div className="px-10 py-12 text-center">
                        <div className="flex justify-center mb-6">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-success">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="26"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray="166"
                                    strokeDashoffset="166"
                                    strokeLinecap="round"
                                    style={{animation: 'checkmarkCircleDraw 0.6s ease-out 0.1s forwards'}}
                                />
                                <path
                                    d="M21 33l7 7 15-15"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray="36"
                                    strokeDashoffset="36"
                                    style={{animation: 'checkmarkCheckDraw 0.4s ease-out 0.6s forwards'}}
                                />
                            </svg>
                        </div>
                        <h2
                            className="text-2xl font-semibold text-primary confirmation-fade-in"
                            style={{animationDelay: '0.4s'}}
                        >
                            Thank you!
                        </h2>
                        <p
                            className="mt-2 text-sm text-muted confirmation-fade-in"
                            style={{animationDelay: '0.6s'}}
                        >
                            We&apos;ll tailor your experience based on your preferences.
                        </p>
                        <button
                            onClick={handleFinish}
                            className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors confirmation-fade-in"
                            style={{animationDelay: '0.8s'}}
                        >
                            Start exploring
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
