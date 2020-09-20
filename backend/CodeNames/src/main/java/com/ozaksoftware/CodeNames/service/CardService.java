package com.ozaksoftware.CodeNames.service;

import com.ozaksoftware.CodeNames.domain.Card;
import com.ozaksoftware.CodeNames.enums.CardColor;
import com.ozaksoftware.CodeNames.enums.CardStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CardService {
    public Card createNewCard(CardColor color) {
        Card newCard = new Card();
        newCard.setWord(getRandomWord());
        newCard.setCardColor(color);
        newCard.setCardStatus(CardStatus.CLOSED);
        return newCard;
    }

    private String getRandomWord() {
    return null;
    }

    public List<Card> generateCards() {
        List<Card> randomCards = new ArrayList<>();
        for (int i = 0; i <9; i++){
            randomCards.add(createNewCard(CardColor.BLUE));
        }
        for (int i = 0; i <8; i++){
            randomCards.add(createNewCard(CardColor.RED));
        }
        for (int i = 0; i <7; i++){
            randomCards.add(createNewCard(CardColor.NEUTRAL));
        }
        randomCards.add(createNewCard(CardColor.BLACK));
        return randomCards;
    }


}
