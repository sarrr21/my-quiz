import Options from "./options";

export default function Questions({question, dispatch, answer}) {
    console.log(question);
  return (
    <div>
      <h4>{question.question}</h4>

      <Options question ={question} dispatch={dispatch} answer={answer}/>
    </div>
  )
}

