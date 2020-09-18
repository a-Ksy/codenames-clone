package com.ozaksoftware.CodeNames.service;

import com.ozaksoftware.CodeNames.DTO.model.CardDTO;
import com.ozaksoftware.CodeNames.domain.Card;
import com.ozaksoftware.CodeNames.enums.CardColor;
import com.ozaksoftware.CodeNames.enums.CardStatus;
import com.ozaksoftware.CodeNames.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CardService {
    private final CardRepository cardRepository;

    @Autowired
    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public Card createNewCard(CardDTO cardDTO) {
        Card newCard = new Card();
        newCard.setWord(cardDTO.getWord());
        newCard.setCardColor(CardColor.BLACK);
        newCard.setCardStatus(CardStatus.CLOSED);
        cardRepository.save(newCard);
        return newCard;
    }
    public Card getCard(int id) {
        return cardRepository.findOneById(id);
    }

    public List<Card> listCards() {
        List<Card> cards = (List<Card>) cardRepository.findAll();
        return cards;
    }

}
