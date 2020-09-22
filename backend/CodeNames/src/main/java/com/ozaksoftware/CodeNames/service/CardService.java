package com.ozaksoftware.CodeNames.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ozaksoftware.CodeNames.domain.Card;
import com.ozaksoftware.CodeNames.enums.CardColor;
import com.ozaksoftware.CodeNames.enums.CardStatus;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Random;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.lang.reflect.Type;
import java.util.*;

@Service
@Transactional
public class CardService {
    public Card createNewCard(String word, CardColor color) {
        Card newCard = new Card();
        newCard.setWord(word);
        newCard.setCardColor(color);
        newCard.setCardStatus(CardStatus.CLOSED);
        return newCard;
    }

    public List<Card> generateCards() {
        try {
            Gson gson = new Gson();
            Type type = new TypeToken<Map<String, String>>(){}.getType();
            Resource resource = new ClassPathResource("/static/wordList");
            String path = resource.getURL().getPath().toString();
            Map<String, String> myMap = gson.fromJson(new FileReader(path), type);
            Set<String> wordListSet = new HashSet<>();
            Random rand = new Random();
            List<Card> randomCards = new ArrayList<>();
            while (wordListSet.size() < 25){
                String randomKey = String.valueOf(rand.nextInt(400));
                wordListSet.add(myMap.get(randomKey));
           }
            String[] wordListArray = wordListSet.toArray(String[]::new);

            for (int i = 0; i <25; i++){
                if(i<9){
                    randomCards.add(createNewCard(wordListArray[i],CardColor.BLUE));
                }
                else if(i < 17){
                    randomCards.add(createNewCard(wordListArray[i],CardColor.RED));
                }
                else if(i < 24) {
                    randomCards.add(createNewCard(wordListArray[i],CardColor.NEUTRAL));
                }
                else {
                    randomCards.add(createNewCard(wordListArray[i],CardColor.BLACK));
                }
            }
            Collections.shuffle(randomCards);
            return randomCards;

        } catch (FileNotFoundException e) {
            System.out.println(e);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ArrayList<Card>();
    }
}
