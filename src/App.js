import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./startScreen";
import Questions from "./Questions";
import NextButton from "./NextButton";
import Progress from "./progress";
import FinshScreen from "./finshScreen";

const intialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  status: "loading",
}

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready"
      };
    case "dataFailed":
      return{
        ...state,
        status: "error"
      }
    case "start":
      return{
        ...state,
        status: "start"
      }
    case "newAnswer":
      const question = state.questions.at(state.index);
      return{
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + 1 : state.points,
      };
    case "nextQuestion":
      return{
        ...state,
        index: state.index + 1,
        answer: null
      };
    case "finish":
      return{ ...state, 
      status:"finished",
      highscore:
    state.points > state.highscore ? state.points : state.highscore,
  };
      default:
        throw new Error("Action unkonwn")
  }

}
function App() {

  const [{questions, status, index, answer, points}, dispatch] = useReducer(reducer, intialState)
   const numQuestions = questions.length;
   const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
   );

  useEffect(function(){
    fetch("http://localhost:9000/questions")
    .then((res) => res.json())
    .then((data) => dispatch({type: "dataReceived", payload: data}))
    .catch((err) => dispatch({type: "dataFailed"}));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} 
         dispatch={dispatch} />}
        {status === 'start' && (
        <>
        <Progress 
        index={index}
         numQuestions={numQuestions} 
         points={points} 
         maxPossiblePoints={maxPossiblePoints}
         answer={answer} />
        <Questions  
        question = {questions[index]} 
        dispatch={dispatch} 
        answer={answer} 
        />

        <NextButton 
        dispatch={dispatch} 
        answer={answer}
        index={index}
        numQuestions={numQuestions}/>
        </>
     )}
     {status === 'finshed' && <FinshScreen points={points}
      maxPossiblePoints={maxPossiblePoints} /> }
      </Main>
    </div>
  );
}

export default App;
