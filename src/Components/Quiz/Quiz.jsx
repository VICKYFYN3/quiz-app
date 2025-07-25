import React, { useRef, useState, useEffect } from 'react'
import './Quiz.css'
import { data } from './../../assets/data';

const Quiz = ({ user, onLogout }) => {
    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index])
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    // Page leave detection
    const [leaveCount, setLeaveCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const leaveTimeout = useRef(null);

    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_array = [Option1, Option2, Option3, Option4];

    // Timer effect
    useEffect(() => {
        if (result) return;
        if (timeLeft <= 0) {
            setResult(true);
            sendScoreToSheet(score);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, result]);

    // Format timer mm:ss
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Page leave detection
    useEffect(() => {
        const handleBlur = () => {
            if (result) return;
            leaveTimeout.current = setTimeout(() => {
                setShowWarning(true);
                setLeaveCount((c) => c + 1);
            }, 10000); // 10 seconds
        };
        const handleFocus = () => {
            clearTimeout(leaveTimeout.current);
        };
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            clearTimeout(leaveTimeout.current);
        };
    }, [result]);

    // Log out if user leaves page twice
    useEffect(() => {
        if (leaveCount >= 2) {
            onLogout && onLogout();
        }
    }, [leaveCount, onLogout]);

    // Hide warning after 3 seconds
    useEffect(() => {
        if (showWarning) {
            const t = setTimeout(() => setShowWarning(false), 3000);
            return () => clearTimeout(t);
        }
    }, [showWarning]);

    const checkAnswer = (e, ans) => {
        if (lock === false) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setLock(true);
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("wrong");
                setLock(true);
                option_array[question.ans - 1].current.classList.add("correct");
            }
        }
    }

    const sendScoreToSheet = async (score) => {
        const WEBHOOK_URL = '/api/gsheet-proxy';
        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...user,
                    score,
                }),
            });
        } catch (err) {
            // Optionally handle error
        }
    };

    const next = () => {
        if (lock === true) {
            if (index === data.length - 1) {
                setResult(true);
                sendScoreToSheet(score + (question.ans === undefined ? 0 : 0)); // Send score after quiz
                return 0;
            }
            setIndex(++index);
            setQuestion(data[index]);
            setLock(false);
            option_array.map(option => {
                option.current.classList.remove("correct", "wrong");
                return null;
            });
        }
    }
    // Remove reset, add submit (logout)
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async () => {
        setSubmitting(true);
        await sendScoreToSheet(score);
        setSubmitting(false);
        onLogout && onLogout();
    };
    return (
        <div className='container'>
            <h1>Quiz App</h1>
            <hr />
            <div style={{textAlign:'right', fontWeight:'bold', fontSize:'18px', color: timeLeft < 60 ? 'red' : '#222'}}>
                Time Left: {formatTime(timeLeft)}
            </div>
            {showWarning && (
                <div style={{color:'orange', fontWeight:'bold', margin:'10px 0'}}>Warning: Do not leave the page during the quiz!</div>
            )}
            {result ? 
            <> 
                <h2>You Scored {score} out of {data.length}</h2>
                <button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
            </>: 
            <>
                <h2>{index + 1}. {question.question} </h2>
                <ul>
                    <li ref={Option1} onClick={(e) => { checkAnswer(e, 1) }}>{question.option1}</li>
                    <li ref={Option2} onClick={(e) => { checkAnswer(e, 2) }}>{question.option2}</li>
                    <li ref={Option3} onClick={(e) => { checkAnswer(e, 3) }}>{question.option3}</li>
                    <li ref={Option4} onClick={(e) => { checkAnswer(e, 4) }}>{question.option4}</li>
                </ul>
                <button onClick={next}>Next</button>
                <div className="index">{index + 1} of {data.length} questions</div>
            </>}
        </div>
    )
}

export default Quiz