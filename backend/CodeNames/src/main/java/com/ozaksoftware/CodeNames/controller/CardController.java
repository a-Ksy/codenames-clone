package com.ozaksoftware.CodeNames.controller;

import com.ozaksoftware.CodeNames.DTO.model.CardDTO;
import com.ozaksoftware.CodeNames.domain.Card;
import com.ozaksoftware.CodeNames.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/card")
public class CardController {
    @Autowired
    CardService cardService;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public Card createCard(@RequestBody CardDTO newCardDTO) {
        Card newCard = cardService.createNewCard(newCardDTO);
        return newCard;
    }

    @RequestMapping(value = "/cards", method = RequestMethod.GET)
    public void getCards() {
        cardService.listCards();
    }
}
