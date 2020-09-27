package com.ozaksoftware.CodeNames.DTO.mapper;

import com.ozaksoftware.CodeNames.DTO.model.CardDTO;
import com.ozaksoftware.CodeNames.domain.Card;
import java.util.List;
import java.util.stream.Collectors;

public class CardMapper {
    public static CardDTO toCardDTO(Card card) {
        return new CardDTO()
                .setId(card.getId())
                .setWord(card.getWord())
                .setCardColor(card.getCardColor())
                .setCardStatus(card.getCardStatus())
                .setHighlighters(card.getHighlighters());
    }
    public static List<CardDTO> toCardDTOList(List<Card> cardList) {
        return cardList.stream().map(card -> toCardDTO(card)).collect(Collectors.toList());
    }
}
