package com.ozaksoftware.CodeNames.domain;

import com.ozaksoftware.CodeNames.enums.CardColor;
import com.ozaksoftware.CodeNames.enums.GameStatus;
import com.ozaksoftware.CodeNames.service.CardService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Check;
import org.springframework.beans.factory.annotation.Autowired;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Check(constraints = "game_status = 'WAITS_FOR_PLAYER' or game_status = 'IN_PROGRESS'" +
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

    @OneToMany
    private List<Card> cards;

    @OneToMany
    private List<Move> moves;

    @OneToOne
    private Player owner;
}
