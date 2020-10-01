package com.ozaksoftware.CodeNames.domain;

import com.ozaksoftware.CodeNames.enums.PlayerType;
import com.ozaksoftware.CodeNames.enums.Team;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Check;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Check(constraints = "player_type = 'SPECTATOR' or player_type = 'OPERATIVE' or player_type = 'SPYMASTER'" +
        " and team = 'SPECTATOR' or team = 'BLUE' or team = 'RED'")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "nick_name",nullable = false)
    private String nickName;

    @Column(name = "is_online",nullable = false)
    private boolean isOnline;

    @Column(name = "token",nullable = false)
    private String token;

    @Column(name = "session_id",nullable = true)
    private String sessionId;

    @Enumerated(EnumType.STRING)
    private PlayerType playerType;

    @Enumerated(EnumType.STRING)
    private Team team;
}
