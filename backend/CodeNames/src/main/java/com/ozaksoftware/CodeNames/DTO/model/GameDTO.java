package com.ozaksoftware.CodeNames.DTO.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.ozaksoftware.CodeNames.domain.Card;
import com.ozaksoftware.CodeNames.domain.Move;
import com.ozaksoftware.CodeNames.domain.Player;
import com.ozaksoftware.CodeNames.enums.GameStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class GameDTO {
    private int id;
    private String gameName;
    private GameStatus gameStatus;
    private String clueWord;
    private int clueNumber;
    private List<Player> players;
    private Map<String,List<Player>> redTeam;
    private Map<String,List<Player>> blueTeam;
    private List<CardDTO> cards;
    private int redCardsLeft;
    private int blueCardsLeft;
    private List<Move> moves;
    private Player owner;
}
