package com.ozaksoftware.CodeNames.DTO.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.ozaksoftware.CodeNames.enums.PlayerType;
import com.ozaksoftware.CodeNames.enums.Team;
import lombok.*;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayerDTO {
    private int id;
    private String nickName;
    private boolean isOnline;
    private PlayerType playerType;
    private Team team;
}
