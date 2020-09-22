package com.ozaksoftware.CodeNames.domain;

import com.ozaksoftware.CodeNames.enums.CardColor;
import com.ozaksoftware.CodeNames.enums.CardStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Check;

import javax.persistence.*;
import java.util.ArrayList;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Check(constraints = "card_color = 'RED' or card_color = 'BLUE' or card_color = 'BLACK' or card_color = 'NEUTRAL' or card_color = 'HIDDEN'" +
        " and card_status = 'CLOSED' or card_status = 'OPEN'")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "word", nullable = false)
    private String word;

    @Enumerated(EnumType.STRING)
    private CardColor cardColor;

    @Enumerated(EnumType.STRING)
    private CardStatus cardStatus;
}
