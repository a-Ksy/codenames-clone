package com.ozaksoftware.CodeNames.domain;

import com.ozaksoftware.CodeNames.enums.CardColor;
import com.ozaksoftware.CodeNames.enums.GameStatus;

import com.ozaksoftware.CodeNames.enums.Team;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Check;
import javax.persistence.*;
import java.util.HashMap;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Check(constraints = "game_status = 'WAITS_FOR_PLAYER' or game_status = 'RED_TEAM_OPERATIVE_ROUND' " +
        "or game_status = 'RED_TEAM_SPYMASTER_ROUND' or game_status = 'BLUE_TEAM_OPERATIVE_ROUND' or " +
        "game_status = 'BLUE_TEAM_SPYMASTER_ROUND'" +
        " or game_status = 'BLUE_TEAM_WON' or game_status = 'RED_TEAM_WON'")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "game_name",nullable = false)
    private String gameName;

    @Enumerated(EnumType.STRING)
    private GameStatus gameStatus;

    @Column(name = "clue_word")
    private String clueWord;

    @Column(name = "clue_number")
    private int clueNumber;

    @OneToMany
    private List<Player> players;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Card> cards;

    @Column(name = "logs")
    @ElementCollection
    private List<HashMap<String,String>> logs;

    @OneToOne
    private Player owner;

    public void addHintLog(String nickName, Team team, String clueWord, int clueNumber){
        HashMap<String,String> logMap = new HashMap<>();
        logMap.put("nickName",nickName);
        logMap.put("playerColor", team.toString());
        logMap.put("clueWord",clueWord);
        logMap.put("clueNumber", String.valueOf(clueNumber));
        logMap.put("text", "gives clue");
        logMap.put("cardColor","");
        logs.add(logMap);
    }

    public void addCardLog(String nickName, Team team, CardColor cardColor){
        HashMap<String,String> logMap = new HashMap<>();
        logMap.put("nickName",nickName);
        logMap.put("playerColor", team.toString());
        logMap.put("text", "taps");
        logMap.put("cardColor",cardColor.toString());
        logMap.put("clueWord","");
        logMap.put("clueNumber", "");
        logs.add(logMap);
    }
}
