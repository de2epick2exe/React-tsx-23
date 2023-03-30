import React, { useEffect, useState, useMemo } from "react";
import { getall, insert, random_five, search } from "../unite/Unit_Functions";

type RandomListType = { id: string; word: string, translate:string}[][];

const Eng_Ua = () => {
  const [wordsl, setWordsl] = useState([]);
  const [inserted_word, setInserted_word] = useState("");
  const [inserted_translate, setInserted_translate] = useState("");
  const [random_list, setRandom_list] = useState<RandomListType>([]);
  const [answer, setAnswer]= useState<null | boolean>(null)
  const [randomWord, setRandomWord] = useState<string>("");
  const [search_word, setSearch_word]= useState<string>("")
  const [returned_word, setReturned_word]=useState([])

 


  const generateRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * random_list.length);
    setRandomWord(random_list[randomIndex]?.[0].word);
  };
  useEffect(() => {
    generateRandomWord();
  }, [random_list]);

  const wordslist = async () => {
    const wordli = await getall();
    setWordsl(wordli);
  };

  const random_req = async () => {
    setRandom_list([]);
    const randwords = await random_five();
    console.log(randwords);
    setRandom_list(randwords);
  };

  useEffect(() => {
    wordslist();
    random_req();
    
  }, []);

  const displayWordAndTranslate = (obj: any) => {
    return (
      <div key={obj.id}>
        {obj.word} : {obj.translate} <button> delete</button>
      </div>
    );
  };

  const addword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await insert(inserted_word, inserted_translate);
    console.log(inserted_word, inserted_translate);
    setInserted_word("");
    setInserted_translate("");
  };

  const word_button =   (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    id==random_list[randomIndex][0].id ? setAnswer(true) : setAnswer(false)
    console.log(id==random_list[randomIndex][0].id)
    console.log(answer)    
    setTimeout(random_req, 3500);
    setTimeout(setAnswer, 3500, null);
    setTimeout(generateRandomWord, 3500)
  };

 
  const randomIndex = Math.floor(Math.random() * random_list.length);
 // const randomWord = random_list[randomIndex]?.[0].word;

 function isEnglishWord(word: string) {
  // Match only English letters, including capital and lowercase letters
  const englishRegex = /^[a-zA-Z]+$/;
  return englishRegex.test(word);
}
function isUkrainianWord(word: string) {
  // Match only Ukrainian letters, including capital and lowercase letters
  const ukrainianRegex = /^[а-яА-ЯіІїЇєЄ']+$/;
  return ukrainianRegex.test(word);
}
function containsNumbers(number:string) {
  return /[0-9]/.test(number);
}
  async function find_word(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault()
    setReturned_word([])
    console.log(search_word)
    let findone = []
    if(containsNumbers(search_word) ){
       findone = await search(search_word,'','')
       console.log(search_word, 'is number')
    }
    else if(isEnglishWord(search_word)){
      findone = await search('',search_word,'')
      console.log(search_word, 'is eng')
    }
    else if(isUkrainianWord(search_word)){
      findone = await search('',search_word,'') 
      console.log(search_word, 'is Uk')
    }
    else{
      setReturned_word([])
    }
    console.log(findone)
    setReturned_word(findone)
  }
 

  return (
    <>
      <form>
        <input
          placeholder="word"
          value={inserted_word}
          onChange={(e) => {
            setInserted_word(e.target.value);
          }}
        />
        <input
          placeholder="translate"
          value={inserted_translate}
          onChange={(e) => {
            setInserted_translate(e.target.value);
          }}
        />
        <br />
        <button type="submit" onClick={addword}>
          {" "}
          add{" "}
        </button>
      </form>

      <div>
        <div>----------------------------------------------------------</div>


        <div>{randomWord}</div>
        <div>{answer? 'true': answer==null ? '' : 'false' }</div>
        {random_list.map((item) => (
          <span key={item[0].id}>
            <button onClick={(e) => word_button(e, item[0].id)}>{item[0].translate}</button>
          </span>
        ))}
      </div>
      <div>----------------------------------------------------------</div>

      <div>{wordsl.map(displayWordAndTranslate)}</div>
      <div>----------------------------------------------------------</div>
      <div>
          <form>
            <input
            placeholder="search"
            value={search_word}
            onChange={(e)=>{setSearch_word(e.target.value)}}
            ></input>
            <button
            onClick={find_word}
            >search</button>

            <div>{returned_word.length == 0 ? "": returned_word.map(displayWordAndTranslate)}</div>
          </form>

      </div>
    </>
  );
};

export default Eng_Ua;
