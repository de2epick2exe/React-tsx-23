import React, { useEffect, useState, useMemo } from "react";
import { getall, insert, random_five, search } from "../unite/Unit_Functions";

import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { IconButton } from "@chakra-ui/react";

type RandomListType = { id: string; word: string; translate: string }[][];

const Eng_Ua = () => {
  const [wordsl, setWordsl] = useState([]);
  const [inserted_word, setInserted_word] = useState("");
  const [inserted_translate, setInserted_translate] = useState("");
  const [random_list, setRandom_list] = useState<RandomListType>([]);
  const [answer, setAnswer] = useState<null | boolean>(null);
  const [randomWord, setRandomWord] = useState<string>("");
  const [search_word, setSearch_word] = useState<string>("");
  const [returned_word, setReturned_word] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [random_word_id, setRandom_word_id] = useState<string>();
  const [offset, setOffset]= useState(1)
  const [limit, setLimit] = useState(10)
  console.log(randomWord);

  const generateRandomWord = () => {
    setRandomWord("");
    const randomIndex = Math.floor(Math.random() * random_list.length);
    setRandomWord(random_list[randomIndex]?.[0].word);
    setRandom_word_id(random_list[randomIndex]?.[0].id);
  };
  useEffect(() => {
    generateRandomWord();
  }, [random_list]);

  const wordslist = async () => {
    const wordli = await getall(offset, limit, false);
    setWordsl(wordli);
  };

 const set_pages_count =async () => {
  const res = await getall(offset, limit, true);

  return(
    console.log('test')
  )
 }


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
  useEffect(() => {
    wordslist();    
  }, [limit]);

  const show_searched = (obj: any) => {
    return (
      <div key={obj.id}>
        {obj.word}: {obj.translate}
      </div>
    );
  };

  const displayWordAndTranslate = (obj: any) => {
    return (
      <Tr key={obj.id}>
      <Td width="10%">{obj.id}</Td>
      <Td width="30%">{obj.word}</Td>
      <Td width="30%">{obj.translate}</Td>
      <Td width="30%">
        {isEditing ? (
          <>
            <Button onClick={(e) => { edit_word_status(2); }}>
              Update
            </Button>{" "}
            <Button onClick={(e) => { edit_word_status(3); }}>
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={(e) => { edit_word_status(1); }}>
            Change
          </Button>
        )}
      </Td>
    </Tr>
    );
  };
  const edit_word_status = (swt: Number) => {
    if (swt === 1) {
      setIsEditing(true);
    } else if (swt === 2) {
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };
  const addword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await insert(inserted_word, inserted_translate);
    console.log(inserted_word, inserted_translate);
    setInserted_word("");
    setInserted_translate("");
  };

  const word_button = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();

    id == random_word_id ? setAnswer(true) : setAnswer(false);
    console.log("===========================");
    console.log(id == random_word_id, random_word_id);

    console.log("============================");

    setTimeout(() => {
      random_req();
      generateRandomWord();
      setAnswer(null);
    }, 1500);
  };

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
  function containsNumbers(number: string) {
    return /[0-9]/.test(number);
  }
  async function find_word(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setReturned_word([]);
    console.log(search_word);
    let findone = [];
    if (containsNumbers(search_word)) {
      findone = await search(search_word, "", "");
      console.log(search_word, "is number");
    } else if (isEnglishWord(search_word)) {
      findone = await search("", search_word, "");
      console.log(search_word, "is eng");
    } else if (isUkrainianWord(search_word)) {
      findone = await search("", search_word, "");
      console.log(search_word, "is Uk");
    } else {
      setReturned_word([]);
    }
    console.log(findone);
    setReturned_word(findone);
  }
  // ---------------------------------MAIN PAGE -------------------------------------------------------------
  return (
    <>
      <FormControl display='flex' alignItems='center' justifyContent='start' className="page">
        <FormLabel>
          <Input
            placeholder="word"
            value={inserted_word}
            onChange={(e) => {
              setInserted_word(e.target.value);
            }}
          />
          <Input
            
            placeholder="translate"
            value={inserted_translate}
            onChange={(e) => {
              setInserted_translate(e.target.value);
            }}
          />
          
          <Button type="submit" onClick={addword}>
            {" "}
            add{" "}
          </Button>
        </FormLabel>
      </FormControl>

      <div>
        <div>----------------------------------------------------------</div>
           
         <Box display='flex' justifyContent='center' width='10rem' 
         ml='12rem' boxShadow='dark-lg' p='6'
          rounded='md' >{randomWord}</Box>
         <Box display='flex' justifyContent='center' 
         width='10rem' ml='12rem' boxShadow='dark-lg'
          p='6' rounded='md' >{answer ? "True" : answer == null ? "" : "False"}</Box>
        {random_list.map((item) => (
          <span key={item[0].id}>
            <Button onClick={(e) => word_button(e, item[0].id)}>
              {item[0].translate}
            </Button>
          </span>
        ))}
      </div>
      <div>----------------------------------------------------------</div>

      <div>
      <Menu><p>on page :</p>
      <MenuButton as={Button}>
        {limit}
      </MenuButton>
      <MenuList>
        {/** add array output withou selected limit */}
        <MenuItem onClick={e=>setLimit(10)}>10</MenuItem>
        <MenuItem onClick={e=>setLimit(20)}>20</MenuItem>
        <MenuItem onClick={e=>setLimit(50)}>50</MenuItem>
      </MenuList>
      </Menu>
        <TableContainer width='25%'>
          <Table size="sm" variant="striped" colorScheme="cyan">
            <Thead >
              <Tr>
                <Th>№</Th>
                <Th>Слово</Th>
                <Th>Переклад</Th>
                <Th>Status</Th>
              </Tr>
              </Thead>
            <Tbody>{wordsl.map(displayWordAndTranslate)}</Tbody>
            
          </Table>
        </TableContainer>
      </div>
      <div>----------------------------------------------------------</div>
      <div>
        <FormControl display="flex" justifyContent="start">
          <FormLabel>
            <Input             
              placeholder="search"
              value={search_word}
              onChange={(e) => {
                setSearch_word(e.target.value);
              }}></Input>
            <Button onClick={find_word}>search</Button>

            <div>
              {returned_word.length == 0 ? "" : show_searched(returned_word)}
            </div>
          </FormLabel>
        </FormControl>
      </div>
    </>
  );
};

export default Eng_Ua;
