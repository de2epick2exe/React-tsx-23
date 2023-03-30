const db = require("../db");
class WordController {
  async select_all(req, res) {
    const words = await db.query("SELECT * FROM public.words");
    res.json(words.rows);
  }
  async insert_word(req, res) {
    try {
      const { word, translate } = req.body;
      const insert = await db.query(
        "INSERT INTO public.words (word, translate) VALUES ($1, $2) RETURNING *",
        [word, translate]
      );
      res.json(insert.rows[0]);
    } catch (e) {
      if (e.code === "23505") {
        // Postgres unique constraint violation error code
        res
          .status(409)
          .json({ message: "This word already exists in the database" });
      } else {
        res.status(409).json(e);
      }
    }
  }
  async update_word_byword(req, res) {
    const { id, word, translate } = req.body;

    const update_byword = await db.query("UPDATE public.words SET word = $1", [
      word,
    ]);
    res.json(update_byword);
  }

  async find_word(req, res) {
    const { id, word, translate } = req.body;
    
    function isEnglishWord(word) {
      // Match only English letters, including capital and lowercase letters
      const englishRegex = /^[a-zA-Z]+$/;
      return englishRegex.test(word);
    }
    function isUkrainianWord(word) {
      // Match only Ukrainian letters, including capital and lowercase letters
      const ukrainianRegex = /^[а-яА-ЯіІїЇєЄ']+$/;
      return ukrainianRegex.test(word);
    }

    if(id!=''){
      const by_id = await db.query("SELECT * FROM public.words where id=$1", [id]);
      res.json(by_id.rows[0])
    }
    
     else if(word!=''&& isEnglishWord(word)){
      const by_word = await db.query("SELECT * FROM public.words where word=$1", [word]);
      res.json(by_word.rows[0])
    }
     else if(translate!=''&& isUkrainianWord(translate)){
      const by_translate = await db.query("SELECT * FROM public.words where translate=$1", [translate]);
      res.json(by_translate.rows[0])
    } 
    else{
      res.json('not imputed')
    }    
   
    
  }

  async getrandom(req, res) {
    try {
      const id_list = await db.query("SELECT ID FROM public.words");

      const word_arr = [];
      let x = 0;
      const test_rand = [];
      while (x <= 5 && word_arr.length < 5) {
        let rand = Math.floor(
          Math.random() * Object.keys(id_list.rows).length + 1
        );

        if (!test_rand.includes(rand) && rand <= 6) {
          console.log("------------------");
          test_rand.push(rand);
          const word = await db.query(
            "SELECT * FROM public.words where id=$1",
            [rand]
          );
          word_arr.push(word.rows);
          x++;
        }
        console.log(test_rand);
        console.log(word_arr.length, "=======================");
      }

      console.log(word_arr);
      res.json(word_arr);
    } catch (e) {
      res.json(e);
    }
  }

  


}
module.exports = new WordController();
